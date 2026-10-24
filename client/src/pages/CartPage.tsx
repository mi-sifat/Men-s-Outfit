import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/ui/Button';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">আপনার শপিং কার্ট খালি!</h2>
        <p className="text-slate-400 text-sm max-w-sm mx-auto">
          পছন্দের ড্রপ-শোল্ডার বা ওভারসাইজড টি-শার্ট খুঁজে কার্টে যোগ করুন।
        </p>
        <Link to="/shop">
          <Button variant="secondary" size="lg" className="font-bold">
            শপিং শুরু করুন
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="mb-8 border-b border-white/10 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          শপিং কার্ট ({totalItems} টি আইটেম)
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Cart Item List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item.variantId}
              className="p-4 sm:p-5 rounded-2xl bg-[#0F172A]/80 border border-white/5 flex gap-4 sm:gap-6 items-center"
            >
              {/* Image */}
              <div className="w-20 sm:w-24 aspect-4/5 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-white/5">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-white truncate">
                  {item.title}
                </h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                  <span>সাইজ: <strong className="text-[#C5A880]">{item.size}</strong></span>
                  <span>•</span>
                  <span>কালার: <strong className="text-slate-200">{item.color}</strong></span>
                </div>
                <div className="mt-3 font-mono font-bold text-white text-base">
                  {formatPrice(item.price)}
                </div>
              </div>

              {/* Quantity Controls & Remove */}
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 shrink-0">
                <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 h-9">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-white font-mono">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                    disabled={item.quantity >= item.maxStock}
                    className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-white disabled:opacity-30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.variantId)}
                  className="p-2 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="pt-4 flex justify-between items-center text-xs text-slate-400">
            <Link to="/shop" className="text-[#C5A880] hover:underline flex items-center gap-1 font-semibold">
              ← আরও প্রোডাক্ট ব্রাউজ করুন
            </Link>
          </div>
        </div>

        {/* Order Summary Checkout Card */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#0F172A] border border-white/10 space-y-6 shadow-xl">
          <h2 className="text-lg font-bold text-white border-b border-white/10 pb-3">
            অর্ডার সামারি (Summary)
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-slate-300">
              <span>আইটেম মোট</span>
              <span className="font-mono font-bold text-white">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-400 text-xs">
              <span>ডেলিভারি চার্জ</span>
              <span className="text-[#C5A880]">চেকআউটে নির্ধারিত হবে</span>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-between items-baseline">
            <span className="text-base font-bold text-white">সর্বমোট প্রদেয়</span>
            <span className="text-2xl font-black text-[#C5A880] font-mono">
              {formatPrice(subtotal)}
            </span>
          </div>

          <Link to="/checkout" className="block">
            <button className="w-full h-12 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#B39366] text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#C5A880]/15 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer">
              <span>চেকআউটে এগিয়ে যান (Checkout)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>

          {/* Trust points */}
          <div className="space-y-2 text-[11px] text-slate-400 pt-2 border-t border-white/5">
            <div className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>সারাদেশে ক্যাশ অন ডেলিভারি প্রযোজ্য</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>১০০% প্রিমিয়াম কোয়ালিটি গ্যারান্টি</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
