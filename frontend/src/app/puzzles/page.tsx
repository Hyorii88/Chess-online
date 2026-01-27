'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { FaPuzzlePiece, FaCheck, FaRedo, FaLightbulb, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';

// Database of checkmate puzzles
const CHECKMATE_PUZZLES = [
    {
        id: 1,
        fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4',
        title: 'Scholar\'s Mate',
        description: 'White to move and mate in 1.',
        orientation: 'white'
    },
    {
        id: 2,
        fen: 'rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2',
        title: 'Fool\'s Mate',
        description: 'Black to move and mate in 1.',
        orientation: 'black'
    },
    {
        id: 3,
        fen: '6rk/5Npp/8/8/8/8/8/7K w - - 0 1',
        title: 'Smothered Mate',
        description: 'White to move and mate in 1.',
        orientation: 'white'
    },
    {
        id: 4,
        fen: 'r1b3kr/ppp1Bp1p/1b6/n2P4/2p3q1/2Q2N2/P4PPP/RN2R1K1 w - - 1 17',
        title: 'Boden\'s Mate',
        description: 'White to move and mate in 1.',
        orientation: 'white'
    },
    {
        id: 5,
        fen: '6k1/5ppp/8/8/8/8/8/4R1K1 w - - 0 1',
        title: 'Back Rank Mate',
        description: 'White to move and mate in 1.',
        orientation: 'white'
    },
    {
        id: 6,
        fen: 'r6k/6pp/8/8/8/8/5PPP/5RK1 b - - 0 1',
        title: 'Back Rank Mate (Black)',
        description: 'Black to move and mate in 1.',
        orientation: 'black'
    }
];

