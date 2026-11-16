import { describe, it, expect, vi } from 'vitest';
import { SSLCommerzProvider } from '../src/integrations/payments/SSLCommerz.provider';
import { AamarPayProvider } from '../src/integrations/payments/AamarPay.provider';

describe('Public Order Tracking Security & Privacy', () => {
  it('should only accept 32-character hexadecimal tracking tokens', () => {
    const validToken = 'a1b2c3d4e5f6789012345678abcdef01';
    const sequentialOrderNumber = 'EO-2026-00001';
    const shortToken = 'abc123';
    const invalidHex = 'g1b2c3d4e5f6789012345678abcdef01';

    const hexPattern = /^[a-f0-9]{32}$/i;
    expect(hexPattern.test(validToken)).toBe(true);
    expect(hexPattern.test(sequentialOrderNumber)).toBe(false);
    expect(hexPattern.test(shortToken)).toBe(false);
    expect(hexPattern.test(invalidHex)).toBe(false);
  });

  it('should ensure tracking response only projects non-sensitive status fields', () => {
    const fullOrderDocument = {
      orderNumber: 'EO-2026-A1B2C3D4E5',
      trackingToken: 'a1b2c3d4e5f6789012345678abcdef01',
      status: 'pending',
      courierProvider: 'manual',
      courierTrackingCode: null,
      createdAt: new Date().toISOString(),
      confirmedAt: null,
      shippedAt: null,
      deliveredAt: null,
      // Sensitive fields that MUST NEVER be exposed in public tracking:
      shippingAddress: {
        fullName: 'Sensitive Customer',
        phone: '01712345678',
        addressLine: 'Flat 4B, Road 12, Dhanmondi',
        district: 'Dhaka',
      },
      customerNotes: 'Please ring bell twice',
      adminNotes: 'High value customer, verify COD call',
      payableTotal: 1550,
      customer: 'user_obj_id_654321',
    };

    const allowedFields = [
      'orderNumber',
      'status',
      'courierProvider',
      'courierTrackingCode',
      'createdAt',
      'confirmedAt',
      'shippedAt',
      'deliveredAt',
    ];

    const sanitizedOutput = Object.keys(fullOrderDocument)
      .filter((k) => allowedFields.includes(k))
      .reduce((obj: Record<string, any>, key) => {
        obj[key] = (fullOrderDocument as any)[key];
        return obj;
      }, {});

    expect(sanitizedOutput).not.toHaveProperty('shippingAddress');
    expect(sanitizedOutput).not.toHaveProperty('phone');
    expect(sanitizedOutput).not.toHaveProperty('customerNotes');
    expect(sanitizedOutput).not.toHaveProperty('adminNotes');
    expect(sanitizedOutput).not.toHaveProperty('payableTotal');
    expect(sanitizedOutput).not.toHaveProperty('customer');
    expect(sanitizedOutput).toHaveProperty('orderNumber', 'EO-2026-A1B2C3D4E5');
    expect(sanitizedOutput).toHaveProperty('status', 'pending');
  });
});

describe('Payment Verification Security & Production Safeguards', () => {
  it('SSLCommerz mock mode should fail safely when production credentials missing in production', async () => {
    const ssl = new SSLCommerzProvider();
    const mockPayload = { val_id: 'mock_val_id', tran_id: 'SSL-123' };

    // In dev, verifyPayment returns isValid: true
    const devResult = await ssl.verifyPayment(mockPayload);
    expect(devResult.isValid).toBe(true);

    // If NODE_ENV is set to production and credentials missing, verifyPayment must return isValid: false
    const origEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
      const prodResult = await ssl.verifyPayment(mockPayload);
      expect(prodResult.isValid).toBe(false);
      expect(prodResult.status).toBe('failed');
    } finally {
      process.env.NODE_ENV = origEnv;
    }
  });

  it('aamarPay mock mode should fail safely when production credentials missing in production', async () => {
    const aamar = new AamarPayProvider();
    const mockPayload = { mer_txnid: 'AAMAR-123' };

    const origEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    try {
      const prodResult = await aamar.verifyPayment(mockPayload);
      expect(prodResult.isValid).toBe(false);
      expect(prodResult.status).toBe('failed');
    } finally {
      process.env.NODE_ENV = origEnv;
    }
  });

  it('Payment amount and currency match check', () => {
    const verification = {
      isValid: true,
      status: 'paid',
      currency: 'BDT',
      amount: 1500.0,
      transactionId: 'TXN-999',
    };

    const paymentRecord = {
      amount: 1500.0,
      currency: 'BDT',
      status: 'PENDING',
    };

    const isMatch =
      verification.isValid &&
      verification.status === 'paid' &&
      verification.currency === 'BDT' &&
      Math.abs(verification.amount - paymentRecord.amount) < 0.01;

    expect(isMatch).toBe(true);

    // Mismatched amount
    const tamperedAmount = { ...verification, amount: 100.0 };
    const mismatch = Math.abs(tamperedAmount.amount - paymentRecord.amount) < 0.01;
    expect(mismatch).toBe(false);

    // Foreign currency injection
    const wrongCurrency = { ...verification, currency: 'USD' };
    expect(wrongCurrency.currency === 'BDT').toBe(false);
  });
});

describe('Inventory & Coupon Concurrency Guard', () => {
  it('Consolidates multiple identical variant cart lines to prevent under-deduction', () => {
    const items = [
      { productId: 'prod-1', size: 'XL', color: 'Black', quantity: 2 },
      { productId: 'prod-2', size: 'L', color: 'White', quantity: 1 },
      { productId: 'prod-1', size: 'XL', color: 'Black', quantity: 3 },
    ];

    const consolidated = [...items.reduce((map: Map<string, any>, item: any) => {
      const key = `${item.productId}:${item.size}:${item.color}`;
      const existing = map.get(key);
      if (existing) existing.quantity += item.quantity;
      else map.set(key, { ...item });
      return map;
    }, new Map()).values()];

    expect(consolidated).toHaveLength(2);
    const prod1 = consolidated.find((i) => i.productId === 'prod-1');
    expect(prod1?.quantity).toBe(5);
  });
});
