import {Router} from 'express';
import {imageController} from '../controllers/image.controller';
import {publicReadLimiter} from '../middleware/rateLimit';

const router = Router();

router.get('/:id', publicReadLimiter, imageController.get);

export default router;
