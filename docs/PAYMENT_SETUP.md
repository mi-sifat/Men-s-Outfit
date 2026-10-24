# 💳 Echo Outfits — Payment Gateway Setup Guide

> **Official Bangladeshi Payment Integration Layer**  
> Supports **SSLCOMMERZ** and **aamarPay** with server-side transaction verification and idempotent callbacks.

---

## 1. SSLCOMMERZ Setup

1. **Merchant Account:**
   - Register at [SSLCOMMERZ](https://sslcommerz.com/).
   - Obtain your **Store ID** and **Store Password**.

2. **Environment Variables:**
   Add the following in your `.env` file:
   ```env
   PAYMENT_PROVIDER=sslcommerz
   SSLCOMMERZ_STORE_ID=your_store_id
   SSLCOMMERZ_STORE_PASSWORD=your_store_password
   SSLCOMMERZ_IS_SANDBOX=true # Set to false for live production
   ```

3. **Callback URLs (automatically handled):**
   - Success: `https://yourdomain.com/api/payments/sslcommerz/success`
   - Fail: `https://yourdomain.com/api/payments/sslcommerz/fail`
   - Cancel: `https://yourdomain.com/api/payments/sslcommerz/cancel`

---

## 2. aamarPay Setup

1. **Merchant Account:**
   - Register at [aamarPay](https://aamarpay.com/).
   - Obtain your **Store ID** and **Signature Key**.

2. **Environment Variables:**
   ```env
   PAYMENT_PROVIDER=aamarpay
   AAMARPAY_STORE_ID=your_aamarpay_store_id
   AAMARPAY_SIGNATURE_KEY=your_signature_key
   AAMARPAY_IS_SANDBOX=true # Set to false for live production
   ```

---

## 3. Development / Sandbox Mode

- If credentials are not configured, the payment service operates in **Safe Mock Mode**:
  - Automatically simulates session generation without failing.
  - No customer credit card numbers, CVVs, or gateway passwords are stored in the database.
  - Transactions are verified server-side before updating the order status to `PAID`.
