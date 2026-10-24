import { Request, Response } from 'express';
import { Coupon } from '../models/Coupon';
import { AppError } from '../utils/AppError';

// POST /api/coupons/validate (Public coupon validation for checkout)
export const validateCoupon = async (req: Request, res: Response) => {
  const { code, subtotal } = req.body;

  if (!code) {
    throw AppError.badRequest('কুপন কোড প্রদান করুন।');
  }

  const coupon = await Coupon.findOne({
    code: String(code).trim().toUpperCase(),
    isActive: true,
    startDate: { $lte: new Date() },
    endDate: { $gte: new Date() },
  });

  if (!coupon) {
    throw AppError.notFound('অবৈধ বা মেয়াদোত্তীর্ণ কুপন কোড।');
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw AppError.badRequest('এই কুপনের ব্যবহারের সীমা শেষ হয়ে গেছে।');
  }

  if (subtotal && subtotal < coupon.minOrderAmount) {
    throw AppError.badRequest(`এই কুপনটি ব্যবহার করতে ন্যূনতম ৳${coupon.minOrderAmount} টাকার অর্ডার প্রয়োজন।`);
  }

  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = Math.round(((subtotal || 0) * coupon.discountValue) / 100);
    if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
      discountAmount = coupon.maxDiscountAmount;
    }
  } else {
    discountAmount = coupon.discountValue;
  }

  if (subtotal && discountAmount > subtotal) {
    discountAmount = subtotal;
  }

  res.status(200).json({
    success: true,
    message: 'কুপন সফলভাবে প্রয়োগ করা হয়েছে!',
    data: {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
    },
  });
};

// GET /api/coupons (Admin list)
export const getCoupons = async (_req: Request, res: Response) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    data: coupons,
  });
};

// POST /api/coupons (Admin create)
export const createCoupon = async (req: Request, res: Response) => {
  const { code, discountType, discountValue, minOrderAmount, maxDiscountAmount, startDate, endDate, usageLimit } = req.body;

  const existing = await Coupon.findOne({ code: String(code).trim().toUpperCase() });
  if (existing) {
    throw AppError.conflict('এই কোডের একটি কুপন ইতিমধ্যে বিদ্যমান।');
  }

  const coupon = await Coupon.create({
    code: String(code).trim().toUpperCase(),
    discountType,
    discountValue,
    minOrderAmount: minOrderAmount || 0,
    maxDiscountAmount,
    startDate: new Date(startDate || Date.now()),
    endDate: new Date(endDate),
    usageLimit,
    isActive: true,
  });

  res.status(201).json({
    success: true,
    message: 'কুপন সফলভাবে তৈরি করা হয়েছে।',
    data: coupon,
  });
};
