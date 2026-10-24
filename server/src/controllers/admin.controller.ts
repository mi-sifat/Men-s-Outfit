import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { StoreSettings } from '../models/StoreSettings';
import { AuditLog } from '../models/AuditLog';
import { OrderStatus } from '../types';

// GET /api/admin/dashboard/stats
export const getDashboardStats = async (_req: Request, res: Response) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalOrders,
    todayOrders,
    pendingOrders,
    confirmedOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    totalProducts,
    totalCustomers,
    revenueData,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ createdAt: { $gte: today } }),
    Order.countDocuments({ status: OrderStatus.PENDING }),
    Order.countDocuments({ status: OrderStatus.CONFIRMED }),
    Order.countDocuments({ status: OrderStatus.SHIPPED }),
    Order.countDocuments({ status: OrderStatus.DELIVERED }),
    Order.countDocuments({ status: OrderStatus.CANCELLED }),
    Product.countDocuments({ isPublished: true }),
    User.countDocuments({ role: 'customer' }),
    Order.aggregate([
      { $match: { status: { $ne: OrderStatus.CANCELLED } } },
      { $group: { _id: null, totalRevenue: { $sum: '$payableTotal' } } },
    ]),
  ]);

  const grossRevenue = revenueData[0]?.totalRevenue || 0;

  // Recent 10 orders
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  // Low stock products alert (stock < 5)
  const lowStockProducts = await Product.find({
    'variants.stock': { $lt: 5 },
  })
    .select('title variants')
    .limit(6)
    .lean();

  res.status(200).json({
    success: true,
    data: {
      metrics: {
        totalOrders,
        todayOrders,
        pendingOrders,
        confirmedOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalProducts,
        totalCustomers,
        grossRevenue,
      },
      recentOrders,
      lowStockProducts,
    },
  });
};

// GET /api/admin/settings (Get full store settings for admin)
export const getSettings = async (_req: Request, res: Response) => {
  let settings = await StoreSettings.findOne();
  if (!settings) {
    settings = await StoreSettings.create({});
  }
  res.status(200).json({ success: true, data: settings });
};

// PUT /api/admin/settings (Update store settings)
export const updateSettings = async (req: Request, res: Response) => {
  let settings = await StoreSettings.findOne();
  if (!settings) {
    settings = await StoreSettings.create(req.body);
  } else {
    Object.assign(settings, req.body);
    await settings.save();
  }

  // Record Audit Log
  if (req.user) {
    await AuditLog.create({
      adminId: req.user.userId,
      adminEmail: req.user.email,
      adminName: 'Admin',
      action: 'UPDATE_STORE_SETTINGS',
      resource: 'SETTINGS',
      details: 'Store settings, banners or delivery rules updated.',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  res.status(200).json({
    success: true,
    message: 'স্টোর সেটিংস সফলভাবে আপডেট হয়েছে।',
    data: settings,
  });
};

// GET /api/admin/orders (Full order list with filtering)
export const getAllOrders = async (req: Request, res: Response) => {
  const { status, search } = req.query;
  const query: any = {};

  if (status && status !== 'all') {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { orderNumber: { $regex: search as string, $options: 'i' } },
      { 'shippingAddress.phone': { $regex: search as string, $options: 'i' } },
      { 'shippingAddress.fullName': { $regex: search as string, $options: 'i' } },
    ];
  }

  const orders = await Order.find(query).sort({ createdAt: -1 }).limit(50).lean();

  res.status(200).json({
    success: true,
    data: orders,
  });
};

// GET /api/admin/audit-logs (Security & Audit trails)
export const getAuditLogs = async (_req: Request, res: Response) => {
  const logs = await AuditLog.find()
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  res.status(200).json({
    success: true,
    data: logs,
  });
};
