import { Router } from 'express';
import * as todoController from '../controllers/todo.controller';

const router = Router();

router.get('/', todoController.getTodos);
router.post('/', todoController.createTodo);
router.put('/:id/toggle', todoController.toggleTodo);
router.delete('/:id', todoController.deleteTodo);

export default router;
