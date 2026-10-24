import { Router } from 'express';
import { 
  register, 
  login, 
  getMe, 
  logout, 
  setupFirstAdmin, 
  checkAdminStatus, 
  changePassword 
} from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validate';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public auth routes
router.get('/admin-status', asyncHandler(checkAdminStatus));
router.post('/setup-admin', authLimiter, asyncHandler(setupFirstAdmin));
router.post('/register', authLimiter, validateRequest(registerSchema), asyncHandler(register));
router.post('/login', authLimiter, validateRequest(loginSchema), asyncHandler(login));

// Protected auth routes
router.get('/me', authenticate, asyncHandler(getMe));
router.put('/change-password', authenticate, asyncHandler(changePassword));
router.post('/logout', asyncHandler(logout));

export default router;
