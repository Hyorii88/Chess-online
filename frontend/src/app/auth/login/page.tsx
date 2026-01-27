'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { FaChessKnight, FaEnvelope, FaLock } from 'react-icons/fa';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(email, password);

            // Check for returnUrl
            const searchParams = new URLSearchParams(window.location.search);
            const returnUrl = searchParams.get('returnUrl');

            router.push(returnUrl || '/lobby');
        } catch (error) {
            // Error is handled by AuthContext with toast
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-3xl font-bold mb-4">
                        <FaChessKnight className="text-primary-500" />
                        <span className="gradient-text">ChessMaster</span>
                    </Link>
                    <h1 className="text-3xl font-bold mt-4">Welcome Back</h1>
                    <p className="text-gray-400 mt-2">Sign in to continue your chess journey</p>
                </div>

                <form onSubmit={handleSubmit} className="card space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field w-full pl-10"
                                placeholder="your@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field w-full pl-10"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="spinner w-5 h-5 border-2"></div>
                                Signing in...
                            </div>
                        ) : (
                            'Sign In'
                        )}
                    </button>

                    <div className="text-center text-gray-400">
                        Don't have an account?{' '}
                        <Link
                            href={`/auth/register${typeof window !== 'undefined' && window.location.search ? window.location.search : ''}`}
                            className="text-primary-500 hover:text-primary-400 font-semibold"
                        >
                            Sign up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
