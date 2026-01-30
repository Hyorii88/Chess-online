'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/lib/AuthContext';
import { FaUser, FaTrophy, FaChartLine, FaClock, FaPuzzlePiece, FaFire, FaCalendar, FaEdit, FaMedal, FaCrown, FaStar, FaChess } from 'react-icons/fa';

export default function ProfilePage() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    // Mock data - in production, this would come from API
    const stats = {
        totalGames: 147,
        wins: 82,
        losses: 51,
        draws: 14,
        winRate: 55.8,
        currentStreak: 5,
        longestStreak: 12,
        puzzlesSolved: 324,
        puzzleAccuracy: 87.3,
        rapidRating: user?.elo || 1500,
        blitzRating: 1450,
        bulletRating: 1380,
    };

    const recentGames = [
        { id: 1, opponent: 'Grandmaster99', result: 'win', timeControl: 'Rapid 10+0', date: '2026-01-29', myColor: 'white' },
        { id: 2, opponent: 'ChessKnight', result: 'loss', timeControl: 'Blitz 5+0', date: '2026-01-29', myColor: 'black' },
        { id: 3, opponent: 'TacticMaster', result: 'win', timeControl: 'Rapid 10+0', date: '2026-01-28', myColor: 'white' },
        { id: 4, opponent: 'PawnStorm', result: 'draw', timeControl: 'Rapid 15+10', date: '2026-01-28', myColor: 'black' },
        { id: 5, opponent: 'QueenSlayer', result: 'win', timeControl: 'Blitz 3+2', date: '2026-01-27', myColor: 'white' },
    ];

    const achievements = [
        { id: 1, name: '100 Games', description: 'Play 100 games', icon: <FaChess />, unlocked: true },
        { id: 2, name: 'Puzzle Master', description: 'Solve 300 puzzles', icon: <FaPuzzlePiece />, unlocked: true },
        { id: 3, name: 'Win Streak 10', description: 'Win 10 games in a row', icon: <FaFire />, unlocked: true },
        { id: 4, name: '1500 Elo', description: 'Reach 1500 rating', icon: <FaTrophy />, unlocked: true },
        { id: 5, name: 'Champion', description: 'Win a tournament', icon: <FaCrown />, unlocked: false },
        { id: 6, name: 'Legend', description: 'Reach 2000 rating', icon: <FaStar />, unlocked: false },
    ];

    return (
        <div className="min-h-screen bg-dark-900">
            <Navbar />
            <div className="pt-24 pb-12 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Profile Header */}
                    <div className="card p-8 mb-6">
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                            {/* Avatar */}
                            <div className="relative group">
                                <img
                                    src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'}
                                    alt={user?.username}
                                    className="w-32 h-32 rounded-full border-4 border-primary-500 shadow-xl"
                                />
                                {isEditing && (
                                    <button className="absolute bottom-0 right-0 bg-primary-600 p-2 rounded-full hover:bg-primary-500 transition-colors">
                                        <FaEdit className="text-white" />
                                    </button>
                                )}
                            </div>

                            {/* User Info */}
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-4xl font-bold gradient-text">{user?.username || 'Guest'}</h1>
                                    <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-bold rounded-full flex items-center gap-1">
                                        <FaCrown className="text-xs" /> Pro
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-4 text-gray-400 mb-4">
                                    <div className="flex items-center gap-2">
                                        <FaTrophy className="text-yellow-500" />
                                        <span className="font-semibold text-white">{user?.elo || 1500}</span> Elo
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaCalendar className="text-blue-400" />
                                        Joined Jan 2026
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaFire className="text-orange-500" />
                                        {stats.currentStreak} Win Streak
                                    </div>
                                </div>
                                {!isEditing ? (
                                    <p className="text-gray-300 max-w-2xl">
                                        Passionate chess player always looking to improve. Favorite opening: Sicilian Defense. Let's play!
                                    </p>
                                ) : (
                                    <textarea
                                        className="w-full max-w-2xl bg-dark-800 border border-dark-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500"
                                        rows={3}
                                        placeholder="Tell us about yourself..."
                                        defaultValue="Passionate chess player always looking to improve. Favorite opening: Sicilian Defense. Let's play!"
                                    />
                                )}
                            </div>

                            {/* Edit Button */}
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className={`btn-${isEditing ? 'primary' : 'secondary'} px-6 py-2 flex items-center gap-2`}
                            >
                                <FaEdit />
                                {isEditing ? 'Save' : 'Edit Profile'}
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 overflow-x-auto">
                        {['overview', 'stats', 'games', 'achievements'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-3 rounded-lg font-semibold capitalize transition-all whitespace-nowrap ${activeTab === tab
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'overview' && (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Quick Stats */}
                            <div className="card p-6">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <FaChartLine className="text-primary-500" />
                                    Quick Stats
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Total Games</span>
                                        <span className="font-bold text-xl">{stats.totalGames}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Win Rate</span>
                                        <span className="font-bold text-xl text-green-400">{stats.winRate}%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Puzzles Solved</span>
                                        <span className="font-bold text-xl text-purple-400">{stats.puzzlesSolved}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Win/Loss/Draw */}
                            <div className="card p-6">
                                <h3 className="text-xl font-bold mb-4">Game Results</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                                        <div className="text-3xl font-bold text-green-400">{stats.wins}</div>
                                        <div className="text-xs text-gray-400">Wins</div>
                                    </div>
                                    <div className="text-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                                        <div className="text-3xl font-bold text-red-400">{stats.losses}</div>
                                        <div className="text-xs text-gray-400">Losses</div>
                                    </div>
                                    <div className="text-center p-3 bg-gray-500/10 rounded-lg border border-gray-500/20">
                                        <div className="text-3xl font-bold text-gray-400">{stats.draws}</div>
                                        <div className="text-xs text-gray-400">Draws</div>
                                    </div>
                                </div>
                            </div>

                            {/* Time Controls */}
                            <div className="card p-6">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <FaClock className="text-blue-400" />
                                    Ratings
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Rapid</span>
                                        <span className="font-bold text-xl">{stats.rapidRating}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Blitz</span>
                                        <span className="font-bold text-xl">{stats.blitzRating}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Bullet</span>
                                        <span className="font-bold text-xl">{stats.bulletRating}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity Chart Placeholder */}
                            <div className="card p-6 md:col-span-2 lg:col-span-3">
                                <h3 className="text-xl font-bold mb-4">Rating Progress</h3>
                                <div className="h-64 bg-dark-800 rounded-lg flex items-center justify-center border border-dark-700">
                                    <div className="text-center text-gray-500">
                                        <FaChartLine className="text-4xl mx-auto mb-2 text-gray-600" />
                                        <p>Rating history chart</p>
                                        <p className="text-sm">(Chart visualization would go here)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'stats' && (
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="card p-6">
                                <h3 className="text-2xl font-bold mb-6">Detailed Statistics</h3>
                                <div className="space-y-4">
                                    <div className="bg-dark-800 p-4 rounded-lg">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-400">Puzzle Accuracy</span>
                                            <span className="font-bold">{stats.puzzleAccuracy}%</span>
                                        </div>
                                        <div className="w-full bg-dark-700 rounded-full h-2">
                                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${stats.puzzleAccuracy}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="bg-dark-800 p-4 rounded-lg">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-400">Win Rate</span>
                                            <span className="font-bold">{stats.winRate}%</span>
                                        </div>
                                        <div className="w-full bg-dark-700 rounded-full h-2">
                                            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${stats.winRate}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-dark-800 rounded-lg">
                                        <span className="text-gray-400">Longest Win Streak</span>
                                        <span className="text-2xl font-bold text-orange-400">{stats.longestStreak}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 bg-dark-800 rounded-lg">
                                        <span className="text-gray-400">Current Streak</span>
                                        <span className="text-2xl font-bold text-yellow-400">{stats.currentStreak}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="card p-6">
                                <h3 className="text-2xl font-bold mb-6">Activity Heatmap</h3>
                                <div className="h-64 bg-dark-800 rounded-lg flex items-center justify-center border border-dark-700">
                                    <div className="text-center text-gray-500">
                                        <FaCalendar className="text-4xl mx-auto mb-2 text-gray-600" />
                                        <p>Games played per day</p>
                                        <p className="text-sm">(Activity calendar would go here)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'games' && (
                        <div className="card p-6">
                            <h3 className="text-2xl font-bold mb-6">Recent Games</h3>
                            <div className="space-y-3">
                                {recentGames.map((game) => (
                                    <div
                                        key={game.id}
                                        className="flex items-center justify-between p-4 bg-dark-800 rounded-lg hover:bg-dark-700 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl ${game.result === 'win' ? 'bg-green-500/20 text-green-400' :
                                                    game.result === 'loss' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-gray-500/20 text-gray-400'
                                                }`}>
                                                {game.result === 'win' ? 'W' : game.result === 'loss' ? 'L' : 'D'}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-white">vs {game.opponent}</div>
                                                <div className="text-sm text-gray-400">{game.timeControl}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-400">{game.date}</div>
                                            <div className="text-xs text-gray-500 capitalize">{game.myColor}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'achievements' && (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {achievements.map((achievement) => (
                                <div
                                    key={achievement.id}
                                    className={`card p-6 transition-all ${achievement.unlocked
                                            ? 'border-2 border-yellow-500/50 shadow-lg shadow-yellow-500/20'
                                            : 'opacity-50 grayscale'
                                        }`}
                                >
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 mx-auto ${achievement.unlocked
                                            ? 'bg-gradient-to-br from-yellow-500 to-orange-500 text-white'
                                            : 'bg-dark-800 text-gray-600'
                                        }`}>
                                        {achievement.icon}
                                    </div>
                                    <h4 className="text-lg font-bold text-center mb-2">{achievement.name}</h4>
                                    <p className="text-sm text-gray-400 text-center">{achievement.description}</p>
                                    {achievement.unlocked && (
                                        <div className="mt-4 text-center">
                                            <span className="text-xs text-yellow-400 font-semibold">✓ UNLOCKED</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
