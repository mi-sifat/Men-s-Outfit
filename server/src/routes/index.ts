import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import orderRoutes from './order.routes';
import couponRoutes from './coupon.routes';
import paymentRoutes from './payment.routes';
import courierRoutes from './courier.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/coupons', couponRoutes);
router.use('/payments', paymentRoutes);
router.use('/couriers', courierRoutes);
router.use('/admin', adminRoutes);

export default router;
