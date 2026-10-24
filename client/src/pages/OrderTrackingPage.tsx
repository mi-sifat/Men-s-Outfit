import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { formatPrice } from '../lib/utils';

export const OrderTrackingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialToken = searchParams.get('token') || '';
  const [tokenInput, setTokenInput] = useState<string>(initialToken);
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTracking = async (searchToken: string) => {
    if (!searchToken.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(searchToken.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'অর্ডারের তথ্য পাওয়া যায়নি।');
      }
      setOrder(data.data);
    } catch (err: any) {
      setError(err.message || 'ট্র্যাকিং তথ্য লোড করতে সমস্যা হয়েছে।');
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialToken) {
      fetchTracking(initialToken);
    }
  }, [initialToken]);

  const getStatusStep = (status: string) => {
    const steps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const idx = steps.indexOf(status.toLowerCase());
    return idx === -1 ? 0 : idx;
  };

  const currentStep = order ? getStatusStep(order.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-mono font-bold text-[#C5A880] uppercase tracking-widest">
          LIVE TRACKING
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          অর্ডার ও পার্সেল ট্র্যাকিং
        </h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          আপনার অর্ডার নম্বর (যেমন: EO-2026-00001) বা ট্র্যাকিং লিংক প্রদান করে পার্সেলের বর্তমান অবস্থান জানুন।
        </p>
      </div>

      {/* Search Input Box */}
      <div className="max-w-xl mx-auto flex gap-2">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="অর্ডার নম্বর বা ট্র্যাকিং কোড লিখুন..."
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchTracking(tokenInput)}
            className="w-full pl-11 pr-4 py-3 bg-[#0F172A] border border-white/10 rounded-xl text-sm text-white font-mono uppercase focus:outline-hidden focus:ring-2 focus:ring-[#C5A880]"
          />
        </div>
        <Button
          variant="secondary"
          size="md"
          className="font-bold px-6"
          disabled={isLoading || !tokenInput.trim()}
          onClick={() => fetchTracking(tokenInput)}
        >
          {isLoading ? 'খোঁজা হচ্ছে...' : 'ট্র্যাক করুন'}
        </Button>
      </div>

      {/* Error state */}
      {error && (
        <div className="max-w-xl mx-auto p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Order Info Card if Found */}
      {order && (
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0F172A] border border-white/10 space-y-8 shadow-2xl">
          {/* Top header row */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/10 pb-5">
            <div>
              <span className="text-xs text-slate-400">অর্ডার নম্বর</span>
              <h2 className="text-xl font-black text-white font-mono">{order.orderNumber}</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#C5A880]/10 text-[#C5A880] border border-[#C5A880]/30 text-xs font-bold uppercase tracking-wider">
                {order.status}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              ডেলিভারি টাইমলাইন
            </h3>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {[
                { title: 'অর্ডার প্লেসড', step: 0 },
                { title: 'কনফার্মড', step: 1 },
                { title: 'কুরিয়ারে হস্তান্তর', step: 3 },
                { title: 'ডেলিভার্ড', step: 4 },
              ].map((s) => (
                <div key={s.title} className="space-y-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      currentStep >= s.step ? 'bg-[#C5A880]' : 'bg-white/10'
                    }`}
                  />
                  <span
                    className={`block font-medium ${
                      currentStep >= s.step ? 'text-white' : 'text-slate-500'
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Courier Details */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">কুরিয়ার সার্ভিস:</span>
              <span className="text-white font-semibold">
                {order.courierProvider === 'pathao'
                  ? 'Pathao Courier'
                  : order.courierProvider === 'steadfast'
                  ? 'Steadfast Courier'
                  : 'Echo Express / Manual Courier'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">কুরিয়ার ট্র্যাকিং কোড:</span>
              <span className="font-mono text-[#C5A880] font-bold">
                {order.courierTrackingCode || 'শীঘ্রই আপডেট হবে'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">ডেলিভারি ঠিকানা:</span>
              <span className="text-slate-300">
                {order.shippingAddress?.fullName}, {order.shippingAddress?.addressLine}, {order.shippingAddress?.district}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">সর্বমোট মূল্য (COD):</span>
              <span className="font-mono text-white font-bold text-sm">
                {formatPrice(order.payableTotal)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
