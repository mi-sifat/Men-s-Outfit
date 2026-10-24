import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { PathaoCourierProvider } from '../integrations/couriers/Pathao.provider';
import { SteadfastCourierProvider } from '../integrations/couriers/Steadfast.provider';
import { CourierProvider, OrderStatus } from '../types';
import { AppError } from '../utils/AppError';
import { NotificationService } from '../services/notification.service';

const pathao = new PathaoCourierProvider();
const steadfast = new SteadfastCourierProvider();

// POST /api/couriers/ship/:orderId (Create consignment via API or Manual)
export const createShipment = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { provider = CourierProvider.MANUAL, manualConsignmentId, manualTrackingCode, manualFee } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    throw AppError.notFound('অর্ডারটি পাওয়া যায়নি।');
  }

  if (order.courierConsignmentId) {
    throw AppError.conflict('এই অর্ডারের জন্য ইতিমধ্যেই পার্সেল বুকিং করা হয়েছে।');
  }

  let consignmentId = manualConsignmentId;
  let trackingCode = manualTrackingCode || manualConsignmentId;
  let courierName = 'Manual Courier';

  if (provider === CourierProvider.PATHAO) {
    const result = await pathao.createShipment({
      orderNumber: order.orderNumber,
      recipientName: order.shippingAddress.fullName,
      recipientPhone: order.shippingAddress.phone,
      recipientAddress: order.shippingAddress.addressLine,
      amountToCollect: order.payableTotal,
    });
    consignmentId = result.consignmentId;
    trackingCode = result.trackingCode;
    courierName = result.courierName;
  } else if (provider === CourierProvider.STEADFAST) {
    const result = await steadfast.createShipment({
      orderNumber: order.orderNumber,
      recipientName: order.shippingAddress.fullName,
      recipientPhone: order.shippingAddress.phone,
      recipientAddress: order.shippingAddress.addressLine,
      amountToCollect: order.payableTotal,
    });
    consignmentId = result.consignmentId;
    trackingCode = result.trackingCode;
    courierName = result.courierName;
  } else {
    // Manual Workflow
    if (!consignmentId) {
      throw AppError.badRequest('ম্যানুয়াল ওয়ার্কফ্লোর জন্য ট্র্যাকিং বা কনসাইনমেন্ট আইডি দিন।');
    }
  }

  order.courierProvider = provider;
  order.courierConsignmentId = consignmentId;
  order.courierTrackingCode = trackingCode;
  order.status = OrderStatus.SHIPPED;
  order.shippedAt = new Date();
  await order.save();

  // Trigger Notification to Customer
  NotificationService.notifyOrderShipped({
    orderNumber: order.orderNumber,
    phone: order.shippingAddress.phone,
    courierName,
    consignmentId,
  }).catch(() => {});

  res.status(200).json({
    success: true,
    message: `পার্সেল সফলভাবে ${courierName}-এ বুকিং করা হয়েছে।`,
    data: {
      orderNumber: order.orderNumber,
      courierProvider: order.courierProvider,
      consignmentId: order.courierConsignmentId,
      trackingCode: order.courierTrackingCode,
      status: order.status,
    },
  });
};
