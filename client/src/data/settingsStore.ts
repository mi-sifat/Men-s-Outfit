export interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  linkUrl: string;
  imageUrl: string;
  mobileImageUrl?: string;
  altText?: string;
  badgeText?: string;
  badgeTextBn?: string;
  startAt?: string;
  endAt?: string;
  isActive: boolean;
  order: number;
}

export type HomepageSectionType =
  | 'hero_slider'
  | 'policy_strip'
  | 'category_icons'
  | 'featured'
  | 'category'
  | 'manual'
  | 'new_arrivals'
  | 'sale'
  | 'banner_promo'
  | 'social_brand';

export interface HomepageSectionItem {
  id: string;
  title: string;
  titleBn?: string;
  subtitle?: string;
  subtitleBn?: string;
  type: HomepageSectionType;
  categorySlug?: string;
  productIds?: string[];
  promoBanner?: {
    title: string;
    titleBn?: string;
    subtitle?: string;
    subtitleBn?: string;
    imageUrl: string;
    linkUrl: string;
    buttonText: string;
    buttonTextBn?: string;
  };
  limit?: number;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'popular';
  viewAllText?: string;
  viewAllTextBn?: string;
  viewAllLink?: string;
  order: number;
  isActive: boolean;
  layout?: 'grid-5' | 'grid-4' | 'slider';
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
  homepageSections: HomepageSectionItem[];
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
}

