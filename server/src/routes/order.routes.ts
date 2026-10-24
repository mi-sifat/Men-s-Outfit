import { Router } from 'express';
import { createOrder, trackOrder, updateOrderStatus } from '../controllers/order.controller';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

// Guest and customer can checkout
router.post('/checkout', asyncHandler(createOrder));

// Public order tracking
router.get('/track/:token', asyncHandler(trackOrder));

// Admin update status (protected with role check)
router.put('/:id/status', authenticate, authorize(UserRole.ADMIN, UserRole.OWNER, UserRole.ORDER_MANAGER), asyncHandler(updateOrderStatus));

export default router;
