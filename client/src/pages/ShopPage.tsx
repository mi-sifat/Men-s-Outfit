import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  Filter, 
  RotateCcw, 
  Check, 
  ChevronRight,
  PackageCheck
} from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { getAllProducts } from '../data/productStore';
import { getAllCategories } from '../data/categoryStore';
import type { CategoryItem } from '../data/categoryStore';
import { useTheme } from '../context/ThemeContext';
import { formatPrice } from '../lib/utils';
import type { Product } from '../types';

interface ShopPageProps {
  onAddToCart?: (product: any) => void;
}

const normalizeCategory = (cat: string) => cat.toLowerCase().trim().replace(/[\s_]+/g, '-');

const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', 'XXL'] as const;

export const ShopPage: React.FC<ShopPageProps> = ({ onAddToCart }) => {
  const { category } = useParams<{ category?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useTheme();
  const isBn = language === 'bn';

  // Products & Categories
  const [allProducts, setAllProducts] = useState<Product[]>(() => getAllProducts());
  const [categories, setCategories] = useState<CategoryItem[]>(() => getAllCategories());

  useEffect(() => {
    const handleProducts = () => setAllProducts(getAllProducts());
    const handleCategories = () => setCategories(getAllCategories());
    window.addEventListener('products_updated', handleProducts);
    window.addEventListener('categories_updated', handleCategories);
    return () => {
      window.removeEventListener('products_updated', handleProducts);
      window.removeEventListener('categories_updated', handleCategories);
    };
  }, []);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating'>('newest');
  const [visibleCount, setVisibleCount] = useState(15);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const isSale = location.pathname.includes('/sale');
  const isNewArrivals = location.pathname.includes('/new-arrivals');
  const targetCategorySlug = category ? normalizeCategory(category) : undefined;

  // Extract unique available colors from all products
  const availableColors = useMemo(() => {
    const colorMap = new Map<string, string>();
    allProducts.forEach((p) => {
      (p.variants || []).forEach((v) => {
        if (v.color && !colorMap.has(v.color)) {
          colorMap.set(v.color, v.colorCode || '#888888');
        }
      });
    });
    return Array.from(colorMap.entries()).map(([color, colorCode]) => ({ color, colorCode }));
  }, [allProducts]);

  // Dynamic category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allProducts.length };
    categories.forEach((cat) => {
      counts[cat.slug] = 0;
    });
    allProducts.forEach((p) => {
      const slug = normalizeCategory(p.category);
      if (counts[slug] !== undefined) {
        counts[slug]++;
      }
    });
    return counts;
  }, [allProducts, categories]);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (selectedSizes.length > 0) count += selectedSizes.length;
    if (selectedColors.length > 0) count += selectedColors.length;
    if (minPrice !== '' || maxPrice !== '') count++;
    if (inStockOnly) count++;
    return count;
  }, [searchQuery, selectedSizes, selectedColors, minPrice, maxPrice, inStockOnly]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedSizes([]);
    setSelectedColors([]);
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setSortBy('newest');
  };

  const handleToggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleToggleColor = (col: string) => {
    setSelectedColors((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  // Filtered & Sorted Product List
  const filteredProducts = useMemo(() => {
    let list = [...allProducts];

    // Category / Collection Route filter
    if (targetCategorySlug) {
      list = list.filter((p) => normalizeCategory(p.category) === targetCategorySlug);
    } else if (isSale) {
      list = list.filter((p) => (p.compareAtPrice && p.compareAtPrice > p.price) || p.tags?.includes('sale'));
    } else if (isNewArrivals) {
      list = list.filter((p) => p.isNewArrival);
    }

    // Text Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          (p.titleBn && p.titleBn.toLowerCase().includes(query)) ||
          p.description.toLowerCase().includes(query) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(query)))
      );
    }

    // Size filter (variant stock > 0)
    if (selectedSizes.length > 0) {
      list = list.filter((p) =>
        (p.variants || []).some(
          (v) => selectedSizes.includes(v.size) && v.stock > 0
        )
      );
    }

    // Color filter
    if (selectedColors.length > 0) {
      list = list.filter((p) =>
        (p.variants || []).some((v) => selectedColors.includes(v.color))
      );
    }

    // Price Range filter
    if (minPrice !== '') {
      list = list.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice !== '') {
      list = list.filter((p) => p.price <= Number(maxPrice));
    }

    // In Stock Only filter
    if (inStockOnly) {
      list = list.filter((p) => (p.variants || []).reduce((sum, v) => sum + v.stock, 0) > 0);
    }

    // Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 5) - (a.rating || 5));
    } else if (sortBy === 'newest') {
      list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    }

    return list;
  }, [
    allProducts,
    targetCategorySlug,
    isSale,
    isNewArrivals,
    searchQuery,
    selectedSizes,
    selectedColors,
    minPrice,
    maxPrice,
    inStockOnly,
    sortBy,
  ]);

  const activeCategory = targetCategorySlug
    ? categories.find((c) => c.slug === targetCategorySlug)
    : null;

  const pageTitle = activeCategory
    ? isBn
      ? activeCategory.nameBn || activeCategory.name
      : activeCategory.name
    : isSale
    ? isBn
      ? 'সেল এবং বিশেষ অফার (Special Sale)'
      : 'Special Sale & Offers'
    : isNewArrivals
    ? isBn
      ? 'নতুন কালেকশন (New Arrivals)'
      : 'New Arrivals Collection'
    : isBn
    ? 'সব কালেকশন (All Collections)'
    : 'All Apparel Collections';

  const pageSubtitle = activeCategory?.description
    ? activeCategory.description
    : isBn
    ? 'বাংলাদেশের আধুনিক স্ট্রিটওয়্যার, হেভিওয়েট ড্রপ শোল্ডার ও ওভারসাইজড কালেকশন'
    : 'Premium heavyweight cotton streetwear, oversized drops and urban essentials';

  // Visible products for pagination
  const displayedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* ── Category Navigation Pills ──────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none snap-x border-b border-slate-200 dark:border-white/10">
        <Link
          to="/shop"
          className={`flex-none px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all ${
            !targetCategorySlug && !isSale && !isNewArrivals
              ? 'bg-[#111827] text-white dark:bg-white dark:text-slate-900 shadow-md scale-102'
              : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
          }`}
        >
          {isBn ? `সব প্রোডাক্ট (${categoryCounts.all || 0})` : `All Items (${categoryCounts.all || 0})`}
        </Link>
        {categories
          .filter((c) => c.isActive)
          .map((cat) => {
            const isSelected = targetCategorySlug === cat.slug;
            const count = categoryCounts[cat.slug] || 0;
            return (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className={`flex-none px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all ${
                  isSelected
                    ? 'bg-[#111827] text-white dark:bg-white dark:text-slate-900 shadow-md scale-102'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                {isBn ? cat.nameBn || cat.name : cat.name} ({count})
              </Link>
            );
          })}
      </div>

      {/* ── Page Header & Search / Sort Controls ─────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {pageTitle}
            </h1>
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#2563EB]/10 dark:bg-[#C5A880]/15 text-[#2563EB] dark:text-[#C5A880] border border-[#2563EB]/20 dark:border-[#C5A880]/30 font-mono">
              {filteredProducts.length} {isBn ? 'টি আইটেম' : 'Items'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl font-normal">
            {pageSubtitle}
          </p>
        </div>

        {/* Search Bar & Mobile Filter Trigger */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Live Search Input */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? 'প্রোডাক্ট খুঁজুন...' : 'Search apparel...'}
              className="w-full pl-9 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] dark:focus:ring-[#C5A880] shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] dark:focus:ring-[#C5A880] cursor-pointer shadow-xs shrink-0"
          >
            <option value="newest">{isBn ? 'নতুন কালেকশন (Newest)' : 'Newest'}</option>
            <option value="featured">{isBn ? 'জনপ্রিয় (Featured)' : 'Featured'}</option>
            <option value="price-asc">{isBn ? 'দাম: কম থেকে বেশি' : 'Price: Low to High'}</option>
            <option value="price-desc">{isBn ? 'দাম: বেশি থেকে কম' : 'Price: High to Low'}</option>
            <option value="rating">{isBn ? 'টপ রেটেড (Top Rated)' : 'Top Rated'}</option>
          </select>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-bold cursor-pointer shrink-0 shadow-xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{isBn ? 'ফিল্টার' : 'Filters'}</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#C5A880] text-black font-mono text-[10px] flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Main Layout: Desktop Sidebar + Product Grid ─────────────── */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Desktop Left Filter Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-white/10 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>{isBn ? 'ফিল্টার অপশন' : 'Filters'}</span>
            </span>
            {activeFilterCount > 0 && (
              <button
                onClick={handleClearFilters}
                className="text-[11px] text-rose-500 hover:text-rose-600 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{isBn ? 'রিসেট' : 'Reset'}</span>
              </button>
            )}
          </div>

          {/* 1. Size Filter */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              {isBn ? 'সাইজ নির্বাচন (Sizes)' : 'Select Size'}
            </span>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_SIZES.map((sz) => {
                const isSelected = selectedSizes.includes(sz);
                return (
                  <button
                    key={sz}
                    onClick={() => handleToggleSize(sz)}
                    className={`w-9 h-8 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#2563EB] text-white dark:bg-[#C5A880] dark:text-black shadow-xs'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Price Range */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              {isBn ? 'মূল্য সীমা (Price Range BDT)' : 'Price Range (BDT)'}
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Min (৳)</label>
                <input
                  type="number"
                  placeholder="500"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-2.5 py-1.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-0.5">Max (৳)</label>
                <input
                  type="number"
                  placeholder="2500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-2.5 py-1.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* 3. Color Filter */}
          {availableColors.length > 0 && (
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                {isBn ? 'রং (Colors)' : 'Colors'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {availableColors.slice(0, 8).map(({ color, colorCode }) => {
                  const isSelected = selectedColors.includes(color);
                  return (
                    <button
                      key={color}
                      onClick={() => handleToggleColor(color)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                          : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/20"
                        style={{ backgroundColor: colorCode }}
                      />
                      <span>{color}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. In Stock Only Toggle */}
          <div className="pt-2 border-t border-slate-100 dark:border-white/10">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
              />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <PackageCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>{isBn ? 'শুধুমাত্র ইন-স্টক' : 'In-Stock Only'}</span>
              </span>
            </label>
          </div>
        </aside>

        {/* ── Product Grid ─────────────────────────────────────────── */}
        <div className="flex-1 w-full space-y-8">
          {/* Active Filter Tags */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 text-xs">
              <span className="font-bold text-slate-500 dark:text-slate-400">
                {isBn ? 'সক্রিয় ফিল্টার:' : 'Active filters:'}
              </span>
              {searchQuery && (
                <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-[#C5A880] flex items-center gap-1 font-mono">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedSizes.map((sz) => (
                <span
                  key={sz}
                  className="px-2 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-slate-200 flex items-center gap-1 font-mono"
                >
                  Size: {sz}
                  <button onClick={() => handleToggleSize(sz)} className="cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {selectedColors.map((col) => (
                <span
                  key={col}
                  className="px-2 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-slate-200 flex items-center gap-1 font-mono"
                >
                  {col}
                  <button onClick={() => handleToggleColor(col)} className="cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {(minPrice !== '' || maxPrice !== '') && (
                <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-slate-200 flex items-center gap-1 font-mono">
                  ৳{minPrice || 0} - ৳{maxPrice || '∞'}
                  <button onClick={() => { setMinPrice(''); setMaxPrice(''); }} className="cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {inStockOnly && (
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 flex items-center gap-1 font-mono">
                  In-Stock
                  <button onClick={() => setInStockOnly(false)} className="cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={handleClearFilters}
                className="text-xs text-rose-500 hover:underline font-bold ml-auto cursor-pointer"
              >
                {isBn ? 'সব মুছুন' : 'Clear All'}
              </button>
            </div>
          )}

          {/* Products Grid */}
          {displayedProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-5">
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-300 dark:border-white/10 p-8 space-y-4">
              <p className="text-slate-700 dark:text-slate-300 font-bold text-base">
                {isBn ? 'কোনো প্রোডাক্ট পাওয়া যায়নি।' : 'No products found matching your active filters.'}
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {isBn
                  ? 'আপনার ফিল্টার বা সার্চ টার্ম পরিবর্তন করে পুনরায় চেষ্টা করুন।'
                  : 'Try adjusting your size, price range or search keywords to find what you are looking for.'}
              </p>
              <button
                onClick={handleClearFilters}
                className="inline-block px-5 py-2.5 bg-slate-900 text-white dark:bg-[#C5A880] dark:text-black text-xs font-bold rounded-lg shadow-sm hover:opacity-90 cursor-pointer"
              >
                {isBn ? 'সব ফিল্টার মুছুন' : 'Reset All Filters'}
              </button>
            </div>
          )}

          {/* Load More Button */}
          {visibleCount < filteredProducts.length && (
            <div className="text-center pt-6">
              <button
                onClick={() => setVisibleCount((prev) => prev + 15)}
                className="px-8 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-all cursor-pointer"
              >
                {isBn
                  ? `আরও প্রোডাক্ট দেখুন (${filteredProducts.length - visibleCount} বাকি)`
                  : `Load More Products (${filteredProducts.length - visibleCount} remaining)`}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile Filter Slide-out Drawer ───────────────────────────── */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xs h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
                <span className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#C5A880]" />
                  <span>{isBn ? 'ফিল্টার ও বাছাই' : 'Filter & Sort'}</span>
                </span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Sizes */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  {isBn ? 'সাইজ' : 'Sizes'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_SIZES.map((sz) => {
                    const isSelected = selectedSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        onClick={() => handleToggleSize(sz)}
                        className={`w-9 h-8 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#2563EB] text-white dark:bg-[#C5A880] dark:text-black shadow-xs'
                            : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Price */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  {isBn ? 'মূল্য সীমা (BDT)' : 'Price Range (BDT)'}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-2.5 py-1.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-2.5 py-1.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Mobile In Stock */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {isBn ? 'শুধুমাত্র ইন-স্টক প্রোডাক্ট' : 'In-Stock Only'}
                  </span>
                </label>
              </div>
            </div>

            {/* Mobile Drawer Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center gap-3">
              <button
                onClick={handleClearFilters}
                className="flex-1 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
              >
                {isBn ? 'রিসেট' : 'Reset'}
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-lg bg-[#111827] dark:bg-[#C5A880] text-white dark:text-black text-xs font-bold"
              >
                {isBn ? `দেখান (${filteredProducts.length})` : `Show (${filteredProducts.length})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
