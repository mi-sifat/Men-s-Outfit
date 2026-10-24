import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';
import config from '../config';

// Async handler wrapper to avoid try-catch in every controller
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Global error handler
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = 'সার্ভারে সমস্যা হয়েছে।';
  let code = 'INTERNAL_ERROR';
  let isOperational = false;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    code = err.code || 'ERROR';
    isOperational = err.isOperational;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'তথ্য যাচাইকরণে সমস্যা।';
    code = 'VALIDATION_ERROR';
    isOperational = true;
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'অবৈধ তথ্য।';
    code = 'INVALID_ID';
    isOperational = true;
  }

  // Mongoose duplicate key error
  if ((err as any).code === 11000) {
    statusCode = 409;
    message = 'এই তথ্য ইতিমধ্যে বিদ্যমান।';
    code = 'DUPLICATE_KEY';
    isOperational = true;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'অবৈধ টোকেন। দয়া করে আবার লগইন করুন।';
    code = 'INVALID_TOKEN';
    isOperational = true;
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'টোকেনের মেয়াদ শেষ। দয়া করে আবার লগইন করুন।';
    code = 'TOKEN_EXPIRED';
    isOperational = true;
  }

  // Log error
  if (!isOperational) {
    logger.error('Unhandled error:', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
    });
  } else {
    logger.warn(`Operational error: ${message}`, {
      statusCode,
      code,
      url: req.originalUrl,
    });
  }

  // Send response
  const response: Record<string, any> = {
    success: false,
    message,
    code,
  };

  // Include stack trace in development only
  if (config.isDevelopment && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

// 404 handler
export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(AppError.notFound(`রুট পাওয়া যায়নি: ${req.originalUrl}`));
};
