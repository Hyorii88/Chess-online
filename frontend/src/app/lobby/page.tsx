'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import Navbar from '@/components/Navbar';
import { FaRobot, FaUsers, FaPlus, FaClock, FaTrophy } from 'react-icons/fa';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';
import { gameAPI } from '@/lib/api';

export default function LobbyPage() {
    const { user, isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [aiDifficulty, setAiDifficulty] = useState(10);

    useEffect(() => {
        // Wait for auth to finish loading before redirecting
        if (loading) return;

        if (!isAuthenticated) {
            router.push(`/auth/login?returnUrl=${encodeURIComponent(window.location.pathname)}`);
            return;
        }

        // Connect to matchmaking socket
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
        const newSocket = io(`${socketUrl}/matchmaking`);

        newSocket.on('connect', () => {
            console.log('Connected to matchmaking');
        });

        newSocket.on('matchFound', (data) => {
            toast.success('Match found!');
            setIsSearching(false);
            router.push(`/play/${data.roomId}`);
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, [isAuthenticated, loading, router]);

    const handlePlayAI = async () => {
        try {
            // Create AI game
            const response = await gameAPI.createGame({
                whiteId: user?.id,
                blackId: user?.id, // AI games use same user ID
                mode: 'ai',
                aiDifficulty: aiDifficulty
            });

            const gameId = response.data.game._id;
            router.push(`/play/${gameId}?mode=ai&difficulty=${aiDifficulty}`);
        } catch (error) {
            toast.error('Failed to create AI game');
        }
    };

    const handleQuickMatch = () => {
        if (!socket || !user) return;

        setIsSearching(true);
        socket.emit('joinQueue', {
            userId: user.id,
            username: user.username,
            elo: user.elo
        });

        toast.success('Searching for opponent...');
    };

    const handleCancelSearch = () => {
        if (!socket || !user) return;

        socket.emit('leaveQueue', { userId: user.id });
        setIsSearching(false);
        toast.success('Search cancelled');
    };

    const handleCreateRoom = async () => {
        try {
            const response = await gameAPI.createGame({
                whiteId: user?.id,
                blackId: user?.id, // Will be updated when opponent joins
                mode: 'online'
            });

            const gameId = response.data.game._id;
            router.push(`/play/${gameId}?mode=private`);
        } catch (error) {
            toast.error('Failed to create room');
        }
    };

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="spinner w-12 h-12 border-4 mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen">
            <Navbar />

            <div className="pt-32 pb-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold mb-4">
                            Choose Your <span className="gradient-text">Game Mode</span>
                        </h1>
                        <p className="text-xl text-gray-400">
                            Test your skills against AI or challenge real players
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        {/* Play vs AI */}
                        <div className="card text-center group hover:border-primary-500 transition-all">
                            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 rounded-lg inline-block mb-4 group-hover:scale-110 transition-transform">
                                <FaRobot className="text-6xl" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Play vs AI</h3>
                            <p className="text-gray-400 mb-6">
                                Practice against Stockfish engine with adjustable difficulty
                            </p>

                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2">
                                    Difficulty: {aiDifficulty}/20
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="20"
                                    value={aiDifficulty}
                                    onChange={(e) => setAiDifficulty(parseInt(e.target.value))}
                                    className="w-full accent-primary-500"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>Beginner</span>
                                    <span>Master</span>
                                </div>
                            </div>

                            <button onClick={handlePlayAI} className="w-full btn-primary">
                                Start Game
                            </button>
                        </div>

                        {/* Quick Match */}
                        <div className="card text-center group hover:border-green-500 transition-all">
                            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-lg inline-block mb-4 group-hover:scale-110 transition-transform">
                                <FaUsers className="text-6xl" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Quick Match</h3>
                            <p className="text-gray-400 mb-6">
                                Get matched with a player of similar skill level
                            </p>

                            {isSearching ? (
                                <div className="space-y-4">
                                    <div className="flex justify-center">
                                        <div className="spinner"></div>
                                    </div>
                                    <p className="text-primary-400">Searching for opponent...</p>
                                    <button onClick={handleCancelSearch} className="w-full btn-secondary">
                                        Cancel Search
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-6 py-8">
                                        <div className="text-sm text-gray-400">Your Elo</div>
                                        <div className="text-3xl font-bold text-yellow-500 flex items-center justify-center gap-2">
                                            <FaTrophy />
                                            {user?.elo}
                                        </div>
                                    </div>
                                    <button onClick={handleQuickMatch} className="w-full btn-primary">
                                        Find Match
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Create Room */}
                        <div className="card text-center group hover:border-purple-500 transition-all">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-lg inline-block mb-4 group-hover:scale-110 transition-transform">
                                <FaPlus className="text-6xl" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Create Room</h3>
                            <p className="text-gray-400 mb-6">
                                Create a private game and invite your friends
                            </p>

                            <div className="mb-6 py-8">
                                <div className="text-sm text-gray-400 mb-2">Game Settings</div>
                                <div className="flex items-center justify-center gap-2 text-gray-300">
                                    <FaClock />
                                    <span>Unlimited Time</span>
                                </div>
                            </div>

                            <button onClick={handleCreateRoom} className="w-full btn-primary">
                                Create Game
                            </button>
                        </div>
                    </div>

                    {/* Recent Games */}
                    <div className="card">
                        <h2 className="text-2xl font-bold mb-6">Recent Games</h2>
                        <div className="text-center text-gray-400 py-8">
                            <p>No recent games yet. Start playing to see your game history!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
