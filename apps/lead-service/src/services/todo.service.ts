import { AppDataSource } from '../config/data-source';
import { Todo } from '../entities/todo.entity';

export const TodoRepository = AppDataSource.getRepository(Todo);

export const createTodo = async (text: string, userId?: string) => {
    const todo = TodoRepository.create({ text, userId, done: false });
    return await TodoRepository.save(todo);
};

export const getTodos = async (userId?: string) => {
    // If we have userId, filter by it. For now, if no userId is passed, maybe return all or none?
    // Let's assume we want to support filtering by user if possible.
    if (userId) {
        return await TodoRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' } // Newest first
        });
    }
    return await TodoRepository.find({
        order: { createdAt: 'DESC' }
    });
};

export const toggleTodo = async (id: number) => {
    const todo = await TodoRepository.findOneBy({ id });
    if (!todo) return null;
    todo.done = !todo.done;
    return await TodoRepository.save(todo);
};

export const deleteTodo = async (id: number) => {
    return await TodoRepository.delete(id);
};
