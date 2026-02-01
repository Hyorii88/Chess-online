'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { ChevronRight, Crown, Brain, BookOpen, BarChart, Bot, Users } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();

  const features = [
    {
      id: 'lobby',
      icon: Crown,
      title: 'Chơi cờ trực tuyến',
      description: 'Thách thức người chơi trên toàn thế giới hoặc luyện tập với AI đối thủ',
      gradient: 'from-cyan-500 to-blue-600',
      href: '/lobby'
    },
    {
      id: 'puzzles',
      icon: Brain,
      title: 'Giải đố chiến thuật',
      description: 'Nâng cao kỹ năng với hàng nghìn bài tập cờ đa dạng',
      gradient: 'from-purple-500 to-pink-600',
      href: '/puzzles'
    },
    {
      id: 'learn',
      icon: BookOpen,
      title: 'Học cờ',
      description: 'Các bài giảng toàn diện từ khai cuộc đến chiến lược tàn cuộc',
      gradient: 'from-orange-500 to-red-600',
      href: '/learn'
    },
    {
      id: 'analyze',
      icon: BarChart,
      title: 'Phân tích ván đấu',
      description: 'Phân tích chuyên sâu với công cụ Stockfish để cải thiện lối chơi',
      gradient: 'from-green-500 to-emerald-600',
      href: '/analyze'
    },
    {
      id: 'coach',
      icon: Bot,
      title: 'Chess Bot',
      description: 'Hỏi AI chatbot của chúng tôi để nhận lời khuyên và mẹo chiến thuật',
      gradient: 'from-blue-500 to-indigo-600',
      href: '/coach'
    },
    {
      id: 'leaderboard',
      icon: Users,
      title: 'Cộng đồng',
      description: 'Tham gia cộng đồng sôi động của những người đam mê cờ vua',
      gradient: 'from-pink-500 to-rose-600',
      href: '/leaderboard'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">Làm chủ trò chơi </span>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Cờ Vua
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto">
            Chơi trực tuyến, giải đố, học chiến lược, và nâng cao kỹ năng của bạn với phân tích được hỗ trợ bởi AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {loading ? (
              <div className="px-8 py-4 bg-cyan-500 text-white rounded-lg text-lg font-semibold opacity-50">
                Loading...
              </div>
            ) : isAuthenticated ? (
              <>
                <Link href="/lobby" className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-xl shadow-cyan-500/50">
                  Chơi ngay
                </Link>
                <Link href="/learn" className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-lg font-semibold transition-all transform hover:scale-105">
                  Bắt đầu học
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/register" className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-xl shadow-cyan-500/50">
                  Đăng ký miễn phí
                </Link>
                <Link href="/auth/login" className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-lg font-semibold transition-all transform hover:scale-105">
                  Đăng nhập
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">
          <span className="text-white">Mọi thứ bạn cần để </span>
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Xuất sắc trong Cờ Vua
          </span>
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.id}
              href={feature.href}
              className="group bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6 hover:bg-slate-800 transition-all cursor-pointer hover:scale-105 hover:shadow-2xl block"
            >
              <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 mb-4">{feature.description}</p>
              <div className="flex items-center text-cyan-400 font-semibold group-hover:translate-x-2 transition-transform">
                Khám phá <ChevronRight className="w-5 h-5 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-800/50 backdrop-blur border-y border-slate-700 py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-cyan-400 mb-2">10K+</div>
            <div className="text-slate-300">Người chơi hoạt động</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-cyan-400 mb-2">50K+</div>
            <div className="text-slate-300">Bài đố cờ</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-cyan-400 mb-2">100+</div>
            <div className="text-slate-300">Bài học</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-cyan-400 mb-2">24/7</div>
            <div className="text-slate-300">Hỗ trợ AI</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Sẵn sàng bắt đầu hành trình Cờ Vua của bạn?
        </h2>
        <p className="text-xl text-slate-300 mb-8">
          Tham gia cùng hàng nghìn người chơi và bắt đầu cải thiện kỹ năng của bạn ngay hôm nay
        </p>
        {!isAuthenticated && (
          <Link href="/auth/register" className="inline-block px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg text-xl font-bold transition-all transform hover:scale-105 shadow-2xl shadow-cyan-500/30">
            Bắt đầu chơi miễn phí
          </Link>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-8 px-4 text-center text-slate-400 text-sm">
        © {new Date().getFullYear()} Chess Learning Platform. All rights reserved.
      </footer>
    </div>
  );
}
