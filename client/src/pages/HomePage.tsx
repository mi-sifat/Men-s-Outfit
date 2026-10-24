import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Sparkles, TrendingUp, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../components/product/ProductCard';
import { getAllProducts } from '../data/productStore';
import { getLocalStoreSettings } from '../data/settingsStore';
import type { StoreSettingsData } from '../data/settingsStore';

interface HomePageProps {
  onAddToCart?: (product: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onAddToCart }) => {
  const allProducts = getAllProducts();
  const newArrivals = allProducts.filter((p) => p.isNewArrival);
  const bestSellers = allProducts.filter((p) => p.isBestSeller);

  const [settings, setSettings] = useState<StoreSettingsData>(() => getLocalStoreSettings());

  useEffect(() => {
    const handleUpdate = () => setSettings(getLocalStoreSettings());
    window.addEventListener('store_settings_updated', handleUpdate);
    return () => window.removeEventListener('store_settings_updated', handleUpdate);
  }, []);

  const activeBanner = settings.banners?.find((b) => b.isActive) || settings.banners?.[0];

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#0B0F19] text-white overflow-hidden">
        {/* Background Accent Gradients */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#C5A880]/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-slate-800/40 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C5A880]/10 border border-[#C5A880]/30 text-[#C5A880] text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>নতুন ড্রপ: সামার & স্ট্রিটওয়্যার ২০২৬</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
                {activeBanner?.title || 'আধুনিক পুরুষের ট্রেন্ডি কালেকশন'}
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {activeBanner?.subtitle || '১০০% কম্বড সুতি এবং হেভিওয়েট জিএসএম-এ প্রস্তুতকৃত নিখুঁত ফিটিং টি-শার্ট। বাংলাদেশের আবহাওয়ায় সর্বোচ্চ কমফোর্ট।'}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to={activeBanner?.linkUrl || '/shop'}>
                  <Button variant="secondary" size="lg" className="shadow-lg shadow-[#C5A880]/20 font-bold gap-2">
                    <span>{activeBanner?.buttonText || 'কালেকশন দেখুন'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/category/oversized">
                  <Button variant="outline" size="lg" className="border-slate-700 text-white hover:bg-slate-800/80 hover:border-slate-500">
                    ওভারসাইজড টি-শার্ট
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ক্যাশ অন ডেলিভারি
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ৭ দিনের এক্সচেঞ্জ ওয়ারেন্টি
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  প্রকৃত গ্রাহক সন্তুষ্টি
                </span>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="aspect-4/5 rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-800 bg-slate-900 group">
                  <img
                    src={activeBanner?.imageUrl || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80'}
                    alt={activeBanner?.title || "Men's Outfit Banner"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                    <span className="text-[#C5A880] text-xs font-mono uppercase tracking-widest font-bold">MEN'S OUTFIT</span>
                    <h3 className="text-white text-lg font-bold">{activeBanner?.title || 'Jet Black Drop-Shoulder Tee'}</h3>
                    <p className="text-slate-300 text-xs mt-1">Starting from ৳ ৮৫০</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-[#C5A880] uppercase tracking-widest block mb-1">
              CATEGORY SPOTLIGHT
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              জনপ্রিয় ক্যাটাগরি ব্রাউজ করুন
            </h2>
          </div>
          <Link to="/shop" className="text-sm font-semibold text-slate-700 hover:text-black flex items-center gap-1">
            <span>সবগুলো দেখুন</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              title: 'ওভারসাইজড টি-শার্ট',
              slug: 'oversized',
              image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&auto=format&fit=crop&q=80',
              count: '১২+ ডিজাইন',
            },
            {
              title: 'ড্রপ শোল্ডার',
              slug: 'drop-shoulder',
              image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop&q=80',
              count: '১৫+ কালার',
            },
            {
              title: 'গ্রাফিক টিজ',
              slug: 'graphic-tees',
              image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80',
              count: '৮+ আর্টওয়ার্ক',
            },
            {
              title: 'প্রিমিয়াম পোলো',
              slug: 'polo',
              image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&auto=format&fit=crop&q=80',
              count: '১০+ শেডস',
            },
          ].map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="group relative aspect-3/4 rounded-xl overflow-hidden bg-slate-900 block shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4">
                <span className="text-[11px] text-[#C5A880] font-mono tracking-wider">{cat.count}</span>
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#C5A880] transition-colors">
                  {cat.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. NEW ARRIVALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-900 text-[#C5A880] rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">নতুন আগমন (New Arrivals)</h2>
              <p className="text-xs text-slate-500">এই সপ্তাহের সদ্য বাজারে আসা এক্সক্লুসিভ কালেকশন</p>
            </div>
          </div>
          <Link to="/new-arrivals" className="text-xs font-bold uppercase tracking-wider text-slate-800 hover:text-[#C5A880] flex items-center gap-1">
            <span>সব নতুন প্রোডাক্ট</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      </section>

      {/* 4. PROMOTIONAL BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-gradient-to-r from-[#0B0F19] via-slate-900 to-[#1E293B] text-white p-8 sm:p-12 overflow-hidden shadow-xl border border-slate-800">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="inline-block px-3 py-1 bg-rose-600 text-white font-bold text-xs uppercase tracking-widest rounded-md">
              বিশেষ মূল্যছাড় অফার
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              যেকোনো ৩টি টি-শার্ট অর্ডারে সারাদেশে ফ্রি হোম ডেলিভারি!
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              কুপন কোড প্রয়োজন নেই। চেকআউটে স্বয়ংক্রিয়ভাবে ডেলিভারি চার্জ মওকুফ হবে। অফারটি সীমিত সময়ের জন্য।
            </p>
            <div className="pt-2">
              <Link to="/shop">
                <Button variant="secondary" size="md" className="font-bold">
                  এখনই শপিং শুরু করুন
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <Flame className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">সেরা বিক্রিত (Best Sellers)</h2>
              <p className="text-xs text-slate-500">গ্রাহকদের সবচেয়ে পছন্দের এবং সর্বাধিক বিক্রিত আইটেম</p>
            </div>
          </div>
          <Link to="/shop" className="text-xs font-bold uppercase tracking-wider text-slate-800 hover:text-[#C5A880] flex items-center gap-1">
            <span>সব সেরা পণ্য</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      </section>
    </div>
  );
};