export default function PuzzlesPage() {
    const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
    const puzzle = CHECKMATE_PUZZLES[currentPuzzleIndex];

    // Initialize game with current puzzle FEN
    // We pass the FEN strictly to new Chess() to ensure clean state
    const [game, setGame] = useState(() => new Chess(puzzle.fen));
    const [solved, setSolved] = useState(false);

    // Click-to-move state
    const [moveFrom, setMoveFrom] = useState('');
    const [optionSquares, setOptionSquares] = useState({});

    // Reset game when switching puzzles
    useEffect(() => {
        const newGame = new Chess(puzzle.fen);
        setGame(newGame);
        setSolved(false);
        setMoveFrom('');
        setOptionSquares({});
    }, [puzzle.fen]);

    function getMoveOptions(square: string) {
        const moves = game.moves({
            square: square as any,
            verbose: true
        }) as any[];

        if (moves.length === 0) {
            return false;
        }

        const newSquares: any = {};
        moves.map((move) => {
            newSquares[move.to] = {
                background:
                    game.get(move.to as any) && game.get(move.to as any).color !== game.get(square as any).color
                        ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
                        : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
                borderRadius: '50%'
            };
            return move;
        });
        newSquares[square] = {
            background: 'rgba(255, 255, 0, 0.4)'
        };
        setOptionSquares(newSquares);
        return true;
    }

    function onSquareClick(square: string) {
        if (solved) return;

        // Ensure we only interact with our own pieces
        const piece = game.get(square as any);
        // If selecting a new piece (not moving), check color
        if (!moveFrom) {
            if (piece && piece.color !== puzzle.orientation[0]) {
                return;
            }
        }

        // Click on same square -> deselect
        if (square === moveFrom) {
            setMoveFrom('');
            setOptionSquares({});
            return;
        }

        // No piece selected yet
        if (!moveFrom) {
            const hasMoveOptions = getMoveOptions(square);
            if (hasMoveOptions) setMoveFrom(square);
            return;
        }

        // Attempt move
        const gameCopy = new Chess(game.fen());
        try {
            const move = gameCopy.move({
                from: moveFrom,
                to: square,
                promotion: 'q',
            });

            // Invalid move
            if (move === null) {
                // Check if user clicked on another own piece to switch selection
                const piece = game.get(square as any);
                if (piece && piece.color === game.turn()) {
                    const hasMoveOptions = getMoveOptions(square);
                    if (hasMoveOptions) setMoveFrom(square);
                    return;
                }

                // Clicking on empty square or enemy piece (invalid move) -> deselect
                setMoveFrom('');
                setOptionSquares({});
                return;
            }

            // Valid move
            handleMove(gameCopy);
        } catch (error) {
            console.error(error);
            setMoveFrom('');
            setOptionSquares({});
        }
    }

    function handleMove(gameCopy: Chess) {
        setGame(gameCopy);
        setMoveFrom('');
        setOptionSquares({});

        if (gameCopy.isCheckmate()) {
            setSolved(true);
            toast.success('Correct! Puzzle Solved!');
        } else {
            toast.error('Incorrect! Try again.');
            setTimeout(() => {
                const resetGame = new Chess(puzzle.fen);
                setGame(resetGame); // Reset on wrong move
            }, 1000);
        }
    }

    function onDrop(sourceSquare: string, targetSquare: string) {
        if (solved) return false;

        try {
            const gameCopy = new Chess(game.fen());
            const move = gameCopy.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: 'q',
            });

            if (move === null) return false;

            handleMove(gameCopy);
            return true;
        } catch (error) {
            return false;
        }
    }

    const resetPuzzle = () => {
        const newGame = new Chess(puzzle.fen);
        setGame(newGame);
        setSolved(false);
        setMoveFrom('');
        setOptionSquares({});
    };

    const nextPuzzle = () => {
        if (currentPuzzleIndex < CHECKMATE_PUZZLES.length - 1) {
            setCurrentPuzzleIndex(prev => prev + 1);
        } else {
            toast.success('You completed all puzzles! Starting over.');
            setCurrentPuzzleIndex(0);
        }
    };

    const prevPuzzle = () => {
        if (currentPuzzleIndex > 0) {
            setCurrentPuzzleIndex(prev => prev - 1);
        }
    };

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="pt-24 pb-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
                            <FaPuzzlePiece className="text-yellow-500" />
                            Tactical Puzzles
                        </h1>
                        <p className="text-gray-400">Puzzle {currentPuzzleIndex + 1} of {CHECKMATE_PUZZLES.length}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Chessboard */}
                        <div className="flex justify-center">
                            <div className="w-full max-w-[500px] aspect-square bg-dark-800 p-4 rounded-lg shadow-2xl relative">
                                <Chessboard
                                    position={game.fen()}
                                    onPieceDrop={onDrop}
                                    onSquareClick={onSquareClick}
                                    customSquareStyles={optionSquares}
                                    boardOrientation={puzzle.orientation as 'white' | 'black'}
                                    customBoardStyle={{
                                        borderRadius: '4px',
                                        boxShadow: '0 5px 15px rgba(0,0,0,0.5)'
                                    }}
                                />
                                {solved && (
                                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 rounded-lg pointer-events-none">
                                        <FaCheck className="text-9xl text-green-500 opacity-80 animate-bounce" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Info Panel */}
                        <div className="card h-full flex flex-col justify-center text-center p-8">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold mb-2">{puzzle.title}</h2>
                                <p className="text-xl text-primary-400 mb-6">{puzzle.description}</p>

                                <div className="flex justify-center gap-4 text-sm mb-6">
                                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full">{puzzle.orientation === 'white' ? 'White to Move' : 'Black to Move'}</span>
                                    <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">Mate in 1</span>
                                    <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full">+15 Elo</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {solved ? (
                                    <div className="animate-fade-in space-y-4">
                                        <h3 className="text-2xl font-bold text-green-400">Puzzle Solved!</h3>
                                        <button onClick={nextPuzzle} className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg">
                                            Next Puzzle <FaArrowRight />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        <button onClick={resetPuzzle} className="btn-secondary flex items-center justify-center gap-2">
                                            <FaRedo /> Reset
                                        </button>
                                        <button className="btn-secondary flex items-center justify-center gap-2">
                                            <FaLightbulb /> Hint
                                        </button>
                                    </div>
                                )}

                                <div className="flex justify-between mt-8 pt-6 border-t border-dark-700">
                                    <button
                                        onClick={prevPuzzle}
                                        disabled={currentPuzzleIndex === 0}
                                        className={`flex items-center gap-2 ${currentPuzzleIndex === 0 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:text-white'}`}
                                    >
                                        <FaArrowLeft /> Previous
                                    </button>
                                    <button
                                        onClick={nextPuzzle}
                                        className="flex items-center gap-2 text-gray-300 hover:text-white"
                                    >
                                        Next <FaArrowRight />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
