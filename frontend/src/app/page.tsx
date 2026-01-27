'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { FaChess, FaPuzzlePiece, FaBook, FaChartLine, FaRobot, FaUsers } from 'react-icons/fa';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <FaChess className="text-5xl" />,
      title: 'Play Chess Online',
      description: 'Challenge players worldwide or test your skills against AI opponents',
      color: 'from-blue-500 to-cyan-500',
      link: '/lobby',
    },
    {
      icon: <FaPuzzlePiece className="text-5xl" />,
      title: 'Solve Puzzles',
      description: 'Master tactical patterns with thousands of chess puzzles',
      color: 'from-purple-500 to-pink-500',
      link: '/puzzles',
    },
    {
      icon: <FaBook className="text-5xl" />,
      title: 'Learn Chess',
      description: 'Comprehensive lessons from opening to endgame strategies',
      color: 'from-green-500 to-emerald-500',
      link: '/learn',
    },
    {
      icon: <FaChartLine className="text-5xl" />,
      title: 'Analyze Games',
      description: 'Deep analysis with Stockfish engine to improve your play',
      color: 'from-orange-500 to-red-500',
      link: '/analyze',
    },
    {
      icon: <FaRobot className="text-5xl" />,
      title: 'AI Coach',
      description: 'Ask our AI chatbot for chess advice and strategy tips',
      color: 'from-indigo-500 to-purple-500',
      link: '/coach',
    },
    {
      icon: <FaUsers className="text-5xl" />,
      title: 'Community',
      description: 'Join a thriving community of chess enthusiasts',
      color: 'from-pink-500 to-rose-500',
      link: '/leaderboard',
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 px-6">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 left-10 text-6xl animate-float">♜</div>
          <div className="absolute top-40 right-20 text-6xl animate-float" style={{ animationDelay: '1s' }}>♞</div>
          <div className="absolute bottom-20 left-1/3 text-6xl animate-float" style={{ animationDelay: '2s' }}>♝</div>
          <div className="absolute bottom-10 right-1/4 text-6xl animate-float" style={{ animationDelay: '1.5s' }}>♛</div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 animate-slide-up">
            Master the Game of
            <br />
            <span className="gradient-text">Chess</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto animate-fade-in">
            Play online, solve puzzles, learn strategies, and improve your skills with AI-powered analysis
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            {isAuthenticated ? (
              <>
                <Link href="/lobby" className="btn-primary text-lg px-8 py-4">
                  Play Now
                </Link>
                <Link href="/learn" className="btn-secondary text-lg px-8 py-4">
                  Start Learning
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/register" className="btn-primary text-lg px-8 py-4">
                  Get Started Free
                </Link>
                <Link href="/auth/login" className="btn-secondary text-lg px-8 py-4">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Everything You Need to <span className="gradient-text">Excel at Chess</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Link
                key={index}
                href={feature.link}
                className="group relative overflow-hidden rounded-xl bg-dark-800/50 border border-dark-700 p-6 hover:border-primary-500 transition-all duration-300 hover:-translate-y-1 block h-full !no-underline !text-white"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {React.cloneElement(feature.icon as React.ReactElement, { className: "text-2xl text-white" })}
                </div>

                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-primary-400 transition-colors no-underline">
                  {feature.title}
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed no-underline">
                  {feature.description}
                </p>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-dark-400">
                  <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-primary-600/20 to-purple-600/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold gradient-text mb-2">10K+</div>
              <div className="text-gray-400">Active Players</div>
            </div>
            <div>
              <div className="text-5xl font-bold gradient-text mb-2">5K+</div>
              <div className="text-gray-400">Chess Puzzles</div>
            </div>
            <div>
              <div className="text-5xl font-bold gradient-text mb-2">100+</div>
              <div className="text-gray-400">Video Lessons</div>
            </div>
            <div>
              <div className="text-5xl font-bold gradient-text mb-2">24/7</div>
              <div className="text-gray-400">AI Assistant</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Begin Your Chess Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of players improving their game every day
          </p>
          {!isAuthenticated && (
            <Link href="/auth/register" className="btn-primary text-lg px-10 py-4">
              Create Free Account
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-700 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2026 Chess Learning Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
