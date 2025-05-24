import axios from 'axios';

const BASE_URL_TODO = import.meta.env.VITE_BASE_URL_TODO;

export const fetchAllTodos = async () => {
    try {
        const response = await axios.get(`${BASE_URL_TODO}/get`, {
            withCredentials: true
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const userAddTask = async (todo: string, description: string) => {
    try {
        const response = await axios.post(`${BASE_URL_TODO}/save`, {
            task: todo,
            description: description
        }, {
            withCredentials: true
        });

        return response.data.newTodo;
    } catch (error) {
        throw error;
    }
};

export const userEditTask = async (id: string, editingText: string, editingDesc: string) => {
    try {
        const response = await axios.put(`${BASE_URL_TODO}/update/${id}`, {
            task: editingText,
            description: editingDesc
        }, {
            withCredentials: true
        });

        return response.data.updatedTodo;
    } catch (error) {
        throw error;
    }
};

export const userDeleteTask = async (id: string) => {
    try {
        await axios.delete(`${BASE_URL_TODO}/delete/${id}`, {
            withCredentials: true
        });
    } catch (error) {
        throw error;
    }
};

export const userToggleCompleted = async (id: string) => {
    try {
        const response = await axios.put(`${BASE_URL_TODO}/toggle/${id}`, {}, {
            withCredentials: true
        });

        return response.data.updatedTodo;
    } catch (error) {
        throw error;
    }
};  
