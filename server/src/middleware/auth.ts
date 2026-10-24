import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { verifyToken, TokenPayload } from '../utils/jwt';
import { UserRole } from '../types';
import { User } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    // 1. From Authorization Header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } 
    // 2. From Cookies
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(AppError.unauthorized('দয়া করে প্রথমে লগইন করুন।'));
    }

    const decoded = verifyToken(token);
    
    // Check if user still exists and is active
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return next(AppError.unauthorized('এই ব্যবহারকারীর একাউন্ট আর কার্যকর নেই।'));
    }

    req.user = decoded;
    next();
  } catch (error) {
    return next(AppError.unauthorized('অবৈধ বা মেয়াদোত্তীর্ণ টোকেন।'));
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(AppError.unauthorized());
    }

    if (!roles.includes(req.user.role)) {
      return next(AppError.forbidden('আপনার এই অপারেশনের অনুমতি নেই।'));
    }

    next();
  };
};
