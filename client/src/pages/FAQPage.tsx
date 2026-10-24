import React from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const faqs = [
    {
      q: 'ক্যাশ অন ডেলিভারিতে কি সারা বাংলাদেশে পার্সেল পাওয়া যাবে?',
      a: 'হ্যাঁ! ঢাকা শহর সহ বাংলাদেশের ৬৪টি জেলা ও যেকোনো থানা/উপজেলায় আমরা ক্যাশ অন ডেলিভারিতে হোম ডেলিভারি প্রদান করি। পণ্য হাতে পেয়ে ডেলিভারিম্যানকে টাকা পরিশোধ করবেন।',
    },
    {
      q: 'টি-শার্টের ফেব্রিক কোয়ালিটি ও জিএসএম (GSM) কেমন?',
      a: 'আমরা শতভাগ ১০০% কম্বড কটন ফেব্রিক ব্যবহার করি যা ২৪০ থেকে ২৬০ GSM-এর হেভিওয়েট ও প্রিমিয়াম ফিনিশের। এতে কোনো কালার ব্লিডিং বা সহজে সঙ্কুচিত হওয়ার ভয় নেই।',
    },
    {
      q: 'সাইজ ছোট বা বড় হলে পরিবর্তন (Exchange) করার সুযোগ আছে কি?',
      a: 'অবশ্যই! পার্সেল গ্রহণের পর ৭ দিনের মধ্যে সাইজ পরিবর্তনের সম্পূর্ণ সুযোগ রয়েছে। আমাদের হটলাইনে জানালেই এক্সচেঞ্জ পার্সেল পৌঁছে দেওয়া হবে।',
    },
    {
      q: 'ডেলিভারি পেতে কতদিন সময় লাগে?',
      a: 'ঢাকা সিটিতে ২৪ থেকে ৪৮ ঘণ্টা এবং ঢাকার বাইরে ২ থেকে ৪ কার্যদিবসের মধ্যে পার্সেল ডেলিভারি সম্পন্ন হয়।',
    },
    {
      q: 'আমি কি অর্ডার ট্র্যাক করতে পারব?',
      a: 'হ্যাঁ, আমাদের ওয়েবসাইটের "অর্ডার ট্র্যাকিং" পেজে গিয়ে আপনার অর্ডার নম্বর দিলেই লাইভ কুরিয়ার স্ট্যাটাস দেখতে পাবেন।',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8 text-slate-300">
      <div className="border-b border-white/10 pb-4">
        <span className="text-xs font-mono font-bold text-[#C5A880] uppercase tracking-widest block mb-1">
          HELP & SUPPORT
        </span>
        <h1 className="text-3xl font-black text-white">প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী (FAQ)</h1>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="p-5 rounded-2xl bg-[#0F172A] border border-white/10 space-y-2">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#C5A880] shrink-0" />
              <span>{faq.q}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 pl-7 leading-relaxed font-light">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
