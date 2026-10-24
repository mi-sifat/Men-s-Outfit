import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Package, Truck, Phone } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const OrderSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || 'EO-2026-00001';
  const token = searchParams.get('token') || '';

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24 text-center space-y-8">
      {/* Success Badge */}
      <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-3">
        <span className="text-xs font-mono font-bold text-[#C5A880] uppercase tracking-widest">
          ORDER CONFIRMED
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          ধন্যবাদ! আপনার অর্ডার সফল হয়েছে
        </h1>
        <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
          আমরা আপনার ক্যাশ অন ডেলিভারি অর্ডারটি গ্রহণ করেছি। খুব শীঘ্রই আমাদের প্রতিনিধি আপনাকে ফোনে কল করে অর্ডারটি নিশ্চিত করবেন।
        </p>
      </div>

      {/* Order Info Card */}
      <div className="p-6 rounded-2xl bg-[#0F172A] border border-white/10 max-w-md mx-auto text-left space-y-4">
        <div className="flex justify-between items-center text-sm border-b border-white/10 pb-3">
          <span className="text-slate-400">অর্ডার নম্বর:</span>
          <span className="font-mono font-bold text-[#C5A880] text-base">{orderNumber}</span>
        </div>
        <div className="flex justify-between items-center text-sm border-b border-white/10 pb-3">
          <span className="text-slate-400">পেমেন্ট মেথড:</span>
          <span className="font-semibold text-white">ক্যাশ অন ডেলিভারি (COD)</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-400">ডেলিভারি সময়:</span>
          <span className="text-slate-200">২ থেকে ৪ কার্যদিবস</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Link to={`/order-tracking?token=${token || orderNumber}`}>
          <Button variant="outline" size="md" className="border-white/10 text-white hover:bg-white/5 gap-2">
            <Truck className="w-4 h-4 text-[#C5A880]" />
            <span>অর্ডার ট্র্যাক করুন</span>
          </Button>
        </Link>
        <Link to="/shop">
          <Button variant="secondary" size="md" className="font-bold gap-2">
            <span>আরও শপিং করুন</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
