'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { ArrowLeft, Lightbulb, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import toast from 'react-hot-toast';

// Define Puzzle types
type Puzzle = {
    id: string;
    fen: string;
    moves: string[]; // LAN format e.g. "e2e4" or SAN keys? Chess.js moves match. 
    // We'll simplisticly use checkmate detection or single best move for now. 
    // Or better: Just check if move matches expected "solution".
    solution: string; // The move string to make (e.g., source-target)
    description: string;
};

type PuzzleCategory = {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    color: string;
    puzzles: Puzzle[];
};

// Mock Data
const PUZZLE_DATA: PuzzleCategory[] = [
    {
        id: 'mate_in_1',
        title: 'Chiếu hết trong 1 nước',
        description: 'Tìm nước đi chiếu hết trong một nước',
        difficulty: 'Dễ',
        color: 'from-green-500 to-emerald-600',
        puzzles: [
            { id: '1', fen: 'r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4', solution: 'h5f7', description: 'Scholar\'s Mate (Chiếu hết học trò)' },
            { id: '2', fen: '6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1', solution: 'e1e8', description: 'Back Rank Mate (Chiếu hết hàng ngang)' },
            { id: '3', fen: 'rn1qkbnr/pbpp1ppp/1p6/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1', solution: 'f3f7', description: 'Attack on f7' }
        ]
    },
    {
        id: 'fork',
        title: 'Đòn Bắt Đôi (Fork)',
        description: 'Tấn công hai quân cùng lúc',
        difficulty: 'Trung bình',
        color: 'from-yellow-500 to-orange-600',
        puzzles: [
            { id: 'f1', fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1', solution: 'not_real', description: 'Demo Fork Puzzle' }
            // Simplified for demo - logic will be generic
        ]
    },
    // Add more categories from previous code...
    {
        id: 'pin',
        title: 'Đòn Ghim (Pin)',
        description: 'Ghim quân đối phương vào vua hoặc hậu',
        difficulty: 'Trung bình',
        color: 'from-blue-500 to-cyan-600',
        puzzles: []
    }
];

export default function PuzzlesPage() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState<PuzzleCategory | null>(null);
    const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
    const [game, setGame] = useState(new Chess());
    const [status, setStatus] = useState<'playing' | 'solved' | 'failed'>('playing');
    const [moveFrom, setMoveFrom] = useState('');
    const [optionSquares, setOptionSquares] = useState({});

    // Load puzzle when category or index changes
    useEffect(() => {
        if (selectedCategory) {
            const puzzle = selectedCategory.puzzles[currentPuzzleIndex];
            if (puzzle) {
                const newGame = new Chess(puzzle.fen);
                setGame(newGame);
                setStatus('playing');
                setMoveFrom('');
                setOptionSquares({});
            }
        }
    }, [selectedCategory, currentPuzzleIndex]);

    const handleCategorySelect = (category: PuzzleCategory) => {
        if (category.puzzles.length === 0) {
            toast.error("Chuyên mục này đang cập nhật thêm bài tập!");
            return;
        }
        setSelectedCategory(category);
        setCurrentPuzzleIndex(0);
    };

    function getMoveOptions(square: string) {
        const moves = game.moves({
            square: square as any,
            verbose: true,
        }) as any[];

        if (moves.length === 0) {
            return false;
        }

        const newSquares: any = {};
        moves.map((move) => {
            const targetPiece = game.get(move.to as any);
            const sourcePiece = game.get(square as any);

            newSquares[move.to] = {
                background:
                    targetPiece && sourcePiece && targetPiece.color !== sourcePiece.color
                        ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
                        : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
                borderRadius: '50%',
            };
            return move;
        });
        newSquares[square] = {
            background: 'rgba(255, 255, 0, 0.4)',
        };
        setOptionSquares(newSquares);
        return true;
    }

    function onSquareClick(square: string) {
        if (status === 'solved') return;

        // If clicking on a piece to select it
        if (!moveFrom) {
            const hasMoveOptions = getMoveOptions(square);
            if (hasMoveOptions) setMoveFrom(square);
            return;
        }

        // Click to move logic
        const gameCopy = new Chess(game.fen());
        try {
            const move = gameCopy.move({
                from: moveFrom,
                to: square,
                promotion: 'q',
            });

            // If invalid move (move is null), check if clicking on another own piece to switch selection
            if (move === null) {
                const piece = game.get(square as any);
                if (piece && piece.color === game.turn()) {
                    const hasMoveOptions = getMoveOptions(square);
                    if (hasMoveOptions) setMoveFrom(square);
                    return;
                }

                // Else deselect
                setMoveFrom('');
                setOptionSquares({});
                return;
            }

            // Valid move execution
            handleMove(gameCopy, moveFrom + square);
        } catch (e) {
            setMoveFrom('');
            setOptionSquares({});
        }
    }

    function handleMove(gameCopy: any, moveStr: string) {
        const currentPuzzle = selectedCategory?.puzzles[currentPuzzleIndex];
        if (!currentPuzzle) return;

        if (moveStr === currentPuzzle.solution || gameCopy.isCheckmate()) {
            setGame(gameCopy);
            setStatus('solved');
            toast.success('Chính xác! Xuất sắc!');
        } else {
            setGame(gameCopy);
            setStatus('failed');
            toast.error('Sai rồi! Thử lại nhé.');
        }
        setMoveFrom('');
        setOptionSquares({});
    }

    const onDrop = (sourceSquare: string, targetSquare: string) => {
        if (status === 'solved') return false;

        const moveStr = sourceSquare + targetSquare;
        const currentPuzzle = selectedCategory?.puzzles[currentPuzzleIndex];

        if (!currentPuzzle) return false;

        try {
            const gameCopy = new Chess(game.fen());
            const move = gameCopy.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: 'q',
            });

            if (move === null) return false;

            handleMove(gameCopy, moveStr);
            return true;
        } catch (error) {
            return false;
        }
    };

    const handleNextPuzzle = () => {
        if (selectedCategory && currentPuzzleIndex < selectedCategory.puzzles.length - 1) {
            setCurrentPuzzleIndex(prev => prev + 1);
        } else {
            toast.success("Bạn đã hoàn thành tất cả bài tập trong mục này!");
            setSelectedCategory(null);
        }
    };

    const handleReset = () => {
        if (selectedCategory) {
            const puzzle = selectedCategory.puzzles[currentPuzzleIndex];
            setGame(new Chess(puzzle.fen));
            setStatus('playing');
            setMoveFrom('');
            setOptionSquares({});
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
            <Navbar />

            <div className="py-12 px-4 pt-24">
                <div className="max-w-6xl mx-auto">
                    {/* Header with Back Button */}
                    <button
                        onClick={() => selectedCategory ? setSelectedCategory(null) : router.back()}
                        className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-semibold">{selectedCategory ? 'Chọn chủ đề khác' : 'Quay lại'}</span>
                    </button>

                    {!selectedCategory ? (
                        /* CATEGORY SELECTION VIEW */
                        <>
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

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {PUZZLE_DATA.map((category) => (
                                    <div
                                        key={category.id}
                                        onClick={() => handleCategorySelect(category)}
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
                                            <span className="text-cyan-400 font-semibold text-sm">{category.puzzles.length} bài đố</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        /* PUZZLE GAMEPLAY VIEW */
                        <div className="grid md:grid-cols-2 gap-8 items-start animate-fade-in">
                            <div className="flex justify-center">
                                <div className="w-full max-w-[500px] aspect-square shadow-2xl rounded-lg overflow-hidden border-4 border-slate-700">
                                    <Chessboard
                                        position={game.fen()}
                                        onPieceDrop={onDrop}
                                        onSquareClick={onSquareClick}
                                        customSquareStyles={optionSquares}
                                        boardOrientation="white"
                                        customBoardStyle={{
                                            borderRadius: '4px',
                                        }}
                                        customDarkSquareStyle={{ backgroundColor: '#779556' }}
                                        customLightSquareStyle={{ backgroundColor: '#ebecd0' }}
                                    />
                                </div>
                            </div>

                            <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8">
                                <div className="mb-6">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm font-semibold">
                                            {selectedCategory.title}
                                        </span>
                                        <span className="text-slate-400 text-sm">Bài {currentPuzzleIndex + 1}/{selectedCategory.puzzles.length}</span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-white mb-2">
                                        {selectedCategory.puzzles[currentPuzzleIndex].description}
                                    </h2>
                                    <p className="text-slate-300">
                                        {status === 'playing' ? 'Trắng đi trước và chiến thắng.' :
                                            status === 'solved' ? 'Tuyệt vời!' : 'Chưa chính xác.'}
                                    </p>
                                </div>

                                {status === 'solved' && (
                                    <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl flex items-center gap-3">
                                        <CheckCircle className="w-8 h-8 text-green-400" />
                                        <div>
                                            <div className="font-bold text-green-400">Chính xác!</div>
                                            <div className="text-green-200 text-sm">Bạn đã giải được bài đố này.</div>
                                        </div>
                                    </div>
                                )}

                                {status === 'failed' && (
                                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3">
                                        <XCircle className="w-8 h-8 text-red-400" />
                                        <div>
                                            <div className="font-bold text-red-400">Sai rồi</div>
                                            <div className="text-red-200 text-sm">Nước đi này chưa đúng. Hãy thử lại!</div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    <button
                                        onClick={handleReset}
                                        className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                                    >
                                        <RotateCcw className="w-5 h-5" /> Thử lại
                                    </button>

                                    {status === 'solved' && (
                                        <button
                                            onClick={handleNextPuzzle}
                                            className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/30"
                                        >
                                            Bài tiếp theo <ArrowLeft className="w-5 h-5 rotate-180" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
