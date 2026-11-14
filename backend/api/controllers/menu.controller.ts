import {Request, Response, NextFunction} from 'express';
import {menuService} from '../services/menu.service';

export const menuController = {
  async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await menuService.getMenu();
      res.set('Cache-Control', 'public, max-age=60');
      res.status(200).json({categories});
    } catch (error) {
      next(error);
    }
  },

  async getItem(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await menuService.getItem(String(req.params.slug));
      res.status(200).json({item});
    } catch (error) {
      next(error);
    }
  }
};
