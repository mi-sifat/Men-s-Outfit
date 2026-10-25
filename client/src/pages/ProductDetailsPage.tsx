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
import { getAllProducts } from '../data/productStore';
import { formatPrice } from '../lib/utils';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ProductCard } from '../components/product/ProductCard';
import { useTheme } from '../context/ThemeContext';

interface ProductDetailsPageProps {
  onAddToCart?: (item: any) => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ onAddToCart }) => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useTheme();
  const isBn = language === 'bn';

  // Find product from store
  const allProducts = getAllProducts();
  const product = allProducts.find((p) => p.slug === slug) || allProducts[0];

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

  const relatedProducts = allProducts.filter((p: any) => p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-8 font-medium">
        <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">
          {isBn ? 'হোম' : 'Home'}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
        <Link to="/shop" className="hover:text-slate-900 dark:hover:text-white transition-colors">
          {isBn ? 'শপ' : 'Shop'}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
        <span className="text-blue-600 dark:text-[#C5A880] truncate max-w-xs font-semibold">
          {isBn && product.titleBn ? product.titleBn : product.title}
        </span>
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
                    ? 'border-blue-600 dark:border-[#C5A880] shadow-md scale-102'
                    : 'border-slate-200 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/30 opacity-75 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Main Selected Image */}
          <div className="relative flex-1 aspect-4/5 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-lg">
            <img
              src={selectedImage}
              alt={isBn && product.titleBn ? product.titleBn : product.title}
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
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-[#C5A880] uppercase tracking-widest block mb-2">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white leading-tight">
              {isBn && product.titleBn ? product.titleBn : product.title}
            </h1>

            {/* Rating & Review */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{product.rating}</span>
              <span className="text-xs text-slate-500">
                ({product.reviewCount} {isBn ? 'কাস্টমার রিভিউ' : 'Customer Reviews'})
              </span>
            </div>
          </div>

          {/* Price Box */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">
                {isBn ? 'মূল্য (Price)' : 'Price'}
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white font-mono">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm text-slate-400 dark:text-slate-500 line-through font-mono">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>
            </div>
            <div>
              {currentVariant && currentVariant.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {isBn ? `স্টকে আছে (${currentVariant.stock} টি)` : `In Stock (${currentVariant.stock})`}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-semibold">
                  {isBn ? 'স্টক আউট' : 'Out of Stock'}
                </span>
              )}
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider block">
              {isBn ? 'রঙ পছন্দ করুন:' : 'Select Color:'} <span className="text-blue-600 dark:text-[#C5A880] normal-case font-semibold">{selectedColor}</span>
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
                      ? 'border-blue-600 dark:border-[#C5A880] scale-110 shadow-lg'
                      : 'border-slate-300 dark:border-white/20 hover:scale-105'
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
              <label className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider">
                {isBn ? 'সাইজ সিলেক্ট করুন:' : 'Select Size:'} <span className="text-blue-600 dark:text-[#C5A880]">{selectedSize}</span>
              </label>
              <button
                type="button"
                onClick={() => setShowSizeModal(true)}
                className="text-xs text-blue-600 dark:text-[#C5A880] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>{isBn ? 'সাইজ গাইড' : 'Size Guide'}</span>
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
                        ? 'bg-[#2563EB] text-white border-[#2563EB] dark:bg-[#C5A880] dark:text-black dark:border-[#C5A880] shadow-md scale-102'
                        : hasStock
                        ? 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200 dark:bg-white/5 dark:text-white dark:border-white/10 dark:hover:bg-white/10'
                        : 'bg-slate-50 text-slate-400 border-slate-200 dark:bg-white/2 dark:text-slate-600 dark:border-white/5 cursor-not-allowed line-through'
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
              <div className="flex items-center bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-1 h-12">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-slate-900 dark:text-white font-mono">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(currentVariant?.stock || 10, q + 1))}
                  disabled={quantity >= (currentVariant?.stock || 1)}
                  className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button (Screenshot 2 Blue style) */}
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className="flex-1 h-12 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#C5A880] dark:hover:bg-[#B39366] text-white dark:text-black font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{isOutOfStock ? (isBn ? 'স্টক খালি' : 'Out of Stock') : (isBn ? 'কার্টে যোগ করুন' : 'ADD TO CART')}</span>
              </button>
            </div>

            <Link to="/cart">
              <Button variant="outline" size="lg" className="w-full border-slate-300 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/5 mt-2">
                {isBn ? 'সরাসরি চেকআউট করুন (Buy Now)' : 'Direct Checkout (Buy Now)'}
              </Button>
            </Link>
          </div>

          {/* Delivery & Trust Metrics */}
          <div className="pt-4 border-t border-slate-200 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600 dark:text-[#C5A880] shrink-0" />
              <span>{isBn ? 'ঢাকা ২-৩ দিন, ঢাকার বাইরে ৩-৫ দিন' : 'Dhaka 2-3 Days, Outside Dhaka 3-5 Days'}</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{isBn ? '৭ দিনের সহজ সাইজ এক্সচেঞ্জ' : '7 Days Easy Size Exchange'}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{isBn ? '১০০% খাঁটি কম্বড সুতির গ্যারান্টি' : '100% Combed Heavy Cotton'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{isBn ? 'ক্যাশ অন ডেলিভারি প্রযোজ্য' : 'Cash on Delivery Available'}</span>
            </div>
          </div>

          {/* Description */}
          <div className="pt-4 border-t border-slate-200 dark:border-white/10">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
              {isBn ? 'পণ্যের বিবরণ (Description)' : 'Product Description'}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Ruler className="w-5 h-5 text-blue-600 dark:text-[#C5A880]" />
                <span>{isBn ? 'সাইজ চার্ট গাইড (ইঞ্চি)' : 'Size Chart Guide (Inches)'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowSizeModal(false)}
                className="text-slate-500 hover:text-black dark:text-slate-400 dark:hover:text-white font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 text-xs font-mono text-blue-600 dark:text-[#C5A880]">
                    <th className="py-2.5 px-3">{isBn ? 'সাইজ' : 'Size'}</th>
                    <th className="py-2.5 px-3">{isBn ? 'চেস্ট (Chest)' : 'Chest'}</th>
                    <th className="py-2.5 px-3">{isBn ? 'লম্বা (Length)' : 'Length'}</th>
                    <th className="py-2.5 px-3">{isBn ? 'স্লিভ (Sleeve)' : 'Sleeve'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono text-xs">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">M</td>
                    <td className="py-2.5 px-3">40"</td>
                    <td className="py-2.5 px-3">28"</td>
                    <td className="py-2.5 px-3">9"</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">L</td>
                    <td className="py-2.5 px-3">42"</td>
                    <td className="py-2.5 px-3">29"</td>
                    <td className="py-2.5 px-3">9.5"</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">XL</td>
                    <td className="py-2.5 px-3">44"</td>
                    <td className="py-2.5 px-3">30"</td>
                    <td className="py-2.5 px-3">10"</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">XXL</td>
                    <td className="py-2.5 px-3">46"</td>
                    <td className="py-2.5 px-3">31"</td>
                    <td className="py-2.5 px-3">10.5"</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
              {isBn
                ? '* টি-শার্টের ফিটিং ড্রপ-শোল্ডার এবং ওভারসাইজড। আপনার স্বাভাবিক সাইজ সিলেক্ট করলেই রিলাক্সড লুক পাবেন।'
                : '* Relaxed drop-shoulder cut. Choose your regular size for an authentic streetwear drape.'}
            </p>

            <Button
              variant="outline"
              size="md"
              className="w-full border-slate-300 dark:border-white/10 text-slate-900 dark:text-white mt-2 cursor-pointer"
              onClick={() => setShowSizeModal(false)}
            >
              {isBn ? 'বন্ধ করুন' : 'Close'}
            </Button>
          </div>
        </div>
      )}

      {/* Related Products */}
      <div className="mt-16 pt-10 border-t border-slate-200 dark:border-white/10">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
          {isBn ? 'অনুরূপ কালেকশন (Related Products)' : 'Similar Collections'}
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

export default ProductDetailsPage;

