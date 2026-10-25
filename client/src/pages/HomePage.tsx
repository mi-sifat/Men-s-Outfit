import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, Sparkles, Truck, RotateCcw, ShieldCheck, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../components/product/ProductCard';
import { getAllProducts } from '../data/productStore';
import { getLocalStoreSettings } from '../data/settingsStore';
import type { StoreSettingsData } from '../data/settingsStore';
import { useTheme } from '../context/ThemeContext';

interface HomePageProps {
  onAddToCart?: (product: any) => void;
}

const normalizeCategory = (cat: string) => cat.toLowerCase().trim().replace(/[\s_]+/g, '-');

export const HomePage: React.FC<HomePageProps> = ({ onAddToCart }) => {
  const { language } = useTheme();
  const isBn = language === 'bn';

  const allProducts = useMemo(() => getAllProducts(), []);

  const newArrivals = useMemo(() => allProducts.filter((p) => p.isNewArrival).slice(0, 5), [allProducts]);
  const dropShoulder = useMemo(
    () => allProducts.filter((p) => normalizeCategory(p.category) === 'drop-shoulder').slice(0, 5),
    [allProducts]
  );
  const oversized = useMemo(
    () => allProducts.filter((p) => normalizeCategory(p.category) === 'oversized').slice(0, 5),
    [allProducts]
  );
  const graphicTees = useMemo(
    () => allProducts.filter((p) => normalizeCategory(p.category) === 'graphic-tees').slice(0, 5),
    [allProducts]
  );
  const polos = useMemo(
    () => allProducts.filter((p) => normalizeCategory(p.category) === 'polo').slice(0, 5),
    [allProducts]
  );

  const [settings, setSettings] = useState<StoreSettingsData>(() => getLocalStoreSettings());

  useEffect(() => {
    const handleUpdate = () => setSettings(getLocalStoreSettings());
    window.addEventListener('store_settings_updated', handleUpdate);
    return () => window.removeEventListener('store_settings_updated', handleUpdate);
  }, []);

  const activeBanner = settings.banners?.find((b) => b.isActive) || settings.banners?.[0];

  return (
    <div className="space-y-10 sm:space-y-14 pb-16">
      {/* 1. TOP WIDE LIFESTYLE BANNER (EDWIN Style Top Banner from 2nd Screenshot) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-white/10 shadow-lg group">
          <div className="relative aspect-16/7 sm:aspect-21/8 lg:aspect-3/1 w-full overflow-hidden">
            <img
              src={activeBanner?.imageUrl || 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1600&auto=format&fit=crop&q=85'}
              alt={activeBanner?.title || "Men's Outfit Casual Fashion"}
              className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-700 brightness-95"
            />
            {/* Subtle Gradient & Typography Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex items-center p-6 sm:p-12 lg:p-16">
              <div className="max-w-xl space-y-3 sm:space-y-4 text-white">
                <span className="inline-block px-3 py-1 bg-[#2563EB] dark:bg-[#C5A880] text-white dark:text-black font-extrabold text-[11px] sm:text-xs uppercase tracking-widest rounded-sm">
                  {isBn ? 'এক্সক্লুসিভ স্ট্রিটওয়্যার ২০২৬' : 'SUMMER & STREET DROP 2026'}
                </span>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight uppercase font-heading">
                  {activeBanner?.title || (isBn ? 'ক্যাজুয়াল ও ড্রপ-শোল্ডার কালেকশন' : 'CASUAL & STREETWEAR ESSENTIALS')}
                </h1>
                <p className="text-slate-200 text-xs sm:text-sm sm:max-w-md line-clamp-2 sm:line-clamp-none font-normal">
                  {activeBanner?.subtitle || (isBn ? '১০০% হেভিওয়েট কম্বড কটন ফেব্রিক। নিখুঁত রিল্যাক্সড ফিট ও দীর্ঘস্থায়ী কোয়ালিটি।' : '100% Combed Heavy Cotton. Built for comfort, durability, and bold streetwear aesthetics.')}
                </p>
                <div className="pt-2">
                  <Link to={activeBanner?.linkUrl || '/shop'}>
                    <Button variant="primary" size="md" className="bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#C5A880] dark:hover:bg-[#B39366] text-white dark:text-black font-bold text-xs uppercase tracking-wider rounded-md px-6 shadow-md">
                      <span>{activeBanner?.buttonText || (isBn ? 'কালেকশন দেখুন' : 'SHOP NOW')}</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE FEATURED CATEGORY TILES (Screenshot 2: Formal Shirt, Casual Shirt, Shirt Combo) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
          {[
            {
              title: isBn ? 'ওভারসাইজড টি-শার্ট' : 'OVERSIZED TEES',
              link: '/category/oversized',
              image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
            },
            {
              title: isBn ? 'ড্রপ শোল্ডার টিজ' : 'CASUAL DROP SHOULDER',
              link: '/category/drop-shoulder',
              image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=80',
            },
            {
              title: isBn ? 'গ্রাফিক ও প্রিন্ট' : 'GRAPHIC & ART COMBOS',
              link: '/category/graphic-tees',
              image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
            },
          ].map((item, idx) => (
            <Link
              key={idx}
              to={item.link}
              className="group relative aspect-16/10 rounded-lg overflow-hidden bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm block"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-95"
              />
              <div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-colors flex items-center justify-center p-4">
                <span className="px-4 py-2 bg-white text-slate-900 text-xs font-black uppercase tracking-wider rounded shadow-md group-hover:bg-slate-900 group-hover:text-white transition-colors">
                  {item.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. SECTION 1: NEW ARRIVALS (5 Items Row from 2nd Screenshot) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-200 dark:border-white/10">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isBn ? 'নতুন কালেকশন (New Arrivals)' : 'New Arrivals'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isBn ? 'এই সপ্তাহের একদম নতুন ড্রপ শোল্ডার ও ওভারসাইজ ডিজাইন' : 'Just dropped this week — limited release'}
            </p>
          </div>
          <Link
            to="/new-arrivals"
            className="text-xs font-bold text-blue-600 dark:text-[#C5A880] hover:underline flex items-center gap-1"
          >
            <span>{isBn ? 'সবগুলো দেখুন' : 'View All'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4.5">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      </section>

      {/* 4. SECONDARY MIDDLE BANNER (Screenshot 2: FORMAL SHIRT COLLECTION Graphic Style) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl group">
          <div className="relative aspect-16/7 sm:aspect-21/7 w-full overflow-hidden flex items-center">
            <img
              src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1600&auto=format&fit=crop&q=85"
              alt="Signature Streetwear Collection"
              className="absolute inset-0 w-full h-full object-cover object-center brightness-75 group-hover:scale-103 transition-transform duration-700"
            />
            <div className="relative z-10 p-6 sm:p-12 lg:p-16 max-w-xl text-white space-y-3">
              <span className="text-amber-400 font-mono text-xs font-bold uppercase tracking-widest block">
                MEN'S OUTFIT SIGNATURE
              </span>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase leading-tight font-heading">
                {isBn ? 'হেভিওয়েট ড্রপ শোল্ডার কালেকশন' : 'STREETWEAR DROP SHOULDER'}
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm font-normal">
                {isBn
                  ? 'প্রিমিয়াম ২৪০ জিএসএম কটন ও ট্রেন্ডি কালার প্যালেট। নিখুঁত স্টিচিং ও আধুনিক স্ট্রিট আর্ট।'
                  : 'Engineered with 240 GSM organic combed cotton, precision tailored for all-day comfort.'}
              </p>
              <div className="pt-2">
                <Link to="/category/drop-shoulder">
                  <Button variant="secondary" size="md" className="bg-white text-slate-950 hover:bg-slate-200 font-bold text-xs uppercase tracking-wider rounded-md">
                    <span>{isBn ? 'কালেকশন দেখুন' : 'EXPLORE COLLECTION'}</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION 2: CASUAL DROP SHOULDER SHIRTS (5 Items Row) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-200 dark:border-white/10">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isBn ? 'ড্রপ শোল্ডার টি-শার্ট (Drop Shoulder)' : 'Drop Shoulder Collection'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isBn ? 'জনপ্রিয় সলিড ও মিনিমালিস্ট ড্রপ কাটিং টি-শার্ট' : 'Trending solid minimal drop shoulder tees'}
            </p>
          </div>
          <Link
            to="/category/drop-shoulder"
            className="text-xs font-bold text-blue-600 dark:text-[#C5A880] hover:underline flex items-center gap-1"
          >
            <span>{isBn ? 'সবগুলো দেখুন' : 'View All'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4.5">
          {dropShoulder.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      </section>

      {/* 6. SECTION 3: OVERSIZED T-SHIRTS (5 Items Row) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-200 dark:border-white/10">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isBn ? 'ওভারসাইজড টি-শার্ট (Oversized Tees)' : 'Oversized T-Shirts'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isBn ? '২৬০ জিএসএম হেভিওয়েট রিল্যাক্সড ফিট' : 'Heavyweight 260 GSM relaxed comfort cut'}
            </p>
          </div>
          <Link
            to="/category/oversized"
            className="text-xs font-bold text-blue-600 dark:text-[#C5A880] hover:underline flex items-center gap-1"
          >
            <span>{isBn ? 'সবগুলো দেখুন' : 'View All'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4.5">
          {oversized.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      </section>

      {/* 7. SECTION 4: GRAPHIC TEES & ART (5 Items Row) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-200 dark:border-white/10">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isBn ? 'গ্রাফিক টিজ (Graphic Tees)' : 'Graphic Art Tees'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isBn ? 'আর্বান স্ট্রিট কালচার ও স্ক্রিন প্রিন্ট' : 'Urban street art & high-density screen prints'}
            </p>
          </div>
          <Link
            to="/category/graphic-tees"
            className="text-xs font-bold text-blue-600 dark:text-[#C5A880] hover:underline flex items-center gap-1"
          >
            <span>{isBn ? 'সবগুলো দেখুন' : 'View All'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4.5">
          {graphicTees.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      </section>

      {/* 8. BRAND VALUE PROPOSITION BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 dark:bg-[#C5A880]/15 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-blue-600 dark:text-[#C5A880]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {isBn ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isBn ? 'পণ্য হাতে পেয়ে টাকা পরিশোধ করুন' : 'Pay when you receive the parcel'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {isBn ? '৭ দিনের সাইজ এক্সচেঞ্জ' : '7 Days Size Exchange'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isBn ? 'সাইজ সমস্যা হলে দ্রুত পরিবর্তন' : 'Easy replacement for size issues'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {isBn ? '১০০% কোয়ালিটি গ্যারান্টি' : '100% Quality Guaranteed'}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isBn ? 'কম্বড কটন ও দীর্ঘস্থায়ী রঙ' : 'Premium combed cotton & durable colors'}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

