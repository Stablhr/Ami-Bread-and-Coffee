import Router from 'express';
import authRoutes from './auth.routes';
import menuRoutes from './menu.routes';
import adminRoutes from './admin.routes';
import imageRoutes from './images.routes';
import orderRoutes from './orders.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/menu', menuRoutes);
router.use('/images', imageRoutes);
router.use('/orders', orderRoutes);
router.use('/admin', adminRoutes);

export default router;