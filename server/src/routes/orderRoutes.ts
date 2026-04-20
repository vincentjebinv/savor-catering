import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { getOrders, createOrder, deleteOrder } from '../controllers/OrderController';

const router = Router();

router.use(authenticate);

router.get('/', getOrders);
router.post('/', createOrder);
router.delete('/:id', deleteOrder);

export default router;

