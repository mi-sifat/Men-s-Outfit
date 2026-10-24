import { Request, Response } from 'express';
import { User } from '../models/User';
import { AppError } from '../utils/AppError';
import { generateToken } from '../utils/jwt';
import { UserRole } from '../types';
import config from '../config';

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

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
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

export const logout = async (_req: Request, res: Response) => {
  res.clearCookie('token');
  res.status(200).json({
    success: true,
    message: 'সফলভাবে লগআউট হয়েছে।',
  });
};
