import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star } from 'lucide-react';
import type { Product } from '../../types';
import { formatPrice } from '../../lib/utils';
import { Badge } from '../ui/Badge';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  return (
    <div className="group relative bg-[#0F172A]/80 border border-white/5 rounded-2xl overflow-hidden hover:border-[#C5A880]/40 hover:shadow-2xl hover:shadow-[#C5A880]/5 transition-all duration-300 flex flex-col">
      {/* Product Image Frame */}
      <Link to={`/product/${product.slug}`} className="relative aspect-4/5 overflow-hidden bg-slate-900 block">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80'}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {hasDiscount && (
            <Badge variant="sale">-{discountPercent}%</Badge>
          )}
          {product.isNewArrival && (
            <Badge variant="accent">NEW DROP</Badge>
          )}
          {product.isBestSeller && (
            <Badge variant="default">POPULAR</Badge>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold text-[#C5A880] uppercase tracking-widest block mb-1.5">
            {product.category}
          </span>
          <Link
            to={`/product/${product.slug}`}
            className="text-sm sm:text-base font-semibold text-white line-clamp-2 hover:text-[#C5A880] transition-colors leading-snug"
          >
            {product.title}
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2.5">
            <div className="flex items-center text-[#C5A880]">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-semibold text-slate-300">{product.rating}</span>
            <span className="text-[11px] text-slate-500">({product.reviewCount} রিভিউ)</span>
          </div>
        </div>

        {/* Pricing & Add to Cart button */}
        <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-white font-mono">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through font-mono">
                  {formatPrice(product.compareAtPrice!)}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onAddToCart && onAddToCart(product)}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-[#C5A880] text-slate-200 hover:text-black border border-white/10 hover:border-transparent transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            title="কার্টে যোগ করুন"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
