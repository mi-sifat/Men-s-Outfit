import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  PhoneCall, 
  Truck, 
  ShieldCheck,
  Sun,
  Moon,
  Globe,
  ChevronRight
} from 'lucide-react';
import { getLocalStoreSettings } from '../../data/settingsStore';
import type { StoreSettingsData } from '../../data/settingsStore';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  cartCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ cartCount = 0 }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settings, setSettings] = useState<StoreSettingsData>(() => getLocalStoreSettings());
  const { theme, toggleTheme, language, toggleLanguage } = useTheme();

  const isBn = language === 'bn';

  useEffect(() => {
    const handleUpdate = () => setSettings(getLocalStoreSettings());
    window.addEventListener('store_settings_updated', handleUpdate);
    return () => window.removeEventListener('store_settings_updated', handleUpdate);
  }, []);

  const navigation = [
    { name: isBn ? 'সব কালেকশন' : 'All Shop', href: '/shop' },
    { name: isBn ? 'ওভারসাইজড' : 'Oversized', href: '/category/oversized' },
    { name: isBn ? 'ড্রপ শোল্ডার' : 'Drop Shoulder', href: '/category/drop-shoulder' },
    { name: isBn ? 'গ্রাফিক আর্ট' : 'Graphic Tees', href: '/category/graphic-tees' },
    { name: isBn ? 'পোলো শার্ট' : 'Polos', href: '/category/polo' },
    { name: isBn ? 'হট সেল %' : 'Hot Deals %', href: '/sale', highlight: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#080C14]/95 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 transition-colors duration-200">
      {/* Top Notification Announcement */}
      <div className="bg-slate-900 dark:bg-black text-slate-200 text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-3 border-b border-slate-800 dark:border-white/10">
        <span className="flex items-center gap-1.5 text-amber-300 dark:text-[#C5A880] font-semibold">
          <Truck className="w-3.5 h-3.5" />
          <span>{isBn ? 'সারাদেশে দ্রুত ক্যাশ অন ডেলিভারি (COD)' : 'Cash on Delivery Across All Bangladesh'}</span>
        </span>
        <span className="hidden sm:inline text-white/30">•</span>
        <span className="hidden sm:flex items-center gap-1.5 text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isBn ? 'প্রিমিয়াম হেভিওয়েট কম্বড কটন' : '100% Combed Heavy Cotton'}</span>
        </span>
        <span className="hidden md:inline text-white/30">•</span>
        <a 
          href={`tel:${(settings.storePhone || '01700000000').replace(/[^0-9+]/g, '')}`} 
          className="hidden md:flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
        >
          <PhoneCall className="w-3 h-3 text-amber-300 dark:text-[#C5A880]" />
          <span>{isBn ? 'হটলাইন:' : 'Hotline:'} {settings.storePhone || '01700-000000'}</span>
        </a>
      </div>

      {/* Main Nav Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile hamburger */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 text-slate-800 dark:text-slate-200 hover:text-black dark:hover:text-white cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <img
                src={settings.logoUrl || '/logo.png'}
                alt={settings.storeName || "Men's Outfit"}
                className="h-11 sm:h-12 w-auto object-contain transition-opacity group-hover:opacity-90 rounded-md"
              />
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-7">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-bold transition-all duration-150 py-1 relative tracking-wide ${
                  item.highlight
                    ? 'text-rose-600 dark:text-rose-400 font-extrabold'
                    : 'text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-[#C5A880]'
                }`}
              >
                {item.name}
                {item.highlight && (
                  <span className="absolute -top-1 -right-2.5 w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                )}
              </Link>
            ))}
          </nav>

          {/* Action Icons: Language, Dark/Light Toggle, Search, Admin, Cart */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Language Switcher */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-all flex items-center gap-1 cursor-pointer"
              title={isBn ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
            >
              <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-[#C5A880]" />
              <span>{isBn ? 'EN' : 'বাংলা'}</span>
            </button>

            {/* Dark / Light Mode Switcher */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer"
              title={theme === 'dark' ? 'Light Mode (লাইট মোড)' : 'Dark Mode (ডার্ক মোড)'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Search Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-all cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Cart Button */}
            <Link to="/cart">
              <button className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-[#C5A880] dark:hover:bg-[#B39366] text-white dark:text-black font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer">
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">{isBn ? 'কার্ট' : 'Cart'}</span>
                {cartCount > 0 && (
                  <span className="bg-black text-white dark:bg-black dark:text-[#C5A880] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Expandable Search Input */}
      {searchOpen && (
        <div className="border-t border-white/5 bg-[#0B0F19] p-4 transition-all">
          <div className="max-w-3xl mx-auto relative flex items-center">
            <Search className="w-5 h-5 absolute left-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="পছন্দের টি-শার্ট, পোলো বা কালেকশন খুঁজুন..."
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#C5A880] focus:border-transparent"
              autoFocus
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="ml-3 text-xs font-semibold text-slate-400 hover:text-white px-3 py-2 bg-white/5 rounded-lg"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/5 bg-[#080C14] px-4 pt-3 pb-6 shadow-2xl">
          <div className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between py-3 px-3 rounded-lg text-sm font-medium ${
                  item.highlight
                    ? 'text-rose-400 bg-rose-500/10'
                    : 'text-slate-200 hover:bg-white/5'
                }`}
              >
                <span>{item.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
