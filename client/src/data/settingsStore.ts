export interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  linkUrl: string;
  imageUrl: string;
  mobileImageUrl?: string;
  isActive: boolean;
  order: number;
}

export interface StoreSettingsData {
  storeName: string;
  logoUrl: string;
  faviconUrl: string;
  brandDescription: string;
  storePhone: string;
  storeEmail: string;
  storeAddress: string;
  supportHours: string;
  copyrightText: string;
  deliveryDhaka: number;
  deliveryOutsideDhaka: number;
  freeDeliveryThreshold: number;
  isCodEnabled: boolean;
  isOnlinePaymentEnabled: boolean;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    whatsapp?: string;
  };
  banners: BannerItem[];
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
}

export const DEFAULT_SETTINGS: StoreSettingsData = {
  storeName: "Men's Outfit",
  logoUrl: '/logo.png',
  faviconUrl: '/logo.png',
  brandDescription: 'বাংলাদেশের আধুনিক তরুণদের জন্য প্রিমিয়াম কোয়ালিটির ওভারসাইজড, ড্রপ-শোল্ডার টি-শার্ট ও স্ট্রিটওয়্যার ফ্যাশন ব্র্যান্ড।',
  storePhone: '+880 1700-000000',
  storeEmail: 'support@mensoutfit.com',
  storeAddress: 'ধানমন্ডি, ঢাকা - ১২০৫, বাংলাদেশ',
  supportHours: 'সকাল ১০টা থেকে রাত ১০টা (প্রতিদিন)',
  copyrightText: `© ${new Date().getFullYear()} Men's Outfit. সর্বস্বত্ব সংরক্ষিত।`,
  deliveryDhaka: 70,
  deliveryOutsideDhaka: 130,
  freeDeliveryThreshold: 2000,
  isCodEnabled: true,
  isOnlinePaymentEnabled: false,
  socialLinks: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    youtube: '',
    tiktok: '',
    whatsapp: '+8801700000000',
  },
  banners: [
    {
      id: 'banner-1',
      title: 'আধুনিক পুরুষের ড্রপ-শোল্ডার & ওভারসাইজড কালেকশন',
      subtitle: '২৪০-২৬০ GSM প্রিমিয়াম কম্বড সুতির তৈরি রিল্যাক্সড কমফোর্ট স্ট্রিটওয়্যার',
      buttonText: 'কালেকশন এক্সপ্লোর করুন',
      linkUrl: '/shop',
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1600&auto=format&fit=crop&q=80',
      isActive: true,
      order: 1,
    },
  ],
  seo: {
    metaTitle: "Men's Outfit — Premium Streetwear Bangladesh",
    metaDescription: "প্রিমিয়াম ওভারসাইজড, ড্রপ-শোল্ডার টি-শার্ট ও স্ট্রিটওয়্যার ফ্যাশন ব্র্যান্ড। দ্রুত ক্যাশ অন ডেলিভারি সারাদেশে।",
  },
};

const STORAGE_KEY = 'mens_outfit_store_settings';

export function getLocalStoreSettings(): StoreSettingsData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.warn('Failed to parse local store settings', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveLocalStoreSettings(settings: StoreSettingsData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event('store_settings_updated'));
  } catch (e) {
    console.warn('Failed to save store settings to localStorage', e);
  }
}
