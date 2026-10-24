import React, { useMemo, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { ProductCard } from '../components/product/ProductCard';
import { SAMPLE_PRODUCTS } from '../data/sampleProducts';

interface ShopPageProps {
  onAddToCart?: (product: any) => void;
}

const CATEGORY_MAP: Record<string, { title: string; subtitle: string; matchCategory: string }> = {
  'oversized': {
    title: 'ওভারসাইজড টি-শার্ট (Oversized T-Shirts)',
    subtitle: 'প্রিমিয়াম ২৪০ GSM ড্রপ কাটিং এবং রিল্যাক্সড কমফোর্ট ফিট',
    matchCategory: 'oversized',
  },
  'drop-shoulder': {
    title: 'ড্রপ শোল্ডার টি-শার্ট (Drop Shoulder)',
    subtitle: 'মডার্ন স্ট্রিটওয়্যার সিলুয়েট ও আলটিমেট প্রিমিয়াম ফিনিশ',
    matchCategory: 'drop-shoulder',
  },
  'graphic-tees': {
    title: 'গ্রাফিক টিজ (Graphic Tees)',
    subtitle: 'হাই-ডেনসিটি স্ক্রিন প্রিন্ট ও ইউনিক আর্বান স্ট্রিট আর্ট',
    matchCategory: 'graphic-tees',
  },
  'polo': {
    title: 'প্রিমিয়াম পোলো শার্ট (Premium Polos)',
    subtitle: 'লাক্সারি হানি-কম্ব পিক কটন ও এলিগ্যান্ট আর্কিটেকচারাল কলার',
    matchCategory: 'polo',
  },
};

export const ShopPage: React.FC<ShopPageProps> = ({ onAddToCart }) => {
  const { category } = useParams<{ category?: string }>();
  const location = useLocation();
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  const isSale = location.pathname.includes('/sale');
  const isNewArrivals = location.pathname.includes('/new-arrivals');

  const categoryMeta = category ? CATEGORY_MAP[category.toLowerCase()] : null;

  const filteredProducts = useMemo(() => {
    let list = [...SAMPLE_PRODUCTS];

    if (category) {
      const target = category.toLowerCase();
      list = list.filter((p) => p.category.toLowerCase() === target);
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
  }, [category, isSale, isNewArrivals, sortBy]);

  const pageTitle = categoryMeta
    ? categoryMeta.title
    : isSale
    ? 'সেল এবং ডিসকাউন্ট অফার (Special Sale)'
    : isNewArrivals
    ? 'নতুন কালেকশন (New Arrivals)'
    : 'সব কালেকশন (All Products)';

  const pageSubtitle = categoryMeta
    ? categoryMeta.subtitle
    : isSale
    ? 'সীমিত সময়ের জন্য বিশেষ ছাড়ে প্রিমিয়াম স্ট্রিটওয়্যার'
    : isNewArrivals
    ? 'এই মৌসুমের একদম নতুন ড্রপ শোল্ডার ও ওভারসাইজ ডিজাইন'
    : 'প্রিমিয়াম ড্রপ-শোল্ডার, ওভারসাইজড, গ্রাফিক ও পোলো টি-শার্টের সম্পূর্ণ ক্যাটালগ';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Category Pills navigation */}
      <div className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-slate-200">
        <Link
          to="/shop"
          className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
            !category && !isSale && !isNewArrivals
              ? 'bg-slate-900 text-gold-400 shadow-md'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          সব প্রোডাক্ট ({SAMPLE_PRODUCTS.length})
        </Link>
        <Link
          to="/category/oversized"
          className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
            category === 'oversized'
              ? 'bg-slate-900 text-gold-400 shadow-md'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          ওভারসাইজড (১৬)
        </Link>
        <Link
          to="/category/drop-shoulder"
          className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
            category === 'drop-shoulder'
              ? 'bg-slate-900 text-gold-400 shadow-md'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          ড্রপ-শোল্ডার (১৫)
        </Link>
        <Link
          to="/category/graphic-tees"
          className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
            category === 'graphic-tees'
              ? 'bg-slate-900 text-gold-400 shadow-md'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          গ্রাফিক টিজ (১৫)
        </Link>
        <Link
          to="/category/polo"
          className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
            category === 'polo'
              ? 'bg-slate-900 text-gold-400 shadow-md'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          পোলো শার্ট (১৫)
        </Link>
      </div>

      {/* Header and Sorting */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{pageTitle}</h1>
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-gold-100 text-gold-800 border border-gold-300">
              {filteredProducts.length} টি আইটেম
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">{pageSubtitle}</p>
        </div>

        {/* Sort dropdown */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <label htmlFor="sort-select" className="text-xs font-medium text-slate-500">
            সর্ট করুন:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-gold-500 cursor-pointer shadow-sm"
          >
            <option value="featured">ফিচার্ড (Featured)</option>
            <option value="price-asc">দাম: কম থেকে বেশি</option>
            <option value="price-desc">দাম: বেশি থেকে কম</option>
            <option value="rating">কাস্টমার রেটিং (High Rated)</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-500 font-medium">এই ক্যাটাগরিতে এই মুহূর্তে কোনো প্রোডাক্ট নেই।</p>
          <Link
            to="/shop"
            className="mt-4 inline-block px-5 py-2.5 bg-slate-900 text-gold-400 text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors"
          >
            সব প্রোডাক্ট দেখুন
          </Link>
        </div>
      )}
    </div>
  );
};

