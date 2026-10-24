import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const config = {
  // General
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:5000/api',

  // Database
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/echo-outfits',

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cookieDomain: process.env.COOKIE_DOMAIN || 'localhost',

  // Cloudinary
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },

  // Payment
  paymentProvider: process.env.PAYMENT_PROVIDER || 'cod',
  sslcommerz: {
    storeId: process.env.SSLCOMMERZ_STORE_ID || '',
    storePassword: process.env.SSLCOMMERZ_STORE_PASSWORD || '',
    isSandbox: process.env.SSLCOMMERZ_IS_SANDBOX === 'true',
  },
  aamarpay: {
    storeId: process.env.AAMARPAY_STORE_ID || '',
    signatureKey: process.env.AAMARPAY_SIGNATURE_KEY || '',
    isSandbox: process.env.AAMARPAY_IS_SANDBOX === 'true',
  },

  // Courier
  courierProvider: process.env.COURIER_PROVIDER || 'manual',
  pathao: {
    clientId: process.env.PATHAO_CLIENT_ID || '',
    clientSecret: process.env.PATHAO_CLIENT_SECRET || '',
    username: process.env.PATHAO_USERNAME || '',
    password: process.env.PATHAO_PASSWORD || '',
    isSandbox: process.env.PATHAO_IS_SANDBOX === 'true',
  },
  steadfast: {
    apiKey: process.env.STEADFAST_API_KEY || '',
    secretKey: process.env.STEADFAST_SECRET_KEY || '',
  },

  // Email
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    fromName: process.env.SMTP_FROM_NAME || 'Echo Outfits',
    fromEmail: process.env.SMTP_FROM_EMAIL || '',
  },

  // SMS
  sms: {
    provider: process.env.SMS_PROVIDER || 'mock',
    apiKey: process.env.SMS_API_KEY || '',
    senderId: process.env.SMS_SENDER_ID || '',
  },

  // Analytics
  analytics: {
    gaMeasurementId: process.env.GA_MEASUREMENT_ID || '',
    metaPixelId: process.env.META_PIXEL_ID || '',
  },

  // Store
  store: {
    name: process.env.STORE_NAME || 'Echo Outfits',
    currency: process.env.STORE_CURRENCY || 'BDT',
    timezone: process.env.STORE_TIMEZONE || 'Asia/Dhaka',
  },

  // Is production
  get isProduction() {
    return this.nodeEnv === 'production';
  },
  get isDevelopment() {
    return this.nodeEnv === 'development';
  },
} as const;

export default config;
