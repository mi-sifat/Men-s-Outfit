import { NextFunction, Request, Response, Router } from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/upload.controller';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';
import { AppError } from '../utils/AppError';

const router = Router();
const acceptedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']);
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!acceptedImageTypes.has(file.mimetype)) return callback(AppError.badRequest('শুধু JPG, PNG, WebP, AVIF বা GIF image upload করা যাবে।'));
    callback(null, true);
  },
});

const parseImageUpload = (req: Request, res: Response, next: NextFunction) => {
  imageUpload.single('image')(req, res, (error: unknown) => {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') return next(AppError.badRequest('Image must be 8 MB or smaller.'));
      return next(AppError.badRequest('Select one valid image file.'));
    }
    next(error);
  });
};

router.post(
  '/image',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.OWNER, UserRole.INVENTORY_MANAGER),
  parseImageUpload,
  asyncHandler(uploadImage)
);

export default router;
