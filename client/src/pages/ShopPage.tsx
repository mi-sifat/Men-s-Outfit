import React, { useMemo, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { ProductCard } from '../components/product/ProductCard';
import { getAllProducts } from '../data/productStore';
import { useTheme } from '../context/ThemeContext';

interface ShopPageProps {
  onAddToCart?: (product: any) => void;
}

const normalizeCategory = (cat: string) => cat.toLowerCase().trim().replace(/[\s_]+/g, '-');

const CATEGORY_MAP: Record<string, { titleBn: string; titleEn: string; subtitleBn: string; subtitleEn: string }> = {
  'oversized': {
    titleBn: 'ওভারসাইজড টি-শার্ট (Oversized T-Shirts)',
    titleEn: 'Oversized T-Shirts Collection',
    subtitleBn: 'প্রিমিয়াম ২৪০ GSM ড্রপ কাটিং এবং রিল্যাক্সড কমফোর্ট ফিট',
    subtitleEn: 'Premium 240 GSM drop cutting & relaxed street comfort fit',
  },
  'drop-shoulder': {
    titleBn: 'ড্রপ শোল্ডার টি-শার্ট (Drop Shoulder)',
    titleEn: 'Drop Shoulder T-Shirts',
    subtitleBn: 'মডার্ন স্ট্রিটওয়্যার সিলুয়েট ও আলটিমেট প্রিমিয়াম ফিনিশ',
    subtitleEn: 'Modern streetwear silhouettes with clean heavyweight finish',
  },
  'graphic-tees': {
    titleBn: 'গ্রাফিক টিজ (Graphic Tees)',
    titleEn: 'Graphic & Urban Art Tees',
    subtitleBn: 'হাই-ডেনসিটি স্ক্রিন প্রিন্ট ও ইউনিক আর্বান স্ট্রিট আর্ট',
    subtitleEn: 'High-density screen prints & unique urban streetwear art',
  },
  'polo': {
    titleBn: 'প্রিমিয়াম পোলো শার্ট (Premium Polos)',
    titleEn: 'Signature Polo Shirts',
    subtitleBn: 'লাক্সারি হানি-কম্ব পিক কটন ও এলিগ্যান্ট আর্কিটেকচারাল কলার',
    subtitleEn: 'Luxury honey-comb pique cotton with structured collar',
  },
};

export const ShopPage: React.FC<ShopPageProps> = ({ onAddToCart }) => {
  const { category } = useParams<{ category?: string }>();
  const location = useLocation();
  const { language } = useTheme();
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const isSale = location.pathname.includes('/sale');
  const isNewArrivals = location.pathname.includes('/new-arrivals');

  const allProducts = useMemo(() => getAllProducts(), []);

  // Calculate dynamic category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: allProducts.length,
      'oversized': 0,
      'drop-shoulder': 0,
      'graphic-tees': 0,
      'polo': 0,
    };
    allProducts.forEach((p) => {
      const key = normalizeCategory(p.category);
      if (counts[key] !== undefined) {
        counts[key]++;
      }
    });
    return counts;
  }, [allProducts]);

  const targetCategory = category ? normalizeCategory(category) : undefined;
  const categoryMeta = targetCategory ? CATEGORY_MAP[targetCategory] : null;

  const filteredProducts = useMemo(() => {
    let list = [...allProducts];

    if (targetCategory) {
      list = list.filter((p) => normalizeCategory(p.category) === targetCategory);
    } else if (isSale) {
      list = list.filter((p) => (p.compareAtPrice && p.compareAtPrice > p.price) || p.tags?.includes('sale'));
    } else if (isNewArrivals) {
      list = list.filter((p) => p.isNewArrival);
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }

    return list;
  }, [allProducts, targetCategory, isSale, isNewArrivals, sortBy]);

  const isBn = language === 'bn';

  const pageTitle = categoryMeta
    ? (isBn ? categoryMeta.titleBn : categoryMeta.titleEn)
    : isSale
    ? (isBn ? 'সেল এবং বিশেষ অফার (Special Sale)' : 'Hot Sale & Deals')
    : isNewArrivals
    ? (isBn ? 'নতুন আগমন (New Arrivals)' : 'New Drop Arrivals')
    : (isBn ? 'সব কালেকশন (All Collections)' : 'All Fashion Collections');

  const pageSubtitle = categoryMeta
    ? (isBn ? categoryMeta.subtitleBn : categoryMeta.subtitleEn)
    : isSale
    ? (isBn ? 'সীমিত সময়ের জন্য বিশেষ ছাড়ে প্রিমিয়াম স্ট্রিটওয়্যার' : 'Limited time offers on premium streetwear essentials')
    : isNewArrivals
    ? (isBn ? 'এই মৌসুমের একদম নতুন ড্রপ শোল্ডার ও ওভারসাইজ ডিজাইন' : 'Latest seasonal drop shoulder and oversized fashion')
    : (isBn ? 'প্রিমিয়াম ড্রপ-শোল্ডার, ওভারসাইজড, গ্রাফিক ও পোলো টি-শার্টের সম্পূর্ণ ক্যাটালগ' : 'Complete catalog of heavy-cotton oversized, drop shoulder & polos');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Dynamic Category Navigation Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-8 pb-4 border-b border-slate-200 dark:border-white/10">
        <Link
          to="/shop"
          className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all ${
            !targetCategory && !isSale && !isNewArrivals
              ? 'bg-[#111827] text-white dark:bg-white dark:text-slate-900 shadow-md scale-102'
              : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
          }`}
        >
          {isBn ? `সব প্রোডাক্ট (${categoryCounts.all})` : `All Products (${categoryCounts.all})`}
        </Link>
        <Link
          to="/category/oversized"
          className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all ${
            targetCategory === 'oversized'
              ? 'bg-[#111827] text-white dark:bg-white dark:text-slate-900 shadow-md scale-102'
              : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
          }`}
        >
          {isBn ? `ওভারসাইজড (${categoryCounts['oversized']})` : `Oversized (${categoryCounts['oversized']})`}
        </Link>
        <Link
          to="/category/drop-shoulder"
          className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all ${
            targetCategory === 'drop-shoulder'
              ? 'bg-[#111827] text-white dark:bg-white dark:text-slate-900 shadow-md scale-102'
              : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
          }`}
        >
          {isBn ? `ড্রপ-শোল্ডার (${categoryCounts['drop-shoulder']})` : `Drop Shoulder (${categoryCounts['drop-shoulder']})`}
        </Link>
        <Link
          to="/category/graphic-tees"
          className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all ${
            targetCategory === 'graphic-tees'
              ? 'bg-[#111827] text-white dark:bg-white dark:text-slate-900 shadow-md scale-102'
              : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
          }`}
        >
          {isBn ? `গ্রাফিক টিজ (${categoryCounts['graphic-tees']})` : `Graphic Tees (${categoryCounts['graphic-tees']})`}
        </Link>
        <Link
          to="/category/polo"
          className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all ${
            targetCategory === 'polo'
              ? 'bg-[#111827] text-white dark:bg-white dark:text-slate-900 shadow-md scale-102'
              : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
          }`}
        >
          {isBn ? `পোলো শার্ট (${categoryCounts['polo']})` : `Polos (${categoryCounts['polo']})`}
        </Link>
      </div>

      {/* Header and Sorting with High Contrast */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {pageTitle}
            </h1>
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#C5A880]/15 text-[#8C6D37] dark:text-[#C5A880] border border-[#C5A880]/30 font-mono">
              {filteredProducts.length} {isBn ? 'টি আইটেম' : 'Items'}
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5 max-w-2xl font-normal">
            {pageSubtitle}
          </p>
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <label htmlFor="sort-select" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {isBn ? 'সর্ট করুন:' : 'Sort by:'}
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3.5 py-2 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#C5A880] cursor-pointer shadow-sm"
          >
            <option value="featured">{isBn ? 'ফিচার্ড (Featured)' : 'Featured'}</option>
            <option value="price-asc">{isBn ? 'দাম: কম থেকে বেশি' : 'Price: Low to High'}</option>
            <option value="price-desc">{isBn ? 'দাম: বেশি থেকে কম' : 'Price: High to Low'}</option>
            <option value="rating">{isBn ? 'কাস্টমার রেটিং (High Rated)' : 'Top Rated'}</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-300 dark:border-white/10 p-8">
          <p className="text-slate-700 dark:text-slate-300 font-semibold text-base">
            {isBn ? 'এই ক্যাটাগরিতে এই মুহূর্তে কোনো প্রোডাক্ট নেই।' : 'No products found in this category at the moment.'}
          </p>
          <Link
            to="/shop"
            className="mt-5 inline-block px-6 py-2.5 bg-[#111827] text-white dark:bg-[#C5A880] dark:text-black text-xs font-bold rounded-xl shadow-md hover:opacity-90 transition-all"
          >
            {isBn ? 'সব প্রোডাক্ট দেখুন' : 'View All Products'}
          </Link>
        </div>
      )}
    </div>
  );
};

export default ShopPage;

