export interface PaymentInitiationResult {
  paymentUrl: string;
  transactionId: string;
  sessionId?: string;
}

export interface PaymentVerificationResult {
  isValid: boolean;
  status: 'paid' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  transactionId: string;
  bankTransactionId?: string;
  cardType?: string;
  rawResponse: Record<string, any>;
}

export interface IPaymentProvider {
  initiatePayment(order: {
    orderNumber: string;
    amount: number;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    address: string;
  }): Promise<PaymentInitiationResult>;

  verifyPayment(payload: Record<string, any>): Promise<PaymentVerificationResult>;
}
