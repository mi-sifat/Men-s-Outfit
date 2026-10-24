import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  ShoppingBag, 
  Ruler, 
  ChevronRight,
  Minus,
  Plus,
  Check
} from 'lucide-react';
import { SAMPLE_PRODUCTS } from '../data/sampleProducts';
import { formatPrice } from '../lib/utils';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../components/product/ProductCard';

interface ProductDetailsPageProps {
  onAddToCart?: (item: any) => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ onAddToCart }) => {
  const { slug } = useParams<{ slug: string }>();

  // Find product from sample data (fallback)
  const product = SAMPLE_PRODUCTS.find((p) => p.slug === slug) || SAMPLE_PRODUCTS[0];

  const [selectedImage, setSelectedImage] = useState<string>(product.images[0]);
  const [selectedSize, setSelectedSize] = useState<string>(product.variants[0]?.size || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(product.variants[0]?.color || 'Jet Black');
  const [quantity, setQuantity] = useState<number>(1);
  const [showSizeModal, setShowSizeModal] = useState<boolean>(false);

  // Find matching variant
  const currentVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  ) || product.variants[0];

  const availableSizes = Array.from(new Set(product.variants.map((v) => v.size)));
  const availableColors = Array.from(
    new Map(product.variants.map((v) => [v.color, v.colorCode])).entries()
  );

  const isOutOfStock = !currentVariant || currentVariant.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock || !onAddToCart) return;
    onAddToCart({
      productId: product.id,
      variantId: currentVariant.id,
      title: product.title,
      price: product.price,
      image: selectedImage,
      size: selectedSize,
      color: selectedColor,
      quantity,
      maxStock: currentVariant.stock,
    });
  };

  const relatedProducts = SAMPLE_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8">
        <Link to="/" className="hover:text-white transition-colors">হোম</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <Link to="/shop" className="hover:text-white transition-colors">শপ</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-[#C5A880] truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* Left: Gallery Column */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible shrink-0">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedImage(img)}
                className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  selectedImage === img
                    ? 'border-[#C5A880] shadow-md shadow-[#C5A880]/10 scale-102'
                    : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Main Selected Image */}
          <div className="relative flex-1 aspect-4/5 rounded-2xl overflow-hidden bg-slate-900 border border-white/5 shadow-2xl">
            <img
              src={selectedImage}
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <div className="absolute top-4 left-4">
                <Badge variant="sale">
                  SAVE {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Right: Product Buy Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-xs font-mono font-bold text-[#C5A880] uppercase tracking-widest block mb-2">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {product.title}
            </h1>

            {/* Rating & Review */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center text-[#C5A880]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-200">{product.rating}</span>
              <span className="text-xs text-slate-500">({product.reviewCount} কাস্টমার রিভিউ)</span>
            </div>
          </div>

          {/* Price Box */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block mb-0.5">মূল্য (Price)</span>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm text-slate-500 line-through font-mono">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>
            </div>
            <div>
              {currentVariant && currentVariant.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  স্টকে আছে ({currentVariant.stock} টি)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold">
                  স্টক আউট
                </span>
              )}
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              রঙ পছন্দ করুন: <span className="text-[#C5A880] normal-case">{selectedColor}</span>
            </label>
            <div className="flex items-center gap-3">
              {availableColors.map(([colName, colCode]) => (
                <button
                  key={colName}
                  type="button"
                  onClick={() => setSelectedColor(colName)}
                  style={{ backgroundColor: colCode }}
                  className={`w-9 h-9 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center ${
                    selectedColor === colName
                      ? 'border-[#C5A880] scale-110 shadow-lg'
                      : 'border-white/20 hover:scale-105'
                  }`}
                  title={colName}
                >
                  {selectedColor === colName && (
                    <Check className={`w-4 h-4 ${colName.toLowerCase() === 'white' ? 'text-black' : 'text-white'}`} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection & Size Guide */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                সাইজ সিলেক্ট করুন: <span className="text-[#C5A880]">{selectedSize}</span>
              </label>
              <button
                type="button"
                onClick={() => setShowSizeModal(true)}
                className="text-xs text-[#C5A880] hover:text-[#D8BD97] flex items-center gap-1 font-semibold underline underline-offset-4 cursor-pointer"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>সাইজ গাইড</span>
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2.5">
              {availableSizes.map((size) => {
                const variantForSize = product.variants.find(
                  (v) => v.size === size && v.color === selectedColor
                );
                const hasStock = variantForSize && variantForSize.stock > 0;

                return (
                  <button
                    key={size}
                    type="button"
                    disabled={!hasStock}
                    onClick={() => setSelectedSize(size as any)}
                    className={`py-3 rounded-xl font-bold text-sm transition-all border cursor-pointer ${
                      selectedSize === size
                        ? 'bg-[#C5A880] text-black border-[#C5A880] shadow-lg shadow-[#C5A880]/10 scale-102'
                        : hasStock
                        ? 'bg-white/5 text-white border-white/10 hover:border-white/30 hover:bg-white/10'
                        : 'bg-white/2 text-slate-600 border-white/5 cursor-not-allowed line-through'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity and Add to Cart Row */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              {/* Quantity Selector */}
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 h-12">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-white font-mono">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(currentVariant?.stock || 10, q + 1))}
                  disabled={quantity >= (currentVariant?.stock || 1)}
                  className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#B39366] text-black font-extrabold text-base flex items-center justify-center gap-2.5 shadow-xl shadow-[#C5A880]/15 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5 text-black" />
                <span>{isOutOfStock ? 'স্টক খালি' : 'কার্টে যোগ করুন'}</span>
              </button>
            </div>

            <Link to="/cart">
              <Button variant="outline" size="lg" className="w-full border-white/10 text-white hover:bg-white/5 mt-2">
                সরাসরি চেকআউট করুন (Buy Now)
              </Button>
            </Link>
          </div>

          {/* Delivery & Trust Metrics */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#C5A880] shrink-0" />
              <span>ঢাকা ২-৩ দিন, ঢাকার বাইরে ৩-৫ দিন</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#C5A880] shrink-0" />
              <span>৭ দিনের সহজ সাইজ এক্সচেঞ্জ</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C5A880] shrink-0" />
              <span>১০০% খাঁটি কম্বড সুতির গ্যারান্টি</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>ক্যাশ অন ডেলিভারি প্রযোজ্য</span>
            </div>
          </div>

          {/* Description */}
          <div className="pt-4 border-t border-white/10">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
              পণ্যের বিবরণ (Description)
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0F172A] border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Ruler className="w-5 h-5 text-[#C5A880]" />
                <span>সাইজ চার্ট গাইড (ইঞ্চি)</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowSizeModal(false)}
                className="text-slate-400 hover:text-white font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-xs font-mono text-[#C5A880]">
                    <th className="py-2.5 px-3">সাইজ</th>
                    <th className="py-2.5 px-3">চেস্ট (Chest)</th>
                    <th className="py-2.5 px-3">লম্বা (Length)</th>
                    <th className="py-2.5 px-3">স্লিভ (Sleeve)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-xs">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-white">M</td>
                    <td className="py-2.5 px-3">40"</td>
                    <td className="py-2.5 px-3">28"</td>
                    <td className="py-2.5 px-3">9"</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-white">L</td>
                    <td className="py-2.5 px-3">42"</td>
                    <td className="py-2.5 px-3">29"</td>
                    <td className="py-2.5 px-3">9.5"</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-white">XL</td>
                    <td className="py-2.5 px-3">44"</td>
                    <td className="py-2.5 px-3">30"</td>
                    <td className="py-2.5 px-3">10"</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-white">XXL</td>
                    <td className="py-2.5 px-3">46"</td>
                    <td className="py-2.5 px-3">31"</td>
                    <td className="py-2.5 px-3">10.5"</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-slate-400 leading-normal">
              * টি-শার্টের ফিটিং ড্রপ-শোল্ডার এবং ওভারসাইজড। আপনার স্বাভাবিক সাইজ সিলেক্ট করলেই রিলাক্সড লুক পাবেন।
            </p>

            <Button
              variant="outline"
              size="md"
              className="w-full border-white/10 text-white mt-2"
              onClick={() => setShowSizeModal(false)}
            >
              বন্ধ করুন
            </Button>
          </div>
        </div>
      )}

      {/* Related Products */}
      <div className="mt-20 pt-12 border-t border-white/10">
        <h2 className="text-2xl font-black text-white tracking-tight mb-8">
          অনুরূপ কালেকশন (Related Products)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
          ))}
        </div>
      </div>
    </div>
  );
};
