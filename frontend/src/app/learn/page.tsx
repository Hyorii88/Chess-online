'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { BookOpen, ChevronRight, Play, ArrowLeft } from 'lucide-react';

export default function LearnPage() {
    const router = useRouter();

    const courses = [
        {
            category: 'Khai cuộc',
            description: 'Nắm vững các nguyên tắc chơi khai cuộc.',
            lessons: [
                { title: 'Nguyên tắc khai cuộc', duration: '28 phút', level: 'Người mới' },
                { title: 'Khai cuộc Ruy Lopez', duration: '45 phút', level: 'Trung bình' },
                { title: 'Gambit hậu', duration: '36 phút', level: 'Nâng cao' },
            ]
        },
        {
            category: 'Chiến thuật & Chiến lược',
            description: 'Mài giũa tầm nhìn chiến thuật và kế hoạch chiến lược.',
            lessons: [
                { title: 'Chiến thuật & Combo', duration: '45 phút', level: 'Người mới' },
                { title: 'Chiến lược nâng cao', duration: '52 phút', level: 'Nâng cao' },
                { title: 'Tấn công vua', duration: '40 phút', level: 'Trung bình' },
            ]
        },
        {
            category: 'Tàn cuộc',
            description: 'Biến lợi thế của bạn thành chiến thắng.',
            lessons: [
                { title: 'Nguyên tắc tàn cuộc', duration: '35 phút', level: 'Người mới' },
                { title: 'Tàn cuộc Vua & Tốt', duration: '42 phút', level: 'Trung bình' },
                { title: 'Kỹ thuật tàn cuộc phức tạp', duration: '55 phút', level: 'Nâng cao' },
            ]
        },
        {
            category: 'Phân tích trận đấu',
            description: 'Học cách phân tích và cải thiện trận đấu của bạn.',
            lessons: [
                { title: 'Cơ bản phân tích', duration: '30 phút', level: 'Người mới' },
                { title: 'Sử dụng công cụ phân tích', duration: '38 phút', level: 'Trung bình' },
                { title: 'Phân tích chuyên sâu', duration: '50 phút', level: 'Nâng cao' },
            ]
        }
    ];

    const getLevelColor = (level: string) => {
        if (level === 'Người mới') return 'text-green-400 bg-green-400/10';
        if (level === 'Trung bình') return 'text-yellow-400 bg-yellow-400/10';
        return 'text-red-400 bg-red-400/10';
    };

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

                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <BookOpen className="w-12 h-12 text-cyan-400" />
                            <h1 className="text-4xl md:text-5xl font-bold">
                                <span className="text-white">Chess </span>
                                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                    Academy
                                </span>
                            </h1>
                        </div>
                        <p className="text-xl text-slate-300">
                            Làm chủ trò chơi với các bài giảng từ Grandmaster và các giảng viên hàng đầu.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {courses.map((course, index) => (
                            <div
                                key={index}
                                className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl overflow-hidden hover:border-cyan-500/50 transition-all"
                            >
                                <div className="p-6 bg-gradient-to-r from-slate-800 to-slate-800/50">
                                    <h2 className="text-2xl font-bold text-white mb-2">{course.category}</h2>
                                    <p className="text-slate-300">{course.description}</p>
                                </div>

                                <div className="divide-y divide-slate-700">
                                    {course.lessons.map((lesson, lessonIndex) => (
                                        <div
                                            key={lessonIndex}
                                            className="p-6 hover:bg-slate-700/30 transition-all cursor-pointer group"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        <Play className="w-6 h-6 text-white" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                                                            {lesson.title}
                                                        </h3>
                                                        <div className="flex items-center gap-3 text-sm">
                                                            <span className="text-slate-400">{lesson.duration}</span>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(lesson.level)}`}>
                                                                {lesson.level}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-6 h-6 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Progress Section */}
                    <div className="mt-12 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8">
                        <h3 className="text-2xl font-bold text-white mb-6">Tiến độ học tập của bạn</h3>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-cyan-400 mb-2">12</div>
                                <div className="text-slate-300">Bài học đã hoàn thành</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-cyan-400 mb-2">8.5h</div>
                                <div className="text-slate-300">Tổng thời gian học</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-cyan-400 mb-2">65%</div>
                                <div className="text-slate-300">Điểm trung bình</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
