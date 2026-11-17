import {Router} from 'express';
import {orderController} from '../controllers/order.controller';
import {requireAuth, requireCustomer} from '../middleware/auth';
import {authReadLimiter, orderLimiter} from '../middleware/rateLimit';
import {validate} from '../middleware/validation';
import {createOrderDto} from '../dtos/order.dto';

/** Customer orders. Only signed-in customer accounts (not admin) can order. */
const router = Router();

router.use(requireAuth, requireCustomer);

router.post('/', orderLimiter, validate(createOrderDto), orderController.create);
router.get('/mine', authReadLimiter, orderController.listMine);
router.get('/:id', authReadLimiter, orderController.getMine);

export default router;
