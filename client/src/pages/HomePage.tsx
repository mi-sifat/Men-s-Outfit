import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Truck, RotateCcw, ShieldCheck, PhoneCall, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../components/product/ProductCard';
import { HeroSlider } from '../components/home/HeroSlider';
import { CategoryStrip } from '../components/home/CategoryStrip';
import { getAllProducts } from '../data/productStore';
import { getLocalStoreSettings } from '../data/settingsStore';
import { getAllCategories } from '../data/categoryStore';
import type { StoreSettingsData, HomepageSectionItem } from '../data/settingsStore';
import type { CategoryItem } from '../data/categoryStore';
import { useTheme } from '../context/ThemeContext';
import type { Product } from '../types';

interface HomePageProps {
  onAddToCart?: (product: any) => void;
}

const normalizeCategory = (cat: string) => cat.toLowerCase().trim().replace(/[\s_]+/g, '-');

export const HomePage: React.FC<HomePageProps> = ({ onAddToCart }) => {
  const { language } = useTheme();
  const isBn = language === 'bn';

  const [settings, setSettings] = useState<StoreSettingsData>(() => getLocalStoreSettings());
  const [categories, setCategories] = useState<CategoryItem[]>(() => getAllCategories());
  const [allProducts, setAllProducts] = useState<Product[]>(() => getAllProducts());

  useEffect(() => {
    const handleSettingsUpdate = () => setSettings(getLocalStoreSettings());
    const handleCategoriesUpdate = () => setCategories(getAllCategories());
    const handleProductsUpdate = () => setAllProducts(getAllProducts());

    window.addEventListener('store_settings_updated', handleSettingsUpdate);
    window.addEventListener('categories_updated', handleCategoriesUpdate);
    window.addEventListener('products_updated', handleProductsUpdate);

    return () => {
      window.removeEventListener('store_settings_updated', handleSettingsUpdate);
      window.removeEventListener('categories_updated', handleCategoriesUpdate);
      window.removeEventListener('products_updated', handleProductsUpdate);
    };
  }, []);

  // Sorted active sections
  const activeSections = useMemo(() => {
    return (settings.homepageSections || [])
      .filter((s) => s.isActive)
      .sort((a, b) => a.order - b.order);
  }, [settings.homepageSections]);

  // Helper to resolve products for a given section
  const getSectionProducts = (sec: HomepageSectionItem): Product[] => {
    let prods: Product[] = [];
    const limit = sec.limit || 5;

    switch (sec.type) {
      case 'new_arrivals':
        prods = allProducts.filter((p) => p.isNewArrival);
        break;
      case 'featured':
        prods = allProducts.filter((p) => p.isFeatured);
        break;
      case 'sale':
        prods = allProducts.filter((p) => (p.compareAtPrice && p.compareAtPrice > p.price) || p.tags?.includes('sale'));
        break;
      case 'category':
        if (sec.categorySlug) {
          prods = allProducts.filter((p) => normalizeCategory(p.category) === sec.categorySlug);
        }
        break;
      case 'manual':
        if (sec.productIds && sec.productIds.length > 0) {
          // Preserve exact chosen order
          prods = sec.productIds
            .map((id) => allProducts.find((p) => p.id === id))
            .filter((p): p is Product => !!p);
        }
        break;
      default:
        prods = allProducts;
    }

    // Sort if specified
    if (sec.sortBy === 'price_asc') {
      prods = [...prods].sort((a, b) => a.price - b.price);
    } else if (sec.sortBy === 'price_desc') {
      prods = [...prods].sort((a, b) => b.price - a.price);
    } else if (sec.sortBy === 'popular') {
      prods = [...prods].sort((a, b) => (b.rating || 5) - (a.rating || 5));
    }

    return prods.slice(0, limit);
  };

  return (
    <div className="space-y-10 sm:space-y-14 pb-16">
      {activeSections.map((section) => {
        // 1. HERO SLIDER SECTION
        if (section.type === 'hero_slider') {
          return (
            <section key={section.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
              <HeroSlider banners={settings.banners || []} />
            </section>
          );
        }

        // 2. CATEGORY ICONS / STRIP SECTION
        if (section.type === 'category_icons') {
          return (
            <section key={section.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase">
                  {isBn ? section.titleBn || section.title : section.title}
                </h3>
                <Link
                  to="/shop"
                  className="text-xs font-semibold text-blue-600 dark:text-[#C5A880] hover:underline flex items-center gap-1"
                >
                  <span>{isBn ? 'সব ক্যাটাগরি' : 'All Categories'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <CategoryStrip categories={categories} />
            </section>
          );
        }

        // 3. POLICY STRIP (Customer Trust & Benefits)
        if (section.type === 'policy_strip') {
          return (
            <section key={section.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 dark:bg-[#C5A880]/10 flex items-center justify-center text-blue-600 dark:text-[#C5A880] shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      {isBn ? 'সারাদেশে হোম ডেলিভারি' : 'Nationwide Delivery'}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isBn ? 'ক্যাশ অন ডেলিভারি সুবিধা' : 'Cash on delivery available'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      {isBn ? '৭ দিনে সহজ এক্সচেঞ্জ' : '7 Days Easy Exchange'}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isBn ? 'সাইজ সমস্যায় ইনস্ট্যান্ট রিপ্লেস' : 'Size or fit mismatch replacement'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      {isBn ? '১০০% কম্বড কটন' : '100% Combed Cotton'}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isBn ? '২৪০-২৬০ GSM হেভিওয়েট সুতি' : 'Heavyweight anti-shrink fabric'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      {isBn ? '২৪/৭ কাস্টমার সাপোর্ট' : 'Direct Support'}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      {settings.storePhone || '+880 1700-000000'}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          );
        }

        // 4. PROMOTIONAL GRAPHIC BANNER SECTION
        if (section.type === 'banner_promo') {
          const promo = section.promoBanner;
          if (!promo) return null;
          return (
            <section key={section.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl group">
                <div className="relative aspect-16/7 sm:aspect-21/7 w-full overflow-hidden flex items-center">
                  <img
                    src={promo.imageUrl || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1600&auto=format&fit=crop&q=85'}
                    alt={promo.title}
                    className="absolute inset-0 w-full h-full object-cover object-center brightness-75 group-hover:scale-103 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="relative z-10 p-6 sm:p-12 lg:p-16 max-w-xl text-white space-y-3">
                    <span className="text-amber-400 font-mono text-xs font-bold uppercase tracking-widest block">
                      MEN'S OUTFIT SIGNATURE
                    </span>
                    <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase leading-tight font-heading">
                      {isBn ? promo.titleBn || promo.title : promo.title}
                    </h2>
                    {promo.subtitle && (
                      <p className="text-slate-300 text-xs sm:text-sm font-normal">
                        {isBn ? promo.subtitleBn || promo.subtitle : promo.subtitle}
                      </p>
                    )}
                    <div className="pt-2">
                      <Link to={promo.linkUrl || '/shop'}>
                        <Button
                          variant="secondary"
                          size="md"
                          className="bg-white text-slate-950 hover:bg-slate-200 font-bold text-xs uppercase tracking-wider rounded-md cursor-pointer"
                        >
                          <span>{isBn ? promo.buttonTextBn || promo.buttonText : promo.buttonText}</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        }

        // 5. PRODUCT GRID SECTIONS (New Arrivals, Categories, Featured, Manual, Sale)
        const products = getSectionProducts(section);
        if (products.length === 0) return null;

        const sectionHeading = isBn ? section.titleBn || section.title : section.title;
        const sectionSubtitle = isBn ? section.subtitleBn || section.subtitle : section.subtitle;
        const viewAllText = isBn ? section.viewAllTextBn || section.viewAllText : section.viewAllText;
        const viewAllHref = section.viewAllLink || (section.categorySlug ? `/category/${section.categorySlug}` : '/shop');

        return (
          <section key={section.id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-200 dark:border-white/10">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {sectionHeading}
                </h2>
                {sectionSubtitle && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {sectionSubtitle}
                  </p>
                )}
              </div>
              <Link
                to={viewAllHref}
                className="text-xs font-bold text-blue-600 dark:text-[#C5A880] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{viewAllText}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4.5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};
