import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { ShieldCheck, Truck, ArrowRight, CheckCircle2, Tag, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';

const DIVISIONS = ['ঢাকা', 'চট্টগ্রাম', 'রাজশাহী', 'খুলনা', 'বরিশাল', 'সিলেট', 'রংপুর', 'ময়মনসিংহ'];

const checkoutSchema = z.object({
  fullName: z.string().min(3, 'আপনার পূর্ণ নাম লিখুন'),
  phone: z.string().regex(/^01[3-9]\d{8}$/, 'সঠিক ১১ ডিজিটের ফোন নম্বর দিন (যেমন: 01712345678)'),
  division: z.string().min(1, 'বিভাগ নির্বাচন করুন'),
  district: z.string().min(2, 'জেলা বা শহরের নাম লিখুন'),
  addressLine: z.string().min(5, 'বাড়ি/রোড/এলাকার বিস্তারিত ঠিকানা লিখুন'),
  customerNotes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, subtotal, clearCart } = useCart();
  const [selectedDivision, setSelectedDivision] = useState<string>('ঢাকা');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Coupon State
  const [couponInput, setCouponInput] = useState<string>('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number } | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      division: 'ঢাকা',
    },
  });

  // Calculate delivery charge
  const deliveryCharge = selectedDivision === 'ঢাকা' ? 70 : 130;
  const isFreeDelivery = subtotal >= 2000;
  const finalDeliveryCharge = isFreeDelivery ? 0 : deliveryCharge;
  const appliedDiscount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotal = Math.max(0, subtotal + finalDeliveryCharge - appliedDiscount);

  // Apply Coupon Handler
  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      toast.error('কুপন কোড লিখুন');
      return;
    }

    setIsApplyingCoupon(true);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput, subtotal }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'কুপনটি সঠিক নয়।');
      }

      setAppliedCoupon({
        code: data.data.code,
        discountAmount: data.data.discountAmount,
      });
      toast.success(data.message || 'কুপন ডিসকাউন্ট যোগ করা হয়েছে!');
    } catch (err: any) {
      toast.error(err.message || 'কুপন প্রয়োগ ব্যর্থ হয়েছে।');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    toast.success('কুপন বাতিল করা হয়েছে।');
  };

  const onSubmit = async (data: CheckoutFormData) => {
    if (cart.length === 0) {
      toast.error('আপনার কার্টে কোনো পণ্য নেই!');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        items: cart.map((item) => ({
          productId: item.productId,
          title: item.title,
          image: item.image,
          size: item.size,
          color: item.color,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: data.fullName,
          phone: data.phone,
          division: data.division,
          district: data.district,
          addressLine: data.addressLine,
        },
        paymentMethod: 'cod',
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        customerNotes: data.customerNotes,
      };

      const res = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'অর্ডার প্রক্রিয়া করতে সমস্যা হয়েছে।');
      }

      clearCart();
      toast.success('অর্ডার সফল হয়েছে!');
      navigate(`/order-success?orderNumber=${result.data.orderNumber}&token=${result.data.trackingToken}`);
    } catch (err: any) {
      toast.error(err.message || 'সার্ভার সংযোগে সমস্যা। আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="mb-8 border-b border-white/10 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          ক্যাশ অন ডেলিভারি চেকআউট (COD)
        </h1>
        <p className="text-xs text-slate-400 mt-1">পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Shipping Address Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-white/10 space-y-5">
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#C5A880]" />
              <span>ডেলিভারি ঠিকানা ও গ্রাহকের তথ্য</span>
            </h2>

            {/* Full Name */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                আপনার পুরো নাম *
              </label>
              <input
                type="text"
                placeholder="যেমন: তানভীর আহমেদ"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-[#C5A880]"
                {...register('fullName')}
              />
              {errors.fullName && (
                <p className="text-xs text-rose-400 mt-1">{errors.fullName.message}</p>
              )}
            </div>

            {/* Mobile Phone */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                মোবাইল নম্বর (১১ ডিজিট) *
              </label>
              <input
                type="tel"
                placeholder="017XXXXXXXX"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white font-mono focus:outline-hidden focus:ring-2 focus:ring-[#C5A880]"
                {...register('phone')}
              />
              {errors.phone && (
                <p className="text-xs text-rose-400 mt-1">{errors.phone.message}</p>
              )}
            </div>

            {/* Division & District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  বিভাগ (Division) *
                </label>
                <select
                  className="w-full px-4 py-2.5 bg-[#0F172A] border border-white/10 rounded-xl text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-[#C5A880]"
                  {...register('division')}
                  onChange={(e) => {
                    setValue('division', e.target.value);
                    setSelectedDivision(e.target.value);
                  }}
                >
                  {DIVISIONS.map((div) => (
                    <option key={div} value={div}>
                      {div} {div === 'ঢাকা' ? '(৭০৳ ডেলিভারি)' : '(১৩০৳ ডেলিভারি)'}
                    </option>
                  ))}
                </select>
                {errors.division && (
                  <p className="text-xs text-rose-400 mt-1">{errors.division.message}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  জেলা / শহর *
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ধানমন্ডি, ঢাকা"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-[#C5A880]"
                  {...register('district')}
                />
                {errors.district && (
                  <p className="text-xs text-rose-400 mt-1">{errors.district.message}</p>
                )}
              </div>
            </div>

            {/* Address Line */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                সম্পূর্ণ ঠিকানা (বাসা, রোড ও এলাকা) *
              </label>
              <textarea
                rows={2}
                placeholder="বাড়ি নং, রোড নং, এলাকার বিস্তারিত বিবরণ"
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-[#C5A880]"
                {...register('addressLine')}
              />
              {errors.addressLine && (
                <p className="text-xs text-rose-400 mt-1">{errors.addressLine.message}</p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                ডেলিভারি নোট (ঐচ্ছিক)
              </label>
              <input
                type="text"
                placeholder="যেমন: বিকেলে ডেলিভারি দিলে ভালো হয়"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-[#C5A880]"
                {...register('customerNotes')}
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-white/10 space-y-4">
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              পেমেন্ট মেথড (Payment Method)
            </h2>
            <div className="p-4 rounded-xl border-2 border-[#C5A880] bg-[#C5A880]/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#C5A880]" />
                <div>
                  <h4 className="text-sm font-bold text-white">ক্যাশ অন ডেলিভারি (Cash on Delivery)</h4>
                  <p className="text-xs text-slate-400">ডেলিভারিম্যানের কাছে পার্সেল দেখে নগদ টাকা পরিশোধ করুন</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#C5A880] uppercase tracking-wider">সক্রিয়</span>
            </div>
          </div>
        </div>

        {/* Right: Order Summary with Coupon Box */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0F172A] border border-white/10 space-y-6 shadow-xl sticky top-28">
          <h2 className="text-base font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
            আপনার অর্ডার ({cart.length} টি আইটেম)
          </h2>

          {/* Items Preview */}
          <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.variantId} className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={item.image} alt="" className="w-10 h-12 rounded object-cover shrink-0 bg-slate-900" />
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate">{item.title}</p>
                    <p className="text-slate-400 font-mono">{item.size} • {item.color} × {item.quantity}</p>
                  </div>
                </div>
                <span className="font-mono font-bold text-white shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Coupon Input Box */}
          <div className="pt-2 border-t border-white/10">
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>ডিসকাউন্ট কুপন</span>
            </label>
            {appliedCoupon ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-emerald-400 text-xs">
                    {appliedCoupon.code}
                  </span>
                  <p className="text-[11px] text-slate-400">
                    ৳{appliedCoupon.discountAmount} ডিসকাউন্ট প্রয়োগ করা হয়েছে
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="যেমন: ECHO100"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white font-mono uppercase focus:outline-hidden focus:ring-2 focus:ring-[#C5A880]"
                />
                <button
                  type="button"
                  disabled={isApplyingCoupon || !couponInput.trim()}
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-[#C5A880] text-black font-bold text-xs rounded-xl hover:bg-[#D8BD97] transition-all disabled:opacity-40 cursor-pointer"
                >
                  {isApplyingCoupon ? '...' : 'প্রয়োগ'}
                </button>
              </div>
            )}
          </div>

          {/* Pricing calculations */}
          <div className="space-y-3 pt-3 border-t border-white/10 text-sm">
            <div className="flex justify-between text-slate-300">
              <span>সাবটোটাল</span>
              <span className="font-mono font-bold text-white">{formatPrice(subtotal)}</span>
            </div>

            <div className="flex justify-between text-slate-300">
              <span>ডেলিভারি চার্জ ({selectedDivision})</span>
              <span className="font-mono text-[#C5A880]">
                {isFreeDelivery ? 'ফ্রি' : formatPrice(finalDeliveryCharge)}
              </span>
            </div>

            {appliedDiscount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>কুপন ডিসকাউন্ট</span>
                <span className="font-mono font-bold">-{formatPrice(appliedDiscount)}</span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-between items-baseline">
            <span className="text-base font-bold text-white">সর্বমোট প্রদেয়</span>
            <span className="text-2xl font-black text-[#C5A880] font-mono">
              {formatPrice(finalTotal)}
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-13 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#B39366] text-black font-extrabold text-base flex items-center justify-center gap-2 shadow-xl shadow-[#C5A880]/15 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <span>অর্ডার সম্পন্ন হচ্ছে...</span>
            ) : (
              <>
                <span>অর্ডার কনফার্ম করুন (৳{finalTotal})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
