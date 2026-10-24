import { Router } from 'express';
import { getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

// Public routes
router.get('/', asyncHandler(getProducts));
router.get('/:slug', asyncHandler(getProductBySlug));

// Admin protected routes
router.post('/', authenticate, authorize(UserRole.ADMIN, UserRole.OWNER, UserRole.INVENTORY_MANAGER), asyncHandler(createProduct));
router.put('/:id', authenticate, authorize(UserRole.ADMIN, UserRole.OWNER, UserRole.INVENTORY_MANAGER), asyncHandler(updateProduct));
router.delete('/:id', authenticate, authorize(UserRole.ADMIN, UserRole.OWNER), asyncHandler(deleteProduct));

export default router;
