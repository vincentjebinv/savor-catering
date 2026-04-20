import { Router } from 'express';
import { authenticate } from '../middleware/authMiddleware';
import { 
  getMenu, addCategory, updateCategory, deleteCategory,
  addDish, updateDish, deleteDish, seedMenu
} from '../controllers/MenuController';


const router = Router();

router.use(authenticate); // 🛡️ GLOBAL AUTH FOR ALL MENU ROUTES

router.get('/', getMenu);
router.post('/category', addCategory);
router.put('/category/:id', updateCategory);
router.delete('/category/:id', deleteCategory);

router.post('/dish', addDish);
router.put('/dish/:id', updateDish);
router.delete('/dish/:id', deleteDish);

router.post('/seed', seedMenu);

export default router;

