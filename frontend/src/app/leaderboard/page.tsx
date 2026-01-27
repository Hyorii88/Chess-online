'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { FaTrophy } from 'react-icons/fa';

export default function LeaderboardPage() {
    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="pt-24 pb-12 px-6 text-center">
                <h1 className="text-4xl font-bold mb-6">Leaderboard</h1>
                <div className="card max-w-2xl mx-auto py-20">
                    <FaTrophy className="text-6xl text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Global Rankings</h2>
                    <p className="text-gray-400">Compete to see your name here!</p>
                </div>
            </div>
        </div>
    );
}
