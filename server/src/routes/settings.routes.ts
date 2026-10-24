import { Router } from 'express';
import { getPublicSettings } from '../controllers/settings.controller';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Public storefront settings
router.get('/', asyncHandler(getPublicSettings));

export default router;
