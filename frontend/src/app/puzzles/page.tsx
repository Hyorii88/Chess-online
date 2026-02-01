'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { ArrowLeft, Lightbulb } from 'lucide-react';

export default function PuzzlesPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
            <Navbar />

            <div className="py-12 px-4 pt-24">
                <div className="max-w-6xl mx-auto">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-semibold">Quay lại</span>
                    </button>

                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                                <span className="text-white font-bold">🧩</span>
                            </div>
                            <h1 className="text-4xl font-bold text-white">Bài đố chiến thuật</h1>
                        </div>
                        <p className="text-slate-300 text-lg">
                            Nâng cao kỹ năng chiến thuật của bạn với hàng nghìn bài đố cờ
                        </p>
                    </div>

                    {/* Puzzle Categories */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                title: 'Chiếu hết trong 1 nước',
                                description: 'Tìm nước đi chiếu hết trong một nước',
                                difficulty: 'Dễ',
                                count: 500,
                                color: 'from-green-500 to-emerald-600'
                            },
                            {
                                title: 'Fork đôi',
                                description: 'Tìm vị trí fork tấn công hai quân',
                                difficulty: 'Trung bình',
                                count: 350,
                                color: 'from-yellow-500 to-orange-600'
                            },
                            {
                                title: 'Phá cơ đồ',
                                description: 'Hy sinh quân để phá vỡ phòng thủ',
                                difficulty: 'Khó',
                                count: 250,
                                color: 'from-red-500 to-pink-600'
                            },
                            {
                                title: 'Chiến thuật nâng cao',
                                description: 'Kết hợp nhiều chiến thuật phức tạp',
                                difficulty: 'Rất khó',
                                count: 150,
                                color: 'from-purple-500 to-indigo-600'
                            },
                            {
                                title: 'Tàn cuộc',
                                description: 'Chiếu hết trong tàn cuộc',
                                difficulty: 'Trung bình',
                                count: 300,
                                color: 'from-blue-500 to-cyan-600'
                            },
                            {
                                title: 'Hỗn hợp',
                                description: 'Bài tập ngẫu nhiên mọi cấp độ',
                                difficulty: 'Đa dạng',
                                count: 1000,
                                color: 'from-pink-500 to-rose-600'
                            },
                        ].map((category, index) => (
                            <div
                                key={index}
                                className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 hover:bg-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group"
                            >
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <Lightbulb className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{category.title}</h3>
                                <p className="text-slate-400 mb-4 text-sm">{category.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="px-3 py-1 bg-slate-900/50 rounded-full text-xs font-semibold text-slate-300">
                                        {category.difficulty}
                                    </span>
                                    <span className="text-cyan-400 font-semibold text-sm">{category.count} bài đố</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Stats Section */}
                    <div className="mt-12 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-6">Thống kê của bạn</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-cyan-400 mb-2">45</div>
                                <div className="text-slate-300">Đã giải</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-green-400 mb-2">78%</div>
                                <div className="text-slate-300">Tỷ lệ đúng</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-yellow-400 mb-2">1450</div>
                                <div className="text-slate-300">Điểm đố</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-purple-400 mb-2">12</div>
                                <div className="text-slate-300">Chuỗi hiện tại</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
