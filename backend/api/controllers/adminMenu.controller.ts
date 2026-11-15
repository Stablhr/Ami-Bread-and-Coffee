import {Request, Response, NextFunction} from 'express';
import {adminMenuService} from '../services/adminMenu.service';
import {imageService} from '../services/image.service';
import {menuItemDto, updateMenuItemDto} from '../dtos/menu.dto';

export const adminMenuController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await adminMenuService.getMenu();
      res.set('Cache-Control', 'no-store');
      res.status(200).json({categories});
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      // validate() already checked the body; parse again to apply defaults.
      const item = await adminMenuService.createItem(menuItemDto.parse(req.body));
      res.status(201).json({item});
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = updateMenuItemDto.parse(req.body);
      const item = await adminMenuService.updateItem(String(req.params.id), dto);
      res.status(200).json({item});
    } catch (error) {
      next(error);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await adminMenuService.deleteItem(String(req.params.id));
      res.status(200).json({message: 'Deleted'});
    } catch (error) {
      next(error);
    }
  },

  async uploadImage(req: Request, res: Response, next: NextFunction) {
    try {
      const image = await imageService.upload(req.file);
      res.status(201).json({image});
    } catch (error) {
      next(error);
    }
  }
};
