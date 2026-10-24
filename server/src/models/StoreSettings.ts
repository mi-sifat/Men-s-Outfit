import mongoose, { Document, Schema } from 'mongoose';

export interface IStoreSettings extends Document {
  storeName: string;
  storePhone: string;
  storeEmail: string;
  storeAddress: string;
  deliveryDhaka: number;
  deliveryOutsideDhaka: number;
  freeDeliveryThreshold: number;
  isCodEnabled: boolean;
  isOnlinePaymentEnabled: boolean;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
}

const StoreSettingsSchema = new Schema<IStoreSettings>(
  {
    storeName: { type: String, default: 'Echo Outfits' },
    storePhone: { type: String, default: '+880 1700-000000' },
    storeEmail: { type: String, default: 'support@echooutfits.com' },
    storeAddress: { type: String, default: 'ধানমন্ডি, ঢাকা - ১২০৫, বাংলাদেশ' },
    deliveryDhaka: { type: Number, default: 70 },
    deliveryOutsideDhaka: { type: Number, default: 130 },
    freeDeliveryThreshold: { type: Number, default: 2000 },
    isCodEnabled: { type: Boolean, default: true },
    isOnlinePaymentEnabled: { type: Boolean, default: false },
    socialLinks: {
      facebook: { type: String, default: 'https://facebook.com' },
      instagram: { type: String, default: 'https://instagram.com' },
      youtube: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

export const StoreSettings = mongoose.model<IStoreSettings>('StoreSettings', StoreSettingsSchema);
