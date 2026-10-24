import { Router } from 'express';
import { 
  getDashboardStats, 
  getSettings, 
  updateSettings, 
  getAllOrders, 
  getAuditLogs 
} from '../controllers/admin.controller';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

// Protect all admin routes
router.use(authenticate);
router.use(authorize(UserRole.ADMIN, UserRole.OWNER, UserRole.ORDER_MANAGER));

router.get('/dashboard/stats', asyncHandler(getDashboardStats));
router.get('/orders', asyncHandler(getAllOrders));
router.get('/settings', asyncHandler(getSettings));
router.put('/settings', asyncHandler(updateSettings));
router.get('/audit-logs', asyncHandler(getAuditLogs));

export default router;
