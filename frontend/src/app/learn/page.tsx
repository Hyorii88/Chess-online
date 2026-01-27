'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { FaBookOpen, FaVideo, FaChessBoard, FaGraduationCap, FaPlay, FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function LearnPage() {
    // State to track which lesson is currently expanded (playing video)
    const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

    const toggleLesson = (id: string) => {
        if (activeLessonId === id) {
            setActiveLessonId(null);
        } else {
            setActiveLessonId(id);
        }
    };

    const categories = [
        {
            id: 'openings',
            title: 'Openings',
            icon: <FaBookOpen className="text-4xl text-blue-400" />,
            description: 'Master the principles of opening play.',
            lessons: [
                { id: 'l1', title: 'Opening Principles', difficulty: 'Beginner', duration: '48 min', videoId: 'fKxMNgXVphg' }, // Seirawan
                { id: 'l2', title: 'The Ruy Lopez', difficulty: 'Intermediate', duration: '25 min', videoId: 'YyJPlD7jFBQ' }, // Seirawan
                { id: 'l3', title: 'Queens Gambit', difficulty: 'Advanced', duration: '30 min', videoId: '0d8dciI4X2I' },
            ]
        },
        {
            id: 'tactics',
            title: 'Tactics & Strategy',
            icon: <FaChessBoard className="text-4xl text-green-400" />,
            description: 'Sharpen your tactical vision and strategic planning.',
            lessons: [
                { id: 'l4', title: 'Tactics & Combinations', difficulty: 'Beginner', duration: '45 min', videoId: '21L4yITK5v4' }, // Seirawan
                { id: 'l5', title: 'Advanced Strategy', difficulty: 'Advanced', duration: '50 min', videoId: 'Ld9h48t9sMw' }, // Seirawan
                { id: 'l6', title: 'Attacking the King', difficulty: 'Intermediate', duration: '40 min', videoId: '5f6_q5W-0oE' },
            ]
        },
        {
            id: 'endgames',
            title: 'Endgames',
            icon: <FaGraduationCap className="text-4xl text-purple-400" />,
            description: 'Convert your advantage into a win.',
            lessons: [
                { id: 'l7', title: 'Endgame Principles', difficulty: 'Beginner', duration: '45 min', videoId: 'mCcs8QZc4sE' }, // Seirawan
                { id: 'l8', title: 'Rook Endgames', difficulty: 'Advanced', duration: '35 min', videoId: 'U2d8rQe-vFk' },
                { id: 'l9', title: 'Pawn Structures', difficulty: 'Intermediate', duration: '30 min', videoId: 'Z3I_C5M2Vgg' },
            ]
        }
    ];

    return (
        <div className="min-h-screen">
            <Navbar />

            <div className="pt-24 pb-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-bold mb-6">
                            Chess <span className="gradient-text">Academy</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Master the game with lectures from Grandmaster Yasser Seirawan and other top instructors.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        {categories.map((category) => (
                            <div key={category.id} className="card h-fit">
                                <div className="mb-6 bg-dark-800 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg">
                                    {category.icon}
                                </div>
                                <h2 className="text-2xl font-bold mb-3">{category.title}</h2>
                                <p className="text-gray-400 mb-6 text-sm min-h-[40px]">{category.description}</p>

                                <div className="space-y-4">
                                    {category.lessons.map((lesson) => (
                                        <div
                                            key={lesson.id}
                                            className={`bg-dark-800/50 border rounded-lg transition-all overflow-hidden ${activeLessonId === lesson.id
                                                    ? 'border-primary-500 bg-dark-800 shadow-lg ring-1 ring-primary-500/50'
                                                    : 'border-dark-700 hover:border-dark-500'
                                                }`}
                                        >
                                            {/* Lesson Header */}
                                            <div
                                                onClick={() => toggleLesson(lesson.id)}
                                                className="p-3 flex items-center justify-between cursor-pointer"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${activeLessonId === lesson.id ? 'bg-primary-600' : 'bg-dark-900 group-hover:bg-dark-700'}`}>
                                                        {activeLessonId === lesson.id ? <FaChevronUp className="text-xs" /> : <FaPlay className="text-xs ml-0.5" />}
                                                    </div>
                                                    <div>
                                                        <h3 className={`font-medium text-sm transition-colors ${activeLessonId === lesson.id ? 'text-primary-400' : 'text-gray-200'}`}>
                                                            {lesson.title}
                                                        </h3>
                                                        <div className="flex gap-2 text-[10px] text-gray-500 mt-0.5">
                                                            <span className={
                                                                lesson.difficulty === 'Beginner' ? 'text-green-400' :
                                                                    lesson.difficulty === 'Intermediate' ? 'text-yellow-400' : 'text-red-400'
                                                            }>{lesson.difficulty}</span>
                                                            <span>• {lesson.duration}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Expanded Video Player */}
                                            {activeLessonId === lesson.id && (
                                                <div className="border-t border-dark-700">
                                                    <div className="aspect-video w-full bg-black">
                                                        <iframe
                                                            width="100%"
                                                            height="100%"
                                                            src={`https://www.youtube.com/embed/${lesson.videoId}?autoplay=1&origin=http://localhost:3000`}
                                                            title={lesson.title}
                                                            frameBorder="0"
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                        ></iframe>
                                                    </div>
                                                    <div className="p-3 text-xs text-gray-400 bg-dark-900/50 flex justify-between items-center">
                                                        <span>Watching: <span className="text-white font-semibold">{lesson.title}</span></span>
                                                        <a href={`https://www.youtube.com/watch?v=${lesson.videoId}`} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:underline">
                                                            Watch on YouTube ↗
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Featured Video Section */}
                    <div className="mt-20">
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                            <FaVideo className="text-red-500" />
                            Featured Video Lesson
                        </h2>
                        <div className="card p-0 overflow-hidden text-center bg-dark-800">
                            <div className="aspect-w-16 aspect-h-9 h-[500px]">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/fKxMNgXVphg?origin=http://localhost:3000`}
                                    title="Opening Principles"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
