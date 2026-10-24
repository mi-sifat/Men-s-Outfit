import { Request, Response } from 'express';
import { SSLCommerzProvider } from '../integrations/payments/SSLCommerz.provider';
import { AamarPayProvider } from '../integrations/payments/AamarPay.provider';
import { Payment } from '../models/Payment';
import { Order } from '../models/Order';
import { PaymentStatus, PaymentMethod } from '../types';
import { AppError } from '../utils/AppError';
import config from '../config';

const sslcommerz = new SSLCommerzProvider();
const aamarpay = new AamarPayProvider();

// POST /api/payments/initiate/:orderId (Initiate gateway session)
export const initiatePayment = async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const { provider = PaymentMethod.SSLCOMMERZ } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    throw AppError.notFound('অর্ডারটি পাওয়া যায়নি।');
  }

  if (order.paymentStatus === PaymentStatus.PAID) {
    throw AppError.badRequest('এই অর্ডারের মূল্য ইতিমধ্যে পরিশোধিত হয়েছে।');
  }

  const orderPayload = {
    orderNumber: order.orderNumber,
    amount: order.payableTotal,
    customerName: order.shippingAddress.fullName,
    customerPhone: order.shippingAddress.phone,
    customerEmail: order.shippingAddress.email,
    address: order.shippingAddress.addressLine,
  };

  let sessionResult;
  if (provider === PaymentMethod.AAMARPAY) {
    sessionResult = await aamarpay.initiatePayment(orderPayload);
  } else {
    sessionResult = await sslcommerz.initiatePayment(orderPayload);
  }

  // Create or update Pending Payment Record
  await Payment.create({
    order: order._id,
    orderNumber: order.orderNumber,
    provider,
    amount: order.payableTotal,
    transactionId: sessionResult.transactionId,
    status: PaymentStatus.PENDING,
  });

  res.status(200).json({
    success: true,
    data: sessionResult,
  });
};

// POST /api/payments/sslcommerz/success (Callback from gateway)
export const handleSSLCommerzSuccess = async (req: Request, res: Response) => {
  const verification = await sslcommerz.verifyPayment(req.body);

  if (verification.isValid) {
    const payment = await Payment.findOne({ transactionId: verification.transactionId });
    if (payment) {
      payment.status = PaymentStatus.PAID;
      payment.valId = req.body.val_id;
      payment.bankTransactionId = verification.bankTransactionId;
      payment.cardType = verification.cardType;
      payment.verifiedAt = new Date();
      payment.rawResponse = verification.rawResponse;
      await payment.save();

      // Update Order Payment Status
      await Order.findByIdAndUpdate(payment.order, {
        paymentStatus: PaymentStatus.PAID,
      });

      return res.redirect(`${config.clientUrl}/order-success?orderNumber=${payment.orderNumber}&paymentStatus=paid`);
    }
  }

  res.redirect(`${config.clientUrl}/checkout?paymentError=verification_failed`);
};

// POST /api/payments/sslcommerz/fail
export const handleSSLCommerzFail = async (req: Request, res: Response) => {
  const { tran_id } = req.body;
  if (tran_id) {
    await Payment.findOneAndUpdate({ transactionId: tran_id }, { status: PaymentStatus.FAILED });
  }
  res.redirect(`${config.clientUrl}/checkout?paymentError=failed`);
};

// POST /api/payments/sslcommerz/cancel
export const handleSSLCommerzCancel = async (req: Request, res: Response) => {
  const { tran_id } = req.body;
  if (tran_id) {
    await Payment.findOneAndUpdate({ transactionId: tran_id }, { status: PaymentStatus.CANCELLED });
  }
  res.redirect(`${config.clientUrl}/checkout?paymentError=cancelled`);
};
