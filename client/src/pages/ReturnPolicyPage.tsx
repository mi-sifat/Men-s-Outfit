import React from 'react';
import { RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-react';

export const ReturnPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8 text-slate-300">
      <div className="border-b border-white/10 pb-4">
        <span className="text-xs font-mono font-bold text-[#C5A880] uppercase tracking-widest block mb-1">
          ECHO OUTFITS POLICIES
        </span>
        <h1 className="text-3xl font-black text-white">রিটার্ন ও এক্সচেঞ্জ নীতি (Return & Refund Policy)</h1>
      </div>

      <div className="space-y-6 text-sm leading-relaxed">
        <p>
          গ্রাহকদের ১০০% সন্তুষ্টি আমাদের শীর্ষ অগ্রাধিকার। পণ্যের সাইজ অমিল হলে বা উৎপাদনে কোনো ত্রুটি থাকলে আমরা দিচ্ছি <strong>৭ দিনের সহজ এক্সচেঞ্জ ও রিটার্ন গ্যারান্টি</strong>।
        </p>

        <div className="p-5 rounded-2xl bg-[#0F172A] border border-white/10 space-y-3">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-[#C5A880]" />
            <span>রিটার্ন বা এক্সচেঞ্জের শর্তাবলী:</span>
          </h3>
          <ul className="list-disc list-inside space-y-2 text-xs text-slate-400">
            <li>পণ্যটি গ্রহণের ৭ দিনের মধ্যে এক্সচেঞ্জ বা রিটার্ন রিকোয়েস্ট করতে হবে।</li>
            <li>টি-শার্টটি অব্যবহৃত, ওয়াশ না করা এবং মূল ট্যাগ সহ অক্ষত থাকতে হবে।</li>
            <li>আমাদের ভুল বা সাইজ ত্রুটির কারণে এক্সচেঞ্জ হলে কোনো অতিরিক্ত ডেলিভারি ফি নেওয়া হবে না।</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F172A] border border-white/10 space-y-3">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>টাকা রিফান্ডের নিয়ম (Refund Policy):</span>
          </h3>
          <p className="text-xs text-slate-400">
            অনলাইনে পরিশোধকৃত অর্ডারের ক্ষেত্রে যদি গ্রাহক পণ্য রিটার্ন করেন, তবে পার্সেলটি আমাদের ওয়্যারহাউজে ফেরত আসার ৩-৫ কার্যদিবসের মধ্যে বিকাশ, নগদ বা ব্যাংক ট্রান্সফারের মাধ্যমে রিফান্ড সম্পন্ন করা হবে।
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-400">
          <strong className="text-white">রিটার্ন হেল্পলাইন:</strong> 01700-000000 (সকাল ১০টা থেকে রাত ১০টা) অথবা ইমেইল করুন: support@echooutfits.com
        </div>
      </div>
    </div>
  );
};
