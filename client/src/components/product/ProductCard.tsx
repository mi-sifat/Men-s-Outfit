import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star } from 'lucide-react';
import type { Product } from '../../types';
import { formatPrice } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { language } = useTheme();
  const isBn = language === 'bn';

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  // Extract unique sizes for this product (like M, L, XL in screenshot 2)
  const availableSizes = Array.from(new Set(product.variants.map((v) => v.size)));

  return (
    <div className="group relative bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      {/* Product Image Frame */}
      <div className="relative aspect-3/4 overflow-hidden bg-slate-100 dark:bg-slate-900">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <img
            src={product.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80'}
            alt={isBn && product.titleBn ? product.titleBn : product.title}
            className="w-full h-full object-cover object-top group-hover:scale-106 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {hasDiscount && (
            <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider rounded-sm shadow-sm">
              SALE -{discountPercent}%
            </span>
          )}
          {product.isNewArrival && !hasDiscount && (
            <span className="px-2 py-0.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[10px] font-bold uppercase tracking-wider rounded-sm shadow-sm">
              NEW
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Available Sizes Row (EDWIN style) */}
          <div className="flex items-center gap-1.5 mb-2 text-[11px] font-bold text-slate-500 dark:text-slate-400">
            {availableSizes.slice(0, 4).map((size) => (
              <span key={size} className="px-1.5 py-0.5 border border-slate-200 dark:border-slate-700 rounded text-[10px] bg-slate-50 dark:bg-slate-800/50">
                {size}
              </span>
            ))}
          </div>

          {/* Product Title */}
          <Link
            to={`/product/${product.slug}`}
            className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 hover:text-blue-600 dark:hover:text-[#C5A880] transition-colors leading-snug"
          >
            {isBn && product.titleBn ? product.titleBn : product.title}
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1.5">
            <div className="flex items-center text-amber-400">
              <Star className="w-3 h-3 fill-current" />
            </div>
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">{product.rating}</span>
            <span className="text-[10px] text-slate-500">({product.reviewCount})</span>
          </div>
        </div>

        {/* Price and CTA Button */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-white/5 space-y-2.5">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-black text-slate-950 dark:text-white font-mono">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-slate-500 line-through font-mono">
                {formatPrice(product.compareAtPrice!)}
              </span>
            )}
          </div>

          {/* Prominent Action Button (like 2nd Screenshot) */}
          <button
            type="button"
            onClick={() => onAddToCart && onAddToCart(product)}
            className="w-full py-2 px-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#C5A880] dark:hover:bg-[#D8BD97] text-white dark:text-slate-950 text-xs font-bold uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow-md active:scale-98"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isBn ? 'কার্টে যোগ করুন' : 'ADD TO CART'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

