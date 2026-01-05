import axios from 'axios';

// Assuming lead-service runs on 4003, accessed via Vite proxy or direct URL
// Update this base URL if handled differently in other api files.
// Let's check api/leads.api.ts to match the pattern.
const API_URL = 'http://localhost:4003/todos';

export interface Todo {
    id: number;
    text: string;
    done: boolean;
    userId?: string;
}

export const fetchTodos = async (userId?: string) => {
    return await axios.get<Todo[]>(API_URL, { params: { userId } });
};

export const createTodo = async (text: string, userId?: string) => {
    return await axios.post<Todo>(API_URL, { text, userId });
};

export const toggleTodo = async (id: number) => {
    return await axios.put<Todo>(`${API_URL}/${id}/toggle`);
};

export const deleteTodo = async (id: number) => {
    return await axios.delete(`${API_URL}/${id}`);
};
