import mongoose, { Document, Schema } from 'mongoose';

export interface IBanner {
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
  startAt?: Date;
  endAt?: Date;
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

export interface IHomepageSection {
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

export interface IStoreSettings extends Document {
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
  banners: IBanner[];
  homepageSections: IHomepageSection[];
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
}

const BannerSchema = new Schema<IBanner>(
  {
    id: { type: String, required: true },
    title: { type: String, default: 'নতুন সামার ড্রপ ২০২৬' },
    subtitle: { type: String, default: 'প্রিমিয়াম হেভিওয়েট সুতি ওভারসাইজড ও ড্রপ-শোল্ডার কালেকশন' },
    buttonText: { type: String, default: 'কালেকশন দেখুন' },
    linkUrl: { type: String, default: '/shop' },
    imageUrl: { type: String, default: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1600&auto=format&fit=crop&q=80' },
    mobileImageUrl: { type: String },
    altText: { type: String, default: "Men's Outfit Banner" },
    badgeText: { type: String, default: 'SUMMER & STREET DROP 2026' },
    badgeTextBn: { type: String, default: 'এক্সক্লুসিভ স্ট্রিটওয়্যার ২০২৬' },
    startAt: { type: Date },
    endAt: { type: Date },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 1 },
  },
  { _id: false }
);

const HomepageSectionSchema = new Schema<IHomepageSection>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    titleBn: { type: String },
    subtitle: { type: String },
    subtitleBn: { type: String },
    type: {
      type: String,
      enum: [
        'hero_slider',
        'policy_strip',
        'category_icons',
        'featured',
        'category',
        'manual',
        'new_arrivals',
        'sale',
        'banner_promo',
        'social_brand',
      ],
      required: true,
    },
    categorySlug: { type: String },
    productIds: [{ type: String }],
    promoBanner: {
      title: { type: String },
      titleBn: { type: String },
      subtitle: { type: String },
      subtitleBn: { type: String },
      imageUrl: { type: String },
      linkUrl: { type: String },
      buttonText: { type: String },
      buttonTextBn: { type: String },
    },
    limit: { type: Number, default: 5 },
    sortBy: { type: String, default: 'newest' },
    viewAllText: { type: String, default: 'View All' },
    viewAllTextBn: { type: String, default: 'সবগুলো দেখুন' },
    viewAllLink: { type: String },
    order: { type: Number, required: true, default: 0 },
    isActive: { type: Boolean, default: true },
    layout: { type: String, default: 'grid-5' },
  },
  { _id: false }
);

const StoreSettingsSchema = new Schema<IStoreSettings>(
  {
    storeName: { type: String, default: "Men's Outfit" },
    logoUrl: { type: String, default: '/logo.png' },
    faviconUrl: { type: String, default: '/logo.png' },
    brandDescription: { 
      type: String, 
      default: 'বাংলাদেশের আধুনিক তরুণদের জন্য প্রিমিয়াম কোয়ালিটির ওভারসাইজড, ড্রপ-শোল্ডার টি-শার্ট ও স্ট্রিটওয়্যার ফ্যাশন ব্র্যান্ড।' 
    },
    storePhone: { type: String, default: '+880 1700-000000' },
    storeEmail: { type: String, default: 'support@mensoutfit.com' },
    storeAddress: { type: String, default: 'ধানমন্ডি, ঢাকা - ১২০৫, বাংলাদেশ' },
    supportHours: { type: String, default: 'সকাল ১০টা থেকে রাত ১০টা (প্রতিদিন)' },
    copyrightText: { type: String, default: `© ${new Date().getFullYear()} Men's Outfit. সর্বস্বত্ব সংরক্ষিত।` },
    deliveryDhaka: { type: Number, default: 70 },
    deliveryOutsideDhaka: { type: Number, default: 130 },
    freeDeliveryThreshold: { type: Number, default: 2000 },
    isCodEnabled: { type: Boolean, default: true },
    isOnlinePaymentEnabled: { type: Boolean, default: false },
    socialLinks: {
      facebook: { type: String, default: 'https://facebook.com' },
      instagram: { type: String, default: 'https://instagram.com' },
      youtube: { type: String, default: '' },
      tiktok: { type: String, default: '' },
      whatsapp: { type: String, default: '+8801700000000' },
    },
    banners: {
      type: [BannerSchema],
      default: [
        {
          id: 'banner-1',
          title: 'আধুনিক পুরুষের ড্রপ-শোল্ডার & ওভারসাইজড টি-শার্ট',
          subtitle: '২৪০-২৬০ GSM প্রিমিয়াম কোম্বড সুতির তৈরি রিল্যাক্সড কমফোর্ট স্ট্রিটওয়্যার',
          buttonText: 'কালেকশন এক্সপ্লোর করুন',
          linkUrl: '/shop',
          imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1600&auto=format&fit=crop&q=80',
          isActive: true,
          order: 1,
        },
      ],
    },
    homepageSections: {
      type: [HomepageSectionSchema],
      default: [
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
      ],
    },
    seo: {
      metaTitle: { type: String, default: "Men's Outfit — Premium Streetwear Bangladesh" },
      metaDescription: { 
        type: String, 
        default: "প্রিমিয়াম ওভারসাইজড, ড্রপ-শোল্ডার টি-শার্ট ও স্ট্রিটওয়্যার ফ্যাশন ব্র্যান্ড। দ্রুত ক্যাশ অন ডেলিভারি সারাদেশে।" 
      },
    },
  },
  { timestamps: true }
);

export const StoreSettings = mongoose.model<IStoreSettings>('StoreSettings', StoreSettingsSchema);
