import mongoose, { Document, Schema } from 'mongoose';

export interface IBanner {
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
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 1 },
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
