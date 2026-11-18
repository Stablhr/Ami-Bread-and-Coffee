import {Request, Response, NextFunction} from 'express';
import {orderService} from '../services/order.service';
import {createOrderDto, updateOrderStatusDto} from '../dtos/order.dto';

export const orderController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await orderService.create(req.auth!.userId, createOrderDto.parse(req.body));
      res.status(201).json({order});
    } catch (error) {
      next(error);
    }
  },

  async listMine(req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await orderService.listMine(req.auth!.userId);
      res.set('Cache-Control', 'no-store');
      res.status(200).json({orders});
    } catch (error) {
      next(error);
    }
  },

  async getMine(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await orderService.getMine(req.auth!.userId, String(req.params.id));
      res.set('Cache-Control', 'no-store');
      res.status(200).json({order});
    } catch (error) {
      next(error);
    }
  },

  async adminList(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await orderService.listForAdmin(String(req.query.status ?? 'active'));
      res.set('Cache-Control', 'no-store');
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async adminUpdateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const {status} = updateOrderStatusDto.parse(req.body);
      const order = await orderService.updateStatus(String(req.params.id), status);
      res.status(200).json({order});
    } catch (error) {
      next(error);
    }
  }
};
