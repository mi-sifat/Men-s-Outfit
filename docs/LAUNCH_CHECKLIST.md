# 📋 Echo Outfits — Production Launch Checklist

Ensure all items are verified before public launch to customers in Bangladesh:

### 1. Legal & Bangladesh Government Compliance
- [ ] **Trade License:** Active e-commerce / clothing trading license verified.
- [ ] **DBID (Digital Business ID):** Registered with the Ministry of Commerce DBID portal.
- [ ] **BIN / VAT:** 9-digit or 13-digit Business Identification Number configured for taxation.
- [ ] **Contact Transparency:** Physical showroom or office address displayed on footer and contact page.

### 2. Payment & Courier Logistics
- [ ] **Cash on Delivery (COD):** Verified default active payment method.
- [ ] **SSLCOMMERZ / aamarPay:** Production Store ID and Password updated (set `IS_SANDBOX=false`).
- [ ] **Pathao / Steadfast:** Client ID & Secret or API key connected; test pickup address configured.
- [ ] **Delivery Charges:** Dhaka (70 BDT) and Outside Dhaka (130 BDT) verified in Admin Settings.

### 3. Security & Operational Sanity
- [ ] **JWT_SECRET:** Replaced default development secret with a high-entropy string (32+ chars).
- [ ] **Environment Files:** Ensure `.env` is never committed to Git.
- [ ] **MongoDB:** Set strong passwords and verify IP whitelist on MongoDB Atlas.
- [ ] **Rate Limiting:** Protect `/api/auth` and `/api/orders/checkout` from spam bots.

### 4. Customer Notification
- [ ] **SMS Gateway:** Active SMS provider credentials connected (e.g., Greenweb, BulkSMS BD).
- [ ] **Email SMTP:** Corporate email configured for order confirmation receipts.
