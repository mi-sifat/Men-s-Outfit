import rateLimit from 'express-rate-limit';

// Rate limiter for authentication routes (prevent brute-force password guessing)
// Crucial: skipSuccessfulRequests is true so successful logins are never penalized or blocked!
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 failed login attempts per 15 minutes
  skipSuccessfulRequests: true, // Accurate: Only failed logins (wrong password) count against the limit
  message: {
    success: false,
    message: 'অতিরিক্ত ভুল লগইন চেষ্টা শনাক্ত হয়েছে। অনুগ্রহ করে ১৫ মিনিট পর পুনরায় চেষ্টা করুন।',
    code: 'TOO_MANY_ATTEMPTS',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
