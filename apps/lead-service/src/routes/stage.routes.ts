import { Router } from 'express';
import { StageController } from '../controllers/stage.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, StageController.getAll);
router.post('/', authenticate, StageController.create);
router.delete('/:id', authenticate, StageController.delete);

export default router;
