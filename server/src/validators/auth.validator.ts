import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'নাম কমপক্ষে ২ অক্ষরের হতে হবে'),
    email: z.string().email('সঠিক ইমেইল প্রদান করুন'),
    phone: z.string().regex(/^01[3-9]\d{8}$/, 'সঠিক বাংলাদেশী ফোন নম্বর দিন (যেমন: 017XXXXXXXX)').optional(),
    password: z.string().min(6, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('সঠিক ইমেইল দিন'),
    password: z.string().min(1, 'পাসওয়ার্ড আবশ্যক'),
  }),
});
