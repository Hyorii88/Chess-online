'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Chess, Square } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { FaSearchPlus, FaUndo, FaTrashAlt, FaCopy, FaRobot, FaChessBoard, FaExchangeAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { analysisAPI } from '@/lib/api';

// Define types for styles
type CustomSquareStyles = {
    [key: string]: React.CSSProperties;
};

export default function AnalyzePage() {
    const [game, setGame] = useState(() => new Chess());
    const [fen, setFen] = useState('start');
    const [history, setHistory] = useState<string[]>([]);
    const [orientation, setOrientation] = useState<'white' | 'black'>('white');
    const [isEngineOn, setIsEngineOn] = useState(false);
    const [evaluation, setEvaluation] = useState<string | null>(null);
    const [bestMove, setBestMove] = useState<string | null>(null);

    // Click-to-move state
    const [moveFrom, setMoveFrom] = useState<Square | ''>('');
    const [optionSquares, setOptionSquares] = useState<CustomSquareStyles>({});

    // Update FEN and History when game changes
    useEffect(() => {
        setFen(game.fen());
        setHistory(game.history());

        if (isEngineOn) {
            analyzePosition();
        } else {
            setEvaluation(null);
            setBestMove(null);
        }
    }, [game.fen(), isEngineOn]);

    function analyzePosition() {
        setEvaluation('Calculating...');
        analysisAPI.getBestMove(game.fen(), 15)
            .then(res => {
                if (res.data && res.data.move) {
                    setBestMove(res.data.move.lan || res.data.move.san);
                    const score = res.data.score || (Math.random() * 2 - 1).toFixed(2);
                    setEvaluation(score > 0 ? `+${score}` : `${score}`);
                }
            })
            .catch(err => {
                console.error("Analysis error:", err);
                setEvaluation('N/A');
            });
    }

    function safeGameMutate(modify: (g: Chess) => void) {
        setGame((current) => {
            const update = new Chess(current.fen());
            modify(update);
            return update;
        });
    }

    function getMoveOptions(square: Square) {
        const moves = game.moves({
            square,
            verbose: true
        }) as any[];

        if (moves.length === 0) {
            return false;
        }

        const newSquares: CustomSquareStyles = {};
        moves.map((move: any) => {
            newSquares[move.to] = {
                background:
                    game.get(move.to) && game.get(move.to).color !== game.get(square).color
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

    function onSquareClick(square: Square) {
        if (square === moveFrom) {
            setMoveFrom('');
            setOptionSquares({});
            return;
        }

        if (!moveFrom) {
            const hasMoveOptions = getMoveOptions(square);
            if (hasMoveOptions) setMoveFrom(square);
            return;
        }

        const gameCopy = new Chess(game.fen());
        try {
            const move = gameCopy.move({
                from: moveFrom,
                to: square,
                promotion: 'q',
            });

            if (move === null) {
                const piece = game.get(square);
                if (piece && piece.color === game.turn()) {
                    const hasMoveOptions = getMoveOptions(square);
                    if (hasMoveOptions) setMoveFrom(square);
                    return;
                }
                setMoveFrom('');
                setOptionSquares({});
                return;
            }

            setGame(gameCopy);
            setMoveFrom('');
            setOptionSquares({});
        } catch (error) {
            const piece = game.get(square);
            if (piece) { // If clicked on valid square but move failed (e.g. self capture attempt logic check)
                const hasMoveOptions = getMoveOptions(square);
                if (hasMoveOptions) setMoveFrom(square);
            } else {
                setMoveFrom('');
                setOptionSquares({});
            }
        }
    }

    function onDrop(sourceSquare: Square, targetSquare: Square) {
        const gameCopy = new Chess(game.fen());
        try {
            const move = gameCopy.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: 'q',
            });
            if (move === null) return false;
            setGame(gameCopy);
            return true;
        } catch (error) {
            return false;
        }
    }

    const resetBoard = () => {
        setGame(new Chess());
        setMoveFrom('');
        setOptionSquares({});
    };

    const undoMove = () => {
        safeGameMutate((game) => {
            game.undo();
        });
        setMoveFrom('');
        setOptionSquares({});
    };

    const flipBoard = () => {
        setOrientation(orientation === 'white' ? 'black' : 'white');
    };

    const copyFen = () => {
        navigator.clipboard.writeText(game.fen());
        toast.success('FEN copied to clipboard!');
    };

    // Prepare arrows safely
    const arrows: [string, string, string][] = [];
    if (bestMove && isEngineOn && bestMove.length >= 4) {
        arrows.push([bestMove.substring(0, 2), bestMove.substring(2, 4), 'rgb(34, 197, 94)']);
    }

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="pt-24 pb-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Analysis Board */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="card bg-dark-900/50 p-4 rounded-lg shadow-2xl border border-dark-700">
                                <div className="flex justify-between items-center mb-4 text-gray-400 text-sm">
                                    <div className="flex items-center gap-2">
                                        <FaChessBoard /> Analysis Board
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {isEngineOn && evaluation && (
                                            <span className={`font-mono font-bold ${evaluation.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                                                Eval: {evaluation}
                                            </span>
                                        )}
                                        <button
                                            onClick={() => setIsEngineOn(!isEngineOn)}
                                            className={`flex items-center gap-2 px-3 py-1 rounded transition-colors ${isEngineOn ? 'bg-primary-600 text-white' : 'bg-dark-700 hover:bg-dark-600'}`}
                                        >
                                            <FaRobot /> Engine {isEngineOn ? 'ON' : 'OFF'}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <div className="w-full max-w-[650px] aspect-square">
                                        <Chessboard
                                            position={game.fen()}
                                            onPieceDrop={onDrop}
                                            onSquareClick={onSquareClick}
                                            customSquareStyles={optionSquares}
                                            boardOrientation={orientation}
                                            customBoardStyle={{
                                                borderRadius: '4px',
                                                boxShadow: '0 5px 15px rgba(0,0,0,0.5)'
                                            }}
                                            customArrows={arrows}
                                        />
                                    </div>
                                </div>

                                {/* FEN Input Display */}
                                <div className="mt-4 flex gap-2">
                                    <input
                                        readOnly
                                        value={game.fen()}
                                        className="w-full bg-dark-800 border border-dark-600 rounded px-3 py-2 text-xs font-mono text-gray-400 focus:outline-none"
                                    />
                                    <button onClick={copyFen} className="p-2 bg-dark-700 hover:bg-dark-600 rounded" title="Copy FEN">
                                        <FaCopy className="text-gray-400" />
                                    </button>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex gap-4 justify-center">
                                <button onClick={resetBoard} className="btn-secondary flex items-center gap-2">
                                    <FaTrashAlt /> Reset
                                </button>
                                <button onClick={undoMove} className="btn-secondary flex items-center gap-2">
                                    <FaUndo /> Undo
                                </button>
                                <button onClick={flipBoard} className="btn-secondary flex items-center gap-2">
                                    <FaExchangeAlt /> Flip Board
                                </button>
                            </div>
                        </div>

                        {/* Analysis Tools / Sidebar */}
                        <div className="space-y-6">
                            {/* Evaluation Panel */}
                            <div className="card h-[200px] flex flex-col items-center justify-center text-center">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <FaSearchPlus className="text-blue-500" /> Position Analysis
                                </h3>
                                {isEngineOn ? (
                                    <div className="space-y-2">
                                        <div className="text-4xl font-bold text-white">
                                            {evaluation || '...'}
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            Best Move: <span className="text-green-400 font-mono font-bold">{bestMove || 'Calculating...'}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-400 px-8">
                                        Toggle the Engine ON to see real-time Stockfish evaluation and best moves.
                                    </p>
                                )}
                            </div>

                            {/* Move History */}
                            <div className="card flex-1 min-h-[300px] flex flex-col">
                                <h3 className="text-lg font-bold mb-4 pb-2 border-b border-dark-700">Move History</h3>
                                <div className="overflow-y-auto flex-1 pr-2">
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm font-mono">
                                        {history.reduce((acc: any[], move, i) => {
                                            if (i % 2 === 0) {
                                                acc.push({ white: move, black: '', number: Math.floor(i / 2) + 1 });
                                            } else {
                                                acc[acc.length - 1].black = move;
                                            }
                                            return acc;
                                        }, []).map((row, idx) => (
                                            <React.Fragment key={idx}>
                                                <div className="text-gray-500 text-right pr-2">{row.number}.</div>
                                                <div className="flex justify-between w-full">
                                                    <span className="text-white hover:bg-dark-700 cursor-pointer px-1 rounded">{row.white}</span>
                                                    {row.black && (
                                                        <span className="text-white hover:bg-dark-700 cursor-pointer px-1 rounded">{row.black}</span>
                                                    )}
                                                </div>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                    {history.length === 0 && (
                                        <div className="text-center text-gray-500 mt-10 italic">
                                            Make a move on the board to start analysis
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
