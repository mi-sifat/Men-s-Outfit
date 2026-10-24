import { Router } from 'express';
import {
  initiatePayment,
  handleSSLCommerzSuccess,
  handleSSLCommerzFail,
  handleSSLCommerzCancel,
} from '../controllers/payment.controller';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.post('/initiate/:orderId', asyncHandler(initiatePayment));
router.post('/sslcommerz/success', asyncHandler(handleSSLCommerzSuccess));
router.post('/sslcommerz/fail', asyncHandler(handleSSLCommerzFail));
router.post('/sslcommerz/cancel', asyncHandler(handleSSLCommerzCancel));

export default router;
