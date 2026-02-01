'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import Navbar from '@/components/Navbar';
import { Bot, Users, Plus } from 'lucide-react';
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
            toast.success('Tìm thấy đối thủ!');
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
            const response = await gameAPI.createGame({
                whiteId: user?.id,
                blackId: user?.id,
                mode: 'ai',
                aiDifficulty: aiDifficulty
            });

            const gameId = response.data.game._id;
            router.push(`/play/${gameId}?mode=ai&difficulty=${aiDifficulty}`);
        } catch (error) {
            toast.error('Không thể tạo trận với AI');
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

        toast.success('Đang tìm đối thủ...');
    };

    const handleCancelSearch = () => {
        if (!socket || !user) return;

        socket.emit('leaveQueue', { userId: user.id });
        setIsSearching(false);
        toast.success('Đã hủy tìm kiếm');
    };

    const handleCreateRoom = async () => {
        try {
            const response = await gameAPI.createGame({
                whiteId: user?.id,
                blackId: user?.id,
                mode: 'online'
            });

            const gameId = response.data.game._id;
            router.push(`/play/${gameId}?mode=private`);
        } catch (error) {
            toast.error('Không thể tạo phòng');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-400">Đang tải...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
            <Navbar />

            <div className="py-12 px-4 pt-24">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            <span className="text-white">Chọn </span>
                            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                Chế độ chơi
                            </span>
                        </h1>
                        <p className="text-xl text-slate-300">
                            Thử thách kỹ năng của bạn với AI hoặc đối đầu với người chơi thực
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Play vs AI */}
                        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 hover:bg-slate-800 transition-all">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                                    <Bot className="w-7 h-7 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-white">Chơi với AI</h2>
                                    <p className="text-slate-400">Luyện tập với công cụ Stockfish có thể điều chỉnh độ khó</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-slate-300 font-medium">Độ khó: {aiDifficulty}/20</span>
                                    <div className="flex gap-2 text-xs">
                                        <span className="text-slate-500">Người mới</span>
                                        <span className="text-slate-300">Cao thủ</span>
                                    </div>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="20"
                                    value={aiDifficulty}
                                    onChange={(e) => setAiDifficulty(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                />
                            </div>

                            <button
                                onClick={handlePlayAI}
                                className="w-full py-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-semibold text-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-cyan-500/30"
                            >
                                Bắt đầu trận đấu
                            </button>
                        </div>

                        {/* Quick Match */}
                        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 hover:bg-slate-800 transition-all">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                                    <Users className="w-7 h-7 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-white">Tìm trận đấu nhanh</h2>
                                    <p className="text-slate-400">Được ghép với người chơi có trình độ tương tự</p>
                                </div>
                            </div>

                            {isSearching ? (
                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-900/50 rounded-xl">
                                        <div className="flex items-center justify-center gap-3 mb-3">
                                            <div className="w-6 h-6 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-cyan-400 font-medium">Đang tìm đối thủ...</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleCancelSearch}
                                        className="w-full py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold text-lg transition-all"
                                    >
                                        Hủy tìm kiếm
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-6 p-4 bg-slate-900/50 rounded-xl">
                                        <div className="flex items-center justify-center gap-3">
                                            <span className="text-slate-300">ELO của bạn:</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-3xl font-bold text-cyan-400">{user?.elo || 1200}</span>
                                                <span className="text-slate-500 text-sm">(Ước tính)</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleQuickMatch}
                                        className="w-full py-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-semibold text-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-cyan-500/30"
                                    >
                                        Tìm đối thủ
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Create Room */}
                        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 hover:bg-slate-800 transition-all">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                                    <Plus className="w-7 h-7 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-white">Tạo phòng</h2>
                                    <p className="text-slate-400">Tạo trận đấu riêng và mời bạn bè của bạn</p>
                                </div>
                            </div>

                            <div className="mb-6 p-4 bg-slate-900/50 rounded-xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <input
                                        type="radio"
                                        id="unlimited"
                                        name="timeControl"
                                        defaultChecked
                                        className="w-4 h-4 accent-cyan-500"
                                    />
                                    <label htmlFor="unlimited" className="text-slate-300 font-medium">
                                        Không giới hạn thời gian
                                    </label>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="radio"
                                        id="timed"
                                        name="timeControl"
                                        className="w-4 h-4 accent-cyan-500"
                                    />
                                    <label htmlFor="timed" className="text-slate-300 font-medium">
                                        10 phút mỗi người
                                    </label>
                                </div>
                            </div>

                            <button
                                onClick={handleCreateRoom}
                                className="w-full py-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-semibold text-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-cyan-500/30"
                            >
                                Tạo trận đấu
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
