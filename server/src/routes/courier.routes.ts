import { Router } from 'express';
import { createShipment } from '../controllers/courier.controller';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

// Admin creates shipment
router.post('/ship/:orderId', authenticate, authorize(UserRole.ADMIN, UserRole.OWNER, UserRole.ORDER_MANAGER), asyncHandler(createShipment));

export default router;
