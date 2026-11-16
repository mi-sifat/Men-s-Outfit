import { Router } from 'express';
import {
  initiatePayment,
  handleSSLCommerzSuccess,
  handleSSLCommerzFail,
  handleSSLCommerzCancel,
  handleAamarPaySuccess,
  handleAamarPayFail,
  handleAamarPayCancel,
} from '../controllers/payment.controller';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.post('/initiate/:orderId', asyncHandler(initiatePayment));
router.post('/sslcommerz/success', asyncHandler(handleSSLCommerzSuccess));
router.post('/sslcommerz/fail', asyncHandler(handleSSLCommerzFail));
router.post('/sslcommerz/cancel', asyncHandler(handleSSLCommerzCancel));
router.post('/aamarpay/success', asyncHandler(handleAamarPaySuccess));
router.post('/aamarpay/fail', asyncHandler(handleAamarPayFail));
router.post('/aamarpay/cancel', asyncHandler(handleAamarPayCancel));

export default router;
