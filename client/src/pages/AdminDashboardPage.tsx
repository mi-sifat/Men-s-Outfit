import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Users, 
  DollarSign, 
  Truck, 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Settings,
  Filter,
  Search,
  ExternalLink
} from 'lucide-react';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { toast } from 'react-hot-toast';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'settings'>('orders');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sample realistic admin orders state
  const [orders, setOrders] = useState([
    {
      id: 'ord-1',
      orderNumber: 'EO-2026-00001',
      customerName: 'তানভীর আহমেদ',
      phone: '01712345678',
      address: 'ধানমন্ডি ২৭, ঢাকা',
      total: 1770,
      status: 'pending',
      paymentMethod: 'COD',
      itemsCount: 2,
      createdAt: 'আজ, ০২:১৫ PM',
    },
    {
      id: 'ord-2',
      orderNumber: 'EO-2026-00002',
      customerName: 'রাকিবুল হাসান',
      phone: '01898765432',
      address: 'জিইসি মোড়, চট্টগ্রাম',
      total: 980,
      status: 'confirmed',
      paymentMethod: 'COD',
      itemsCount: 1,
      createdAt: 'গতকাল, ০৮:৪৫ PM',
    },
    {
      id: 'ord-3',
      orderNumber: 'EO-2026-00003',
      customerName: 'আরিফ চৌধুরী',
      phone: '01911223344',
      address: 'উত্তরা সেক্টর ৭, ঢাকা',
      total: 2450,
      status: 'shipped',
      paymentMethod: 'COD',
      itemsCount: 3,
      createdAt: '২৩ অক্টো, ১১:০০ AM',
    },
  ]);

  // Delivery settings state
  const [settings, setSettings] = useState({
    deliveryDhaka: 70,
    deliveryOutsideDhaka: 130,
    freeDeliveryThreshold: 2000,
    isCodEnabled: true,
  });

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    toast.success(`অর্ডারের স্ট্যাটাস '${newStatus}'-এ পরিবর্তন করা হয়েছে!`);
  };

  const handleSaveSettings = () => {
    toast.success('ডেলিভারি চার্জ ও সেটিংস সফলভাবে আপডেট হয়েছে!');
  };

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = orderFilter === 'all' || o.status === orderFilter;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-[#C5A880] uppercase tracking-widest block mb-1">
            CONTROL CENTER
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            অ্যাডমিন ড্যাশবোর্ড (Men's Outfit Admin)
          </h1>
        </div>

        {/* Tab buttons */}
        <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-bold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'orders' ? 'bg-[#C5A880] text-black shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            অর্ডার ম্যানেজমেন্ট
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'inventory' ? 'bg-[#C5A880] text-black shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            ইনভেন্টরি ও স্টক
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'settings' ? 'bg-[#C5A880] text-black shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            ডেলিভারি সেটিংস
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-[#0F172A] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">আজকের মোট সেলস</span>
            <DollarSign className="w-4 h-4 text-[#C5A880]" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {formatPrice(5200)}
          </div>
          <span className="text-[11px] text-emerald-400 font-medium">↑ ১৫% বেশি গত সপ্তাহের চেয়ে</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F172A] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">পেন্ডিং অর্ডার (Pending)</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {orders.filter((o) => o.status === 'pending').length} টি
          </div>
          <span className="text-[11px] text-slate-400">কনফার্মেশন কলের অপেক্ষায়</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F172A] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">কুরিয়ারে পাঠানো (Shipped)</span>
            <Truck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-400 font-mono">
            {orders.filter((o) => o.status === 'shipped').length} টি
          </div>
          <span className="text-[11px] text-slate-400">Pathao ও Steadfast এ সচল</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F172A] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">লো-স্টক পণ্য সতর্কতা</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400 font-mono">
            ২ টি
          </div>
          <span className="text-[11px] text-rose-400">স্টক অবিলম্বে রি-অর্ডার করুন</span>
        </div>
      </div>

      {/* TAB 1: ORDERS MANAGEMENT */}
      {activeTab === 'orders' && (
        <div className="p-6 rounded-2xl bg-[#0F172A] border border-white/10 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-[#C5A880]" />
              <span>সাম্প্রতিক অর্ডার তালিকা ({filteredOrders.length})</span>
            </h2>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {['all', 'pending', 'confirmed', 'shipped', 'cancelled'].map((f) => (
                <button
                  key={f}
                  onClick={() => setOrderFilter(f)}
                  className={`px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    orderFilter === f
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f === 'all' ? 'সব' : f}
                </button>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="অর্ডার নম্বর, ফোন বা নাম দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-[#C5A880]"
            />
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[11px] font-mono text-[#C5A880] uppercase">
                  <th className="py-3 px-3">অর্ডার নং</th>
                  <th className="py-3 px-3">গ্রাহক ও ফোন</th>
                  <th className="py-3 px-3">ঠিকানা</th>
                  <th className="py-3 px-3">মূল্য (COD)</th>
                  <th className="py-3 px-3">স্ট্যাটাস</th>
                  <th className="py-3 px-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/2 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-white">
                      {ord.orderNumber}
                      <span className="block text-[10px] text-slate-500 font-sans font-normal mt-0.5">
                        {ord.createdAt}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-white block">{ord.customerName}</span>
                      <span className="text-slate-400 font-mono">{ord.phone}</span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-300 max-w-xs truncate">
                      {ord.address}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-white text-sm">
                      {formatPrice(ord.total)}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          ord.status === 'confirmed'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : ord.status === 'shipped'
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            : ord.status === 'cancelled'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right space-x-1.5 whitespace-nowrap">
                      {ord.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(ord.id, 'confirmed')}
                          className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          কনফার্ম
                        </button>
                      )}
                      {ord.status === 'confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(ord.id, 'shipped')}
                          className="px-2.5 py-1 bg-[#C5A880]/20 hover:bg-[#C5A880]/30 text-[#C5A880] rounded text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          কুরিয়ার পাঠান
                        </button>
                      )}
                      {ord.status !== 'cancelled' && (
                        <button
                          onClick={() => handleUpdateStatus(ord.id, 'cancelled')}
                          className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          বাতিল
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: INVENTORY & STOCK */}
      {activeTab === 'inventory' && (
        <div className="p-6 rounded-2xl bg-[#0F172A] border border-white/10 space-y-6 shadow-2xl">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-[#C5A880]" />
            <span>ভ্যারিয়েন্ট ভিত্তিক ইনভেন্টরি ম্যানেজমেন্ট</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Jet Black Drop-Shoulder Tee', size: 'M', stock: 15, sku: 'EO-OV-BLK-M' },
              { title: 'Jet Black Drop-Shoulder Tee', size: 'L', stock: 22, sku: 'EO-OV-BLK-L' },
              { title: 'Jet Black Drop-Shoulder Tee', size: 'XL', stock: 4, sku: 'EO-OV-BLK-XL', low: true },
              { title: 'Charcoal Minimalist Graphic Tee', size: 'M', stock: 12, sku: 'EO-GP-CHR-M' },
              { title: 'Chalk White Essential Solid Tee', size: 'L', stock: 3, sku: 'EO-DS-WHT-L', low: true },
              { title: 'Midnight Navy Pique Knit Polo', size: 'M', stock: 11, sku: 'EO-PL-NVY-M' },
            ].map((v, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-white">{v.title}</h4>
                  {v.low && (
                    <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold">
                      LOW STOCK
                    </span>
                  )}
                </div>
                <div className="flex justify-between text-slate-400 font-mono">
                  <span>সাইজ: {v.size}</span>
                  <span>SKU: {v.sku}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <span className="text-slate-300">বর্তমান স্টক:</span>
                  <span className="font-mono font-black text-white text-sm">{v.stock} টি</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="p-6 rounded-2xl bg-[#0F172A] border border-white/10 space-y-6 shadow-2xl max-w-2xl">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#C5A880]" />
            <span>বাংলাদেশ ডেলিভারি রুলস ও কনফিগারেশন</span>
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">ঢাকা সিটির ভিতরে ডেলিভারি চার্জ (৳)</label>
              <input
                type="number"
                value={settings.deliveryDhaka}
                onChange={(e) => setSettings({ ...settings, deliveryDhaka: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-sm focus:outline-hidden focus:ring-2 focus:ring-[#C5A880]"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">ঢাকার বাইরে ডেলিভারি চার্জ (৳)</label>
              <input
                type="number"
                value={settings.deliveryOutsideDhaka}
                onChange={(e) => setSettings({ ...settings, deliveryOutsideDhaka: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-sm focus:outline-hidden focus:ring-2 focus:ring-[#C5A880]"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">ফ্রি ডেলিভারি থ্রেশহোল্ড (৳)</label>
              <input
                type="number"
                value={settings.freeDeliveryThreshold}
                onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-sm focus:outline-hidden focus:ring-2 focus:ring-[#C5A880]"
              />
              <span className="text-slate-500 text-[11px] mt-1 block">এই পরিমাণের বেশি অর্ডারে স্বয়ংক্রিয়ভাবে শিপিং ফি শূন্য হবে।</span>
            </div>

            <Button
              variant="secondary"
              size="md"
              className="font-bold w-full mt-4"
              onClick={handleSaveSettings}
            >
              সেটিংস সেভ করুন
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
