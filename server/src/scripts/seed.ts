import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { StoreSettings } from '../models/StoreSettings';
import { Coupon } from '../models/Coupon';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
}

async function seed() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/echo-outfits';
  console.log(`🌱 Seeding database at: ${mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`);

  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB.');

    // 1. Default Store Settings
    const existingSettings = await StoreSettings.findOne();
    if (!existingSettings) {
      await StoreSettings.create({
        storeName: 'Echo Outfits',
        storePhone: '+880 1700-000000',
        storeEmail: 'support@echooutfits.com',
        storeAddress: 'ধানমন্ডি, ঢাকা - ১২০৫, বাংলাদেশ',
        deliveryDhaka: 70,
        deliveryOutsideDhaka: 130,
        freeDeliveryThreshold: 2000,
        isCodEnabled: true,
        isOnlinePaymentEnabled: false,
      });
      console.log('✅ Store settings initialized (Dhaka ৳70, Outside ৳130, Free over ৳2000).');
    }

    // 2. Default Categories
    const categories = [
      {
        name: 'Oversized T-Shirts',
        nameBn: 'ওভারসাইজড টি-শার্ট',
        slug: 'oversized',
        description: '২৪০ GSM ড্রপ কাটিং ও প্রিমিয়াম কম্বড কটন',
        order: 1,
      },
      {
        name: 'Drop Shoulder T-Shirts',
        nameBn: 'ড্রপ শোল্ডার টি-শার্ট',
        slug: 'drop-shoulder',
        description: '২২০ GSM মডার্ন স্ট্রিটওয়্যার সিলুয়েট',
        order: 2,
      },
      {
        name: 'Graphic Tees',
        nameBn: 'গ্রাফিক টিজ',
        slug: 'graphic-tees',
        description: 'হাই-ডেনসিটি স্ক্রিন প্রিন্ট ও ইউনিক আর্বান আর্ট',
        order: 3,
      },
      {
        name: 'Polo Shirts',
        nameBn: 'প্রিমিয়াম পোলো শার্ট',
        slug: 'polo',
        description: '২৬০ GSM লাক্সারি হানি-কম্ব পিক কটন',
        order: 4,
      },
    ];

    for (const cat of categories) {
      await Category.findOneAndUpdate({ slug: cat.slug }, cat, { upsert: true, new: true });
    }
    console.log('✅ 4 default categories verified/created.');

    // 3. Welcome Coupon
    const existingCoupon = await Coupon.findOne({ code: 'ECHO10' });
    if (!existingCoupon) {
      await Coupon.create({
        code: 'ECHO10',
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: 1000,
        maxDiscountAmount: 300,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        usageLimit: 1000,
        isActive: true,
      });
      console.log('✅ Welcome coupon "ECHO10" (10% off up to ৳300, min ৳1000) created.');
    }

    console.log('\n🎉 Seed process finished successfully!\n');
  } catch (err: any) {
    console.error('❌ Seeding failed:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
