import api from './api';
import type { User, UserCreate, Token, MessageResponse } from '../types';

export const authService = {
    // Register new user
    async register(data: UserCreate): Promise<MessageResponse> {
        const response = await api.post<MessageResponse>('/auth/register', data);
        return response.data;
    },

    // Login user
    async login(email: string, password: string): Promise<Token> {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        const response = await api.post<Token>('/auth/login', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        // Store token
        localStorage.setItem('access_token', response.data.access_token);
        return response.data;
    },

    // Get current user
    async getMe(): Promise<User> {
        const response = await api.get<User>('/auth/me');
        return response.data;
    },

    // Verify email
    async verifyEmail(token: string): Promise<MessageResponse> {
        const response = await api.get<MessageResponse>(`/auth/verify/${token}`);
        return response.data;
    },

    // Logout
    logout(): void {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
    },

    // Check if logged in
    isAuthenticated(): boolean {
        return !!localStorage.getItem('access_token');
    },

    // Get stored token
    getToken(): string | null {
        return localStorage.getItem('access_token');
    },
};

export default authService;