export const DEFAULT_HOMEPAGE_SECTIONS: HomepageSectionItem[] = [
  {
    id: 'sec-hero',
    title: 'Hero Banner Slider',
    titleBn: 'হিরো ব্যানার স্লাইডার',
    type: 'hero_slider',
    order: 1,
    isActive: true,
  },
  {
    id: 'sec-category-icons',
    title: 'Featured Category Strip',
    titleBn: 'জনপ্রিয় ক্যাটাগরি স্ট্রিপ',
    type: 'category_icons',
    order: 2,
    isActive: true,
  },
  {
    id: 'sec-new-arrivals',
    title: 'New Arrivals',
    titleBn: 'নতুন কালেকশন',
    subtitle: 'Just dropped this week — limited release',
    subtitleBn: 'এই সপ্তাহের একদম নতুন ড্রপ শোল্ডার ও ওভারসাইজ ডিজাইন',
    type: 'new_arrivals',
    limit: 5,
    viewAllText: 'View All',
    viewAllTextBn: 'সবগুলো দেখুন',
    viewAllLink: '/new-arrivals',
    order: 3,
    isActive: true,
    layout: 'grid-5',
  },
  {
    id: 'sec-promo-banner',
    title: 'Signature Streetwear Banner',
    titleBn: 'সিগনেচার স্ট্রিটওয়্যার প্রমো ব্যানার',
    type: 'banner_promo',
    promoBanner: {
      title: 'STREETWEAR DROP SHOULDER',
      titleBn: 'হেভিওয়েট ড্রপ শোল্ডার কালেকশন',
      subtitle: 'Engineered with 240 GSM organic combed cotton, precision tailored for all-day comfort.',
      subtitleBn: 'প্রিমিয়াম ২৪০ জিএসএম কটন ও ট্রেন্ডি কালার প্যালেট। নিখুঁত স্টিচিং ও আধুনিক স্ট্রিট আর্ট।',
      imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1600&auto=format&fit=crop&q=85',
      linkUrl: '/category/drop-shoulder',
      buttonText: 'EXPLORE COLLECTION',
      buttonTextBn: 'কালেকশন দেখুন',
    },
    order: 4,
    isActive: true,
  },
  {
    id: 'sec-drop-shoulder',
    title: 'Drop Shoulder Collection',
    titleBn: 'ড্রপ শোল্ডার টি-শার্ট',
    subtitle: 'Trending solid minimal drop shoulder tees',
    subtitleBn: 'জনপ্রিয় সলিড ও মিনিমালিস্ট ড্রপ কাটিং টি-শার্ট',
    type: 'category',
    categorySlug: 'drop-shoulder',
    limit: 5,
    viewAllText: 'View All',
    viewAllTextBn: 'সবগুলো দেখুন',
    viewAllLink: '/category/drop-shoulder',
    order: 5,
    isActive: true,
    layout: 'grid-5',
  },
  {
    id: 'sec-oversized',
    title: 'Oversized T-Shirts',
    titleBn: 'ওভারসাইজড টি-শার্ট',
    subtitle: 'Heavyweight 260 GSM relaxed comfort cut',
    subtitleBn: '২৬০ জিএসএম হেভিওয়েট রিল্যাক্সড ফিট',
    type: 'category',
    categorySlug: 'oversized',
    limit: 5,
    viewAllText: 'View All',
    viewAllTextBn: 'সবগুলো দেখুন',
    viewAllLink: '/category/oversized',
    order: 6,
    isActive: true,
    layout: 'grid-5',
  },
  {
    id: 'sec-graphic-tees',
    title: 'Graphic Art Tees',
    titleBn: 'গ্রাফিক টিজ',
    subtitle: 'Urban street art & high-density screen prints',
    subtitleBn: 'আর্বান স্ট্রিট কালচার ও স্ক্রিন প্রিন্ট',
    type: 'category',
    categorySlug: 'graphic-tees',
    limit: 5,
    viewAllText: 'View All',
    viewAllTextBn: 'সবগুলো দেখুন',
    viewAllLink: '/category/graphic-tees',
    order: 7,
    isActive: true,
    layout: 'grid-5',
  },
  {
    id: 'sec-policy-strip',
    title: 'Trust & Customer Benefits',
    titleBn: 'গ্রাহক সুবিধা ও নিশ্চয়তা',
    type: 'policy_strip',
    order: 8,
    isActive: true,
  },
];

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
      title: 'নতুন কালেকশন এসে গেছে',
      subtitle: 'সেরা মানের ওভারসাইজড টি-শার্ট এখন পাওয়া যাচ্ছে। স্টাইলে থাকুন।',
      buttonText: 'এখনই কিনুন',
      linkUrl: '/category/oversized',
      imageUrl: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=1920&q=85',
      mobileImageUrl: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=85',
      altText: 'New Oversized Collection',
      badgeText: 'নতুন কালেকশন',
      isActive: true,
      order: 1,
    },
    {
      id: 'banner-2',
      title: 'গ্রাফিক টিস কালেকশন',
      subtitle: 'আর্টিস্টিক প্রিন্টের অসাধারণ কালেকশন। আজই অর্ডার করুন।',
      buttonText: 'দেখুন',
      linkUrl: '/category/graphic-tees',
      imageUrl: 'https://images.unsplash.com/photo-1555069519-127aadedf1ee?w=1920&q=85',
      mobileImageUrl: 'https://images.unsplash.com/photo-1555069519-127aadedf1ee?w=800&q=85',
      altText: 'Graphic Tees Collection',
      badgeText: 'বেস্ট সেলার',
      isActive: true,
      order: 2,
    },
    {
      id: 'banner-3',
      title: 'পোলো শার্ট স্পেশাল অফার',
      subtitle: 'প্রিমিয়াম কটন পোলো শার্ট। ৳১৫০ পর্যন্ত ছাড়।',
      buttonText: 'অফার দেখুন',
      linkUrl: '/category/polo-shirts',
      imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1920&q=85',
      mobileImageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=85',
      altText: 'Polo Shirts Special Offer',
      badgeText: '৳১৫০ ছাড়',
      isActive: true,
      order: 3,
    },
  ],
  homepageSections: DEFAULT_HOMEPAGE_SECTIONS,
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
      // Ensure homepageSections exists
      if (!parsed.homepageSections || !Array.isArray(parsed.homepageSections)) {
        parsed.homepageSections = DEFAULT_HOMEPAGE_SECTIONS;
      }
      if (!parsed.banners || !Array.isArray(parsed.banners)) {
        parsed.banners = DEFAULT_SETTINGS.banners;
      }
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

export async function saveAdminStoreSettings(settings: StoreSettingsData): Promise<StoreSettingsData> {
  const token = localStorage.getItem('mens_outfit_admin_token') || '';
  const response = await fetch('/api/admin/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(settings),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Store settings could not be saved');
  const saved = { ...settings, ...result.data } as StoreSettingsData;
  saveLocalStoreSettings(saved);
  return saved;
}

export function saveHomepageSections(sections: HomepageSectionItem[]): void {
  const current = getLocalStoreSettings();
  current.homepageSections = sections.sort((a, b) => a.order - b.order);
  saveLocalStoreSettings(current);
}

export function reorderHomepageSections(orderedIds: string[]): void {
  const current = getLocalStoreSettings();
  const reordered = (current.homepageSections || []).map((sec) => {
    const idx = orderedIds.indexOf(sec.id);
    return {
      ...sec,
      order: idx >= 0 ? idx + 1 : sec.order,
    };
  });
  reordered.sort((a, b) => a.order - b.order);
  current.homepageSections = reordered;
  saveLocalStoreSettings(current);
}

export function toggleHomepageSection(id: string): void {
  const current = getLocalStoreSettings();
  current.homepageSections = (current.homepageSections || []).map((sec) =>
    sec.id === id ? { ...sec, isActive: !sec.isActive } : sec
  );
  saveLocalStoreSettings(current);
}

