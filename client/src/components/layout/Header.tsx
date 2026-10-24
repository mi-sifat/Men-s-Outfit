import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  User, 
  PhoneCall, 
  Truck, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Button } from '../ui/Button';
import { getLocalStoreSettings } from '../../data/settingsStore';
import type { StoreSettingsData } from '../../data/settingsStore';

interface HeaderProps {
  cartCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ cartCount = 0 }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settings, setSettings] = useState<StoreSettingsData>(() => getLocalStoreSettings());

  useEffect(() => {
    const handleUpdate = () => setSettings(getLocalStoreSettings());
    window.addEventListener('store_settings_updated', handleUpdate);
    return () => window.removeEventListener('store_settings_updated', handleUpdate);
  }, []);

  const navigation = [
    { name: 'সব কালেকশন', href: '/shop' },
    { name: 'ড্রপ শোল্ডার', href: '/category/drop-shoulder' },
    { name: 'ওভারসাইজড টিজ', href: '/category/oversized' },
    { name: 'গ্রাফিক আর্ট', href: '/category/graphic-tees' },
    { name: 'সিগনেচার পোলো', href: '/category/polo' },
    { name: 'হট ড্রপ %', href: '/sale', highlight: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#080C14]/90 backdrop-blur-xl border-b border-white/5 transition-all">
      {/* Top Notification Announcement */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#0B0F19] to-[#0F172A] text-slate-300 text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-3 border-b border-white/5">
        <span className="flex items-center gap-1.5 text-[#C5A880] font-semibold">
          <Truck className="w-3.5 h-3.5" />
          <span>সারাদেশে দ্রুত ক্যাশ অন ডেলিভারি (COD)</span>
        </span>
        <span className="hidden sm:inline text-white/20">•</span>
        <span className="hidden sm:flex items-center gap-1.5 text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>প্রিমিয়াম হেভিওয়েট সুতি ফেব্রিক</span>
        </span>
        <span className="hidden md:inline text-white/20">•</span>
        <span className="hidden md:flex items-center gap-1 text-slate-400">
          <PhoneCall className="w-3 h-3 text-[#C5A880]" />
          <span>হটলাইন: 01700-000000</span>
        </span>
      </div>

      {/* Main Nav Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile hamburger */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 text-slate-300 hover:text-white"
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
                className="h-12 w-auto object-contain transition-opacity group-hover:opacity-90 rounded-md"
              />
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-all duration-200 py-1 relative tracking-wide ${
                  item.highlight
                    ? 'text-rose-400 hover:text-rose-300 font-semibold'
                    : 'text-slate-300 hover:text-[#C5A880]'
                }`}
              >
                {item.name}
                {item.highlight && (
                  <span className="absolute -top-1 -right-2.5 w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                )}
              </Link>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#C5A880]/15 border border-white/10 hover:border-[#C5A880]/40 text-[#C5A880] text-xs font-bold transition-all"
              title="অ্যাডমিন প্যানেল (Admin Panel)"
            >
              <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
              <span className="hidden md:inline">অ্যাডমিন</span>
            </Link>

            <Link to="/cart">
              <button className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#B39366] text-black font-bold text-sm shadow-lg shadow-[#C5A880]/10 hover:shadow-[#C5A880]/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer">
                <ShoppingBag className="w-4 h-4 text-black" />
                <span className="hidden sm:inline">কার্ট</span>
                {cartCount > 0 && (
                  <span className="bg-black text-[#C5A880] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-[#C5A880]/40">
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

          <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-2">
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 py-2.5 px-3 text-sm font-semibold text-[#C5A880] bg-[#C5A880]/10 border border-[#C5A880]/20 rounded-lg"
            >
              <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
              <span>অ্যাডমিন ড্যাশবোর্ড (Admin)</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
