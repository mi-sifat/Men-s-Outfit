import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  CreditCard,
  Share2
} from 'lucide-react';
import { getLocalStoreSettings } from '../../data/settingsStore';
import type { StoreSettingsData } from '../../data/settingsStore';

export const Footer: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettingsData>(() => getLocalStoreSettings());

  useEffect(() => {
    const handleUpdate = () => setSettings(getLocalStoreSettings());
    window.addEventListener('store_settings_updated', handleUpdate);
    return () => window.removeEventListener('store_settings_updated', handleUpdate);
  }, []);

  return (
    <footer className="bg-[#0B0F19] text-slate-300 border-t border-slate-800">
      {/* Brand Value Propositions Bar */}
      <div className="border-b border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#C5A880]/10 border border-[#C5A880]/20 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-[#C5A880]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">ক্যাশ অন ডেলিভারি</h4>
                <p className="text-xs text-slate-400 mt-0.5">পণ্য হাতে পেয়ে মূল্য পরিশোধ</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#C5A880]/10 border border-[#C5A880]/20 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5 text-[#C5A880]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">৭ দিনের সহজ রিটার্ন</h4>
                <p className="text-xs text-slate-400 mt-0.5">সাইজ পরিবর্তন বা ত্রুটি পেলে</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#C5A880]/10 border border-[#C5A880]/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#C5A880]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">১০০% কোয়ালিটি গ্যারান্টি</h4>
                <p className="text-xs text-slate-400 mt-0.5">কম্বড কটন ও প্রিমিয়াম প্রিন্ট</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#C5A880]/10 border border-[#C5A880]/20 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5 text-[#C5A880]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">নিরাপদ পেমেন্ট</h4>
                <p className="text-xs text-slate-400 mt-0.5">বিকাশ, নগদ বা কার্ডে পে করুন</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Bio */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img
                src={settings.logoUrl || '/logo.png'}
                alt={settings.storeName || "Men's Outfit"}
                className="h-10 w-auto object-contain rounded-md"
              />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-6">
              {settings.brandDescription || 'বাংলাদেশের আধুনিক তরুণদের জন্য প্রিমিয়াম কোয়ালিটির ওভারসাইজড, ড্রপ-শোল্ডার টি-শার্ট ও স্ট্রিটওয়্যার ফ্যাশন ব্র্যান্ড।'}
            </p>
            <div className="flex items-center gap-3">
              {settings.socialLinks?.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-[#C5A880] hover:text-black flex items-center justify-center transition-colors text-xs font-bold"
                  aria-label="Facebook"
                >
                  FB
                </a>
              )}
              {settings.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-[#C5A880] hover:text-black flex items-center justify-center transition-colors text-xs font-bold"
                  aria-label="Instagram"
                >
                  IG
                </a>
              )}
              {settings.socialLinks?.whatsapp && (
                <a
                  href={`https://wa.me/${settings.socialLinks.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors text-xs font-bold"
                  aria-label="WhatsApp"
                >
                  WA
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#C5A880] pl-2">
              কালেকশনসমূহ
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/category/oversized" className="hover:text-[#C5A880] transition-colors">ওভারসাইজড টি-শার্ট</Link></li>
              <li><Link to="/category/drop-shoulder" className="hover:text-[#C5A880] transition-colors">ড্রপ-শোল্ডার টিজ</Link></li>
              <li><Link to="/category/graphic-tees" className="hover:text-[#C5A880] transition-colors">গ্রাফিক ও প্রিন্টেড টি-শার্ট</Link></li>
              <li><Link to="/category/polo" className="hover:text-[#C5A880] transition-colors">ক্লাসিক পোলো শার্ট</Link></li>
              <li><Link to="/new-arrivals" className="hover:text-[#C5A880] transition-colors">নতুন আগমন (New Arrivals)</Link></li>
              <li><Link to="/sale" className="text-rose-400 hover:text-rose-300 transition-colors">ডিসকাউন্ট অফার</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#C5A880] pl-2">
              গ্রাহক সেবা
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/order-tracking" className="hover:text-[#C5A880] transition-colors">অর্ডার ট্র্যাকিং (Track Order)</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-[#C5A880] transition-colors">ডেলিভারি পলিসি</Link></li>
              <li><Link to="/return-policy" className="hover:text-[#C5A880] transition-colors">রিটার্ন ও এক্সচেঞ্জ নীতি</Link></li>
              <li><Link to="/faq" className="hover:text-[#C5A880] transition-colors">সাধারণ জিজ্ঞাসা (FAQ)</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-[#C5A880] pl-2">
              হেড অফিস ও শোরুম
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                <span>{settings.storeAddress || 'ধানমন্ডি, ঢাকা - ১২০৫, বাংলাদেশ'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C5A880] shrink-0" />
                <span>{settings.storePhone || '+880 1700-000000'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C5A880] shrink-0" />
                <span>{settings.storeEmail || 'support@mensoutfit.com'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & policies */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>{settings.copyrightText || `© ${new Date().getFullYear()} Men's Outfit. সর্বস্বত্ব সংরক্ষিত।`}</p>
          <div className="flex items-center gap-6">
            <Link to="/shipping-policy" className="hover:text-slate-300 transition-colors">শিপিং পলিসি</Link>
            <Link to="/return-policy" className="hover:text-slate-300 transition-colors">রিটার্ন পলিসি</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
