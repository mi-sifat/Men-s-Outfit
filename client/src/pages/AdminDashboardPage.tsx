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
  ExternalLink,
  Plus,
  Trash2,
  Tag,
  Image as ImageIcon
} from 'lucide-react';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { toast } from 'react-hot-toast';
import { getAllProducts, saveProduct, deleteProduct } from '../data/productStore';
import type { Product } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'inventory' | 'settings'>('orders');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Products state loaded from store
  const [productsList, setProductsList] = useState<Product[]>(() => getAllProducts());
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // New product form state
  const [newTitle, setNewTitle] = useState('');
  const [newTitleBn, setNewTitleBn] = useState('');
  const [newCategory, setNewCategory] = useState<'Oversized' | 'Drop-Shoulder' | 'Graphic Tees' | 'Polo'>('Oversized');
  const [newPrice, setNewPrice] = useState('850');
  const [newComparePrice, setNewComparePrice] = useState('1050');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Initial orders with localStorage support
  const defaultOrders = [
    {
      id: 'ord-1',
      orderNumber: 'MO-2026-00001',
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
      orderNumber: 'MO-2026-00002',
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
      orderNumber: 'MO-2026-00003',
      customerName: 'আরিফ চৌধুরী',
      phone: '01911223344',
      address: 'উত্তরা সেক্টর ৭, ঢাকা',
      total: 2450,
      status: 'shipped',
      paymentMethod: 'COD',
      itemsCount: 3,
      createdAt: '২৩ অক্টো, ১১:০০ AM',
    },
  ];

  const [orders, setOrders] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('mens_outfit_orders') || '[]');
      if (Array.isArray(stored) && stored.length > 0) {
        return [...stored, ...defaultOrders];
      }
    } catch (e) {
      console.warn('Could not parse stored orders', e);
    }
    return defaultOrders;
  });

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
    // Also sync localStorage if it's a locally stored order
    try {
      const stored = JSON.parse(localStorage.getItem('mens_outfit_orders') || '[]');
      const updated = stored.map((o: any) => o.id === id ? { ...o, status: newStatus } : o);
      localStorage.setItem('mens_outfit_orders', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to update order in storage', e);
    }
    toast.success(`অর্ডারের স্ট্যাটাস '${newStatus}'-এ পরিবর্তন করা হয়েছে!`);
  };

  const handleSaveSettings = () => {
    toast.success('ডেলিভারি চার্জ ও সেটিংস সফলভাবে আপডেট হয়েছে!');
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error('প্রোডাক্টের নাম লিখুন');
      return;
    }

    const priceNum = Number(newPrice) || 850;
    const compareNum = Number(newComparePrice) || priceNum + 200;
    const id = `custom-${Date.now()}`;
    const slug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `product-${id}`;
    const image = newImageUrl.trim() || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80';

    const newProd: Product = {
      id,
      title: newTitle.trim(),
      titleBn: newTitleBn.trim() || newTitle.trim(),
      slug,
      description: newDescription.trim() || 'Men\'s Outfit প্রিমিয়াম ১০০% সুতির তৈরি পোশাক। আরামদায়ক ফিটিং এবং দীর্ঘস্থায়ী কোয়ালিটি।',
      price: priceNum,
      compareAtPrice: compareNum,
      category: newCategory,
      images: [image],
      variants: [
        { id: `${id}-m`, size: 'M', color: 'Jet Black', colorCode: '#111111', sku: `MO-${newCategory.slice(0, 2).toUpperCase()}-M`, stock: 20 },
        { id: `${id}-l`, size: 'L', color: 'Jet Black', colorCode: '#111111', sku: `MO-${newCategory.slice(0, 2).toUpperCase()}-L`, stock: 25 },
        { id: `${id}-xl`, size: 'XL', color: 'Jet Black', colorCode: '#111111', sku: `MO-${newCategory.slice(0, 2).toUpperCase()}-XL`, stock: 15 },
      ],
      isNewArrival: true,
      tags: [newCategory.toLowerCase(), 'new'],
      rating: 5.0,
      reviewCount: 1,
    };

    saveProduct(newProd);
    setProductsList(getAllProducts());
    setShowAddProductModal(false);
    setNewTitle('');
    setNewTitleBn('');
    setNewImageUrl('');
    setNewDescription('');
    toast.success(`"${newProd.title}" সফলভাবে যুক্ত করা হয়েছে! এটি এখন শপেও দেখা যাবে।`);
  };

  const handleDeleteProduct = (productId: string, title: string) => {
    deleteProduct(productId);
    setProductsList(getAllProducts());
    toast.success(`"${title}" মুছে ফেলা হয়েছে!`);
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
        <div className="flex flex-wrap gap-2 bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-bold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'orders' ? 'bg-[#C5A880] text-black shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            অর্ডার ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'products' ? 'bg-[#C5A880] text-black shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            <span>প্রোডাক্ট ম্যানেজমেন্ট</span>
            <span className="bg-black/30 px-1.5 py-0.2 rounded text-[10px] font-mono">{productsList.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'inventory' ? 'bg-[#C5A880] text-black shadow-md' : 'text-slate-300 hover:text-white'
            }`}
          >
            ইনভেন্টরি
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
            {formatPrice(orders.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0))}
          </div>
          <span className="text-[11px] text-emerald-400 font-medium">মোট {orders.length} টি অর্ডার সম্পন্ন</span>
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
            <span className="text-xs font-medium">মোট লাইভ প্রোডাক্ট</span>
            <Package className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {productsList.length} টি
          </div>
          <span className="text-[11px] text-slate-400">৪টি ক্যাটাগরিতে সচল</span>
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
              {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((f) => (
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
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      কোনো অর্ডার পাওয়া যায়নি।
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-white/2 transition-colors">
                      <td className="py-3.5 px-3 font-mono font-bold text-white">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-white">{ord.customerName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{ord.phone}</div>
                      </td>
                      <td className="py-3.5 px-3 max-w-xs truncate text-slate-300">
                        {ord.address}
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-[#C5A880]">
                        {formatPrice(ord.total)}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            ord.status === 'pending'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : ord.status === 'confirmed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : ord.status === 'shipped'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                              : ord.status === 'delivered'
                              ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right space-x-1.5 whitespace-nowrap">
                        {ord.status === 'pending' && (
                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'confirmed')}
                            className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            কনফার্ম
                          </button>
                        )}
                        {ord.status === 'confirmed' && (
                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'shipped')}
                            className="px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            কুরিয়ার হ্যান্ডওভার
                          </button>
                        )}
                        {ord.status === 'shipped' && (
                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'delivered')}
                            className="px-2 py-1 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 rounded text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            ডেলিভার্ড
                          </button>
                        )}
                        {ord.status !== 'cancelled' && ord.status !== 'delivered' && (
                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'cancelled')}
                            className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded text-[11px] font-bold transition-colors cursor-pointer"
                          >
                            বাতিল
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="p-6 rounded-2xl bg-[#0F172A] border border-white/10 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#C5A880]" />
                <span>প্রোডাক্ট ম্যানেজমেন্ট ও নতুন প্রোডাক্ট অ্যাড ({productsList.length} টি)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                এখান থেকে যেকোনো সময় নতুন টি-শার্ট বা প্রোডাক্ট যুক্ত করতে পারবেন
              </p>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowAddProductModal(true)}
              className="gap-2 font-bold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন প্রোডাক্ট যোগ করুন</span>
            </Button>
          </div>

          {/* Add Product Modal */}
          {showAddProductModal && (
            <div className="p-6 rounded-2xl bg-black/60 border border-[#C5A880]/30 space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#C5A880]" />
                  <span>নতুন প্রোডাক্টের তথ্য পূরণ করুন</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-white/5 rounded"
                >
                  ✕ বন্ধ করুন
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">প্রোডাক্টের নাম (English) *</label>
                  <input
                    type="text"
                    placeholder="e.g. Heavyweight Minimalist Acid Tee"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:ring-1 focus:ring-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">প্রোডাক্টের নাম (বাংলা)</label>
                  <input
                    type="text"
                    placeholder="যেমন: হেভিওয়েট মিনিমালিস্ট টি-শার্ট"
                    value={newTitleBn}
                    onChange={(e) => setNewTitleBn(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:ring-1 focus:ring-[#C5A880]"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">ক্যাটাগরি *</label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0F172A] border border-white/10 rounded-xl text-white text-xs focus:ring-1 focus:ring-[#C5A880]"
                  >
                    <option value="Oversized">ওভারসাইজড টি-শার্ট (Oversized)</option>
                    <option value="Drop-Shoulder">ড্রপ শোল্ডার (Drop-Shoulder)</option>
                    <option value="Graphic Tees">গ্রাফিক টিজ (Graphic Tees)</option>
                    <option value="Polo">পোলো শার্ট (Polo)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">মূল্য (৳) *</label>
                    <input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-mono focus:ring-1 focus:ring-[#C5A880]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">আগের দাম (৳)</label>
                    <input
                      type="number"
                      value={newComparePrice}
                      onChange={(e) => setNewComparePrice(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-mono focus:ring-1 focus:ring-[#C5A880]"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-slate-300 block mb-1 font-semibold">ছবির লিঙ্ক (Image URL) - ঐচ্ছিক</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... (খালি রাখলে সুন্দর ডিফল্ট ছবি বসবে)"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:ring-1 focus:ring-[#C5A880]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-slate-300 block mb-1 font-semibold">বিবরণ (Description)</label>
                  <textarea
                    rows={2}
                    placeholder="কাপড়ের জিএসএম, ফিটিং ও ম্যাটেরিয়ালের বিবরণ..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:ring-1 focus:ring-[#C5A880]"
                  />
                </div>

                <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="px-4 py-2 bg-white/5 text-slate-300 hover:text-white rounded-xl text-xs font-semibold"
                  >
                    বাতিল
                  </button>
                  <Button variant="secondary" size="sm" type="submit" className="font-bold">
                    প্রোডাক্ট সেভ করুন
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Product Items Table */}
          <div className="overflow-x-auto max-h-[500px]">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-[11px] font-mono text-[#C5A880] uppercase sticky top-0 bg-[#0F172A]">
                  <th className="py-3 px-3">ছবি</th>
                  <th className="py-3 px-3">নাম ও বিবরণ</th>
                  <th className="py-3 px-3">ক্যাটাগরি</th>
                  <th className="py-3 px-3">মূল্য</th>
                  <th className="py-3 px-3">রেটিং</th>
                  <th className="py-3 px-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans">
                {productsList.map((prod) => (
                  <tr key={prod.id} className="hover:bg-white/2 transition-colors">
                    <td className="py-2.5 px-3">
                      <img
                        src={prod.images[0]}
                        alt={prod.title}
                        className="w-10 h-10 object-cover rounded-lg border border-white/10"
                      />
                    </td>
                    <td className="py-2.5 px-3 max-w-xs">
                      <div className="font-bold text-white truncate">{prod.title}</div>
                      <div className="text-[11px] text-slate-400 truncate">{prod.titleBn || prod.description}</div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-slate-300">
                        {prod.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#C5A880]">
                      {formatPrice(prod.price)}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 font-mono">
                      ★ {prod.rating} ({prod.reviewCount})
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {prod.id.startsWith('custom-') ? (
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.title)}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded transition-colors"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">সিস্টেম</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: INVENTORY & STOCK */}
      {activeTab === 'inventory' && (
        <div className="p-6 rounded-2xl bg-[#0F172A] border border-white/10 space-y-6 shadow-2xl">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-[#C5A880]" />
            <span>ভ্যারিয়েন্ট ভিত্তিক ইনভেন্টরি ম্যানেজমেন্ট</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Jet Black Drop-Shoulder Tee', size: 'M', stock: 15, sku: 'MO-OV-BLK-M' },
              { title: 'Jet Black Drop-Shoulder Tee', size: 'L', stock: 22, sku: 'MO-OV-BLK-L' },
              { title: 'Jet Black Drop-Shoulder Tee', size: 'XL', stock: 4, sku: 'MO-OV-BLK-XL', low: true },
              { title: 'Charcoal Minimalist Graphic Tee', size: 'M', stock: 12, sku: 'MO-GP-CHR-M' },
              { title: 'Chalk White Essential Solid Tee', size: 'L', stock: 3, sku: 'MO-DS-WHT-L', low: true },
              { title: 'Midnight Navy Pique Knit Polo', size: 'M', stock: 11, sku: 'MO-PL-NVY-M' },
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

      {/* TAB 4: SETTINGS */}
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
              className="font-bold w-full mt-4 cursor-pointer"
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
