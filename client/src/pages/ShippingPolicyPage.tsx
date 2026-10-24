import React from 'react';
import { Truck, Clock, ShieldCheck, MapPin } from 'lucide-react';

export const ShippingPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8 text-slate-300">
      <div className="border-b border-white/10 pb-4">
        <span className="text-xs font-mono font-bold text-[#C5A880] uppercase tracking-widest block mb-1">
          ECHO OUTFITS POLICIES
        </span>
        <h1 className="text-3xl font-black text-white">ডেলিভারি ও শিপিং পলিসি (Shipping Policy)</h1>
      </div>

      <div className="space-y-6 text-sm leading-relaxed">
        <p>
          Echo Outfits গ্রাহকদের দ্রুত ও নির্ভরযোগ্য ডেলিভারি সেবা প্রদানে প্রতিশ্রুতিবদ্ধ। আমরা সরাসরি আমাদের নিজস্ব টিম এবং বিশ্বস্ত কুরিয়ার পার্টনারদের (Pathao, Steadfast) মাধ্যমে সারাদেশে ক্যাশ অন ডেলিভারিতে পণ্য পৌঁছে দিই।
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-white/10 space-y-2">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#C5A880]" />
              <span>ঢাকা সিটির ভিতরে</span>
            </h3>
            <p className="text-xs text-slate-400">
              ডেলিভারি চার্জ: <strong>৳ ৭০</strong><br />
              সময়সীমা: <strong>২৪ থেকে ৪৮ ঘণ্টা</strong> (১-২ কার্যদিবস)
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#0F172A] border border-white/10 space-y-2">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#C5A880]" />
              <span>ঢাকা সিটির বাইরে (সারাদেশ)</span>
            </h3>
            <p className="text-xs text-slate-400">
              ডেলিভারি চার্জ: <strong>৳ ১৩০</strong><br />
              সময়সীমা: <strong>২ থেকে ৪ কার্যদিবস</strong>
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#C5A880]/10 border border-[#C5A880]/20 text-[#C5A880] font-semibold text-xs flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>বিশেষ অফার: যেকোনো ৩টি টি-শার্ট অথবা ২,০০০ টাকার বেশি অর্ডারে সারাদেশে ফ্রি হোম ডেলিভারি!</span>
        </div>

        <div className="space-y-3 pt-4">
          <h2 className="text-lg font-bold text-white">পার্সেল রিসিভ করার নিয়মাবলী:</h2>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-400">
            <li>ডেলিভারিম্যান থাকা অবস্থায় পার্সেলটি ভালোভাবে চেক করে নিন।</li>
            <li>পণ্য ঠিকঠাক থাকলে ক্যাশ অন ডেলিভারির সম্পূর্ণ মূল্য পরিশোধ করুন।</li>
            <li>কোনো ত্রুটি বা সাইজ অমিল মনে হলে সাথে সাথে আমাদের কাস্টমার কেয়ারে কল করুন।</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
