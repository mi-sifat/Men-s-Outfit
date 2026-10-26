import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  DollarSign,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  Store,
  Calendar,
  Check,
  ChevronDown,
  Sliders
} from 'lucide-react';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { toast } from 'react-hot-toast';
import { getAllProducts, saveProduct, deleteProduct } from '../data/productStore';
import { getLocalStoreSettings, saveLocalStoreSettings } from '../data/settingsStore';
import type { StoreSettingsData, BannerItem } from '../data/settingsStore';
import type { Product } from '../types';
import { CategoryManager } from '../components/admin/CategoryManager';
import { HomepageSectionManager } from '../components/admin/HomepageSectionManager';
import { BannerManager } from '../components/admin/BannerManager';

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
    | 'banners'
    | 'sections'
    | 'appearance'
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
  const [stockM, setStockM] = useState('20');
  const [stockL, setStockL] = useState('25');
  const [stockXL, setStockXL] = useState('15');

  // Orders State
  const [orders, setOrders] = useState<any[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('mens_outfit_orders') || '[]');
      const defaultOrders = [
        {
          id: 'ord-1',
          orderNumber: 'MO-2026-00001',
          customerName: 'Tanvir Ahmed',
          phone: '01712345678',
          address: 'House 42, Road 27, Dhanmondi, Dhaka',
          total: 1770,
          status: 'pending',
          paymentMethod: 'COD',
          itemsCount: 2,
          createdAt: 'Today, 02:15 PM',
        },
        {
          id: 'ord-2',
          orderNumber: 'MO-2026-00002',
          customerName: 'Rakibul Hasan',
          phone: '01898765432',
          address: 'GEC Circle, Nasirabad, Chattogram',
          total: 980,
          status: 'confirmed',
          paymentMethod: 'COD',
          itemsCount: 1,
          createdAt: 'Yesterday, 08:45 PM',
        },
        {
          id: 'ord-3',
          orderNumber: 'MO-2026-00003',
          customerName: 'Arif Chowdhury',
          phone: '01911223344',
          address: 'Sector 7, Uttara, Dhaka',
          total: 2450,
          status: 'shipped',
          paymentMethod: 'COD',
          itemsCount: 3,
          createdAt: '23 Oct, 11:00 AM',
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
  const [newBannerButton, setNewBannerButton] = useState('Shop Collection');
  const [newBannerLink, setNewBannerLink] = useState('/shop');
  const [newBannerImage, setNewBannerImage] = useState('');

  // Coupons State
  const [coupons, setCoupons] = useState([
    { code: 'MEN100', discount: 100, type: 'fixed', minSpend: 1500, active: true },
    { code: 'OUTFIT50', discount: 50, type: 'fixed', minSpend: 800, active: true },
    { code: 'WELCOME10', discount: 10, type: 'percent', minSpend: 1000, active: true },
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
      details: 'Administrator logged in successfully via 256-bit SSL',
      time: 'Today, 01:15 AM',
      ip: '103.145.24.12',
    },
    {
      id: 'log-2',
      adminEmail: user?.email || 'admin@mensoutfit.com',
      action: 'SETTINGS_UPDATE',
      resource: 'STORE_SETTINGS',
      details: 'Updated delivery rates & branding configuration',
      time: 'Yesterday, 11:40 PM',
      ip: '103.145.24.12',
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

    toast.success('Settings saved successfully!');
  };

  // Add / Edit Product
  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProdTitle(p.title);
    setProdTitleBn(p.titleBn || p.title);
    setProdCategory(p.category as any);
    setProdPrice(p.price.toString());
    setProdComparePrice(p.compareAtPrice?.toString() || (p.price + 200).toString());
    setProdImage(p.images[0] || '');
    setProdDesc(p.description || '');
    const mVar = p.variants.find((v) => v.size === 'M');
    const lVar = p.variants.find((v) => v.size === 'L');
    const xlVar = p.variants.find((v) => v.size === 'XL');
    setStockM(mVar?.stock.toString() || '20');
    setStockL(lVar?.stock.toString() || '25');
    setStockXL(xlVar?.stock.toString() || '15');
    setShowAddProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle.trim()) {
      toast.error('Please enter product title');
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
      description: prodDesc.trim() || "Men's Outfit 100% premium combed cotton apparel. Durable stitching and comfortable tailored fit.",
      price: priceNum,
      compareAtPrice: compareNum,
      category: prodCategory,
      images: [image],
      variants: [
        { id: `${id}-m`, size: 'M', color: 'Jet Black', colorCode: '#111111', sku: `MO-${prodCategory.slice(0, 2).toUpperCase()}-M`, stock: Number(stockM) || 20 },
        { id: `${id}-l`, size: 'L', color: 'Jet Black', colorCode: '#111111', sku: `MO-${prodCategory.slice(0, 2).toUpperCase()}-L`, stock: Number(stockL) || 25 },
        { id: `${id}-xl`, size: 'XL', color: 'Jet Black', colorCode: '#111111', sku: `MO-${prodCategory.slice(0, 2).toUpperCase()}-XL`, stock: Number(stockXL) || 15 },
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
    toast.success(`Product "${newProd.title}" saved successfully!`);
  };

  const handleDeleteProduct = (productId: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteProduct(productId);
      setProducts(getAllProducts());
      toast.success(`"${title}" deleted successfully!`);
    }
  };

  // Quick Stock Increment
  const handleQuickStockIncrement = (productId: string, size: string, delta: number) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    const updatedVariants = prod.variants.map((v) => {
      if (v.size === size) {
        return { ...v, stock: Math.max(0, v.stock + delta) };
      }
      return v;
    });
    const updatedProd = { ...prod, variants: updatedVariants };
    saveProduct(updatedProd);
    setProducts(getAllProducts());
    toast.success(`Updated stock for ${prod.title} (${size})`);
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
    toast.success(`Order status updated to '${newStatus}'`);
  };

  // Add Banner
  const handleCreateBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerTitle.trim() || !newBannerImage.trim()) {
      toast.error('Banner title and image URL are required');
      return;
    }

    const newBanner: BannerItem = {
      id: `banner-${Date.now()}`,
      title: newBannerTitle.trim(),
      subtitle: newBannerSubtitle.trim(),
      buttonText: newBannerButton.trim() || 'Shop Collection',
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
    if (confirm('Delete this banner?')) {
      const updated = banners.filter((b) => b.id !== id);
      setBanners(updated);
      updateAndSaveSettings({ ...settings, banners: updated });
    }
  };

  // Change Password
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      toast.error('New password and confirmation do not match.');
      return;
    }
    if (newPass.length < 8) {
      toast.error('Password must be at least 8 characters long.');
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
    if (confirm('Are you sure you want to sign out of the Admin Console?')) {
      await logout();
      toast.success('Signed out successfully.');
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

  // Calculations for dashboard
  const totalRevenue = orders.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const lowStockItems = products.filter((p) => p.variants.some((v) => v.stock <= 5));

  // Sidebar Group Structure
  const sidebarGroups = [
    {
      group: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      group: 'STORE MANAGEMENT',
      items: [
        { id: 'products', label: 'Products', icon: Package, badge: products.length },
        { id: 'categories', label: 'Categories', icon: Layers, badge: 4 },
        { id: 'inventory', label: 'Inventory', icon: Boxes },
        { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: orders.length },
        { id: 'coupons', label: 'Coupons / Discounts', icon: TicketPercent, badge: coupons.length },
      ],
    },
    {
      group: 'WEBSITE MANAGEMENT',
      items: [
        { id: 'banners', label: 'Homepage Banners', icon: ImageIcon, badge: banners.length },
        { id: 'sections', label: 'Homepage Sections', icon: Sliders },
        { id: 'appearance', label: 'Appearance & Themes', icon: Palette },
        { id: 'info', label: 'Website Information', icon: Info },
        { id: 'social', label: 'Social Links', icon: Share2 },
        { id: 'delivery', label: 'Delivery Settings', icon: Truck },
        { id: 'payments', label: 'Payment Settings', icon: CreditCard },
      ],
    },
    {
      group: 'BUSINESS',
      items: [
        { id: 'reports', label: 'Sales / Reports', icon: BarChart3 },
      ],
    },
    {
      group: 'SYSTEM',
      items: [
        { id: 'account', label: 'Admin Account', icon: UserCheck },
        { id: 'audit', label: 'Audit Logs', icon: Shield },
      ],
    },
  ];

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Executive Dashboard';
      case 'products': return 'Product Catalog';
      case 'categories': return 'Categories';
      case 'inventory': return 'Inventory & Stock Level';
      case 'orders': return 'Customer Orders';
      case 'coupons': return 'Promotional Coupons';
      case 'banners': return 'Homepage Hero Banners';
      case 'sections': return 'Homepage Section Manager';
      case 'appearance': return 'Branding & Aesthetics';
      case 'info': return 'Store Info & Logo';
      case 'social': return 'Social Media Links';
      case 'delivery': return 'Delivery Rates';
      case 'payments': return 'Payment Gateways';
      case 'reports': return 'Sales & Performance Reports';
      case 'audit': return 'Security & Audit Trails';
      case 'account': return 'Admin Security & Password';
      default: return 'Admin Console';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col lg:flex-row antialiased">
      {/* ── Mobile Top Header ───────────────────────────────────────── */}
      <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <img src={settings.logoUrl || '/logo.png'} alt="Logo" className="h-7 w-auto rounded bg-white p-0.5" />
          <span className="font-bold text-white text-sm">Men's Outfit Admin</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            target="_blank"
            className="text-xs text-slate-300 hover:text-white bg-slate-800 px-2.5 py-1.5 rounded-lg flex items-center gap-1"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Store</span>
          </Link>
          <button
            onClick={handleLogout}
            className="text-xs text-rose-300 bg-rose-500/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Left Sidebar (Dark Charcoal SaaS Style) ────────────────── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#111827] border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 flex flex-col h-full overflow-hidden">
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-2 py-3 border-b border-slate-800/80 mb-3">
            <img
              src={settings.logoUrl || '/logo.png'}
              alt="Logo"
              className="h-9 w-9 object-contain rounded-lg bg-white p-1 shadow-sm shrink-0"
            />
            <div className="truncate">
              <h2 className="font-bold text-white text-sm tracking-tight truncate leading-tight">
                {settings.storeName || "Men's Outfit"}
              </h2>
              <span className="text-[10px] font-medium text-[#C5A880] uppercase tracking-wider block font-mono">
                Admin Console
              </span>
            </div>
          </div>

          {/* Navigation Items (Grouped) */}
          <nav className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
            {sidebarGroups.map((grp) => (
              <div key={grp.group} className="space-y-1">
                <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {grp.group}
                </span>
                {grp.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as any);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-slate-800 text-white font-semibold shadow-xs border-l-3 border-[#C5A880]'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#C5A880]' : 'text-slate-400'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                            isActive ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* User Profile & Sign Out Footer */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <div className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center justify-between">
              <div className="truncate mr-2">
                <p className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] text-slate-400 truncate font-mono">{user?.email || 'admin@mensoutfit.com'}</p>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {user?.role || 'OWNER'}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Area Container ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar Header */}
        <header className="bg-white border-b border-slate-200/80 px-6 py-3.5 sticky top-0 z-20 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Admin</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <h1 className="text-sm font-bold text-slate-900 tracking-tight">
              {getBreadcrumbTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* View Storefront Link */}
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>View Storefront</span>
            </Link>

            {/* Currency Pill */}
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono font-medium text-slate-600 bg-slate-100 rounded-md border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              BDT (৳)
            </span>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* 1. DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Metric Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                    <span>Total Sales Revenue</span>
                    <DollarSign className="w-4 h-4 text-[#C5A880]" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
                    {formatPrice(totalRevenue)}
                  </div>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-600" />
                    <span>Real sales data from orders</span>
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                    <span>Total Orders</span>
                    <ShoppingBag className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
                    {orders.length}
                  </div>
                  <p className="text-[11px] text-amber-600 font-medium">
                    {pendingOrdersCount} orders pending fulfillment
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                    <span>Active Products</span>
                    <Package className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
                    {products.length}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Across 4 fashion categories
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                    <span>Low Stock Alerts</span>
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 tracking-tight font-mono">
                    {lowStockItems.length}
                  </div>
                  <p className="text-[11px] text-rose-600 font-medium">
                    Requires inventory replenishment
                  </p>
                </div>
              </div>

              {/* Quick Operations Bar */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setShowAddProductModal(true);
                      setActiveTab('products');
                    }}
                    className="p-3.5 rounded-lg border border-slate-200 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-100 text-left transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-slate-900 mb-1.5" />
                    <p className="font-semibold text-slate-900">Add New Product</p>
                    <p className="text-[11px] text-slate-500">Add apparel item to catalog</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('orders')}
                    className="p-3.5 rounded-lg border border-slate-200 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-100 text-left transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-slate-900 mb-1.5" />
                    <p className="font-semibold text-slate-900">Process Orders</p>
                    <p className="text-[11px] text-slate-500">Manage fulfillment & delivery</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('banners')}
                    className="p-3.5 rounded-lg border border-slate-200 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-100 text-left transition-all cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4 text-slate-900 mb-1.5" />
                    <p className="font-semibold text-slate-900">Update Banners</p>
                    <p className="text-[11px] text-slate-500">Hero banners & promos</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('delivery')}
                    className="p-3.5 rounded-lg border border-slate-200 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-100 text-left transition-all cursor-pointer"
                  >
                    <Truck className="w-4 h-4 text-slate-900 mb-1.5" />
                    <p className="font-semibold text-slate-900">Delivery Settings</p>
                    <p className="text-[11px] text-slate-500">Configure Dhaka/Outside rates</p>
                  </button>
                </div>
              </div>

              {/* 2-Column Dashboard Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders Table (2 cols) */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
                  <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Recent Customer Orders</h3>
                      <p className="text-xs text-slate-500">Latest activity on Men's Outfit</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab('orders')}
                      className="text-xs"
                    >
                      View All Orders
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200/60 uppercase text-[10px]">
                        <tr>
                          <th className="py-2.5 px-4">Order ID</th>
                          <th className="py-2.5 px-4">Customer</th>
                          <th className="py-2.5 px-4">Total</th>
                          <th className="py-2.5 px-4">Status</th>
                          <th className="py-2.5 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {orders.slice(0, 5).map((o) => (
                          <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                              {o.orderNumber}
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-semibold text-slate-800">{o.customerName}</p>
                              <p className="text-[11px] text-slate-400 font-mono">{o.phone}</p>
                            </td>
                            <td className="py-3 px-4 font-mono font-medium text-slate-900">
                              {formatPrice(o.total)}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                                  o.status === 'delivered'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : o.status === 'shipped'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : o.status === 'confirmed'
                                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                    : o.status === 'cancelled'
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                }`}
                              >
                                {o.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => setSelectedOrderForInvoice(o)}
                                className="text-slate-600 hover:text-slate-900 font-semibold inline-flex items-center gap-1 cursor-pointer"
                              >
                                <span>Invoice</span>
                                <Printer className="w-3 h-3" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Low Stock Watchlist (1 col) */}
                <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Low Stock Watchlist</h3>
                      <p className="text-xs text-slate-500">Items with stock &le; 15</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab('inventory')}
                      className="text-xs"
                    >
                      Manage Stock
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {products.slice(0, 4).map((p) => {
                      const totalStock = p.variants.reduce((a, b) => a + b.stock, 0);
                      return (
                        <div key={p.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200/60">
                          <div className="flex items-center gap-2.5 truncate mr-2">
                            <img
                              src={p.images[0]}
                              alt={p.title}
                              className="w-10 h-10 object-cover rounded-md border border-slate-200 shrink-0"
                            />
                            <div className="truncate">
                              <p className="text-xs font-semibold text-slate-900 truncate">{p.title}</p>
                              <p className="text-[10px] text-slate-500">{p.category}</p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-bold font-mono text-slate-900 block">
                              {totalStock} pcs
                            </span>
                            <button
                              onClick={() => handleQuickStockIncrement(p.id, 'M', 10)}
                              className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                            >
                              +10 Restock
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. PRODUCT MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Products Catalog ({products.length})</h2>
                  <p className="text-xs text-slate-500">Manage apparel listings, pricing, variants, and stock</p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setEditingProduct(null);
                    setProdTitle('');
                    setProdTitleBn('');
                    setProdImage('');
                    setProdDesc('');
                    setShowAddProductModal(true);
                  }}
                  className="gap-2 bg-slate-900 hover:bg-black text-white cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </Button>
              </div>

              {/* Filter bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search by product title or description..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg text-xs px-3 py-2 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                >
                  <option value="all">All Categories</option>
                  <option value="oversized">Oversized</option>
                  <option value="drop-shoulder">Drop-Shoulder</option>
                  <option value="graphic tees">Graphic Tees</option>
                  <option value="polo">Polo</option>
                </select>
              </div>

              {/* Product Table */}
              <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Product</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Price (BDT)</th>
                        <th className="py-3 px-4">Total Stock</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredProducts.map((p) => {
                        const totalStock = p.variants.reduce((a, b) => a + b.stock, 0);
                        return (
                          <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.images[0]}
                                  alt={p.title}
                                  className="w-11 h-11 object-cover rounded-md border border-slate-200 shrink-0"
                                />
                                <div className="truncate max-w-xs">
                                  <p className="font-semibold text-slate-900 truncate">{p.title}</p>
                                  <p className="text-[11px] text-slate-400 font-mono">ID: {p.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 font-medium border border-slate-200">
                                {p.category}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono font-medium">
                              <span className="text-slate-900 font-bold">{formatPrice(p.price)}</span>
                              {p.compareAtPrice && p.compareAtPrice > p.price && (
                                <span className="text-slate-400 line-through text-[11px] ml-1.5">
                                  {formatPrice(p.compareAtPrice)}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                                  totalStock > 10
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : totalStock > 0
                                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}
                              >
                                {totalStock} in stock
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Active
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Link
                                  to={`/product/${p.slug}`}
                                  target="_blank"
                                  className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded"
                                  title="View on Storefront"
                                >
                                  <Eye className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() => handleOpenEditProduct(p)}
                                  className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded cursor-pointer"
                                  title="Edit Product"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id, p.title)}
                                  className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded cursor-pointer"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2.1. CATEGORIES MANAGEMENT */}
          {activeTab === 'categories' && <CategoryManager />}

          {/* 3. INVENTORY */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
                <h2 className="text-lg font-bold text-slate-900">Inventory & Stock Controller</h2>
                <p className="text-xs text-slate-500">Real-time variant quantity adjustment with instant persistence</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-4">Size M</th>
                      <th className="py-3 px-4">Size L</th>
                      <th className="py-3 px-4">Size XL</th>
                      <th className="py-3 px-4">Total Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((p) => {
                      const mVar = p.variants.find((v) => v.size === 'M');
                      const lVar = p.variants.find((v) => v.size === 'L');
                      const xlVar = p.variants.find((v) => v.size === 'XL');
                      const totalStock = p.variants.reduce((a, b) => a + b.stock, 0);

                      return (
                        <tr key={p.id} className="hover:bg-slate-50/60">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <img src={p.images[0]} alt="" className="w-9 h-9 object-cover rounded border border-slate-200" />
                              <span className="font-semibold text-slate-900">{p.title}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleQuickStockIncrement(p.id, 'M', -1)}
                                className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                              >
                                -
                              </button>
                              <span className="font-mono font-bold w-6 text-center">{mVar?.stock || 0}</span>
                              <button
                                onClick={() => handleQuickStockIncrement(p.id, 'M', 1)}
                                className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleQuickStockIncrement(p.id, 'L', -1)}
                                className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                              >
                                -
                              </button>
                              <span className="font-mono font-bold w-6 text-center">{lVar?.stock || 0}</span>
                              <button
                                onClick={() => handleQuickStockIncrement(p.id, 'L', 1)}
                                className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleQuickStockIncrement(p.id, 'XL', -1)}
                                className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                              >
                                -
                              </button>
                              <span className="font-mono font-bold w-6 text-center">{xlVar?.stock || 0}</span>
                              <button
                                onClick={() => handleQuickStockIncrement(p.id, 'XL', 1)}
                                className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">
                            {totalStock} units
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Orders Management ({orders.length})</h2>
                  <p className="text-xs text-slate-500">Track shipments, verify payments, and issue printable invoices</p>
                </div>
              </div>

              {/* Status Tabs and Search */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                        orderFilter === st
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by order number, customer name or phone..."
                    className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Order List Table */}
              <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Order #</th>
                        <th className="py-3 px-4">Customer Details</th>
                        <th className="py-3 px-4">Delivery Address</th>
                        <th className="py-3 px-4">Total Amount</th>
                        <th className="py-3 px-4">Fulfillment Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredOrders.map((o) => (
                        <tr key={o.id} className="hover:bg-slate-50/80">
                          <td className="py-3 px-4 font-mono font-semibold text-slate-900">
                            {o.orderNumber}
                            <span className="block text-[10px] text-slate-400 font-sans font-normal mt-0.5">
                              {o.createdAt}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <p className="font-semibold text-slate-900">{o.customerName}</p>
                            <p className="text-[11px] text-slate-500 font-mono">{o.phone}</p>
                          </td>
                          <td className="py-3 px-4 max-w-xs truncate text-slate-600">
                            {o.address}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-900">
                            {formatPrice(o.total)}
                            <span className="block text-[10px] font-normal text-slate-500 font-sans uppercase">
                              {o.paymentMethod || 'COD'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={o.status}
                              onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                              className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-semibold capitalize text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900 cursor-pointer"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrderForInvoice(o)}
                              className="gap-1 text-xs"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Invoice</span>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 5. HOMEPAGE BANNERS */}
          {activeTab === 'banners' && <BannerManager />}

          {/* 5.1. HOMEPAGE SECTIONS */}
          {activeTab === 'sections' && <HomepageSectionManager />}

          {/* 6. WEBSITE INFO & BRANDING */}
          {(activeTab === 'info' || activeTab === 'appearance') && (
            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Store Branding & Business Info</h2>
                <p className="text-xs text-slate-500">Update logo, store name, customer support contact info, and footer</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Store Name
                  </label>
                  <input
                    type="text"
                    value={settings.storeName}
                    onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Logo Image URL
                  </label>
                  <input
                    type="text"
                    value={settings.logoUrl}
                    onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                    placeholder="/logo.png or https://..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>

                <div className="md:col-span-2 flex items-center gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <img
                    src={settings.logoUrl || '/logo.png'}
                    alt="Logo Preview"
                    className="h-12 w-auto object-contain bg-white p-1 rounded-md border border-slate-300"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Live Logo Preview</span>
                    <span className="text-[11px] text-slate-500">This logo is displayed in the storefront navigation bar and invoices.</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Support Hotline / Phone
                  </label>
                  <input
                    type="text"
                    value={settings.storePhone}
                    onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Support Email
                  </label>
                  <input
                    type="email"
                    value={settings.storeEmail}
                    onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Store Physical Address
                  </label>
                  <input
                    type="text"
                    value={settings.storeAddress}
                    onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Brand Description
                  </label>
                  <textarea
                    rows={3}
                    value={settings.brandDescription}
                    onChange={(e) => setSettings({ ...settings, brandDescription: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => updateAndSaveSettings(settings)}
                  className="gap-2 bg-slate-900 text-white hover:bg-black cursor-pointer font-semibold"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Branding & Info</span>
                </Button>
              </div>
            </div>
          )}

          {/* 7. SOCIAL MEDIA LINKS */}
          {activeTab === 'social' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Social Media & Communication Links</h2>
                <p className="text-xs text-slate-500">Configure external verified links with safe rel="noopener noreferrer" protection</p>
              </div>

              <div className="space-y-4 max-w-2xl">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Facebook Page URL</label>
                  <input
                    type="url"
                    value={settings.socialLinks?.facebook || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      socialLinks: { ...settings.socialLinks, facebook: e.target.value }
                    })}
                    placeholder="https://facebook.com/mensoutfit"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Instagram Profile URL</label>
                  <input
                    type="url"
                    value={settings.socialLinks?.instagram || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      socialLinks: { ...settings.socialLinks, instagram: e.target.value }
                    })}
                    placeholder="https://instagram.com/mensoutfit"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">WhatsApp Chat Link</label>
                  <input
                    type="url"
                    value={settings.socialLinks?.whatsapp || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      socialLinks: { ...settings.socialLinks, whatsapp: e.target.value }
                    })}
                    placeholder="https://wa.me/8801XXXXXXXXX"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => updateAndSaveSettings(settings)}
                  className="gap-2 bg-slate-900 text-white hover:bg-black cursor-pointer font-semibold"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Social Links</span>
                </Button>
              </div>
            </div>
          )}

          {/* 8. DELIVERY SETTINGS */}
          {activeTab === 'delivery' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Delivery & Shipping Fees</h2>
                <p className="text-xs text-slate-500">Configure checkout delivery charges and free shipping threshold</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Inside Dhaka Fee (BDT)</label>
                  <input
                    type="number"
                    value={settings.deliveryDhaka || 60}
                    onChange={(e) => setSettings({
                      ...settings,
                      deliveryDhaka: Number(e.target.value) || 0
                    })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Outside Dhaka Fee (BDT)</label>
                  <input
                    type="number"
                    value={settings.deliveryOutsideDhaka || 120}
                    onChange={(e) => setSettings({
                      ...settings,
                      deliveryOutsideDhaka: Number(e.target.value) || 0
                    })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Free Delivery Threshold (BDT)</label>
                  <input
                    type="number"
                    value={settings.freeDeliveryThreshold || 2000}
                    onChange={(e) => setSettings({
                      ...settings,
                      freeDeliveryThreshold: Number(e.target.value) || 0
                    })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => updateAndSaveSettings(settings)}
                  className="gap-2 bg-slate-900 text-white hover:bg-black cursor-pointer font-semibold"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Delivery Rates</span>
                </Button>
              </div>
            </div>
          )}

          {/* 9. PAYMENT SETTINGS */}
          {activeTab === 'payments' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Payment Gateways & Options</h2>
                <p className="text-xs text-slate-500">Configure Cash on Delivery and Mobile Financial Services</p>
              </div>

              <div className="space-y-4 max-w-xl">
                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Cash on Delivery (COD)</h4>
                    <p className="text-[11px] text-slate-500">Customer pays upon receiving package.</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    ACTIVE
                  </span>
                </div>

                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">bKash Merchant / Personal</h4>
                    <p className="text-[11px] text-slate-500">Manual verification via TrxID.</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    SUPPORTED
                  </span>
                </div>

                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Nagad Merchant</h4>
                    <p className="text-[11px] text-slate-500">Manual verification via TrxID.</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    SUPPORTED
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 10. SALES REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
                <h2 className="text-lg font-bold text-slate-900">Sales & Business Analytics</h2>
                <p className="text-xs text-slate-500">Real-time revenue metrics derived from actual orders</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-medium text-slate-500">Gross Sales</span>
                  <p className="text-2xl font-bold font-mono text-slate-900 mt-1">{formatPrice(totalRevenue)}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-medium text-slate-500">Average Order Value</span>
                  <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
                    {formatPrice(orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0)}
                  </p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-xs font-medium text-slate-500">Completed Deliveries</span>
                  <p className="text-2xl font-bold font-mono text-emerald-600 mt-1">
                    {orders.filter((o) => o.status === 'delivered').length} orders
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 11. AUDIT LOGS */}
          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
                <h2 className="text-lg font-bold text-slate-900">Security Audit Logs</h2>
                <p className="text-xs text-slate-500">Chronological record of privileged administrator actions</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Administrator</th>
                      <th className="py-3 px-4">Resource</th>
                      <th className="py-3 px-4">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-4 text-slate-500">{log.time}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-800 font-bold border border-slate-200">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-800 font-sans">{log.adminEmail}</td>
                        <td className="py-3 px-4 text-slate-600">{log.resource}</td>
                        <td className="py-3 px-4 font-sans text-slate-600">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 12. ADMIN ACCOUNT */}
          {activeTab === 'account' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs space-y-6 max-w-xl">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Administrator Credentials</h2>
                <p className="text-xs text-slate-500">Update master password and review active account permissions</p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                <p className="text-xs font-semibold text-slate-900">Active Profile: {user?.name}</p>
                <p className="text-xs text-slate-500 font-mono">Email: {user?.email}</p>
                <p className="text-[11px] text-emerald-600 font-bold uppercase mt-1">Role: {user?.role || 'OWNER'}</p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Current Password *</label>
                  <input
                    type="password"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    required
                    placeholder="Enter existing password"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">New Password (Min. 8 characters) *</label>
                  <input
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    required
                    minLength={8}
                    placeholder="Enter new strong password"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Confirm New Password *</label>
                  <input
                    type="password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    required
                    minLength={8}
                    placeholder="Re-type new password"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-slate-900"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isChangingPass}
                  className="w-full font-semibold bg-slate-900 text-white hover:bg-black cursor-pointer"
                >
                  {isChangingPass ? 'Updating Password...' : 'Update Password Securely'}
                </Button>
              </form>
            </div>
          )}

          {/* 13. CATEGORIES */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
                <h2 className="text-lg font-bold text-slate-900">Categories Management</h2>
                <p className="text-xs text-slate-500">Active storefront apparel categories</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {['Oversized', 'Drop-Shoulder', 'Graphic Tees', 'Polo'].map((cat) => {
                  const count = products.filter((p) => p.category.toLowerCase() === cat.toLowerCase()).length;
                  return (
                    <div key={cat} className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-2">
                      <span className="text-xs font-bold text-slate-900">{cat}</span>
                      <p className="text-2xl font-bold font-mono text-slate-900">{count} products</p>
                      <Link
                        to={`/category/${cat.toLowerCase().replace(/\s+/g, '-')}`}
                        target="_blank"
                        className="text-xs text-[#C5A880] font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        <span>View category live</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 14. COUPONS */}
          {activeTab === 'coupons' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Coupons & Discount Codes</h2>
                  <p className="text-xs text-slate-500">Create promotional vouchers applicable at checkout</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Coupon Code</th>
                      <th className="py-3 px-4">Discount</th>
                      <th className="py-3 px-4">Min. Spend</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {coupons.map((c) => (
                      <tr key={c.code} className="hover:bg-slate-50/60 font-mono">
                        <td className="py-3 px-4 font-bold text-slate-900">{c.code}</td>
                        <td className="py-3 px-4 text-emerald-600 font-semibold">
                          {c.type === 'fixed' ? `৳${c.discount} OFF` : `${c.discount}% OFF`}
                        </td>
                        <td className="py-3 px-4">৳{c.minSpend}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-sans font-semibold">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── Add / Edit Product Modal ───────────────────────────────── */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Product Title (English) *</label>
                  <input
                    type="text"
                    value={prodTitle}
                    onChange={(e) => setProdTitle(e.target.value)}
                    required
                    placeholder="e.g. Heavyweight Minimal Tee"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  >
                    <option value="Oversized">Oversized</option>
                    <option value="Drop-Shoulder">Drop-Shoulder</option>
                    <option value="Graphic Tees">Graphic Tees</option>
                    <option value="Polo">Polo</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Sale Price (BDT) *</label>
                  <input
                    type="number"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Compare-At Price (BDT)</label>
                  <input
                    type="number"
                    value={prodComparePrice}
                    onChange={(e) => setProdComparePrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Image URL</label>
                  <input
                    type="text"
                    value={prodImage}
                    onChange={(e) => setProdImage(e.target.value)}
                    placeholder="https://images.unsplash.com/... or CDN link"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                  {prodImage && (
                    <div className="mt-2 flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-200">
                      <img src={prodImage} alt="Preview" className="w-12 h-12 object-cover rounded" />
                      <span className="text-[11px] text-slate-500">Live Image Preview</span>
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Stock Quantities (Sizes)</label>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Size M</span>
                      <input
                        type="number"
                        value={stockM}
                        onChange={(e) => setStockM(e.target.value)}
                        className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Size L</span>
                      <input
                        type="number"
                        value={stockL}
                        onChange={(e) => setStockL(e.target.value)}
                        className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Size XL</span>
                      <input
                        type="number"
                        value={stockXL}
                        onChange={(e) => setStockXL(e.target.value)}
                        className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    placeholder="Enter detailed fabric and fitting information..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddProductModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="bg-slate-900 text-white hover:bg-black"
                >
                  Save Product
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Add Banner Modal ───────────────────────────────────────── */}
      {showAddBannerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Add Hero Banner</h3>
              <button
                onClick={() => setShowAddBannerModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBanner} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Banner Headline *</label>
                <input
                  type="text"
                  value={newBannerTitle}
                  onChange={(e) => setNewBannerTitle(e.target.value)}
                  required
                  placeholder="e.g. Summer Drop 2026"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Subtitle</label>
                <input
                  type="text"
                  value={newBannerSubtitle}
                  onChange={(e) => setNewBannerSubtitle(e.target.value)}
                  placeholder="e.g. Premium streetwear essentials"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Image URL *</label>
                <input
                  type="text"
                  value={newBannerImage}
                  onChange={(e) => setNewBannerImage(e.target.value)}
                  required
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Button Text</label>
                <input
                  type="text"
                  value={newBannerButton}
                  onChange={(e) => setNewBannerButton(e.target.value)}
                  placeholder="Shop Collection"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Destination URL</label>
                <input
                  type="text"
                  value={newBannerLink}
                  onChange={(e) => setNewBannerLink(e.target.value)}
                  placeholder="/shop or /category/oversized"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddBannerModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="bg-slate-900 text-white hover:bg-black"
                >
                  Create Banner
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Printable Invoice Modal ─────────────────────────────────── */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <img src={settings.logoUrl || '/logo.png'} alt="" className="h-8 w-auto" />
                <span className="font-bold text-sm text-slate-900">Men's Outfit Invoice</span>
              </div>
              <button
                onClick={() => setSelectedOrderForInvoice(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-3">
                <div>
                  <p className="text-slate-500">Order ID:</p>
                  <p className="font-mono font-bold text-slate-900">{selectedOrderForInvoice.orderNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-500">Date:</p>
                  <p className="font-medium text-slate-900">{selectedOrderForInvoice.createdAt}</p>
                </div>
              </div>

              <div>
                <p className="text-slate-500 font-semibold mb-1">Customer & Delivery Details:</p>
                <p className="font-bold text-slate-900">{selectedOrderForInvoice.customerName}</p>
                <p className="font-mono text-slate-600">{selectedOrderForInvoice.phone}</p>
                <p className="text-slate-600 mt-0.5">{selectedOrderForInvoice.address}</p>
              </div>

              <div className="border-t border-b border-slate-100 py-3 space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({selectedOrderForInvoice.itemsCount || 1} items)</span>
                  <span className="font-mono">{formatPrice(selectedOrderForInvoice.total - 60)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Standard Delivery Fee</span>
                  <span className="font-mono">৳60</span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold pt-2 border-t border-slate-100 text-sm">
                  <span>Total Payable ({selectedOrderForInvoice.paymentMethod || 'COD'})</span>
                  <span className="font-mono">{formatPrice(selectedOrderForInvoice.total)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedOrderForInvoice(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  window.print();
                }}
                className="gap-1.5 bg-slate-900 text-white hover:bg-black"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
