# 🛍️ Echo Outfits — Bangladesh-Ready Men's Fashion E-Commerce Platform

> **Echo Outfits** is a complete, production-grade, full-stack MERN e-commerce application designed specifically for a modern men's streetwear clothing brand in Bangladesh (Oversized, Drop-Shoulder, Graphic Tees, and Polo Shirts).

---

## 🚀 START HERE — ওয়েবসাইট পরিচালনা নির্দেশিকা (Quick Start)

- **Website URL (গ্রাহক সাইট)**: `http://localhost:5173` (লাইভে: `https://yourdomain.com`)
- **Admin Panel URL (অ্যাডমিন প্যানেল)**: `http://localhost:5173/admin/dashboard`
- **অ্যাডমিন তৈরি / পাসওয়ার্ড রিসেট**: সার্ভার ডিরেক্টরিতে টার্মিনালে রান করুন: `npm run create-admin`

### 📚 সম্পূর্ণ বাংলা বিজনেস ও ম্যানেজমেন্ট হ্যান্ডবুক:
1. 🌐 [ভার্সেল ডিপ্লয়মেন্ট সহজ গাইড (VERCEL_DEPLOYMENT_BN.md)](file:///f:/OneDrive/Desktop/Antigrabity/E-com-mern-1/docs/VERCEL_DEPLOYMENT_BN.md)
2. 📖 [অ্যাডমিন ও বিজনেস ম্যানেজমেন্ট গাইড (ADMIN_MANAGEMENT_BN.md)](file:///f:/OneDrive/Desktop/Antigrabity/E-com-mern-1/docs/ADMIN_MANAGEMENT_BN.md)
3. 🗄️ [ডাটাবেস স্ট্রাকচার ও ব্যাকআপ গাইড (DATABASE_GUIDE_BN.md)](file:///f:/OneDrive/Desktop/Antigrabity/E-com-mern-1/docs/DATABASE_GUIDE_BN.md)
4. 📦 [অর্ডার প্রসেসিং ও কুরিয়ার লাইফসাইকেল (ORDER_MANAGEMENT_BN.md)](file:///f:/OneDrive/Desktop/Antigrabity/E-com-mern-1/docs/ORDER_MANAGEMENT_BN.md)
5. 🎟️ [কুপন, ডিসকাউন্ট ও সিক্রেট টোকেন গাইড (COUPON_AND_TOKEN_GUIDE_BN.md)](file:///f:/OneDrive/Desktop/Antigrabity/E-com-mern-1/docs/COUPON_AND_TOKEN_GUIDE_BN.md)
6. 💳 [পেমেন্ট গেটওয়ে ও কুরিয়ার সেটআপ (PAYMENT_COURIER_GUIDE_BN.md)](file:///f:/OneDrive/Desktop/Antigrabity/E-com-mern-1/docs/PAYMENT_COURIER_GUIDE_BN.md)
7. 📊 [সেলস, প্রফিট ও ইনভেন্টরি রিপোর্ট (SALES_REPORTS_BN.md)](file:///f:/OneDrive/Desktop/Antigrabity/E-com-mern-1/docs/SALES_REPORTS_BN.md)
8. ✅ [প্রতিদিনের বিজনেস অপারেশন চেকলিস্ট (DAILY_OPERATIONS_CHECKLIST_BN.md)](file:///f:/OneDrive/Desktop/Antigrabity/E-com-mern-1/docs/DAILY_OPERATIONS_CHECKLIST_BN.md)

---


## 🌟 Key Features

1. **Brand Aesthetics & UX:**
   - Ultra-sleek modern dark luxury streetwear theme (`#080C14` background with `#C5A880` gold accents).
   - Fully responsive for mobile devices, tablets, and desktop displays.
   - Sticky header with announcement bar, category navigation, live search, and reactive cart badge.

2. **Product Catalog & Interactive Showcase:**
   - Variant-level inventory management (Sizes: `S`, `M`, `L`, `XL`, `XXL` + Color swatches).
   - Real-time stock status indicator (`স্টকে আছে` vs `স্টক খালি`).
   - Interactive Size Guide modal with exact chest and length measurements in inches.
   - Server-side full-text search, category filters, and sorting.

3. **Cart & Bangladesh-Tailored Checkout:**
   - Persistent reactive cart with `localStorage` fallback.
   - Guest checkout support (no account mandatory for quick purchase).
   - Bangladeshi address form with 11-digit mobile number validation (`01XXXXXXXXX`).
   - Real-time dynamic delivery fee calculation: **Dhaka: ৳৭০** vs **Outside Dhaka: ৳১৩০**.
   - Automatic free delivery threshold for orders over ৳২,০০০.
   - Cash on Delivery (COD) as primary payment method.

4. **Promotional Coupons & Order Lifecycle:**
   - Interactive coupon box on checkout (`APPLY` / `REMOVE`).
   - Formal Order State Machine: `Pending ➔ Confirmed ➔ Processing ➔ Shipped ➔ Delivered`.
   - Automatic variant inventory restoration upon order cancellation.
   - Automated Bangla SMS notification alerts for order creation and shipment.

5. **Payment Gateway Integration Layer:**
   - Modular payment adapter architecture for **SSLCOMMERZ** and **aamarPay**.
   - Server-side IPN validation and idempotent transaction recording.
   - Zero storage of customer credit cards or CVVs.

6. **Courier Logistics Integration:**
   - **Pathao Courier** and **Steadfast Courier** API adapters.
   - **Manual Courier Workflow** for unintegrated local couriers (RedX, eCourier, SA Paribahan).
   - Customer-facing live tracking page (`/order-tracking`) with visual timeline.

7. **Admin Control Center (`/admin/dashboard`):**
   - Real-time sales metrics, revenue counter, and low-stock alerts.
   - Order management table with instant status transitions (`Confirm`, `Ship`, `Cancel`).
   - Stock view by variant and SKU.
   - Dynamic store settings panel for delivery charges.

8. **Legal & Compliance Pages (Bangla):**
   - Shipping Policy, Return & Refund Policy (7-day exchange), FAQ, and Size Guide.
   - SEO `sitemap.xml` and `robots.txt` for Google Search Console indexation.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, React Router 7, React Hook Form, Zod, Lucide Icons, React Hot Toast.
- **Backend:** Node.js, Express.js, TypeScript, Mongoose (MongoDB), Winston Logger, Helmet, Express Rate Limit, Mongo Sanitize.
- **Testing:** Vitest (8 automated test suites passing).

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v20+ LTS recommended)
- MongoDB running locally or MongoDB Atlas connection URI

### 2. Installation
```bash
# Clone the repository
git clone <repository_url>
cd E-com-mern-1

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Variables
Copy the template to your `.env` file in the project root:
```bash
cp .env.example .env
```
Ensure your `MONGODB_URI` and `JWT_SECRET` are configured.

### 4. Running the Development Servers
From the root directory:
```bash
# Runs both Client (port 5173) and Server (port 5000) concurrently
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing and Production Builds

```bash
# Run backend automated unit tests
npm run test:server

# Build production bundles
npm run build
```

---

## 📚 Documentation Links
- [Payment Gateway Setup](docs/PAYMENT_SETUP.md)
- [Courier Logistics Setup](docs/COURIER_SETUP.md)
- [Production Deployment Guide](docs/DEPLOYMENT.md)
- [Launch Readiness Checklist](docs/LAUNCH_CHECKLIST.md)
