import rateLimit from 'express-rate-limit';

// Strict rate limiter for authentication routes (prevent brute force)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 attempts per 15 mins per IP
  message: {
    success: false,
    message: 'অতিরিক্ত লগইন চেষ্টা শনাক্ত হয়েছে। অনুগ্রহ করে ১৫ মিনিট পর পুনরায় চেষ্টা করুন।',
    code: 'TOO_MANY_ATTEMPTS',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
