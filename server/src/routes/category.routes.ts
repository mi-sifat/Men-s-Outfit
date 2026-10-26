import { Router } from 'express';
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

// Public routes
router.get('/', asyncHandler(getCategories));
router.get('/:slug', asyncHandler(getCategoryBySlug));

// Admin protected routes
router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.OWNER, UserRole.INVENTORY_MANAGER),
  asyncHandler(createCategory)
);
router.put(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.OWNER, UserRole.INVENTORY_MANAGER),
  asyncHandler(updateCategory)
);
router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.OWNER),
  asyncHandler(deleteCategory)
);

export default router;
