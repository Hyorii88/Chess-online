'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Trophy, Medal, Award, Crown, ArrowLeft } from 'lucide-react';

const topPlayers = [
    { rank: 1, name: 'GrandMaster_VN', avatar: '👑', rating: 2850, country: 'VN', wins: 1547, losses: 234 },
    { rank: 2, name: 'ChessProdigy', avatar: '🎯', rating: 2780, country: 'US', wins: 1423, losses: 312 },
    { rank: 3, name: 'TacticalGenius', avatar: '🧠', rating: 2720, country: 'RU', wins: 1389, losses: 289 },
    { rank: 4, name: 'EndgameKing', avatar: '♔', rating: 2680, country: 'IN', wins: 1256, losses: 267 },
    { rank: 5, name: 'StrategicMind', avatar: '⚡', rating: 2645, country: 'DE', wins: 1198, losses: 245 },
    { rank: 6, name: 'CheckmateQueen', avatar: '♕', rating: 2610, country: 'FR', wins: 1156, losses: 234 },
    { rank: 7, name: 'PositionalPlayer', avatar: '🎲', rating: 2575, country: 'ES', wins: 1089, losses: 221 },
    { rank: 8, name: 'TacticalWizard', avatar: '🧙', rating: 2540, country: 'BR', wins: 1034, losses: 209 },
    { rank: 9, name: 'BlitzMaster', avatar: '⚔️', rating: 2505, country: 'CA', wins: 989, losses: 198 },
    { rank: 10, name: 'DefensiveRock', avatar: '🛡️', rating: 2470, country: 'UK', wins: 945, losses: 187 },
];

export default function LeaderboardPage() {
    const router = useRouter();

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
        if (rank === 2) return <Medal className="w-6 h-6 text-slate-300" />;
        if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
        return <span className="text-slate-400 font-bold text-lg">{rank}</span>;
    };

    const getRankBadge = (rank: number) => {
        if (rank === 1) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
        if (rank === 2) return 'bg-gradient-to-r from-slate-300 to-slate-400';
        if (rank === 3) return 'bg-gradient-to-r from-amber-600 to-amber-700';
        return 'bg-slate-700';
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
            <Navbar />

            <div className="py-12 px-4 pt-24">
                <div className="max-w-5xl mx-auto">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-semibold">Quay lại</span>
                    </button>

                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Trophy className="w-12 h-12 text-cyan-400" />
                            <h1 className="text-4xl md:text-5xl font-bold text-white">Bảng xếp hạng</h1>
                        </div>
                        <p className="text-xl text-slate-300">
                            Top người chơi được xếp hạng theo điểm ELO
                        </p>
                    </div>

                    {/* Top 3 Podium */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        {topPlayers.slice(0, 3).map((player) => (
                            <div
                                key={player.rank}
                                className={`${player.rank === 1
                                        ? 'md:order-2 scale-105'
                                        : player.rank === 2
                                            ? 'md:order-1'
                                            : 'md:order-3'
                                    } bg-slate-800/50 backdrop-blur border ${player.rank === 1 ? 'border-yellow-500/50' : 'border-slate-700'
                                    } rounded-2xl p-6 text-center transform transition-all hover:scale-105`}
                            >
                                <div className="flex justify-center mb-4">
                                    {getRankIcon(player.rank)}
                                </div>
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-4xl mx-auto mb-4">
                                    {player.avatar}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{player.name}</h3>
                                <div className="text-3xl font-bold text-cyan-400 mb-2">{player.rating}</div>
                                <div className="flex justify-center gap-4 text-sm text-slate-400">
                                    <span>{player.wins}W</span>
                                    <span>{player.losses}L</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Rest of Leaderboard */}
                    <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-900/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Hạng</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Người chơi</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Quốc gia</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Điểm ELO</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Thắng</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Thua</th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Tỷ lệ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                    {topPlayers.map((player) => {
                                        const winRate = ((player.wins / (player.wins + player.losses)) * 100).toFixed(1);
                                        return (
                                            <tr key={player.rank} className="hover:bg-slate-700/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className={`w-10 h-10 rounded-lg ${getRankBadge(player.rank)} flex items-center justify-center`}>
                                                        {player.rank <= 3 ? (
                                                            getRankIcon(player.rank)
                                                        ) : (
                                                            <span className="text-white font-bold">{player.rank}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-2xl">
                                                            {player.avatar}
                                                        </div>
                                                        <span className="font-semibold text-white">{player.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="px-3 py-1 bg-slate-700 rounded-full text-sm text-slate-300">
                                                        {player.country}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="text-lg font-bold text-cyan-400">{player.rating}</span>
                                                </td>
                                                <td className="px-6 py-4 text-center text-green-400 font-semibold">
                                                    {player.wins}
                                                </td>
                                                <td className="px-6 py-4 text-center text-red-400 font-semibold">
                                                    {player.losses}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="text-slate-300 font-semibold">{winRate}%</span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Your Stats */}
                    <div className="mt-8 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-6">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <Trophy className="w-6 h-6 text-cyan-400" />
                            Thống kê của bạn
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-slate-400 text-sm mb-1">Hạng hiện tại</div>
                                <div className="text-2xl font-bold text-white">#127</div>
                            </div>
                            <div className="text-center">
                                <div className="text-slate-400 text-sm mb-1">Điểm ELO</div>
                                <div className="text-2xl font-bold text-cyan-400">1450</div>
                            </div>
                            <div className="text-center">
                                <div className="text-slate-400 text-sm mb-1">Tổng trận</div>
                                <div className="text-2xl font-bold text-white">342</div>
                            </div>
                            <div className="text-center">
                                <div className="text-slate-400 text-sm mb-1">Tỷ lệ thắng</div>
                                <div className="text-2xl font-bold text-green-400">58.4%</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
