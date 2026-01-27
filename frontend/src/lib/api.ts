import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data: { username: string; email: string; password: string }) =>
        api.post('/auth/register', data),
    login: (data: { email: string; password: string }) =>
        api.post('/auth/login', data),
    verify: () => api.get('/auth/verify'),
};

// User API
export const userAPI = {
    getProfile: (id?: string) => api.get(id ? `/user/profile/${id}` : '/user/profile'),
    updateProfile: (data: { username?: string; avatar?: string }) =>
        api.put('/user/profile', data),
    getStats: (id?: string) => api.get(`/user/stats/${id || ''}`),
    getLeaderboard: () => api.get('/user/leaderboard'),
};

// Game API
export const gameAPI = {
    createGame: (data: any) => api.post('/games/create', data),
    getGame: (id: string) => api.get(`/games/${id}`),
    getUserGames: (userId?: string) => api.get(`/games/user/${userId || ''}`),
    updateGame: (id: string, data: any) => api.put(`/games/${id}`, data),
    endGame: (id: string, data: { result: string; endReason: string }) =>
        api.post(`/games/${id}/end`, data),
};

// Puzzle API
export const puzzleAPI = {
    getRandom: (params?: { difficulty?: number; tags?: string }) =>
        api.get('/puzzles/random', { params }),
    getAll: (params?: { difficulty?: number; tags?: string; limit?: number; skip?: number }) =>
        api.get('/puzzles/all', { params }),
    getById: (id: string) => api.get(`/puzzles/${id}`),
    validate: (data: { puzzleId: string; moves: string[] }) =>
        api.post('/puzzles/validate', data),
    create: (data: any) => api.post('/puzzles/create', data),
    update: (id: string, data: any) => api.put(`/puzzles/${id}`, data),
    delete: (id: string) => api.delete(`/puzzles/${id}`),
};

// Lesson API
export const lessonAPI = {
    getAll: (params?: { category?: string; difficulty?: string }) =>
        api.get('/lessons', { params }),
    getById: (id: string) => api.get(`/lessons/${id}`),
    like: (id: string) => api.post(`/lessons/${id}/like`),
    complete: (id: string) => api.post(`/lessons/${id}/complete`),
    create: (data: any) => api.post('/lessons/create', data),
    update: (id: string, data: any) => api.put(`/lessons/${id}`, data),
    delete: (id: string) => api.delete(`/lessons/${id}`),
};

// Analysis API
export const analysisAPI = {
    analyzePosition: (fen: string) => api.post('/analysis/position', { fen }),
    getBestMove: (fen: string, difficulty?: number) =>
        api.post('/analysis/best-move', { fen, difficulty }),
    getTopMoves: (fen: string, count?: number) =>
        api.post('/analysis/top-moves', { fen, count }),
};

// Chatbot API
export const chatbotAPI = {
    chat: (message: string, context?: any[]) =>
        api.post('/chatbot/chat', { message, context }),
};

export default api;
