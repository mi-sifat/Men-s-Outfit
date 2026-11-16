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
  if (![PaymentMethod.SSLCOMMERZ, PaymentMethod.AAMARPAY].includes(provider)) {
    throw AppError.badRequest('সমর্থিত পেমেন্ট গেটওয়ে নির্বাচন করুন।');
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

  if (verification.isValid && verification.status === 'paid' && verification.currency === 'BDT') {
    const payment = await Payment.findOne({ transactionId: verification.transactionId, provider: PaymentMethod.SSLCOMMERZ });
    if (payment && Math.abs(verification.amount - payment.amount) < 0.01) {
      const order = await Order.findById(payment.order);
      if (!order || Math.abs(order.payableTotal - payment.amount) >= 0.01) {
        return res.redirect(`${config.clientUrl}/checkout?paymentError=verification_failed`);
      }
      if (payment.status !== PaymentStatus.PAID) {
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
      }

      return res.redirect(`${config.clientUrl}/order-success?orderNumber=${payment.orderNumber}&paymentStatus=paid`);
    }
  }

  res.redirect(`${config.clientUrl}/checkout?paymentError=verification_failed`);
};

// POST /api/payments/sslcommerz/fail
export const handleSSLCommerzFail = async (req: Request, res: Response) => {
  const { tran_id } = req.body;
  if (tran_id) {
    await Payment.findOneAndUpdate(
      { transactionId: tran_id, provider: PaymentMethod.SSLCOMMERZ, status: PaymentStatus.PENDING },
      { status: PaymentStatus.FAILED }
    );
  }
  res.redirect(`${config.clientUrl}/checkout?paymentError=failed`);
};

// POST /api/payments/sslcommerz/cancel
export const handleSSLCommerzCancel = async (req: Request, res: Response) => {
  const { tran_id } = req.body;
  if (tran_id) {
    await Payment.findOneAndUpdate(
      { transactionId: tran_id, provider: PaymentMethod.SSLCOMMERZ, status: PaymentStatus.PENDING },
      { status: PaymentStatus.CANCELLED }
    );
  }
  res.redirect(`${config.clientUrl}/checkout?paymentError=cancelled`);
};

// aamarPay callbacks are verified server-to-server before changing payment state.
export const handleAamarPaySuccess = async (req: Request, res: Response) => {
  const verification = await aamarpay.verifyPayment(req.body);
  if (verification.isValid && verification.status === 'paid' && verification.currency === 'BDT') {
    const payment = await Payment.findOne({ transactionId: verification.transactionId, provider: PaymentMethod.AAMARPAY });
    if (payment && Math.abs(verification.amount - payment.amount) < 0.01) {
      const order = await Order.findById(payment.order);
      if (order && Math.abs(order.payableTotal - payment.amount) < 0.01) {
        if (payment.status !== PaymentStatus.PAID) {
          payment.status = PaymentStatus.PAID;
          payment.bankTransactionId = verification.bankTransactionId;
          payment.cardType = verification.cardType;
          payment.verifiedAt = new Date();
          payment.rawResponse = verification.rawResponse;
          await payment.save();
          await Order.findByIdAndUpdate(payment.order, { paymentStatus: PaymentStatus.PAID });
        }
        return res.redirect(`${config.clientUrl}/order-success?orderNumber=${payment.orderNumber}&paymentStatus=paid`);
      }
    }
  }
  return res.redirect(`${config.clientUrl}/checkout?paymentError=verification_failed`);
};

export const handleAamarPayFail = async (req: Request, res: Response) => {
  const verification = await aamarpay.verifyPayment(req.body);
  if (verification.transactionId) {
    await Payment.findOneAndUpdate(
      { transactionId: verification.transactionId, provider: PaymentMethod.AAMARPAY, status: PaymentStatus.PENDING },
      { status: PaymentStatus.FAILED }
    );
  }
  return res.redirect(`${config.clientUrl}/checkout?paymentError=failed`);
};

export const handleAamarPayCancel = async (req: Request, res: Response) => {
  const verification = await aamarpay.verifyPayment(req.body);
  if (verification.transactionId) {
    await Payment.findOneAndUpdate(
      { transactionId: verification.transactionId, provider: PaymentMethod.AAMARPAY, status: PaymentStatus.PENDING },
      { status: PaymentStatus.CANCELLED }
    );
  }
  return res.redirect(`${config.clientUrl}/checkout?paymentError=cancelled`);
};
