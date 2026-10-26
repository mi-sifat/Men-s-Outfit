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
import { getNavCategories } from '../../data/categoryStore';
import type { CategoryItem } from '../../data/categoryStore';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  cartCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ cartCount = 0 }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settings, setSettings] = useState<StoreSettingsData>(() => getLocalStoreSettings());
  const [navCategories, setNavCategories] = useState<CategoryItem[]>(() => getNavCategories());
  const { theme, toggleTheme, language, toggleLanguage } = useTheme();

  const isBn = language === 'bn';

  useEffect(() => {
    const handleUpdate = () => setSettings(getLocalStoreSettings());
    const handleNav = () => setNavCategories(getNavCategories());
    window.addEventListener('store_settings_updated', handleUpdate);
    window.addEventListener('categories_updated', handleNav);
    return () => {
      window.removeEventListener('store_settings_updated', handleUpdate);
      window.removeEventListener('categories_updated', handleNav);
    };
  }, []);

  const navigation = [
    { name: isBn ? 'হোম' : 'Home', href: '/' },
    { name: isBn ? 'শপ' : 'Shop', href: '/shop' },
    { name: isBn ? 'আমাদের সম্পর্কে' : 'About Us', href: '/about' },
    { name: isBn ? 'যোগাযোগ' : 'Contact', href: '/contact' },
    { name: isBn ? 'হট সেল %' : 'Hot Deals %', href: '/sale', highlight: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#15547F] text-white shadow-md transition-colors duration-200">
      {/* Top Notification Announcement */}
      <div className="bg-[#0e3b5a] text-slate-200 text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-3 border-b border-white/10">
        <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
          <Truck className="w-3.5 h-3.5" />
          <span>{isBn ? 'সারাদেশে দ্রুত ক্যাশ অন ডেলিভারি (COD)' : 'Cash on Delivery Across All Bangladesh'}</span>
        </span>
        <span className="hidden sm:inline text-white/30">•</span>
        <span className="hidden sm:flex items-center gap-1.5 text-slate-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isBn ? 'প্রিমিয়াম হেভিওয়েট কম্বড কটন' : '100% Combed Heavy Cotton'}</span>
        </span>
        <span className="hidden md:inline text-white/30">•</span>
        <a 
          href={`tel:${(settings.storePhone || '01700000000').replace(/[^0-9+]/g, '')}`} 
          className="hidden md:flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors"
        >
          <PhoneCall className="w-3 h-3 text-amber-300" />
          <span>{isBn ? 'হটলাইন:' : 'Hotline:'} {settings.storePhone || '01700-000000'}</span>
        </a>
      </div>

      {/* Main Nav Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 relative">
          {/* Mobile hamburger (Left) */}
          <div className="flex items-center lg:hidden z-10">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 text-white hover:text-amber-300 cursor-pointer transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo (Centered on mobile via absolute centering, normal left on desktop) */}
          <div className="flex items-center max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2 z-10">
            <Link to="/" className="flex items-center group py-1">
              <img
                src={settings.logoUrl || '/logo.png'}
                alt={settings.storeName || "Men's Outfit"}
                className="h-10 sm:h-12 lg:h-14 w-auto max-w-[170px] sm:max-w-[210px] lg:max-w-[240px] object-contain transition-transform group-hover:scale-102"
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
                    ? 'text-amber-300 hover:text-amber-200 font-extrabold'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                {item.name}
                {item.highlight && (
                  <span className="absolute -top-1 -right-2.5 w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                )}
              </Link>
            ))}
          </nav>

          {/* Action Icons: Language, Dark/Light, Search, Cart */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 z-10">
            {/* Language Switcher (Hidden on mobile) */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="hidden sm:flex px-2.5 py-1.5 rounded-lg border border-white/20 text-xs font-bold text-white hover:bg-white/10 transition-all items-center gap-1 cursor-pointer"
              title={isBn ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
            >
              <Globe className="w-3.5 h-3.5 text-amber-300" />
              <span>{isBn ? 'EN' : 'বাংলা'}</span>
            </button>

            {/* Dark / Light Mode Switcher (Hidden on mobile) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="hidden sm:flex p-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition-all cursor-pointer"
              title={theme === 'dark' ? 'Light Mode (লাইট মোড)' : 'Dark Mode (ডার্ক মোড)'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-white" />
              )}
            </button>

            {/* Search Button (Hidden on mobile header per user request) */}
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden sm:flex p-2 text-white hover:text-amber-300 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Cart Button */}
            <Link to="/cart">
              <button className="relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-white hover:bg-slate-100 text-[#15547F] font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer">
                <ShoppingBag className="w-4 h-4 text-[#15547F]" />
                <span className="hidden sm:inline">{isBn ? 'কার্ট' : 'Cart'}</span>
                {cartCount > 0 && (
                  <span className="bg-[#15547F] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
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
        <div className="border-t border-white/10 bg-[#0e3b5a] p-4 transition-all">
          <div className="max-w-3xl mx-auto relative flex items-center">
            <Search className="w-5 h-5 absolute left-3.5 text-slate-300" />
            <input
              type="text"
              placeholder={isBn ? 'পছন্দের টি-শার্ট, পোলো বা কালেকশন খুঁজুন...' : 'Search for oversized t-shirts, drop shoulder, polos...'}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-300 focus:border-transparent"
              autoFocus
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="ml-3 text-xs font-semibold text-slate-200 hover:text-white px-3 py-2 bg-white/10 rounded-lg cursor-pointer"
            >
              {isBn ? 'বন্ধ করুন' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#15547F] px-4 pt-3 pb-6 shadow-2xl">
          {/* Mobile Search Bar inside Drawer */}
          <div className="mb-4 pt-2">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3 text-white/60" />
              <input
                type="text"
                placeholder={isBn ? 'টি-শার্ট খুঁজুন...' : 'Search clothing...'}
                className="w-full pl-9 pr-3 py-2 bg-black/20 border border-white/20 rounded-lg text-xs text-white placeholder-white/60 focus:outline-hidden focus:ring-1 focus:ring-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between py-3 px-3 rounded-lg text-sm font-semibold ${
                  item.highlight
                    ? 'text-amber-300 bg-black/20'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <span>{item.name}</span>
                <ChevronRight className="w-4 h-4 text-white/50" />
              </Link>
            ))}
          </div>

          {/* Language & Theme toggles inside Mobile Menu */}
          <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/20 text-xs font-bold text-white cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-amber-300" />
              <span>{isBn ? 'Language: বাংলা' : 'Language: English'}</span>
            </button>

            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/20 text-xs font-bold text-white cursor-pointer"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-300" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-white" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
