import axios from 'axios';
import config from '../../config';
import { IPaymentProvider, PaymentInitiationResult, PaymentVerificationResult } from './PaymentProvider.interface';
import { logger } from '../../utils/logger';

export class AamarPayProvider implements IPaymentProvider {
  private get baseUrl(): string {
    return config.aamarpay.isSandbox
      ? 'https://sandbox.aamarpay.com'
      : 'https://secure.aamarpay.com';
  }

  async initiatePayment(order: {
    orderNumber: string;
    amount: number;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    address: string;
  }): Promise<PaymentInitiationResult> {
    const transactionId = `AAMAR-${Date.now()}-${order.orderNumber}`;

    if (!config.aamarpay.storeId || !config.aamarpay.signatureKey) {
      logger.info(`[MOCK aamarPay] Initiating session for order ${order.orderNumber}`);
      return {
        paymentUrl: `${config.clientUrl}/order-success?orderNumber=${order.orderNumber}&paymentStatus=paid&txn=${transactionId}`,
        transactionId,
      };
    }

    const payload = {
      store_id: config.aamarpay.storeId,
      signature_key: config.aamarpay.signatureKey,
      tran_id: transactionId,
      success_url: `${config.apiBaseUrl}/payments/aamarpay/success`,
      fail_url: `${config.apiBaseUrl}/payments/aamarpay/fail`,
      cancel_url: `${config.apiBaseUrl}/payments/aamarpay/cancel`,
      amount: order.amount,
      currency: 'BDT',
      desc: 'Echo Outfits Apparel Order',
      cus_name: order.customerName,
      cus_email: order.customerEmail || 'support@echooutfits.com',
      cus_phone: order.customerPhone,
      cus_add1: order.address,
      cus_city: 'Dhaka',
      cus_country: 'Bangladesh',
      type: 'json',
    };

    try {
      const response = await axios.post(`${this.baseUrl}/jsonpost.php`, payload);
      if (response.data && response.data.result === 'true') {
        return {
          paymentUrl: response.data.payment_url,
          transactionId,
        };
      }
      throw new Error('aamarPay পেমেন্ট লিঙ্ক তৈরি করতে ব্যর্থ হয়েছে');
    } catch (err: any) {
      logger.error('aamarPay init error:', err);
      throw new Error(`aamarPay ত্রুটি: ${err.message}`);
    }
  }

  async verifyPayment(payload: Record<string, any>): Promise<PaymentVerificationResult> {
    const transactionId = payload.mer_txnid;

    if (!config.aamarpay.storeId || !config.aamarpay.signatureKey) {
      return {
        isValid: true,
        status: 'paid',
        amount: Number(payload.amount || 0),
        currency: 'BDT',
        transactionId: transactionId || `MOCK-${Date.now()}`,
        rawResponse: payload,
      };
    }

    try {
      const checkUrl = `${this.baseUrl}/api/v1/trxcheck/request.php?request_id=${transactionId}&store_id=${config.aamarpay.storeId}&signature_key=${config.aamarpay.signatureKey}&type=json`;
      const response = await axios.get(checkUrl);

      const isValid = response.data && response.data.pay_status === 'Successful';
      return {
        isValid,
        status: isValid ? 'paid' : 'failed',
        amount: parseFloat(response.data.amount),
        currency: response.data.currency,
        transactionId,
        bankTransactionId: response.data.bank_trxid,
        cardType: response.data.card_type,
        rawResponse: response.data,
      };
    } catch (err) {
      logger.error('aamarPay verification error:', err);
      return {
        isValid: false,
        status: 'failed',
        amount: 0,
        currency: 'BDT',
        transactionId: transactionId || '',
        rawResponse: { error: String(err) },
      };
    }
  }
}
