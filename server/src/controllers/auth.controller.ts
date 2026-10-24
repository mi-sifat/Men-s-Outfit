import { Request, Response } from 'express';
import { User } from '../models/User';
import { AuditLog } from '../models/AuditLog';
import { AppError } from '../utils/AppError';
import { generateToken } from '../utils/jwt';
import { UserRole } from '../types';
import config from '../config';

// ── Register (Customer) ──────────────────────────────────────
export const register = async (req: Request, res: Response) => {
  const { name, email, phone, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw AppError.conflict('এই ইমেইল দিয়ে ইতিমধ্যে একাউন্ট খোলা হয়েছে।');
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: UserRole.CUSTOMER,
  });

  const token = generateToken({
    userId: user._id.toString(),
    role: user.role,
    email: user.email,
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: config.isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    success: true,
    message: 'একাউন্ট সফলভাবে তৈরি হয়েছে।',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    },
  });
};

// ── Check if Admin exists (for initial setup check) ──────────
export const checkAdminStatus = async (_req: Request, res: Response) => {
  const adminCount = await User.countDocuments({
    role: { $in: [UserRole.ADMIN, UserRole.OWNER] },
  });

  res.status(200).json({
    success: true,
    data: {
      hasAdmin: adminCount > 0,
    },
  });
};

// ── Setup First Admin (Locked once any admin exists) ─────────
export const setupFirstAdmin = async (req: Request, res: Response) => {
  const adminCount = await User.countDocuments({
    role: { $in: [UserRole.ADMIN, UserRole.OWNER] },
  });

  if (adminCount > 0) {
    throw AppError.forbidden('এডমিন ইতিমধ্যে সেটআপ করা হয়েছে। নতুন এডমিন সেটআপ নিষিদ্ধ।');
  }

  const { name, email, password, phone } = req.body;

  if (!email || !password || password.length < 8) {
    throw AppError.badRequest('বৈধ ইমেইল এবং কমপক্ষে ৮ অক্ষরের পাসওয়ার্ড প্রয়োজন।');
  }

  const user = await User.create({
    name: name?.trim() || 'Store Administrator',
    email: email.trim().toLowerCase(),
    phone: phone?.trim(),
    password,
    role: UserRole.OWNER,
    isActive: true,
  });

  // Audit Log
  await AuditLog.create({
    adminId: user._id.toString(),
    adminEmail: user.email,
    adminName: user.name,
    action: 'INITIAL_ADMIN_SETUP',
    resource: 'SYSTEM',
    details: 'First owner administrator successfully initialized.',
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  const token = generateToken({
    userId: user._id.toString(),
    role: user.role,
    email: user.email,
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: config.isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    success: true,
    message: 'প্রথম এডমিন একাউন্ট সফলভাবে সক্রিয় হয়েছে!',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    },
  });
};

// ── Login ────────────────────────────────────────────────────
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw AppError.badRequest('ইমেইল এবং পাসওয়ার্ড প্রদান করুন।');
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
  if (!user || !user.password) {
    throw AppError.unauthorized('ভুল ইমেইল বা পাসওয়ার্ড।');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw AppError.unauthorized('ভুল ইমেইল বা পাসওয়ার্ড।');
  }

  if (!user.isActive) {
    throw AppError.forbidden('আপনার একাউন্ট স্থগিত করা হয়েছে। সাপোর্টে যোগাযোগ করুন।');
  }

  const token = generateToken({
    userId: user._id.toString(),
    role: user.role,
    email: user.email,
  });

  // Audit log for admin/staff login
  if (user.role !== UserRole.CUSTOMER) {
    await AuditLog.create({
      adminId: user._id.toString(),
      adminEmail: user.email,
      adminName: user.name,
      action: 'ADMIN_LOGIN',
      resource: 'AUTH',
      details: `Admin logged in successfully with role: ${user.role}`,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  res.cookie('token', token, {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: config.isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: 'লগইন সফল হয়েছে।',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token,
    },
  });
};

// ── Get Authenticated User ───────────────────────────────────
export const getMe = async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.userId);
  if (!user) {
    throw AppError.notFound('ব্যবহারকারী পাওয়া যায়নি।');
  }

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses,
      },
    },
  });
};

// ── Change Admin Password ────────────────────────────────────
export const changePassword = async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword || newPassword.length < 8) {
    throw AppError.badRequest('বর্তমান পাসওয়ার্ড এবং কমপক্ষে ৮ অক্ষরের নতুন পাসওয়ার্ড দিন।');
  }

  const user = await User.findById(req.user?.userId).select('+password');
  if (!user || !user.password) {
    throw AppError.unauthorized('ব্যবহারকারী শনাক্ত করা যায়নি।');
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw AppError.badRequest('বর্তমান পাসওয়ার্ডটি সঠিক নয়।');
  }

  user.password = newPassword;
  await user.save();

  await AuditLog.create({
    adminId: user._id.toString(),
    adminEmail: user.email,
    adminName: user.name,
    action: 'CHANGE_PASSWORD',
    resource: 'ACCOUNT',
    details: 'Admin password changed securely.',
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
  });

  res.status(200).json({
    success: true,
    message: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।',
  });
};

// ── Logout ───────────────────────────────────────────────────
export const logout = async (req: Request, res: Response) => {
  if (req.user && req.user.role !== UserRole.CUSTOMER) {
    await AuditLog.create({
      adminId: req.user.userId,
      adminEmail: req.user.email,
      adminName: 'Admin',
      action: 'ADMIN_LOGOUT',
      resource: 'AUTH',
      details: 'Admin logged out.',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
  }

  res.clearCookie('token');
  res.status(200).json({
    success: true,
    message: 'সফলভাবে লগআউট হয়েছে।',
  });
};
