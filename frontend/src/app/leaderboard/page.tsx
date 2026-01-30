'use client';

import { useState, useEffect } from 'react';
import { leaderboardAPI } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { FaTrophy, FaMedal } from 'react-icons/fa';

interface Player {
    _id: string;
    username: string;
    rating: number;
    gamesPlayed: number;
    wins: number;
    losses: number;
    draws: number;
    avatar: string;
}

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLeaderboard();
    }, []);

    const loadLeaderboard = async () => {
        try {
            const data = await leaderboardAPI.getLeaderboard(50);
            setLeaderboard(data);
        } catch (error) {
            console.error('Failed to load leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-900 text-white">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent inline-flex items-center gap-4">
                        <FaTrophy className="text-yellow-500" />
                        Leaderboard
                    </h1>
                    <p className="text-gray-400 mt-4 text-lg">Top players ranked by ELO rating</p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                    </div>
                ) : (
                    <div className="card max-w-5xl mx-auto overflow-hidden shadow-2xl bg-dark-800 rounded-xl border border-dark-700">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-dark-700/50 border-b border-dark-600">
                                        <th className="p-6 text-left font-bold text-gray-300">Rank</th>
                                        <th className="p-6 text-left font-bold text-gray-300">Player</th>
                                        <th className="p-6 text-right font-bold text-gray-300">Rating</th>
                                        <th className="p-6 text-right font-bold text-gray-300 hidden md:table-cell">Games</th>
                                        <th className="p-6 text-right font-bold text-gray-300 hidden md:table-cell">Win Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboard.map((player, index) => (
                                        <tr
                                            key={player._id}
                                            className={`border-b border-dark-700/50 hover:bg-dark-700 transition-colors
                                                ${index === 0 ? 'bg-yellow-500/5 hover:bg-yellow-500/10' : ''}
                                                ${index === 1 ? 'bg-gray-400/5 hover:bg-gray-400/10' : ''}
                                                ${index === 2 ? 'bg-orange-500/5 hover:bg-orange-500/10' : ''}
                                            `}
                                        >
                                            <td className="p-6">
                                                <div className="flex items-center gap-2">
                                                    {index < 3 ? (
                                                        <FaMedal className={`text-2xl ${index === 0 ? 'text-yellow-400 drop-shadow-glow' :
                                                                index === 1 ? 'text-gray-300' :
                                                                    'text-amber-600'
                                                            }`} />
                                                    ) : (
                                                        <span className="text-gray-500 font-mono w-6 text-center text-lg">#{index + 1}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-dark-600 overflow-hidden border border-dark-500">
                                                        {player.avatar ? (
                                                            <img
                                                                src={player.avatar}
                                                                alt={player.username}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg font-bold">
                                                                {player.username.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className={`font-bold text-lg ${index < 3 ? 'text-white' : 'text-gray-300'}`}>
                                                        {player.username}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-6 text-right">
                                                <span className={`text-2xl font-bold font-mono ${index === 0 ? 'text-yellow-400' : 'text-primary-400'
                                                    }`}>
                                                    {player.rating}
                                                </span>
                                            </td>
                                            <td className="p-6 text-right text-gray-400 hidden md:table-cell">
                                                {player.gamesPlayed}
                                            </td>
                                            <td className="p-6 text-right hidden md:table-cell">
                                                <div className="flex items-center justify-end gap-2">
                                                    <div className="w-24 bg-dark-600 rounded-full h-2 overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${(player.wins / player.gamesPlayed * 100) >= 50 ? 'bg-green-500' : 'bg-red-500'
                                                                }`}
                                                            style={{ width: `${player.gamesPlayed > 0 ? (player.wins / player.gamesPlayed * 100) : 0}%` }}
                                                        />
                                                    </div>
                                                    <span className={`font-mono font-semibold ${(player.wins / player.gamesPlayed * 100) >= 50
                                                            ? 'text-green-400'
                                                            : 'text-red-400'
                                                        }`}>
                                                        {player.gamesPlayed > 0
                                                            ? `${Math.round(player.wins / player.gamesPlayed * 100)}%`
                                                            : '0%'
                                                        }
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
