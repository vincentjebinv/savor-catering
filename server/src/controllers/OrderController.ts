import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { OrderService } from '../services/OrderService';

export const getOrders = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await OrderService.getOrders(req.user!.id);
    res.json(result);
  } catch (err) { next(err); }
};

export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await OrderService.createOrder(req.user!.id, req.body);
    res.status(201).json(result);
  } catch (err) { next(err); }
};

export const deleteOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await OrderService.deleteOrder(req.user!.id, parseInt(req.params.id));
    res.status(204).send();
  } catch (err) { next(err); }
};
