import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, Sparkles, Heart, ArrowRight, Award, Compass, Shirt } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/Button';

export const AboutPage: React.FC = () => {
  const { language } = useTheme();
  const isBn = language === 'bn';

  return (
    <div className="bg-white dark:bg-[#080C14] text-slate-900 dark:text-white transition-colors">
      {/* ── Hero Section ────────────────────────────────────────── */}
      <section className="relative py-16 sm:py-24 bg-slate-50 dark:bg-[#0B0F19] border-b border-slate-100 dark:border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-blue-600/10 dark:bg-[#C5A880]/15 text-blue-600 dark:text-[#C5A880] font-mono">
            {isBn ? 'আমাদের ব্র্যান্ডের গল্প' : 'OUR BRAND STORY'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase font-heading">
            {isBn ? "মেন'স আউটফিট — প্রিমিয়াম স্ট্রিটওয়্যার" : "MEN'S OUTFIT — REDEFINING STREETWEAR"}
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {isBn
              ? 'বাংলাদেশের আধুনিক ফ্যাশন সচেতন তরুণদের জন্য সর্বোচ্চ মানের হেভিওয়েট সুতি, নিখুঁত ড্রপ কাটিং এবং দীর্ঘস্থায়ী স্ট্রিট আর্টের মেলবন্ধন।'
              : 'Born out of the urban street culture of Bangladesh, crafted with 100% heavyweight combed cotton and tailored for relaxed all-day comfort.'}
          </p>
        </div>
      </section>

      {/* ── Brand Mission & Story ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-lg bg-slate-900">
            <img
              src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&auto=format&fit=crop&q=85"
              alt="Streetwear Craftsmanship"
              className="w-full h-full object-cover brightness-95 hover:scale-103 transition-transform duration-700"
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight font-heading">
              {isBn ? 'কোয়ালিটি ও ফিটিংয়ে আপসহীন' : 'ENGINEERED FOR HEAVYWEIGHT COMFORT'}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isBn
                ? 'আমরা সাধারণ টি-শার্ট তৈরি করি না। মেন’স আউটফিটের প্রতিটি পোশাক ২৪০ থেকে ২৬০ GSM প্রিমিয়াম বায়ো-ওয়াশড কম্বড কটন দিয়ে তৈরি, যা অতিরিক্ত গরম বা আর্দ্রতায় সহজে আকার নষ্ট হয় না।'
                : 'We don’t compromise on fabric weight. Every Men’s Outfit piece is built with 240-260 GSM organic combed cotton, precision-tailored drop-shoulder cut, and anti-fade reactive dyes to withstand every wash.'}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isBn
                ? 'আমাদের মূল লক্ষ্য আন্তর্জাতিক মানের মিনিমালিস্ট ও স্টেটমেন্ট স্ট্রিটওয়্যার বাংলাদেশের মানুষের কাছে সরাসরি ও ন্যায্য মূল্যে পৌঁছে দেওয়া।'
                : 'Our mission is to bring global architectural streetwear aesthetics right to your door in Bangladesh with full cash on delivery and unconditional replacement.'}
            </p>
            <div className="pt-2">
              <Link to="/shop">
                <Button variant="primary" size="md" className="bg-slate-900 dark:bg-[#C5A880] text-white dark:text-black font-bold text-xs uppercase tracking-wider rounded-lg px-6">
                  <span>{isBn ? 'কালেকশন এক্সপ্লোর করুন' : 'EXPLORE COLLECTION'}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4 Pillars of Men's Outfit ──────────────────────────────── */}
      <section className="bg-slate-50 dark:bg-[#0B0F19] py-14 sm:py-20 border-y border-slate-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight font-heading">
              {isBn ? 'কেন মেন’স আউটফিট?' : 'WHY CHOOSE MEN’S OUTFIT?'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {isBn ? 'আমাদের মূল চারটি প্রতিশ্রুতি' : 'Our four core promises to every customer'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-[#C5A880] flex items-center justify-center">
                <Shirt className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                {isBn ? '২৪০-২৬০ GSM কটন' : 'Heavyweight 240+ GSM'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {isBn
                  ? '১০০% পিউর কম্বড কটন, নন-শ্রিংক ফ্যাব্রিক ও লাক্সারি হ্যান্ড-ফিল।'
                  : 'Zero see-through, pre-shrunk organic combed cotton with superior drape.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                {isBn ? 'নিখুঁত ড্রপ কাটিং' : 'Tailored Street Silhouette'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {isBn
                  ? 'রিল্যাক্সড ড্রপ শোল্ডার ও ওভারসাইজড প্যাটার্ন যা সব ধরণের বডি শেইপে আকর্ষণীয় দেখায়।'
                  : 'Proportionate shoulder drop and relaxed chest measurements for an effortlessly bold look.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                {isBn ? 'সারাদেশে ক্যাশ অন ডেলিভারি' : 'Nationwide COD'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {isBn
                  ? 'ঢাকা সিটিতে ২৪-৪৮ ঘণ্টা এবং সারাদেশে ৭২ ঘণ্টার মধ্যে দ্রুত ডেলিভারি।'
                  : 'Fast doorstep delivery across all 64 districts with full cash on delivery convenience.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/10 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                {isBn ? '৭ দিনে সহজ এক্সচেঞ্জ' : '7 Days Replacement'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {isBn
                  ? 'সাইজ বা ফিটিং এ কোনো সমস্যা হলে সাথে সাথে ফ্রি এক্সচেঞ্জ সাপোর্ট।'
                  : 'Hassle-free size replacement and responsive customer support within 7 days.'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
