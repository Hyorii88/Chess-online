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
                    <div className="hidden md:flex items-center gap-8">
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
                                    className="flex items-center gap-3 glass px-4 py-2 rounded-lg hover:bg-dark-700 transition-colors"
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
                                <Link href="/auth/login" className="btn-secondary py-2 px-6">
                                    Sign In
                                </Link>
                                <Link href="/auth/register" className="btn-primary py-2 px-6">
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
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-50 bg-[#0f172a]/95 backdrop-blur-xl flex flex-col animate-fade-in">
                    {/* Header inside Menu */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                        <span className="text-xl font-bold gradient-text">Menu</span>
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10 transition-colors"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {/* Menu Content */}
                    <div className="flex-1 overflow-y-auto py-8 px-6 flex flex-col gap-2">
                        {isAuthenticated && navLinks.map((link, idx) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group"
                                style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                <span className="text-lg font-medium text-gray-200 group-hover:text-white">{link.label}</span>
                                <span className="text-white/20 group-hover:text-white/50 transition-colors">→</span>
                            </Link>
                        ))}
                    </div>

                    {/* Footer / User Profile */}
                    <div className="p-6 border-t border-white/10 bg-[#0f172a]">
                        {isAuthenticated ? (
                            <div className="flex flex-col gap-4">
                                <Link
                                    href="/profile"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30"
                                >
                                    <img
                                        src={user?.avatar || '/default-avatar.png'}
                                        alt={user?.username}
                                        className="w-12 h-12 rounded-full border-2 border-indigo-500 shadow-lg"
                                    />
                                    <div>
                                        <div className="text-lg font-bold text-white">{user?.username}</div>
                                        <div className="flex items-center gap-2 text-sm text-indigo-300">
                                            <FaTrophy className="text-yellow-500" />
                                            <span className="font-semibold">{user?.elo} Elo</span>
                                        </div>
                                    </div>
                                </Link>

                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full py-4 rounded-xl bg-red-500/10 text-red-400 font-semibold border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                                >
                                    <FaSignOutAlt />
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <Link
                                    href="/auth/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-center py-4 rounded-xl font-semibold bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 transition-all"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/auth/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-center py-4 rounded-xl font-semibold bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 transition-all"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
