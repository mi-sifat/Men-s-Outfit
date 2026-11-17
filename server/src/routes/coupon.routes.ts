import { Router } from 'express';
import { validateCoupon, getCoupons, createCoupon, updateCoupon, deleteCoupon } from '../controllers/coupon.controller';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

// Public checkout validation
router.post('/validate', asyncHandler(validateCoupon));

// Admin management
router.get('/', authenticate, authorize(UserRole.ADMIN, UserRole.OWNER), asyncHandler(getCoupons));
router.post('/', authenticate, authorize(UserRole.ADMIN, UserRole.OWNER), asyncHandler(createCoupon));
router.put('/:id', authenticate, authorize(UserRole.ADMIN, UserRole.OWNER), asyncHandler(updateCoupon));
router.delete('/:id', authenticate, authorize(UserRole.ADMIN, UserRole.OWNER), asyncHandler(deleteCoupon));

export default router;
