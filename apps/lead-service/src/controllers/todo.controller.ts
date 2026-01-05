import { Request, Response } from 'express';
import * as todoService from '../services/todo.service';

export const getTodos = async (req: Request, res: Response) => {
    try {
        // Ideally extract userId from the authenticated request (via middleware)
        // For now we might just pass it or assume it's global if not strictly required by the prompt
        // But usually "lead-service" requests are authenticated.
        // Let's see if we have user info in headers or body.
        // The previous code didn't show auth middleware on 'leadRoutes' in index.ts, so maybe it's open or handled upstream?
        // User-service usually handles auth. Frontend sends token.
        // We'll try to get userId from req.query or req.body or just return all for now.
        // Wait, let's look at `Dashboard.tsx`, it has `user` from Redux. We can send userId in headers or query.
        // For simplicity, let's just fetch all or filter by query `userId`.
        const userId = req.query.userId as string;
        const todos = await todoService.getTodos(userId);
        res.json(todos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching todos', error });
    }
};

export const createTodo = async (req: Request, res: Response) => {
    try {
        const { text, userId } = req.body;
        if (!text) {
            return res.status(400).json({ message: 'Text is required' });
        }
        const todo = await todoService.createTodo(text, userId);
        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({ message: 'Error creating todo', error });
    }
};

export const toggleTodo = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const todo = await todoService.toggleTodo(Number(id));
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }
        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: 'Error toggling todo', error });
    }
};

export const deleteTodo = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await todoService.deleteTodo(Number(id));
        res.json({ message: 'Todo deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting todo', error });
    }
};
