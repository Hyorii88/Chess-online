'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Trophy, Medal, Award, Crown, ArrowLeft } from 'lucide-react';

export default function LeaderboardPage() {
    const router = useRouter();
    const [topPlayers, setTopPlayers] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/leaderboard?limit=50`;
                console.log('Fetching leaderboard from:', apiUrl);
                const response = await fetch(apiUrl);
                console.log('Leaderboard response status:', response.status);

                if (response.ok) {
                    const data = await response.json();
                    console.log('Leaderboard data received:', data);
                    // Clean and map data
                    const mappedData = data.map((player: any, index: number) => ({
                        rank: index + 1,
                        name: player.username,
                        avatar: player.avatar || '♟️',
                        rating: player.rating || player.elo || 1500,
                        country: 'VN', // Default for now
                        wins: player.wins || 0,
                        losses: player.losses || 0,
                        gamesPlayed: player.gamesPlayed || (player.wins + player.losses) || 0
                    }));
                    setTopPlayers(mappedData);
                } else {
                    console.error('Leaderboard response not ok:', await response.text());
                }
            } catch (error) {
                console.error('Failed to fetch leaderboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

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
                        <span className="font-semibold">Back</span>
                    </button>

                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Trophy className="w-12 h-12 text-cyan-400" />
                            <h1 className="text-4xl md:text-5xl font-bold text-white">Leaderboard</h1>
                        </div>
                        <p className="text-xl text-slate-300">
                            Top players ranked by ELO rating
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center text-white">Loading leaderboard...</div>
                    ) : (
                        <>
                            {/* Top 3 Podium */}
                            <div className="grid md:grid-cols-3 gap-6 mb-12">
                                {topPlayers.slice(0, 3).map((player: any) => (
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
                                        <div className="w-20 h-20 rounded-full border-2 border-cyan-500 flex items-center justify-center overflow-hidden mx-auto mb-4">
                                            <img src={player.avatar.startsWith('http') ? player.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.name}`} alt={player.name} className="w-full h-full object-cover" />
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
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Rank</th>
                                                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">Player</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">ELO</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">W</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">L</th>
                                                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-300">Win Rate</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-700">
                                            {topPlayers.map((player: any) => {
                                                const total = player.wins + player.losses;
                                                const winRate = total > 0 ? ((player.wins / total) * 100).toFixed(1) : '0.0';
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
                                                                <div className="w-10 h-10 rounded-full border border-gray-600 overflow-hidden">
                                                                    <img src={player.avatar.startsWith('http') ? player.avatar : `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.name}`} alt={player.name} className="w-full h-full object-cover" />
                                                                </div>
                                                                <span className="font-semibold text-white">{player.name}</span>
                                                            </div>
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
