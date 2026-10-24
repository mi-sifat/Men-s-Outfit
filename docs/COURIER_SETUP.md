# 🚚 Echo Outfits — Courier Integration Guide

> **Official Courier API Integration Layer for Bangladesh**  
> Supports **Pathao Courier**, **Steadfast Courier**, and **Manual Consignment Workflow**.

---

## 1. Pathao Courier Setup

1. **Merchant Account:**
   - Register at [Pathao Courier](https://merchant.pathao.com/).
   - Obtain **Client ID**, **Client Secret**, **Username**, and **Password**.

2. **Environment Variables:**
   ```env
   COURIER_PROVIDER=pathao
   PATHAO_CLIENT_ID=your_client_id
   PATHAO_CLIENT_SECRET=your_client_secret
   PATHAO_USERNAME=your_username
   PATHAO_PASSWORD=your_password
   PATHAO_IS_SANDBOX=true # Set to false in production
   ```

---

## 2. Steadfast Courier Setup

1. **Merchant Account:**
   - Register at [Steadfast Courier Portal](https://portal.steadfast.com.bd/).
   - Go to API Settings to generate **API Key** and **Secret Key**.

2. **Environment Variables:**
   ```env
   COURIER_PROVIDER=steadfast
   STEADFAST_API_KEY=your_api_key
   STEADFAST_SECRET_KEY=your_secret_key
   ```

---

## 3. Manual Courier Workflow

- If API credentials are not yet approved, administrators can use the **Manual Courier Workflow**:
  - Select any local courier (RedX, eCourier, SA Paribahan, Sundarban, etc.).
  - Enter the consignment/tracking ID directly from the admin order dashboard.
  - The customer can instantly track their parcel on `/order-tracking`.
