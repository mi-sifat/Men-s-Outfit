import { Request, Response } from 'express';
import crypto from 'crypto';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { StoreSettings } from '../models/StoreSettings';
import { Coupon } from '../models/Coupon';
import { AppError } from '../utils/AppError';
import { OrderStatus, PaymentStatus, PaymentMethod, CourierProvider } from '../types';
import { validateStatusTransition } from '../services/orderStateMachine';
import { NotificationService } from '../services/notification.service';

export const createOrder = async (req: Request, res: Response) => {
  const { items, shippingAddress, paymentMethod = PaymentMethod.COD, couponCode, customerNotes } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw AppError.badRequest('কার্টে কোনো পণ্য নেই।');
  }

  if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.addressLine || !shippingAddress.division) {
    throw AppError.badRequest('সঠিক ডেলিভারি ঠিকানা ও মোবাইল নম্বর প্রদান করুন।');
  }

  // Get Store settings for delivery rates
  let settings = await StoreSettings.findOne();
  if (!settings) {
    settings = await StoreSettings.create({});
  }

  // Verify and calculate server authoritative price & stock
  let itemsSubtotal = 0;
  const verifiedOrderItems: any[] = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product || !product.isPublished) {
      throw AppError.badRequest(`পণ্যটি উপলব্ধ নেই: ${item.title || 'অজানা পণ্য'}`);
    }

    const variant = product.variants.find(
      (v) => v.size === item.size && v.color === item.color
    );

    if (!variant) {
      throw AppError.badRequest(`নির্বাচিত ভ্যারিয়েন্ট (${item.size} - ${item.color}) উপলব্ধ নেই।`);
    }

    if (variant.stock < item.quantity) {
      throw AppError.badRequest(`"${product.title}" (${item.size}) এর পর্যাপ্ত স্টক নেই। অবশিষ্ট: ${variant.stock} টি।`);
    }

    const price = variant.price || product.price;
    const subtotal = price * item.quantity;
    itemsSubtotal += subtotal;

    verifiedOrderItems.push({
      product: product._id,
      title: product.title,
      sku: variant.sku,
      size: variant.size,
      color: variant.color,
      image: product.images[0] || item.image,
      price,
      quantity: item.quantity,
      subtotal,
    });
  }

  // Calculate delivery charge (Dhaka vs Outside Dhaka)
  const isDhaka = shippingAddress.division === 'ঢাকা' || shippingAddress.division.toLowerCase() === 'dhaka';
  let deliveryCharge = isDhaka ? settings.deliveryDhaka : settings.deliveryOutsideDhaka;

  // Check free delivery threshold
  if (itemsSubtotal >= settings.freeDeliveryThreshold) {
    deliveryCharge = 0;
  }

  // Apply Coupon if provided
  let discountAmount = 0;
  let appliedCouponCode: string | undefined = undefined;

  if (couponCode) {
    const coupon = await Coupon.findOne({
      code: String(couponCode).trim().toUpperCase(),
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    });

    if (coupon) {
      if (itemsSubtotal >= coupon.minOrderAmount) {
        if (coupon.discountType === 'percentage') {
          discountAmount = Math.round((itemsSubtotal * coupon.discountValue) / 100);
          if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
            discountAmount = coupon.maxDiscountAmount;
          }
        } else {
          discountAmount = coupon.discountValue;
        }

        if (discountAmount > itemsSubtotal) {
          discountAmount = itemsSubtotal;
        }

        appliedCouponCode = coupon.code;
        coupon.usedCount += 1;
        await coupon.save();
      }
    }
  }

  const payableTotal = Math.max(0, itemsSubtotal + deliveryCharge - discountAmount);

  // Generate unique order number (EO-YEAR-XXXXX)
  const orderCount = await Order.countDocuments();
  const year = new Date().getFullYear();
  const orderNumber = `EO-${year}-${String(orderCount + 1).padStart(5, '0')}`;

  // Generate secure high-entropy tracking token
  const trackingToken = crypto.randomBytes(16).toString('hex');

  // Atomic stock reduction
  for (const item of items) {
    await Product.updateOne(
      {
        _id: item.productId,
        'variants.size': item.size,
        'variants.color': item.color,
      },
      {
        $inc: { 'variants.$.stock': -item.quantity },
      }
    );
  }

  // Create Order in DB
  const order = await Order.create({
    orderNumber,
    trackingToken,
    customer: (req as any).user ? (req as any).user.userId : undefined,
    items: verifiedOrderItems,
    shippingAddress,
    itemsSubtotal,
    deliveryCharge,
    discountAmount,
    couponCode: appliedCouponCode,
    payableTotal,
    status: OrderStatus.PENDING,
    paymentMethod,
    paymentStatus: PaymentStatus.PENDING,
    courierProvider: CourierProvider.MANUAL,
    customerNotes,
  });

  // Trigger Bangladeshi SMS notification
  NotificationService.notifyOrderCreated({
    orderNumber: order.orderNumber,
    phone: shippingAddress.phone,
    total: order.payableTotal,
  }).catch(() => {});

  res.status(201).json({
    success: true,
    message: 'আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!',
    data: {
      orderId: order._id,
      orderNumber: order.orderNumber,
      trackingToken: order.trackingToken,
      payableTotal: order.payableTotal,
      deliveryCharge: order.deliveryCharge,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
    },
  });
};

// PUT /api/orders/:id/status (Admin status change with state machine and stock restoration)
export const updateOrderStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;

  const order = await Order.findById(id);
  if (!order) {
    throw AppError.notFound('অর্ডারটি পাওয়া যায়নি।');
  }

  // Validate state transition
  validateStatusTransition(order.status, status);

  const previousStatus = order.status;
  order.status = status;

  if (adminNotes) {
    order.adminNotes = adminNotes;
  }

  // Handle cancellation: restore stock
  if (status === OrderStatus.CANCELLED && previousStatus !== OrderStatus.CANCELLED) {
    order.cancelledAt = new Date();
    for (const item of order.items) {
      await Product.updateOne(
        {
          _id: item.product,
          'variants.size': item.size,
          'variants.color': item.color,
        },
        {
          $inc: { 'variants.$.stock': item.quantity },
        }
      );
    }
  }

  if (status === OrderStatus.CONFIRMED) {
    order.confirmedAt = new Date();
  } else if (status === OrderStatus.SHIPPED) {
    order.shippedAt = new Date();
  } else if (status === OrderStatus.DELIVERED) {
    order.deliveredAt = new Date();
    if (order.paymentMethod === PaymentMethod.COD) {
      order.paymentStatus = PaymentStatus.COD_COLLECTED;
    }
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: `অর্ডারের স্ট্যাটাস '${status}'-এ আপডেট করা হয়েছে।`,
    data: order,
  });
};

// GET /api/orders/track/:token (Public tracking)
export const trackOrder = async (req: Request, res: Response) => {
  const token = String(req.params.token);

  const order = await Order.findOne({
    $or: [{ trackingToken: token }, { orderNumber: token.toUpperCase() }],
  })
    .select('-customer')
    .lean();

  if (!order) {
    throw AppError.notFound('কোনো অর্ডার পাওয়া যায়নি। অনুগ্রহ করে সঠিক অর্ডার নম্বর বা ট্র্যাকিং লিংক চেক করুন।');
  }

  res.status(200).json({
    success: true,
    data: order,
  });
};
