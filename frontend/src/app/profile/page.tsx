'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/lib/AuthContext';
import { FaUserCircle } from 'react-icons/fa';

export default function ProfilePage() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="pt-24 pb-12 px-6">
                <div className="max-w-4xl mx-auto card text-center py-20">
                    <FaUserCircle className="text-8xl text-gray-400 mx-auto mb-6" />
                    <h1 className="text-4xl font-bold mb-2">{user ? user.username : 'Guest'}</h1>
                    <p className="text-gray-400 text-xl">Elo Rating: {user ? user.elo : 'N/A'}</p>

                    <div className="mt-8 grid grid-cols-3 gap-4 max-w-lg mx-auto">
                        <div className="bg-dark-800 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-green-400">0</div>
                            <div className="text-sm text-gray-400">Wins</div>
                        </div>
                        <div className="bg-dark-800 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-red-400">0</div>
                            <div className="text-sm text-gray-400">Losses</div>
                        </div>
                        <div className="bg-dark-800 p-4 rounded-lg">
                            <div className="text-2xl font-bold text-gray-400">0</div>
                            <div className="text-sm text-gray-400">Draws</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
