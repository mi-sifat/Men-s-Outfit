import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  Boxes, 
  ShoppingBag, 
  TicketPercent, 
  Palette, 
  Image as ImageIcon, 
  Info, 
  Share2, 
  Truck, 
  CreditCard, 
  BarChart3, 
  Shield, 
  UserCheck, 
  LogOut, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Eye, 
  ExternalLink, 
  Printer, 
  Save, 
  RefreshCw, 
  Menu, 
  X,
  Lock,
  DollarSign
} from 'lucide-react';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { toast } from 'react-hot-toast';
import { getAllProducts, saveProduct, deleteProduct } from '../data/productStore';
import { getLocalStoreSettings, saveLocalStoreSettings } from '../data/settingsStore';
import type { StoreSettingsData, BannerItem } from '../data/settingsStore';
import type { Product } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const { user, logout, changePassword } = useAuth();
  const navigate = useNavigate();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'products'
    | 'categories'
    | 'inventory'
    | 'orders'
    | 'coupons'
    | 'appearance'
    | 'banners'
    | 'info'
    | 'social'
    | 'delivery'
    | 'payments'
    | 'reports'
    | 'audit'
    | 'account'
  >('dashboard');

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Settings State
  const [settings, setSettings] = useState<StoreSettingsData>(() => getLocalStoreSettings());

  // Products State
  const [products, setProducts] = useState<Product[]>(() => getAllProducts());
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Add Product Form
  const [prodTitle, setProdTitle] = useState('');
  const [prodTitleBn, setProdTitleBn] = useState('');
  const [prodCategory, setProdCategory] = useState<'Oversized' | 'Drop-Shoulder' | 'Graphic Tees' | 'Polo'>('Oversized');
  const [prodPrice, setProdPrice] = useState('850');
  const [prodComparePrice, setProdComparePrice] = useState('1050');
  const [prodImage, setProdImage] = useState('');
  const [prodDesc, setProdDesc] = useState('');

  // Orders State
  const [orders, setOrders] = useState<any[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('mens_outfit_orders') || '[]');
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
      return Array.isArray(stored) && stored.length > 0 ? [...stored, ...defaultOrders] : defaultOrders;
    } catch {
      return [];
    }
  });

  const [orderFilter, setOrderFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<any | null>(null);

  // Banners State
  const [banners, setBanners] = useState<BannerItem[]>(settings.banners || []);
  const [showAddBannerModal, setShowAddBannerModal] = useState(false);
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('');
  const [newBannerButton, setNewBannerButton] = useState('কালেকশন দেখুন');
  const [newBannerLink, setNewBannerLink] = useState('/shop');
  const [newBannerImage, setNewBannerImage] = useState('');

  // Coupons State
  const [coupons, setCoupons] = useState([
    { code: 'MEN100', discount: 100, type: 'fixed', minSpend: 1500, active: true },
    { code: 'OUTFIT50', discount: 50, type: 'fixed', minSpend: 800, active: true },
    { code: 'WELCOME', discount: 10, type: 'percent', minSpend: 1000, active: true },
  ]);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('100');

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<any[]>([
    {
      id: 'log-1',
      adminEmail: user?.email || 'admin@mensoutfit.com',
      action: 'ADMIN_LOGIN',
      resource: 'AUTH',
      details: 'Administrator logged in successfully',
      time: 'আজ, ০১:১৫ AM',
    },
    {
      id: 'log-2',
      adminEmail: user?.email || 'admin@mensoutfit.com',
      action: 'SYSTEM_VERIFY',
      resource: 'SECURITY',
      details: 'Audit trails and rate limiting active',
      time: 'আজ, ১২:০০ AM',
    },
  ]);

  // Account Password Form
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Sync settings helper
  const updateAndSaveSettings = (newSettings: StoreSettingsData) => {
    setSettings(newSettings);
    saveLocalStoreSettings(newSettings);

    // Also attempt server sync if online
    fetch('/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('mens_outfit_admin_token') || ''}`,
      },
      body: JSON.stringify(newSettings),
    }).catch(() => {
      // Offline fallback
    });

    toast.success('সেটিংস সফলভাবে সেভ হয়েছে!');
  };

  // Add Product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle.trim()) {
      toast.error('প্রোডাক্টের নাম লিখুন');
      return;
    }

    const priceNum = Number(prodPrice) || 850;
    const compareNum = Number(prodComparePrice) || priceNum + 200;
    const id = editingProduct ? editingProduct.id : `custom-${Date.now()}`;
    const slug = prodTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `product-${id}`;
    const image = prodImage.trim() || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80';

    const newProd: Product = {
      id,
      title: prodTitle.trim(),
      titleBn: prodTitleBn.trim() || prodTitle.trim(),
      slug,
      description: prodDesc.trim() || "Men's Outfit প্রিমিয়াম ১০০% সুতির তৈরি পোশাক। আরামদায়ক ফিটিং এবং দীর্ঘস্থায়ী কোয়ালিটি।",
      price: priceNum,
      compareAtPrice: compareNum,
      category: prodCategory,
      images: [image],
      variants: [
        { id: `${id}-m`, size: 'M', color: 'Jet Black', colorCode: '#111111', sku: `MO-${prodCategory.slice(0, 2).toUpperCase()}-M`, stock: 20 },
        { id: `${id}-l`, size: 'L', color: 'Jet Black', colorCode: '#111111', sku: `MO-${prodCategory.slice(0, 2).toUpperCase()}-L`, stock: 25 },
        { id: `${id}-xl`, size: 'XL', color: 'Jet Black', colorCode: '#111111', sku: `MO-${prodCategory.slice(0, 2).toUpperCase()}-XL`, stock: 15 },
      ],
      isNewArrival: true,
      tags: [prodCategory.toLowerCase(), 'new'],
      rating: 5.0,
      reviewCount: 1,
    };

    saveProduct(newProd);
    setProducts(getAllProducts());
    setShowAddProductModal(false);
    setEditingProduct(null);
    setProdTitle('');
    setProdTitleBn('');
    setProdImage('');
    setProdDesc('');
    toast.success(`"${newProd.title}" সফলভাবে সেভ হয়েছে!`);
  };

  const handleDeleteProduct = (productId: string, title: string) => {
    if (confirm(`আপনি কি নিশ্চিত যে "${title}" প্রোডাক্টটি মুছে ফেলতে চান?`)) {
      deleteProduct(productId);
      setProducts(getAllProducts());
      toast.success(`"${title}" মুছে ফেলা হয়েছে!`);
    }
  };

  // Order status update
  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    try {
      const stored = JSON.parse(localStorage.getItem('mens_outfit_orders') || '[]');
      const updated = stored.map((o: any) => o.id === orderId ? { ...o, status: newStatus } : o);
      localStorage.setItem('mens_outfit_orders', JSON.stringify(updated));
    } catch {
      // local
    }
    toast.success(`অর্ডারের স্ট্যাটাস '${newStatus}'-এ পরিবর্তন করা হয়েছে!`);
  };

  // Add Banner
  const handleCreateBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerTitle.trim() || !newBannerImage.trim()) {
      toast.error('ব্যানারের শিরোনাম ও ছবির লিঙ্ক দিন');
      return;
    }

    const newBanner: BannerItem = {
      id: `banner-${Date.now()}`,
      title: newBannerTitle.trim(),
      subtitle: newBannerSubtitle.trim(),
      buttonText: newBannerButton.trim() || 'কালেকশন দেখুন',
      linkUrl: newBannerLink.trim() || '/shop',
      imageUrl: newBannerImage.trim(),
      isActive: true,
      order: banners.length + 1,
    };

    const updated = [...banners, newBanner];
    setBanners(updated);
    updateAndSaveSettings({ ...settings, banners: updated });
    setShowAddBannerModal(false);
    setNewBannerTitle('');
    setNewBannerSubtitle('');
    setNewBannerImage('');
  };

  const handleToggleBanner = (id: string) => {
    const updated = banners.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b));
    setBanners(updated);
    updateAndSaveSettings({ ...settings, banners: updated });
  };

  const handleDeleteBanner = (id: string) => {
    if (confirm('আপনি কি এই ব্যানারটি মুছে ফেলতে চান?')) {
      const updated = banners.filter((b) => b.id !== id);
      setBanners(updated);
      updateAndSaveSettings({ ...settings, banners: updated });
    }
  };

  // Change Password
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      toast.error('নতুন পাসওয়ার্ড নিশ্চিতকরণের সাথে মিলছে না।');
      return;
    }
    if (newPass.length < 8) {
      toast.error('পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।');
      return;
    }

    setIsChangingPass(true);
    const res = await changePassword(currentPass, newPass);
    setIsChangingPass(false);

    if (res.success) {
      toast.success(res.message);
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } else {
      toast.error(res.message);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    if (confirm('আপনি কি নিশ্চিত যে অ্যাডমিন প্যানেল থেকে লগআউট করতে চান?')) {
      await logout();
      toast.success('সফলভাবে লগআউট হয়েছে!');
      navigate('/admin/login');
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchesFilter = orderFilter === 'all' || o.status === orderFilter;
    const matchesSearch =
      o.orderNumber?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.phone?.includes(orderSearch);
    return matchesFilter && matchesSearch;
  });

  // Filtered products
  const filteredProducts = products.filter((p) => {
    const matchesCat = productCategoryFilter === 'all' || p.category.toLowerCase() === productCategoryFilter.toLowerCase();
    const matchesSearch = p.title.toLowerCase().includes(productSearch.toLowerCase()) || p.description.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const sidebarLinks = [
    { id: 'dashboard', label: 'ওভারভিউ ড্যাশবোর্ড', icon: LayoutDashboard },
    { id: 'products', label: 'প্রোডাক্টস ম্যানেজমেন্ট', icon: Package, badge: products.length },
    { id: 'categories', label: 'ক্যাটাগরি সমূহ', icon: Layers },
    { id: 'inventory', label: 'ইনভেন্টরি ও স্টক', icon: Boxes },
    { id: 'orders', label: 'অর্ডার ম্যানেজমেন্ট', icon: ShoppingBag, badge: orders.length },
    { id: 'coupons', label: 'কুপন ও ছাড়', icon: TicketPercent },
    { id: 'appearance', label: 'ডিজাইন ও থিম', icon: Palette },
    { id: 'banners', label: 'হোমপেইজ ব্যানার', icon: ImageIcon, badge: banners.length },
    { id: 'info', label: 'স্টোর তথ্য ও লোগো', icon: Info },
    { id: 'social', label: 'সোশ্যাল মিডিয়া ও লিঙ্ক', icon: Share2 },
    { id: 'delivery', label: 'ডেলিভারি সেটিংস', icon: Truck },
    { id: 'payments', label: 'পেমেন্ট গেটওয়ে', icon: CreditCard },
    { id: 'reports', label: 'সেলস ও রিপোর্টস', icon: BarChart3 },
    { id: 'audit', label: 'অডিট ও নিরাপত্তা লগ', icon: Shield },
    { id: 'account', label: 'অ্যাডমিন অ্যাকাউন্ট', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-200 flex flex-col lg:flex-row">
      {/* ── Mobile Top Header ───────────────────────────────────── */}
      <div className="lg:hidden bg-[#0F172A] border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 text-slate-300 hover:text-white bg-white/5 rounded-lg"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <img src={settings.logoUrl || '/logo.png'} alt="Logo" className="h-8 w-auto rounded-md" />
          <span className="font-bold text-white text-sm">Men's Outfit Admin</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-xs text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-lg flex items-center gap-1"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>লগআউট</span>
        </button>
      </div>

      {/* ── Sidebar Navigation ─────────────────────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#0F172A] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 flex flex-col h-full overflow-hidden">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 pb-6 border-b border-white/10">
            <img
              src={settings.logoUrl || '/logo.png'}
              alt="Logo"
              className="h-10 w-10 object-contain rounded-xl border border-white/10 bg-[#080C14] p-1 shadow-md"
            />
            <div>
              <h2 className="font-black text-white text-base tracking-tight leading-tight">
                {settings.storeName || "Men's Outfit"}
              </h2>
              <span className="text-[10px] font-mono text-[#C5A880] uppercase tracking-widest block font-bold">
                Admin Console
              </span>
            </div>
          </div>

          {/* Current Admin User Badge */}
          <div className="my-4 p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-slate-400 font-mono truncate">{user?.email || 'admin@mensoutfit.com'}</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {user?.role || 'OWNER'}
            </span>
          </div>

          {/* Navigation Links (Scrollable) */}
          <nav className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {sidebarLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#C5A880] to-[#B39366] text-black font-bold shadow-md shadow-[#C5A880]/10'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                        isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="pt-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>নিরাপদ লগআউট</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ───────────────────────────────────── */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8 overflow-x-hidden">
        {/* 1. DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/10 pb-6">
              <div>
                <span className="text-xs font-mono font-bold text-[#C5A880] uppercase tracking-widest block mb-1">
                  EXECUTIVE DASHBOARD
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white">ব্যবসায়িক ওভারভিউ ও সেলস</h1>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('orders')}
                  className="gap-2 text-xs border-white/10 text-white"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span>অর্ডার দেখুন</span>
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setActiveTab('products');
                    setShowAddProductModal(true);
                  }}
                  className="gap-2 text-xs font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন প্রোডাক্ট</span>
                </Button>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="p-5 rounded-2xl bg-[#0F172A] border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-medium">মোট সেলস রেভিনিউ</span>
                  <DollarSign className="w-4 h-4 text-[#C5A880]" />
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {formatPrice(orders.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0))}
                </div>
                <span className="text-[11px] text-emerald-400 font-medium">সক্রিয় ক্যাশ অন ডেলিভারি</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#0F172A] border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-medium">মোট অর্ডার</span>
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-amber-400 font-mono">{orders.length} টি</div>
                <span className="text-[11px] text-slate-400">
                  {orders.filter((o) => o.status === 'pending').length} টি অপেক্ষমাণ
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#0F172A] border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-medium">মোট লাইভ প্রোডাক্ট</span>
                  <Package className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-emerald-400 font-mono">{products.length} টি</div>
                <span className="text-[11px] text-slate-400">৪টি ক্যাটাগরিতে সচল</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#0F172A] border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-medium">কুরিয়ারে পাঠানো</span>
                  <Truck className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-black text-blue-400 font-mono">
                  {orders.filter((o) => o.status === 'shipped').length} টি
                </div>
                <span className="text-[11px] text-slate-400">Pathao / Steadfast</span>
              </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-white/10 space-y-4">
              <h3 className="font-bold text-white text-sm">কুইক অ্যাকশন (Quick Operations)</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <button
                  onClick={() => setActiveTab('info')}
                  className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all cursor-pointer"
                >
                  <ImageIcon className="w-5 h-5 text-[#C5A880] mb-2" />
                  <p className="font-bold text-white">লোগো পরিবর্তন</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">সাইটের মূল লোগো ও ছবি</p>
                </button>
                <button
                  onClick={() => setActiveTab('banners')}
                  className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all cursor-pointer"
                >
                  <Palette className="w-5 h-5 text-[#C5A880] mb-2" />
                  <p className="font-bold text-white">ব্যানার আপডেট</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">হোমপেইজের স্লাইডার</p>
                </button>
                <button
                  onClick={() => setActiveTab('delivery')}
                  className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all cursor-pointer"
                >
                  <Truck className="w-5 h-5 text-[#C5A880] mb-2" />
                  <p className="font-bold text-white">ডেলিভারি চার্জ</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">ঢাকা ও ঢাকার বাইরে ফি</p>
                </button>
                <button
                  onClick={() => setActiveTab('social')}
                  className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all cursor-pointer"
                >
                  <Share2 className="w-5 h-5 text-[#C5A880] mb-2" />
                  <p className="font-bold text-white">সোশ্যাল মিডিয়া</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">FB, Insta, WhatsApp</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. PRODUCT MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
              <div>
                <span className="text-xs font-mono font-bold text-[#C5A880] uppercase tracking-widest block mb-1">
                  CATALOG & INVENTORY
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  প্রোডাক্ট ম্যানেজমেন্ট ({products.length})
                </h1>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setEditingProduct(null);
                  setShowAddProductModal(true);
                }}
                className="gap-2 font-bold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন প্রোডাক্ট যোগ করুন</span>
              </Button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="প্রোডাক্টের নাম বা বিবরণ দিয়ে সার্চ করুন..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#0F172A] border border-white/10 rounded-xl text-xs text-white focus:ring-1 focus:ring-[#C5A880]"
                />
              </div>
              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="px-4 py-2 bg-[#0F172A] border border-white/10 rounded-xl text-xs text-white focus:ring-1 focus:ring-[#C5A880]"
              >
                <option value="all">সব ক্যাটাগরি</option>
                <option value="oversized">ওভারসাইজড টি-শার্ট</option>
                <option value="drop-shoulder">ড্রপ শোল্ডার</option>
                <option value="graphic-tees">গ্রাফিক টিজ</option>
                <option value="polo">পোলো শার্ট</option>
              </select>
            </div>

            {/* Products Table */}
            <div className="bg-[#0F172A] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto max-h-[600px]">
                <table className="w-full text-left text-xs text-slate-300 border-collapse">
                  <thead className="sticky top-0 bg-[#0A0E17] text-[#C5A880] uppercase tracking-wider text-[11px] font-mono border-b border-white/10">
                    <tr>
                      <th className="py-3.5 px-4">ছবি</th>
                      <th className="py-3.5 px-4">প্রোডাক্টের নাম</th>
                      <th className="py-3.5 px-4">ক্যাটাগরি</th>
                      <th className="py-3.5 px-4">মূল্য (Price)</th>
                      <th className="py-3.5 px-4">স্টক ও ভ্যারিয়েন্ট</th>
                      <th className="py-3.5 px-4 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-white/2 transition-colors">
                        <td className="py-3 px-4">
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="w-12 h-12 object-cover rounded-xl border border-white/10 bg-black"
                          />
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <p className="font-bold text-white truncate">{p.title}</p>
                          <p className="text-[11px] text-slate-400 truncate">{p.titleBn || p.description}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-slate-300">
                            {p.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-[#C5A880]">
                          {formatPrice(p.price)}
                          {p.compareAtPrice && (
                            <span className="line-through text-slate-500 text-[10px] ml-1.5 font-normal">
                              {formatPrice(p.compareAtPrice)}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-mono text-emerald-400 font-bold">
                            {p.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 50} টি
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.title)}
                            className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add / Edit Product Modal */}
            {showAddProductModal && (
              <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                <div className="bg-[#0F172A] border border-white/20 rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <h3 className="font-bold text-white text-base">নতুন প্রোডাক্ট যোগ করুন</h3>
                    <button
                      onClick={() => setShowAddProductModal(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                    <div>
                      <label className="text-slate-300 block mb-1 font-semibold">প্রোডাক্টের নাম (English) *</label>
                      <input
                        type="text"
                        placeholder="e.g. Acid Wash Oversized Tee"
                        value={prodTitle}
                        onChange={(e) => setProdTitle(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:ring-1 focus:ring-[#C5A880]"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 block mb-1 font-semibold">বাংলা নাম</label>
                      <input
                        type="text"
                        placeholder="যেমন: এসিড ওয়াশ ওভারসাইজড টি-শার্ট"
                        value={prodTitleBn}
                        onChange={(e) => setProdTitleBn(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:ring-1 focus:ring-[#C5A880]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-300 block mb-1 font-semibold">ক্যাটাগরি *</label>
                        <select
                          value={prodCategory}
                          onChange={(e: any) => setProdCategory(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#080C14] border border-white/10 rounded-xl text-white text-xs focus:ring-1 focus:ring-[#C5A880]"
                        >
                          <option value="Oversized">ওভারসাইজড টি-শার্ট</option>
                          <option value="Drop-Shoulder">ড্রপ শোল্ডার</option>
                          <option value="Graphic Tees">গ্রাফিক টিজ</option>
                          <option value="Polo">পোলো শার্ট</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-slate-300 block mb-1 font-semibold">মূল্য (৳) *</label>
                        <input
                          type="number"
                          value={prodPrice}
                          onChange={(e) => setProdPrice(e.target.value)}
                          required
                          className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-xs focus:ring-1 focus:ring-[#C5A880]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-300 block mb-1 font-semibold">ছবির লিঙ্ক (Image URL)</label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/... (খালি রাখলে সুন্দর ডিফল্ট ছবি বসবে)"
                        value={prodImage}
                        onChange={(e) => setProdImage(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:ring-1 focus:ring-[#C5A880]"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 block mb-1 font-semibold">বিবরণ (Description)</label>
                      <textarea
                        rows={3}
                        placeholder="ফ্যাব্রিক কোয়ালিটি, জিএসএম এবং কালার বর্ণনা..."
                        value={prodDesc}
                        onChange={(e) => setProdDesc(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:ring-1 focus:ring-[#C5A880]"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAddProductModal(false)}
                        className="border-white/10 text-white"
                      >
                        বাতিল
                      </Button>
                      <Button type="submit" variant="secondary" size="sm" className="font-bold">
                        প্রোডাক্ট সেভ করুন
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <span className="text-xs font-mono font-bold text-[#C5A880] uppercase tracking-widest block mb-1">
                PRODUCT STRUCTURE
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white">ক্যাটাগরি ম্যানেজমেন্ট</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'ওভারসাইজড টি-শার্ট (Oversized)', cat: 'oversized', count: 16, desc: '২৪০-২৬০ GSM প্রিমিয়াম হেভিওয়েট ড্রপ কাটিং' },
                { title: 'ড্রপ শোল্ডার (Drop-Shoulder)', cat: 'drop-shoulder', count: 15, desc: 'মডার্ন স্ট্রিটওয়্যার সিলুয়েট ও আলটিমেট ফিনিশ' },
                { title: 'গ্রাফিক টিজ (Graphic Tees)', cat: 'graphic-tees', count: 15, desc: 'হাই-ডেনসিটি স্ক্রিন প্রিন্ট ও ইউনিক আর্বান আর্ট' },
                { title: 'প্রিমিয়াম পোলো (Polos)', cat: 'polo', count: 15, desc: 'লাক্সারি হানি-কম্ব পিক কটন ও এলিগ্যান্ট কলার' },
              ].map((c) => (
                <div key={c.cat} className="p-6 rounded-2xl bg-[#0F172A] border border-white/10 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-white text-base">{c.title}</h3>
                    <span className="px-2.5 py-1 rounded-full bg-[#C5A880]/10 text-[#C5A880] font-mono text-xs font-bold">
                      {c.count} টি আইটেম
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{c.desc}</p>
                  <div className="pt-2">
                    <a
                      href={`/category/${c.cat}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#C5A880] hover:underline"
                    >
                      <span>গ্রাহক পেজে দেখুন</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. INVENTORY & STOCK */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <span className="text-xs font-mono font-bold text-[#C5A880] uppercase tracking-widest block mb-1">
                WAREHOUSE & LOGISTICS
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white">ইনভেন্টরি ও সাইজ স্টক</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Jet Black Drop-Shoulder Tee', size: 'M', stock: 15, sku: 'MO-OV-BLK-M' },
                { title: 'Jet Black Drop-Shoulder Tee', size: 'L', stock: 22, sku: 'MO-OV-BLK-L' },
                { title: 'Jet Black Drop-Shoulder Tee', size: 'XL', stock: 4, sku: 'MO-OV-BLK-XL', low: true },
                { title: 'Charcoal Minimalist Graphic Tee', size: 'M', stock: 12, sku: 'MO-GP-CHR-M' },
                { title: 'Chalk White Essential Solid Tee', size: 'L', stock: 3, sku: 'MO-DS-WHT-L', low: true },
                { title: 'Midnight Navy Pique Knit Polo', size: 'M', stock: 11, sku: 'MO-PL-NVY-M' },
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#0F172A] border border-white/10 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-white text-xs">{item.title}</h4>
                    {item.low && (
                      <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 text-[10px] font-bold border border-rose-500/20">
                        LOW STOCK
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 font-mono">
                    <span>সাইজ: {item.size}</span>
                    <span>SKU: {item.sku}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-white/10">
                    <span className="text-xs text-slate-300">বর্তমান স্টক:</span>
                    <span className="font-black text-white text-base font-mono">{item.stock} টি</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
              <div>
                <span className="text-xs font-mono font-bold text-[#C5A880] uppercase tracking-widest block mb-1">
                  ORDER FULFILLMENT
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  অর্ডার তালিকা ({filteredOrders.length})
                </h1>
              </div>

              {/* Status Filter */}
              <div className="flex flex-wrap gap-2 text-xs">
                {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-all cursor-pointer ${
                      orderFilter === st
                        ? 'bg-[#C5A880] text-black shadow-md'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {st === 'all' ? 'সব' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="অর্ডার নম্বর, গ্রাহকের নাম বা মোবাইল নম্বর দিয়ে সার্চ করুন..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0F172A] border border-white/10 rounded-xl text-xs text-white focus:ring-1 focus:ring-[#C5A880]"
              />
            </div>

            {/* Orders Table */}
            <div className="bg-[#0F172A] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300 border-collapse">
                  <thead className="bg-[#0A0E17] text-[#C5A880] uppercase tracking-wider text-[11px] font-mono border-b border-white/10">
                    <tr>
                      <th className="py-3 px-4">অর্ডার নং</th>
                      <th className="py-3 px-4">গ্রাহক ও মোবাইল</th>
                      <th className="py-3 px-4">ডেলিভারি ঠিকানা</th>
                      <th className="py-3 px-4">মোট বিল (COD)</th>
                      <th className="py-3 px-4">স্ট্যাটাস</th>
                      <th className="py-3 px-4 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-white/2 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-white">
                          {ord.orderNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-white">{ord.customerName}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{ord.phone}</p>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs truncate text-slate-300">
                          {ord.address}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#C5A880]">
                          {formatPrice(ord.total)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
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
                        <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                          {/* Invoice preview */}
                          <button
                            onClick={() => setSelectedOrderForInvoice(ord)}
                            className="px-2 py-1 bg-white/5 hover:bg-white/10 text-slate-300 rounded text-[11px] font-bold transition-colors cursor-pointer"
                            title="ইনভয়েস দেখুন"
                          >
                            ইনভয়েস
                          </button>
                          {ord.status === 'pending' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(ord.id, 'confirmed')}
                              className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              কনফার্ম
                            </button>
                          )}
                          {ord.status === 'confirmed' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(ord.id, 'shipped')}
                              className="px-2 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              কুরিয়ার
                            </button>
                          )}
                          {ord.status === 'shipped' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(ord.id, 'delivered')}
                              className="px-2 py-1 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 rounded text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              ডেলিভার্ড
                            </button>
                          )}
                          {ord.status !== 'cancelled' && ord.status !== 'delivered' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(ord.id, 'cancelled')}
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

            {/* Invoice Print Modal */}
            {selectedOrderForInvoice && (
              <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                <div className="bg-[#0F172A] border border-white/20 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <h3 className="font-bold text-white text-sm flex items-center gap-2">
                      <Printer className="w-4 h-4 text-[#C5A880]" />
                      <span>ক্যাশ অন ডেলিভারি ইনভয়েস রসিদ</span>
                    </h3>
                    <button
                      onClick={() => setSelectedOrderForInvoice(null)}
                      className="text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 text-xs">
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-slate-400">অর্ডার নং:</span>
                      <span className="font-mono font-bold text-[#C5A880]">{selectedOrderForInvoice.orderNumber}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-slate-400">গ্রাহকের নাম:</span>
                      <span className="font-bold text-white">{selectedOrderForInvoice.customerName}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-slate-400">মোবাইল:</span>
                      <span className="font-mono text-white">{selectedOrderForInvoice.phone}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-slate-400">ঠিকানা:</span>
                      <span className="text-white text-right max-w-xs">{selectedOrderForInvoice.address}</span>
                    </div>
                    <div className="flex justify-between font-bold text-sm pt-2 text-[#C5A880]">
                      <span>সর্বমোট প্রদেয়:</span>
                      <span className="font-mono">{formatPrice(selectedOrderForInvoice.total)}</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedOrderForInvoice(null)}
                      className="border-white/10 text-white"
                    >
                      বন্ধ করুন
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        window.print();
                      }}
                      className="gap-2 font-bold"
                    >
                      <Printer className="w-4 h-4" />
                      <span>প্রিন্ট করুন</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6. COUPONS & DISCOUNTS */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <span className="text-xs font-mono font-bold text-[#C5A880] uppercase tracking-widest block mb-1">
                MARKETING & PROMOTION
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white">কুপন ও ডিসকাউন্ট ভাউচার</h1>
            </div>

            <div className="p-6 rounded-2xl bg-[#0F172A] border border-white/10 space-y-4 max-w-xl">
              <h3 className="font-bold text-white text-sm">নতুন কুপন কোড তৈরি করুন</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">কুপন কোড (যেমন: EID200)</label>
                  <input
                    type="text"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    placeholder="MEN100"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-mono uppercase text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">ছাড়ের পরিমাণ (৳)</label>
                  <input
                    type="number"
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-xs"
                  />
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  if (!newCouponCode.trim()) return toast.error('কুপন কোড লিখুন');
                  setCoupons([...coupons, { code: newCouponCode.trim(), discount: Number(newCouponDiscount) || 100, type: 'fixed', minSpend: 1000, active: true }]);
                  setNewCouponCode('');
                  toast.success('কুপন যুক্ত হয়েছে!');
                }}
                className="font-bold"
              >
                কুপন সক্রিয় করুন
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {coupons.map((c) => (
                <div key={c.code} className="p-5 rounded-2xl bg-[#0F172A] border border-white/10 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-black text-white text-base bg-white/5 px-2 py-1 rounded-lg border border-white/10">
                      {c.code}
                    </span>
                    <span className="text-emerald-400 font-bold text-xs">৳{c.discount} ছাড়</span>
                  </div>
                  <p className="text-xs text-slate-400">সর্বনিম্ন অর্ডার: ৳{c.minSpend}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. WEBSITE APPEARANCE */}
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <span className="text-xs font-mono font-bold text-[#C5A880] uppercase tracking-widest block mb-1">
                VISUAL IDENTITY
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white">ডিজাইন ও কালার থিম</h1>
            </div>

            <div className="p-6 rounded-2xl bg-[#0F172A] border border-white/10 space-y-4 max-w-xl text-xs">
              <h3 className="font-bold text-white text-sm">Men's Outfit সিগনেচার থিম প্যালেট</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-[#080C14] border border-white/10 text-center space-y-1">
                  <div className="w-8 h-8 rounded-full bg-[#080C14] border border-white/30 mx-auto" />
                  <p className="font-bold text-white">Obsidian Black</p>
                  <p className="font-mono text-slate-400 text-[10px]">#080C14</p>
                </div>
                <div className="p-4 rounded-xl bg-[#0F172A] border border-white/10 text-center space-y-1">
                  <div className="w-8 h-8 rounded-full bg-[#0F172A] border border-white/30 mx-auto" />
                  <p className="font-bold text-white">Midnight Slate</p>
                  <p className="font-mono text-slate-400 text-[10px]">#0F172A</p>
                </div>
                <div className="p-4 rounded-xl bg-[#C5A880] text-black text-center space-y-1 font-bold">
                  <div className="w-8 h-8 rounded-full bg-[#C5A880] border border-black/30 mx-auto" />
                  <p>Champagne Gold</p>
                  <p className="font-mono text-[10px]">#C5A880</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 8. HOMEPAGE BANNERS */}
        {activeTab === 'banners' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
              <div>
                <span className="text-xs font-mono font-bold text-[#C5A880] uppercase tracking-widest block mb-1">
                  HERO CAROUSEL
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white">হোমপেইজ ব্যানার ম্যানেজমেন্ট</h1>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowAddBannerModal(true)}
                className="gap-2 font-bold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন ব্যানার যোগ করুন</span>
              </Button>
            </div>

            {/* Banner List */}
            <div className="grid grid-cols-1 gap-6">
              {banners.map((b) => (
                <div
                  key={b.id}
                  className="p-5 rounded-3xl bg-[#0F172A] border border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center shadow-xl"
                >
                  <div className="lg:col-span-5 aspect-16/9 rounded-2xl overflow-hidden border border-white/10 bg-black">
                    <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="lg:col-span-7 space-y-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          b.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-700 text-slate-400'
                        }`}
                      >
                        {b.isActive ? 'সক্রিয় (Live)' : 'নিষ্ক্রিয়'}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">ক্রম: #{b.order}</span>
                    </div>
                    <h3 className="text-lg font-black text-white">{b.title}</h3>
                    <p className="text-xs text-slate-300">{b.subtitle}</p>
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => handleToggleBanner(b.id)}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-white transition-colors cursor-pointer"
                      >
                        {b.isActive ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                      </button>
                      <button
                        onClick={() => handleDeleteBanner(b.id)}
                        className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                      >
                        মুছে ফেলুন
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Banner Modal */}
            {showAddBannerModal && (
              <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                <div className="bg-[#0F172A] border border-white/20 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3">
                    <h3 className="font-bold text-white text-base">নতুন ব্যানার যোগ করুন</h3>
                    <button onClick={() => setShowAddBannerModal(false)} className="text-slate-400 hover:text-white">✕</button>
                  </div>
                  <form onSubmit={handleCreateBanner} className="space-y-3 text-xs">
                    <div>
                      <label className="text-slate-300 block mb-1 font-semibold">ব্যানার শিরোনাম *</label>
                      <input
                        type="text"
                        value={newBannerTitle}
                        onChange={(e) => setNewBannerTitle(e.target.value)}
                        placeholder="যেমন: সামার স্ট্রিটওয়্যার ড্রপ ২০২৬"
                        required
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 block mb-1 font-semibold">সাবটাইটেল / বিবরণ</label>
                      <input
                        type="text"
                        value={newBannerSubtitle}
                        onChange={(e) => setNewBannerSubtitle(e.target.value)}
                        placeholder="প্রিমিয়াম কম্বড সুতির ওভারসাইজড কালেকশন"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 block mb-1 font-semibold">ছবির লিঙ্ক (Image URL) *</label>
                      <input
                        type="url"
                        value={newBannerImage}
                        onChange={(e) => setNewBannerImage(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        required
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <Button variant="outline" size="sm" onClick={() => setShowAddBannerModal(false)} className="border-white/10 text-white">বাতিল</Button>
                      <Button type="submit" variant="secondary" size="sm" className="font-bold">ব্যানার সেভ করুন</Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 9. STORE INFO & LOGO */}
        {activeTab === 'info' && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <span className="text-xs font-mono font-bold text-[#C5A880] uppercase tracking-widest block mb-1">
                BRAND CONFIGURATION
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white">স্টোর তথ্য ও লোগো ম্যানেজমেন্ট</h1>
            </div>

            <div className="p-6 rounded-3xl bg-[#0F172A] border border-white/10 max-w-2xl space-y-5 text-xs">
              {/* Logo Preview & Update */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                <img
                  src={settings.logoUrl || '/logo.png'}
                  alt="Store Logo"
                  className="h-16 w-16 object-contain rounded-xl bg-black/40 border border-white/10 p-1"
                />
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm">সাইটের বর্তমান লোগো</h4>
                  <p className="text-[11px] text-slate-400">হেডার, ফুটার এবং ব্রাউজার ট্যাবে এটি প্রদর্শিত হয়।</p>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">লোগোর ইমেজ পাথ বা লিঙ্ক (Logo URL)</label>
                <input
                  type="text"
                  value={settings.logoUrl}
                  onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-xs focus:ring-1 focus:ring-[#C5A880]"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">স্টোরের নাম (Store Name)</label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:ring-1 focus:ring-[#C5A880]"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">ব্র্যান্ড বর্ণনা (Brand Bio)</label>
                <textarea
                  rows={2}
                  value={settings.brandDescription}
                  onChange={(e) => setSettings({ ...settings, brandDescription: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs focus:ring-1 focus:ring-[#C5A880]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">কাস্টমার কেয়ার ফোন</label>
                  <input
                    type="text"
                    value={settings.storePhone}
                    onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">সাপোর্ট ইমেইল</label>
                  <input
                    type="email"
                    value={settings.storeEmail}
                    onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">শোরুম / অফিস ঠিকানা</label>
                <input
                  type="text"
                  value={settings.storeAddress}
                  onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                />
              </div>

              <Button
                variant="secondary"
                size="md"
                onClick={() => updateAndSaveSettings(settings)}
                className="w-full font-bold gap-2 cursor-pointer mt-2"
              >
                <Save className="w-4 h-4" />
                <span>তথ্য সেভ করুন</span>
              </Button>
            </div>
          </div>
        )}

        {/* 10. SOCIAL MEDIA & USEFUL LINKS */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <span className="text-xs font-mono font-bold text-[#C5A880] uppercase tracking-widest block mb-1">
                ONLINE PRESENCE
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white">সোশ্যাল মিডিয়া ও হেল্পলাইন লিঙ্ক</h1>
            </div>

            <div className="p-6 rounded-3xl bg-[#0F172A] border border-white/10 max-w-xl space-y-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">ফেসবুক পেজ লিঙ্ক (Facebook URL)</label>
                <input
                  type="url"
                  value={settings.socialLinks?.facebook || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialLinks: { ...settings.socialLinks, facebook: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">ইনস্টাগ্রাম লিঙ্ক (Instagram URL)</label>
                <input
                  type="url"
                  value={settings.socialLinks?.instagram || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialLinks: { ...settings.socialLinks, instagram: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">হোয়াটসঅ্যাপ নম্বর / লিঙ্ক (WhatsApp)</label>
                <input
                  type="text"
                  value={settings.socialLinks?.whatsapp || ''}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialLinks: { ...settings.socialLinks, whatsapp: e.target.value },
                    })
                  }
                  placeholder="+8801700000000"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-mono"
                />
              </div>

              <Button
                variant="secondary"
                size="md"
                onClick={() => updateAndSaveSettings(settings)}
                className="w-full font-bold gap-2 cursor-pointer mt-2"
              >
                <Save className="w-4 h-4" />
                <span>সোশ্যাল লিঙ্ক সেভ করুন</span>
              </Button>
            </div>
          </div>
        )}

        {/* 11. DELIVERY SETTINGS */}
        {activeTab === 'delivery' && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <span className="text-xs font-mono font-bold text-[#C5A880] uppercase tracking-widest block mb-1">
                SHIPPING & CHARGES
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white">বাংলাদেশ ডেলিভারি রুলস ও চার্জ</h1>
            </div>

            <div className="p-6 rounded-3xl bg-[#0F172A] border border-white/10 max-w-xl space-y-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">ঢাকা সিটির ভিতরে ডেলিভারি চার্জ (৳)</label>
                <input
                  type="number"
                  value={settings.deliveryDhaka}
                  onChange={(e) => setSettings({ ...settings, deliveryDhaka: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-sm"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">ঢাকার বাইরে ডেলিভারি চার্জ (৳)</label>
                <input
                  type="number"
                  value={settings.deliveryOutsideDhaka}
                  onChange={(e) => setSettings({ ...settings, deliveryOutsideDhaka: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-sm"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">ফ্রি ডেলিভারি থ্রেশহোল্ড (৳)</label>
                <input
                  type="number"
                  value={settings.freeDeliveryThreshold}
                  onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-sm"
                />
                <span className="text-slate-500 text-[11px] mt-1 block">এই পরিমাণের বেশি অর্ডারে শিপিং ফি স্বয়ংক্রিয়ভাবে শূন্য হবে।</span>
              </div>

              <Button
                variant="secondary"
                size="md"
                onClick={() => updateAndSaveSettings(settings)}
                className="w-full font-bold gap-2 cursor-pointer mt-2"
              >
                <Save className="w-4 h-4" />
                <span>ডেলিভারি চার্জ সেভ করুন</span>
              </Button>
            </div>
          </div>
        )}

        {/* 12. PAYMENT SETTINGS */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <span className="text-xs font-mono font-bold text-[#C5A880] uppercase tracking-widest block mb-1">
                GATEWAYS & CHECKOUT
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white">পেমেন্ট গেটওয়ে কনফিগারেশন</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#0F172A] border border-white/10 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-white text-sm">ক্যাশ অন ডেলিভারি (COD)</h4>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">
                    সক্রিয়
                  </span>
                </div>
                <p className="text-xs text-slate-400">গ্রাহক পার্সেল গ্রহণ করে ডেলিভারিম্যানকে টাকা পরিশোধ করবেন।</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0F172A] border border-white/10 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-white text-sm">অনলাইন গেটওয়ে (SSLCOMMERZ / aamarPay)</h4>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-bold text-[10px]">
                    সার্ভার কনফিগারেশন
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  সার্ভার environment variable-এ স্টোর ক্রেডেনশিয়াল দিলে কার্ড ও মোবাইল ব্যাংকিং স্বয়ংক্রিয়ভাবে চালু হবে।
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 13. REPORTS & SALES */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <span className="text-xs font-mono font-bold text-[#C5A880] uppercase tracking-widest block mb-1">
                ANALYTICS & METRICS
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white">সেলস অ্যানালিটিক্স ও রিপোর্টস</h1>
            </div>

            <div className="p-6 rounded-3xl bg-[#0F172A] border border-white/10 space-y-4 max-w-xl text-xs">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">মোট বিক্রির পরিমাণ:</span>
                <span className="font-mono font-bold text-white text-sm">
                  {formatPrice(orders.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0))}
                </span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-slate-400">গড় অর্ডার ভ্যালু (AOV):</span>
                <span className="font-mono font-bold text-[#C5A880] text-sm">
                  {orders.length ? formatPrice(Math.round(orders.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0) / orders.length)) : '৳০'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">মোট প্লেসড অর্ডার:</span>
                <span className="font-mono font-bold text-white">{orders.length} টি</span>
              </div>
            </div>
          </div>
        )}

        {/* 14. AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <span className="text-xs font-mono font-bold text-[#C5A880] uppercase tracking-widest block mb-1">
                SECURITY LOGS
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white">অ্যাডমিন অ্যাকশন অডিট ট্রেইল</h1>
            </div>

            <div className="bg-[#0F172A] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300 border-collapse">
                  <thead className="bg-[#0A0E17] text-[#C5A880] uppercase tracking-wider text-[11px] font-mono border-b border-white/10">
                    <tr>
                      <th className="py-3 px-4">অ্যাডমিন</th>
                      <th className="py-3 px-4">অ্যাকশন</th>
                      <th className="py-3 px-4">রিসোর্স</th>
                      <th className="py-3 px-4">বিবরণ</th>
                      <th className="py-3 px-4">সময়</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans">
                    {auditLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="py-3 px-4 font-mono">{log.adminEmail}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400">{log.resource}</td>
                        <td className="py-3 px-4 text-slate-300">{log.details}</td>
                        <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{log.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 15. ADMIN ACCOUNT & PASSWORD */}
        {activeTab === 'account' && (
          <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
              <span className="text-xs font-mono font-bold text-[#C5A880] uppercase tracking-widest block mb-1">
                CREDENTIALS & SECURITY
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white">অ্যাডমিন অ্যাকাউন্ট ও পাসওয়ার্ড</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Card */}
              <div className="p-6 rounded-3xl bg-[#0F172A] border border-white/10 space-y-4 text-xs">
                <h3 className="font-bold text-white text-sm">বর্তমান অ্যাডমিন প্রোফাইল</h3>
                <div className="space-y-2 font-mono">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-slate-400">নাম:</span>
                    <span className="font-bold text-white">{user?.name || 'Administrator'}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-slate-400">ইমেইল:</span>
                    <span className="text-white">{user?.email || 'admin@mensoutfit.com'}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-slate-400">রোল (Role):</span>
                    <span className="text-emerald-400 uppercase font-bold">{user?.role || 'OWNER'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">নিরাপত্তা স্ট্যাটাস:</span>
                    <span className="text-teal-400 font-bold">256-Bit Encrypted</span>
                  </div>
                </div>
              </div>

              {/* Change Password Card */}
              <div className="p-6 rounded-3xl bg-[#0F172A] border border-white/10 space-y-4 text-xs">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#C5A880]" />
                  <span>পাসওয়ার্ড পরিবর্তন করুন</span>
                </h3>

                <form onSubmit={handlePasswordSubmit} className="space-y-3">
                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">বর্তমান পাসওয়ার্ড *</label>
                    <input
                      type="password"
                      value={currentPass}
                      onChange={(e) => setCurrentPass(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">নতুন পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর) *</label>
                    <input
                      type="password"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      placeholder="কমপক্ষে ৮ অক্ষরের শক্তিশালী পাসওয়ার্ড"
                      required
                      minLength={8}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">নতুন পাসওয়ার্ড নিশ্চিত করুন *</label>
                    <input
                      type="password"
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      placeholder="পুনরায় নতুন পাসওয়ার্ড দিন"
                      required
                      minLength={8}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-xs"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="secondary"
                    size="sm"
                    disabled={isChangingPass}
                    className="w-full font-bold cursor-pointer mt-2"
                  >
                    <span>{isChangingPass ? 'আপডেট হচ্ছে...' : 'পাসওয়ার্ড পরিবর্তন করুন'}</span>
                  </Button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
