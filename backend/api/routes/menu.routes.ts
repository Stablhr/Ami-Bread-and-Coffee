import {Router} from 'express';
import {menuController} from '../controllers/menu.controller';
import {publicReadLimiter} from '../middleware/rateLimit';

const router = Router();

router.get('/', publicReadLimiter, menuController.list);
router.get('/items/:slug', publicReadLimiter, menuController.getItem);

export default router;
