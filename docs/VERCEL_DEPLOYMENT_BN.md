# 🚀 Vercel ডিপ্লয়মেন্ট সহজ গাইড (Vercel Deployment Guide in Bangla)

এই গাইডটি অনুসরণ করে আপনি আপনার **Echo Outfits** ওয়েবসাইটটি খুব সহজে Vercel-এ লাইভ করতে পারবেন।

---

## ১. কীভাবে কাজ করে (Architecture)?

একটি ফুল-স্ট্যাক MERN অ্যাপ্লিকেশনে দুটি অংশ থাকে:
1. **Frontend (ওয়েবসাইট)**: এটি Vercel-এ ডিপ্লয় করার জন্য একদম আদর্শ। এটি সুপার ফাস্ট এবং বিশ্বব্যাপী CDN এর মাধ্যমে চলে।
2. **Backend (Node.js API)**: এটি Render, Railway বা VPS-এ ২৪/৭ চলতে থাকে। অথবা Vercel Serverless Function হিসেবেও চলতে পারে।
3. **Database (MongoDB)**: ক্লাউডে সম্পূর্ণ ফ্রিতে **MongoDB Atlas**-এ সংরক্ষিত থাকে।

---

## ২. Vercel-এ ডিপ্লয় করার সহজ ধাপসমূহ (Step-by-Step)

### ধাপ ১: গিটহাবে প্রজেক্ট পুশ করুন (GitHub Push)
আপনার কোডটি GitHub-এ একটি রিপোজিটরিতে (যেমন: `echo-outfits`) পুশ করুন।

### ধাপ ২: Vercel-এ লগইন ও ইমপোর্ট
1. [vercel.com](https://vercel.com)-এ যান এবং GitHub অ্যাকাউন্ট দিয়ে লগইন করুন।
2. **"Add New..."** বাটনে ক্লিক করে **"Project"** নির্বাচন করুন।
3. আপনার `echo-outfits` রিপোজিটরিটি সিলেক্ট করে **"Import"**-এ ক্লিক করুন।

### ধাপ ৩: গুরুত্বপূর্ণ প্রজেক্ট সেটিংস (Project Configuration)
Vercel ইমপোর্ট স্ক্রিনে এই সেটিংসগুলো নিশ্চিত করুন:
- **Root Directory**: `client` সিলেক্ট করুন (যেহেতু আমাদের ফ্রন্টএন্ড কোড `client` ফোল্ডারে রয়েছে)।
- **Framework Preset**: স্বয়ংক্রিয়ভাবে `Vite` ডিটেক্ট করবে।
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### ধাপ ৪: Environment Variables (পরিবেশ পরিবর্তনশীল)
Vercel-এর "Environment Variables" অপশনে যুক্ত করুন:
- `VITE_API_URL`: আপনার ব্যাকএন্ড সার্ভারের লাইভ ইউআরএল (যেমন: `https://echo-outfits-api.onrender.com/api`)

### ধাপ ৫: Deploy-এ ক্লিক করুন!
- **"Deploy"** বাটনে ক্লিক করুন।
- মাত্র ১-২ মিনিটের মধ্যে আপনার ওয়েবসাইট লাইভ হয়ে যাবে এবং Vercel আপনাকে একটি ফ্রি ডোমেন লিংক দেবে (যেমন: `https://echo-outfits.vercel.app`)।

---

## ৩. রাউটিং ও রিরাইটস সুবিধা (SPA Support)

ফ্রন্টএন্ডের `client/vercel.json` ফাইলে ইতিমধ্যে নিচের কনফিগারেশনটি প্রস্তুত রাখা হয়েছে:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
> **এর সুবিধা**: কাস্টমার যখন সরাসরি `/shop`, `/product/slug`, `/cart`, বা `/admin/dashboard` পেজে রিলোড দেবে, তখন কোনো ৪MD (404 Page Not Found) এরর আসবে না।

---

## ৪. ব্যাকএন্ড (Server) কোথায় ফ্রি ডিপ্লয় করবেন?

ব্যাকএন্ডের জন্য সবচেয়ে জনপ্রিয় ও সহজ প্ল্যাটফর্ম হলো **Render** (সম্পূর্ণ ফ্রি):
1. [render.com](https://render.com)-এ যান।
2. **"New Web Service"** তৈরি করে আপনার একই GitHub রিপোজিটরি যুক্ত করুন।
3. **Root Directory**: `server`
4. **Build Command**: `npm install && npm run build`
5. **Start Command**: `npm start`
6. **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: আপনার MongoDB Atlas ডাটাবেস লিংক
   - `JWT_SECRET`: আপনার সিক্রেট কি
   - `CLIENT_URL`: আপনার Vercel ওয়েবসাইটের লিংক (যেমন: `https://echo-outfits.vercel.app`)

Render থেকে পাওয়া লাইভ লিঙ্কটি Vercel-এর ফ্রন্টএন্ডের সাথে যুক্ত করে দিলেই আপনার সম্পূর্ণ ই-কমার্স সাইট অনলাইনে অর্ডার গ্রহণের জন্য পুরোপুরি রেডি!
