import axios from 'axios';
import config from '../../config';
import { IPaymentProvider, PaymentInitiationResult, PaymentVerificationResult } from './PaymentProvider.interface';
import { logger } from '../../utils/logger';

export class SSLCommerzProvider implements IPaymentProvider {
  private get baseUrl(): string {
    return config.sslcommerz.isSandbox
      ? 'https://sandbox.sslcommerz.com'
      : 'https://securepay.sslcommerz.com';
  }

  async initiatePayment(order: {
    orderNumber: string;
    amount: number;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    address: string;
  }): Promise<PaymentInitiationResult> {
    const transactionId = `TXN-${Date.now()}-${order.orderNumber}`;

    // If live credentials are not set, return simulated gateway session for dev test
    if (!config.sslcommerz.storeId || !config.sslcommerz.storePassword) {
      logger.info(`[MOCK SSLCOMMERZ] Initiating session for order ${order.orderNumber} (Amount: ৳${order.amount})`);
      return {
        paymentUrl: `${config.clientUrl}/order-success?orderNumber=${order.orderNumber}&paymentStatus=paid&txn=${transactionId}`,
        transactionId,
        sessionId: `MOCK-SESSION-${Date.now()}`,
      };
    }

    const payload = {
      store_id: config.sslcommerz.storeId,
      store_passwd: config.sslcommerz.storePassword,
      total_amount: order.amount,
      currency: 'BDT',
      tran_id: transactionId,
      success_url: `${config.apiBaseUrl}/payments/sslcommerz/success`,
      fail_url: `${config.apiBaseUrl}/payments/sslcommerz/fail`,
      cancel_url: `${config.apiBaseUrl}/payments/sslcommerz/cancel`,
      ipn_url: `${config.apiBaseUrl}/payments/sslcommerz/ipn`,
      shipping_method: 'Courier',
      product_name: 'Echo Outfits Apparel',
      product_category: 'Clothing',
      product_profile: 'general',
      cus_name: order.customerName,
      cus_email: order.customerEmail || 'customer@echooutfits.com',
      cus_add1: order.address,
      cus_city: 'Dhaka',
      cus_country: 'Bangladesh',
      cus_phone: order.customerPhone,
      ship_name: order.customerName,
      ship_add1: order.address,
      ship_city: 'Dhaka',
      ship_country: 'Bangladesh',
    };

    try {
      const response = await axios.post(`${this.baseUrl}/gwprocess/v4/api.php`, payload);
      if (response.data && response.data.status === 'SUCCESS') {
        return {
          paymentUrl: response.data.GatewayPageURL,
          transactionId,
          sessionId: response.data.sessionkey,
        };
      }
      throw new Error(response.data.failedreason || 'SSLCOMMERZ সেশন তৈরি করতে ব্যর্থ হয়েছে');
    } catch (err: any) {
      logger.error('SSLCOMMERZ session error:', err);
      throw new Error(`পেমেন্ট সেশন ত্রুটি: ${err.message}`);
    }
  }

  async verifyPayment(payload: Record<string, any>): Promise<PaymentVerificationResult> {
    const valId = payload.val_id;

    if (!config.sslcommerz.storeId || !config.sslcommerz.storePassword) {
      // Mock validation mode
      return {
        isValid: true,
        status: 'paid',
        amount: Number(payload.amount || 0),
        currency: 'BDT',
        transactionId: payload.tran_id || `MOCK-${Date.now()}`,
        rawResponse: payload,
      };
    }

    try {
      const response = await axios.get(
        `${this.baseUrl}/validator/api/validationserverAPI.php?val_id=${valId}&store_id=${config.sslcommerz.storeId}&store_passwd=${config.sslcommerz.storePassword}&v=1&format=json`
      );

      const data = response.data;
      const isValid = data.status === 'VALID' || data.status === 'VALIDATED';

      return {
        isValid,
        status: isValid ? 'paid' : 'failed',
        amount: parseFloat(data.amount),
        currency: data.currency,
        transactionId: data.tran_id,
        bankTransactionId: data.bank_tran_id,
        cardType: data.card_type,
        rawResponse: data,
      };
    } catch (err) {
      logger.error('SSLCOMMERZ validation error:', err);
      return {
        isValid: false,
        status: 'failed',
        amount: 0,
        currency: 'BDT',
        transactionId: payload.tran_id || '',
        rawResponse: { error: String(err) },
      };
    }
  }
}
