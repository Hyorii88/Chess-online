'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { FaChessKnight, FaUser, FaBars, FaTimes, FaTrophy, FaSignOutAlt } from 'react-icons/fa';

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    const navLinks = [
        { href: '/lobby', label: 'Play' },
        { href: '/puzzles', label: 'Puzzles' },
        { href: '/learn', label: 'Learn' },
        { href: '/analyze', label: 'Analyze' },
        { href: '/leaderboard', label: 'Leaderboard' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-dark-700">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 text-2xl font-bold group">
                        <FaChessKnight className="text-primary-500 group-hover:rotate-12 transition-transform" />
                        <span className="gradient-text">ChessMaster</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {isAuthenticated && navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-gray-300 hover:text-white transition-colors font-medium"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* User Menu */}
                    <div className="hidden md:flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-2 glass px-4 py-2 rounded-lg hover:bg-dark-700 transition-colors"
                                >
                                    <img
                                        src={user?.avatar || '/default-avatar.png'}
                                        alt={user?.username}
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <div className="text-left">
                                        <div className="text-sm font-semibold">{user?.username}</div>
                                        <div className="text-xs text-gray-400 flex items-center gap-1">
                                            <FaTrophy className="text-yellow-500" />
                                            {user?.elo}
                                        </div>
                                    </div>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="btn-secondary py-2 px-4 flex items-center gap-2"
                                >
                                    <FaSignOutAlt />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/login" className="btn-secondary py-2 px-4">
                                    Sign In
                                </Link>
                                <Link href="/auth/register" className="btn-primary py-2 px-4">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-2xl text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 border-t border-dark-700 pt-4">
                        {isAuthenticated && navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="block py-2 text-gray-300 hover:text-white transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="mt-4 space-y-2">
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        href="/profile"
                                        className="block glass px-4 py-3 rounded-lg"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={user?.avatar || '/default-avatar.png'}
                                                alt={user?.username}
                                                className="w-8 h-8 rounded-full"
                                            />
                                            <div>
                                                <div className="text-sm font-semibold">{user?.username}</div>
                                                <div className="text-xs text-gray-400">Elo: {user?.elo}</div>
                                            </div>
                                        </div>
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full btn-secondary py-2"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/auth/login"
                                        className="block text-center btn-secondary py-2"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/auth/register"
                                        className="block text-center btn-primary py-2"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
