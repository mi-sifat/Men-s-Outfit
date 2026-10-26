import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  CreditCard
} from 'lucide-react';
import { getLocalStoreSettings } from '../../data/settingsStore';
import type { StoreSettingsData } from '../../data/settingsStore';
import { useTheme } from '../../context/ThemeContext';

const FacebookIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97v7.54c.03 2.53-1.01 5.09-2.91 6.77-2.31 2.06-5.71 2.68-8.56 1.57-2.94-1.12-5.06-3.8-5.38-6.94-.46-4.04 2.37-7.85 6.42-8.58.74-.14 1.5-.18 2.25-.13v4.13c-.63-.07-1.28-.03-1.9.13-1.49.38-2.65 1.63-2.85 3.16-.27 2.08 1.25 3.97 3.32 4.15 1.95.17 3.73-1.12 4.09-3.03.07-.38.09-.78.09-1.17V.02z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
);

export const Footer: React.FC = () => {
  const [settings, setSettings] = useState<StoreSettingsData>(() => getLocalStoreSettings());
  const { language } = useTheme();
  const isBn = language === 'bn';

  useEffect(() => {
    const handleUpdate = () => setSettings(getLocalStoreSettings());
    window.addEventListener('store_settings_updated', handleUpdate);
    return () => window.removeEventListener('store_settings_updated', handleUpdate);
  }, []);

  const fbLink = settings.socialLinks?.facebook || 'https://facebook.com';
  const igLink = settings.socialLinks?.instagram || 'https://instagram.com';
  const ytLink = settings.socialLinks?.youtube || 'https://youtube.com';
  const ttLink = settings.socialLinks?.tiktok || 'https://tiktok.com';
  const rawWa = settings.socialLinks?.whatsapp || settings.storePhone || '01700000000';
  const waLink = `https://wa.me/${rawWa.replace(/[^0-9]/g, '')}`;

  return (
    <footer className="bg-[#15547F] text-slate-100 border-t border-white/10">
      {/* Brand Value Propositions Bar */}
      <div className="border-b border-white/10 bg-[#0e3b5a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  {isBn ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isBn ? 'পণ্য হাতে পেয়ে মূল্য পরিশোধ' : 'Pay when you receive the parcel'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  {isBn ? '৭ দিনের সহজ এক্সচেঞ্জ' : '7 Days Easy Exchange'}
                </h4>
                <p className="text-xs text-slate-200 mt-0.5">
                  {isBn ? 'সাইজ পরিবর্তন বা ত্রুটি পেলে' : 'Hassle-free size replacement'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  {isBn ? '১০০% কোয়ালিটি গ্যারান্টি' : '100% Quality Guarantee'}
                </h4>
                <p className="text-xs text-slate-200 mt-0.5">
                  {isBn ? 'কম্বড কটন ও প্রিমিয়াম প্রিন্ট' : 'Combed heavy cotton fabrics'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  {isBn ? 'নিরাপদ পেমেন্ট' : 'Secure Checkout'}
                </h4>
                <p className="text-xs text-slate-200 mt-0.5">
                  {isBn ? 'ক্যাশ অথবা অনলাইন ট্রানজেকশন' : 'Cash on delivery & secure payments'}
                </p>
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
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <img
                src={settings.logoUrl || '/logo.png'}
                alt={settings.storeName || "Men's Outfit"}
                className="h-11 sm:h-12 w-auto max-w-[200px] object-contain"
              />
            </Link>
            <p className="text-sm text-slate-200 leading-relaxed max-w-sm mb-6">
              {isBn 
                ? (settings.brandDescription || 'বাংলাদেশের আধুনিক তরুণদের জন্য প্রিমিয়াম কোয়ালিটির ওভারসাইজড, ড্রপ-শোল্ডার টি-শার্ট ও স্ট্রিটওয়্যার ফ্যাশন ব্র্যান্ড।')
                : "Premium oversized, drop-shoulder, and urban streetwear clothing engineered with heavyweight combed cotton for youth across Bangladesh."}
            </p>

            {/* Social Media SVG Icons */}
            <div className="flex items-center gap-2.5">
              <a
                href={fbLink}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-[#1877F2] text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-xs"
                aria-label="Facebook"
                title="Follow us on Facebook"
              >
                <FacebookIcon />
              </a>

              <a
                href={igLink}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-[#E4405F] text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-xs"
                aria-label="Instagram"
                title="Follow us on Instagram"
              >
                <InstagramIcon />
              </a>

              <a
                href={ytLink}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-[#FF0000] text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-xs"
                aria-label="YouTube"
                title="Subscribe on YouTube"
              >
                <YouTubeIcon />
              </a>

              <a
                href={ttLink}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-black hover:border hover:border-slate-600 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-xs"
                aria-label="TikTok"
                title="Watch on TikTok"
              >
                <TikTokIcon />
              </a>

              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-[#25D366] text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-xs"
                aria-label="WhatsApp"
                title="Chat with us on WhatsApp"
              >
                <WhatsAppIcon />
              </a>
            </div>
          </div>

          {/* Quick Links / Collections */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-300 pl-2">
              {isBn ? 'কালেকশনসমূহ' : 'Collections'}
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-100">
              <li><Link to="/shop" className="hover:text-amber-300 transition-colors">{isBn ? 'সব পণ্য (All Shop)' : 'All Products'}</Link></li>
              <li><Link to="/category/oversized" className="hover:text-amber-300 transition-colors">{isBn ? 'ওভারসাইজড টি-শার্ট' : 'Oversized Tees'}</Link></li>
              <li><Link to="/category/drop-shoulder" className="hover:text-amber-300 transition-colors">{isBn ? 'ড্রপ-শোল্ডার টিজ' : 'Drop Shoulder'}</Link></li>
              <li><Link to="/category/graphic-tees" className="hover:text-amber-300 transition-colors">{isBn ? 'গ্রাফিক টি-শার্ট' : 'Graphic Art Tees'}</Link></li>
              <li><Link to="/category/polo" className="hover:text-amber-300 transition-colors">{isBn ? 'পোলো শার্ট' : 'Polo Shirts'}</Link></li>
              <li><Link to="/sale" className="text-amber-300 hover:underline transition-colors font-semibold">{isBn ? 'হট অফার %' : 'Hot Deals %'}</Link></li>
            </ul>
          </div>

          {/* Company & Customer Care */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-300 pl-2">
              {isBn ? 'গ্রাহক সেবা ও প্রতিষ্ঠান' : 'Customer & About'}
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-100">
              <li><Link to="/about" className="hover:text-amber-300 transition-colors">{isBn ? 'আমাদের সম্পর্কে' : 'About Us'}</Link></li>
              <li><Link to="/contact" className="hover:text-amber-300 transition-colors">{isBn ? 'যোগাযোগ' : 'Contact Us'}</Link></li>
              <li><Link to="/order-tracking" className="hover:text-amber-300 transition-colors">{isBn ? 'অর্ডার ট্র্যাকিং' : 'Order Tracking'}</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-amber-300 transition-colors">{isBn ? 'ডেলিভারি পলিসি' : 'Shipping Policy'}</Link></li>
              <li><Link to="/return-policy" className="hover:text-amber-300 transition-colors">{isBn ? 'রিটার্ন ও এক্সচেঞ্জ' : 'Return & Exchange'}</Link></li>
              <li><Link to="/faq" className="hover:text-amber-300 transition-colors">{isBn ? 'সাধারণ জিজ্ঞাসা (FAQ)' : 'FAQ'}</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-300 pl-2">
              {isBn ? 'শোরুম ও সাপোর্ট' : 'Showroom & Hotline'}
            </h4>
            <ul className="space-y-3 text-sm text-slate-100">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <span>{settings.storeAddress || 'ধানমন্ডি, ঢাকা - ১২০৫, বাংলাদেশ'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-300 shrink-0" />
                <a href={`tel:${(settings.storePhone || '01700000000').replace(/[^0-9+]/g, '')}`} className="hover:text-white transition-colors">
                  {settings.storePhone || '+880 1700-000000'}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-300 shrink-0" />
                <a href={`mailto:${settings.storeEmail || 'support@mensoutfit.com'}`} className="hover:text-white transition-colors">
                  {settings.storeEmail || 'support@mensoutfit.com'}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & policies */}
        <div className="mt-12 pt-8 border-t border-white/10 text-xs text-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>{settings.copyrightText || `© ${new Date().getFullYear()} Men's Outfit. All rights reserved.`}</p>
          <div className="flex items-center gap-6">
            <Link to="/shipping-policy" className="hover:text-white transition-colors">
              {isBn ? 'শিপিং পলিসি' : 'Shipping'}
            </Link>
            <Link to="/return-policy" className="hover:text-white transition-colors">
              {isBn ? 'রিটার্ন পলিসি' : 'Returns'}
            </Link>
            <Link to="/admin" className="text-slate-300 hover:text-white transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
