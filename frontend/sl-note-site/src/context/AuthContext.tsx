import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthState } from '../types';
import authService from '../services/authService';

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (fullName: string, email: string, password: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        token: authService.getToken(),
        isAuthenticated: authService.isAuthenticated(),
        isLoading: true,
    });

    // Load user on mount if token exists
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const user = await authService.getMe();
                    setState({
                        user,
                        token,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch {
                    // Token invalid, clear it
                    localStorage.removeItem('access_token');
                    setState({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        isLoading: false,
                    });
                }
            } else {
                setState((prev) => ({ ...prev, isLoading: false }));
            }
        };

        loadUser();
    }, []); // Now safe - no external dependencies

    const login = async (email: string, password: string) => {
        const tokenData = await authService.login(email, password);
        const user = await authService.getMe();
        setState({
            user,
            token: tokenData.access_token,
            isAuthenticated: true,
            isLoading: false,
        });
    };

    const logout = () => {
        authService.logout();
        setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
        });
    };

    const register = async (fullName: string, email: string, password: string): Promise<string> => {
        const response = await authService.register({
            full_name: fullName,
            email,
            password,
        });
        return response.message;
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
