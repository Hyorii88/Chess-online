'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { BookOpen, ChevronRight, Play, ArrowLeft, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export default function LearnPage() {
    const router = useRouter();
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [selectedLessonTitle, setSelectedLessonTitle] = useState<string>("");

    const courses = [
        {
            category: 'Khai cuộc (Openings)',
            description: 'Nắm vững các nguyên tắc chơi khai cuộc.',
            lessons: [
                { title: 'Nguyên tắc khai cuộc cơ bản', duration: '15 phút', level: 'Người mới', videoId: '21L45Qo6flk' }, // GothamChess - Openings
                { title: 'Khai cuộc Ruy Lopez', duration: '20 phút', level: 'Trung bình', videoId: 'pA-A1_E0_k' },
                { title: 'Gambit Hậu (Queen\'s Gambit)', duration: '18 phút', level: 'Nâng cao', videoId: '0GeCdj-N07I' },
            ]
        },
        {
            category: 'Chiến thuật (Tactics)',
            description: 'Mài giũa tầm nhìn chiến thuật và kế hoạch chiến lược.',
            lessons: [
                { title: 'Đòn chiến thuật cơ bản', duration: '25 phút', level: 'Người mới', videoId: 'fQUaYfUoF-k' },
                { title: 'Tấn công Vua', duration: '30 phút', level: 'Nâng cao', videoId: '9g8g5pS6qU0' },
                { title: 'Chiến lược trung cuộc', duration: '40 phút', level: 'Trung bình', videoId: '2D0K1d1gV44' }, // Hikaru
            ]
        },
        {
            category: 'Tàn cuộc (Endgames)',
            description: 'Biến lợi thế của bạn thành chiến thắng.',
            lessons: [
                { title: 'Chiếu hết cơ bản', duration: '10 phút', level: 'Người mới', videoId: '4I5x5l2Qy5w' },
                { title: 'Tàn cuộc Xe cơ bản', duration: '35 phút', level: 'Trung bình', videoId: '5k8Fp7h_k6E' },
                { title: 'Kỹ thuật phong cấp Tốt', duration: '20 phút', level: 'Nâng cao', videoId: 'mCj8d8f_k6E' },
            ]
        }
    ];

    const getLevelColor = (level: string) => {
        if (level === 'Người mới') return 'text-green-400 bg-green-400/10';
        if (level === 'Trung bình') return 'text-yellow-400 bg-yellow-400/10';
        return 'text-red-400 bg-red-400/10';
    };

    const handleLessonClick = (videoId: string, title: string) => {
        setSelectedVideo(videoId);
        setSelectedLessonTitle(title);
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
                            Làm chủ trò chơi với các video bài giảng chọn lọc chất lượng cao.
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
                                            onClick={() => handleLessonClick(lesson.videoId, lesson.title)}
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
                </div>
            </div>

            {/* Video Modal */}
            {selectedVideo && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedVideo(null)}>
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Play className="w-5 h-5 text-cyan-400" />
                                {selectedLessonTitle}
                            </h3>
                            <button onClick={() => setSelectedVideo(null)} className="text-slate-400 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="aspect-video w-full bg-black">
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
