import {Router} from 'express';
import {adminMenuController} from '../controllers/adminMenu.controller';
import {requireAdmin, requireAuth} from '../middleware/auth';
import {adminLimiter, uploadLimiter} from '../middleware/rateLimit';
import {singleImage} from '../middleware/upload';
import {validate} from '../middleware/validation';
import {menuItemDto, updateMenuItemDto} from '../dtos/menu.dto';

/** Everything here needs a signed-in admin (owner / cashier account). */
const router = Router();

router.use(adminLimiter, requireAuth, requireAdmin);

router.get('/menu', adminMenuController.list);
router.post('/menu/items', validate(menuItemDto), adminMenuController.create);
router.patch('/menu/items/:id', validate(updateMenuItemDto), adminMenuController.update);
router.delete('/menu/items/:id', adminMenuController.remove);
router.post('/uploads/image', uploadLimiter, singleImage, adminMenuController.uploadImage);

export default router;
