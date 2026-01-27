'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { FaPaperPlane, FaRobot, FaChess, FaLightbulb, FaInfoCircle, FaMagic } from 'react-icons/fa';

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
};

export default function CoachPage() {
    // State initialization
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: "Chào bạn! Tôi là Trợ lý Cờ vua AI cao cấp. ♟️\nTôi có thể giúp bạn phân tích ván đấu, gợi ý khai cuộc, hay giải đáp mọi thắc mắc về chiến thuật. Bạn muốn bắt đầu từ đâu?",
            timestamp: new Date()
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    // Auto-scroll ref
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = async (textOverride?: string) => {
        const textToSend = textOverride || input;
        if (!textToSend.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: textToSend.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate AI Response
        setTimeout(() => {
            let reply = "";
            const q = textToSend.toLowerCase();

            if (q.includes('ruy lopez') || q.includes('tây ban nha')) {
                reply = "Khai cuộc **Ruy Lopez** (1.e4 e5 2.Nf3 Nc6 3.Bb5) là một kiệt tác của cờ vua cổ điển. \n\n**Mục tiêu chính:**\n- Kiểm soát trung tâm nhanh chóng.\n- Phát triển quân nhẹ (Mã, Tượng) để nhập thành sớm.\n- Tạo áp lực lâu dài lên tốt e5 của Đen.";
            } else if (q.includes('sicilian') || q.includes('sicilia') || q.includes('phòng thủ')) {
                reply = "Phòng thủ **Sicilian** (1.e4 c5) là lựa chọn chiến đấu nhất của Đen! 🔥\nThay vì đáp trả đối xứng (e5), Đen phản công vào ô d4 từ cánh. Điều này dẫn đến các ván đấu cực kỳ phức tạp và sắc bén.";
            } else if (q.includes('cải thiện') || q.includes('tập luyện')) {
                reply = "Lộ trình 3 bước để cải thiện Elo:\n1. 🧩 **Chiến thuật (Tactics):** Dành 15 phút mỗi ngày giải đố.\n2. 🔍 **Phân tích (Analyze):** Đừng chỉ chơi, hãy xem lại tại sao mình thua.\n3. 🏰 **Cờ tàn (Endgame):** Học cách chiếu hết bằng Xe và Hậu thành thạo.";
            } else if (q.includes('chào')) {
                reply = "Chào cao thủ tương lai! 👋 Hôm nay chúng ta sẽ luyện tập gì nào? Khai cuộc hay Chiến thuật?";
            } else {
                reply = "Câu hỏi rất thú vị! Để tôi phân tích sâu hơn... \n(Hiện tại tôi đang ở chế độ demo, hãy thử hỏi về 'Ruy Lopez', 'Sicilian' hoặc cách 'cải thiện' trình độ nhé!)";
            }

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: reply,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);
            setIsTyping(false);
        }, 1500);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white font-sans flex flex-col relative overflow-hidden">
            <Navbar />

            {/* Background Gradient Orbs */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full"></div>
            </div>

            <div className="flex-1 pt-24 pb-0 max-w-4xl mx-auto w-full flex flex-col h-screen relative z-10">

                {/* Header */}
                <div className="text-center mb-0 opacity-80 hover:opacity-100 transition-opacity">
                    <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-sm mb-4">
                        <FaMagic className="text-purple-400 text-xs" />
                        <span className="text-xs font-semibold tracking-wide text-purple-100">AI Coach Pro</span>
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 scrollbar-thin scrollbar-thumb-gray-700">
                    {messages.map((msg) => {
                        const isUser = msg.role === 'user';
                        return (
                            <div key={msg.id} className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6 animate-fade-in`}>
                                <div className={`flex max-w-[95%] md:max-w-[85%] gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {/* Avatar */}
                                    <div className="flex-shrink-0 mt-1">
                                        <img
                                            src={isUser
                                                ? "https://api.dicebear.com/7.x/notionists/svg?seed=Felix"
                                                : "https://api.dicebear.com/7.x/bottts/svg?seed=ChessCoachPro&backgroundColor=6366f1"}
                                            alt={msg.role}
                                            className={`w-9 h-9 md:w-10 md:h-10 rounded-full shadow-lg ${isUser ? 'border-2 border-indigo-500' : ''}`}
                                        />
                                    </div>

                                    {/* Bubble / Text Content */}
                                    <div className={`py-2 px-3 md:px-0 whitespace-pre-wrap leading-relaxed ${isUser
                                            ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl rounded-tr-none px-5 py-3 shadow-lg'
                                            : 'bg-transparent text-gray-100 pl-2' // Completely transparent for AI
                                        }`}>
                                        <div className={`text-[15px] md:text-[16px] ${!isUser ? 'font-light tracking-wide' : ''}`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {isTyping && (
                        <div className="flex justify-start mb-8 px-16 pl-20">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                </div>

                {/* Input Area */}
                <div className="p-4 sm:p-6 pb-8 bg-gradient-to-t from-[#0f172a] via-[#0f172a] to-transparent sticky bottom-0 z-20">
                    <div className="max-w-3xl mx-auto">

                        {/* Quick Suggestions Pills */}
                        {messages.length < 5 && (
                            <div className="flex gap-2 overflow-x-auto pb-3 mb-2 justify-center scrollbar-none opacity-90">
                                <button onClick={() => handleSendMessage("Dạy tôi khai cuộc Ruy Lopez")} className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-full text-xs text-slate-300 transition-all whitespace-nowrap shadow-sm">
                                    <FaChess className="text-indigo-400" /> Ruy Lopez
                                </button>
                                <button onClick={() => handleSendMessage("Làm sao để giải chiến thuật tốt hơn?")} className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-full text-xs text-slate-300 transition-all whitespace-nowrap shadow-sm">
                                    <FaLightbulb className="text-yellow-400" /> Cải thiện chiến thuật
                                </button>
                                <button onClick={() => handleSendMessage("Giải thích phòng thủ Sicilian")} className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-full text-xs text-slate-300 transition-all whitespace-nowrap shadow-sm">
                                    <FaInfoCircle className="text-green-400" /> Phòng thủ Sicilian
                                </button>
                            </div>
                        )}

                        <div className="relative flex items-center bg-[#1e293b] rounded-2xl shadow-2xl border border-slate-700/50 focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Hỏi tôi bất cứ điều gì..."
                                className="flex-1 bg-transparent border-none px-6 py-4 text-white focus:outline-none placeholder-slate-500 text-base"
                                autoFocus
                                disabled={isTyping}
                            />
                            <button
                                onClick={() => handleSendMessage()}
                                disabled={!input.trim() || isTyping}
                                className="mr-2 p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                            >
                                <FaPaperPlane />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
