# 🚀 Echo Outfits — Production Deployment Guide

> **Production deployment instructions for Vercel (Frontend), VPS / Render / Railway (Backend), and MongoDB Atlas.**

---

## 1. Architecture Overview

```
[ Customer Browser ]
        │
        ├── HTTPS ──> [ Vercel / Netlify ] (React + Vite Client)
        │
        └── API ────> [ Node.js Server (Render / Railway / VPS) ]
                               │
                               ├── MongoDB Atlas (Managed Database)
                               ├── SSLCOMMERZ / aamarPay (Online Payments)
                               └── Pathao / Steadfast (Courier Logistics)
```

---

## 2. Database Setup (MongoDB Atlas)

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Database User with read/write privileges.
3. In **Network Access**, allow access from anywhere (`0.0.0.0/0`) or whitelist your server's IP.
4. Copy the connection URI:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/echo-outfits?retryWrites=true&w=majority
   ```

---

## 3. Backend Deployment (Render / Railway / Ubuntu VPS)

### Option A: Render / Railway
1. Connect your Git repository.
2. Root Directory: `server`
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Add Environment Variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `MONGODB_URI=...`
   - `JWT_SECRET=your_super_strong_secret`
   - `CLIENT_URL=https://echooutfits.com`
   - `API_BASE_URL=https://api.echooutfits.com/api`

### Option B: Ubuntu VPS (PM2 + Nginx)
```bash
# Clone and build
git clone <repo_url>
cd server
npm install
npm run build

# Start with PM2 process manager
npm install -g pm2
pm2 start dist/server.js --name "echo-outfits-api"
pm2 save
pm2 startup
```

---

## 4. Frontend Deployment (Vercel)

1. Import your GitHub repository into [Vercel](https://vercel.com/).
2. Root Directory: `client`
3. Framework Preset: `Vite`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. In **Rewrites / Single Page Application**, add `vercel.json`:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

---

## 5. Domain & SSL Setup
- Point your custom domain (e.g. `echooutfits.com`) via DNS CNAME to Vercel.
- Point `api.echooutfits.com` to your backend server host.
- Vercel and modern cloud hosts provision Let's Encrypt SSL certificates automatically.
