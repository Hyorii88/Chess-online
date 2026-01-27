'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface User {
    id: string;
    username: string;
    email: string;
    avatar: string;
    elo: number;
    isAdmin?: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await authAPI.verify();
                    setUser(response.data.user);
                } catch (error) {
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await authAPI.login({ email, password });
            const { token, user: userData } = response.data;

            localStorage.setItem('token', token);
            setUser(userData);
            toast.success('Login successful!');
        } catch (error: any) {
            console.error("Login Check Error:", error);
            let message = 'Login failed';

            if (error.response) {
                // Server responded with a status code outside 2xx
                message = error.response.data?.error || `Server Error: ${error.response.status}`;
            } else if (error.request) {
                // Request made but no response received
                message = 'Cannot connect to server. Please check if Backend is running.';
            } else {
                // Something else happened
                message = error.message;
            }

            toast.error(message);
            throw error;
        }
    };

    const register = async (username: string, email: string, password: string) => {
        try {
            const response = await authAPI.register({ username, email, password });
            const { token, user: userData } = response.data;

            localStorage.setItem('token', token);
            setUser(userData);
            toast.success('Registration successful!');
        } catch (error: any) {
            const message = error.response?.data?.error || 'Registration failed';
            toast.error(message);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        toast.success('Logged out successfully');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
