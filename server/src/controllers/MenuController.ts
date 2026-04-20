import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { MenuService } from '../services/MenuService';

export const getMenu = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await MenuService.getMenu(req.user!.id);
    res.json(result);
  } catch (err) { next(err); }
};

export const addCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await MenuService.addCategory(req.user!.id, req.body);
    res.status(201).json(result);
  } catch (err) { next(err); }
};

export const updateCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await MenuService.updateCategory(req.user!.id, parseInt(req.params.id), req.body);
    res.json(result);
  } catch (err) { next(err); }
};

export const deleteCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await MenuService.deleteCategory(req.user!.id, parseInt(req.params.id));
    res.status(204).send();
  } catch (err) { next(err); }
};

export const addDish = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await MenuService.addDish(req.user!.id, req.body);
    res.status(201).json(result);
  } catch (err) { next(err); }
};

export const updateDish = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await MenuService.updateDish(req.user!.id, parseInt(req.params.id), req.body);
    res.json(result);
  } catch (err) { next(err); }
};

export const deleteDish = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await MenuService.deleteDish(req.user!.id, parseInt(req.params.id));
    res.status(204).send();
  } catch (err) { next(err); }
};

export const seedMenu = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await MenuService.seedMenu(req.user!.id, req.body);
    res.status(200).json({ message: 'Menu seeded successfully' });
  } catch (err) { next(err); }
};

