'use client';

import React, { useState, useEffect, use } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { useAuth } from '@/lib/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { io, Socket } from 'socket.io-client';
import { analysisAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { FaFlag, FaHandshake, FaComments, FaRobot, FaUserPlus, FaTrophy, FaMedal, FaChartLine } from 'react-icons/fa';
import Confetti from 'react-confetti';

export default function GamePage({ params }: { params: Promise<{ id: string }> }) {
    const { id: gameId } = use(params);
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode');
    const difficulty = searchParams.get('difficulty');

    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    const [game, setGame] = useState(new Chess());
    const [socket, setSocket] = useState<Socket | null>(null);
    const [playerColor, setPlayerColor] = useState<'white' | 'black'>('white');
    const [opponent, setOpponent] = useState<any>(null);
    const [chatMessages, setChatMessages] = useState<any[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [thinking, setThinking] = useState(false);
    // State for rating updates
    const [ratingChange, setRatingChange] = useState<number | null>(null);
    const [newRating, setNewRating] = useState<number | null>(null);
    const [moveHistory, setMoveHistory] = useState<string[]>([]);
    const [gameStartTime, setGameStartTime] = useState<Date>(new Date());
    const [showConfetti, setShowConfetti] = useState(false);

    // Game over state - explicit state instead of relying on game.isGameOver()
    const [isGameOver, setIsGameOver] = useState(false);
    const [gameWinner, setGameWinner] = useState<string | null>(null); // 'white', 'black', or 'draw'
    const [gameEndReason, setGameEndReason] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push(`/auth/login?returnUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`);
            return;
        }

        // Connect to game socket
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';
        const newSocket = io(`${socketUrl}/game`);

        newSocket.on('connect', () => {
            console.log('Connected to game socket');

            // Join the game room
            newSocket.emit('joinRoom', {
                roomId: gameId,
                userId: user?.id,
                username: user?.username
            });
        });

        newSocket.on('playerJoined', (data) => {
            console.log('🎨 PLAYER JOINED EVENT:', {
                assignedColor: data.color,
                type: typeof data.color
            });
            setPlayerColor(data.color);
            console.log('✅ Player color SET TO:', data.color);

            const newGame = new Chess();

            try {
                if (data.pgn) {
                    newGame.loadPgn(data.pgn);
                } else if (data.fen) {
                    newGame.load(data.fen);
                }
            } catch (e) {
                console.error('Error loading game state:', e);
                if (data.fen) newGame.load(data.fen);
            }

            setGame(newGame);
            setMoveHistory(newGame.history());
            toast.success(`You are playing as ${data.color}`);
        });

        newSocket.on('roomUpdate', (data) => {
            if (data.players && data.players.length === 2) {
                const opp = data.players.find((p: any) => p.userId !== user?.id);
                setOpponent(opp);
                toast.success('Opponent joined!');
            }
        });

        newSocket.on('moveMade', (data) => {
            console.log('📨 moveMade event received:', {
                isGameOver: data.isGameOver,
                result: data.result,
                endReason: data.endReason,
                fen: data.fen
            });

            const newGame = new Chess();
            try {
                if (data.pgn) {
                    newGame.loadPgn(data.pgn);
                } else {
                    newGame.load(data.fen);
                }
            } catch (e) {
                console.error('Error loading move:', e);
                newGame.load(data.fen);
            }

            setGame(newGame);
            setMoveHistory(newGame.history());

            // Handle game over from backend event
            if (data.isGameOver && data.result && data.endReason) {
                console.log('🔥 GAME OVER - Backend says:', {
                    result: data.result,
                    endReason: data.endReason,
                    isWinner: data.isWinner,
                    myColor: playerColor
                });

                // Set game over state
                setIsGameOver(true);
                setGameWinner(data.result);
                setGameEndReason(data.endReason);

                // Auto-redirect to lobby after 10 seconds
                setTimeout(() => {
                    router.push('/lobby');
                }, 10000);

                // Show notifications
                if (data.endReason === 'checkmate') {
                    // Use backend's isWinner flag - NO local comparison needed!
                    if (data.isWinner === true) {
                        console.log('✅ I WON! Showing winner toast');
                        toast.success('🎉 Checkmate! You won!', { duration: 5000 });
                        setShowConfetti(true);
                        setTimeout(() => setShowConfetti(false), 5000);
                    } else if (data.isWinner === false) {
                        console.log('❌ I LOST! Showing loser toast');
                        toast.error('💔 Checkmate! You lost.', { duration: 5000 });
                    } else {
                        console.warn('⚠️ isWinner is undefined - this is a draw or spectator');
                    }
                } else if (data.endReason === 'stalemate') {
                    toast('⚖️ Stalemate - Game drawn', { duration: 4000 });
                } else {
                    toast('⚖️ Game drawn', { duration: 4000 });
                }
            }

            // If it's AI mode and it's not our turn, get AI move
            if (mode === 'ai' && newGame.turn() !== playerColor[0]) {
                makeAIMove(newGame);
            }
        });

        // Add rating update listener
        newSocket.on('ratingUpdate', (data) => {
            console.log('📉 RATING UPDATE:', data);
            setRatingChange(data.change);
            setNewRating(data.newRating);

            const changeText = data.change > 0 ? `+${data.change}` : `${data.change}`;
            const color = data.change > 0 ? 'success' : 'error';

            // Show toast
            toast[color](`Rating: ${data.oldRating} → ${data.newRating} (${changeText})`, {
                duration: 6000
            });
        });

        newSocket.on('chatMessage', (data) => {
            setChatMessages(prev => [...prev, data]);
        });

        newSocket.on('gameEnded', (data) => {
            toast.success(`Game ended: ${data.result}`);
            // Force update local game state if not already recognized
            if (!game.isGameOver()) {
                const newGame = new Chess(game.fen());
                // Set header or some property to force re-render if needed, 
                // but usually isGameOver is derived from FEN. 
                // If server says game ended but local FEN doesn't show it (e.g. resignation),
                // we might need a specific state. 
                // For now, reliance on FEN sync from 'moveMade' should be enough for checkmate.
                // For resignation/draw, we might need a separate 'gameOver' state.
            }
        });

        newSocket.on('playerDisconnected', () => {
            toast.error('Opponent disconnected');
        });

        newSocket.on('invalidMove', (data: { error: string }) => {
            toast.error(data.error);
            console.error('Server rejected move:', data.error);
            // Request full sync if needed, but backend already sends playerJoined which resyncs
        });

        setSocket(newSocket);

        return () => {
            newSocket.emit('leaveRoom', { roomId: gameId, userId: user?.id });
            newSocket.close();
        };
    }, [gameId, isAuthenticated, router]);

    const makeAIMove = async (currentGame: Chess) => {
        setThinking(true);
        try {
            const response = await analysisAPI.getBestMove(
                currentGame.fen(),
                parseInt(difficulty || '10')
            );

            if (response.data.move) {
                setTimeout(() => {
                    const move = currentGame.move(response.data.move.san);
                    if (move) {
                        setGame(new Chess(currentGame.fen()));
                        setMoveHistory(currentGame.history());

                        if (socket) {
                            socket.emit('makeMove', {
                                roomId: gameId,
                                move: response.data.move
                            });
                        }
                    }
                    setThinking(false);
                }, 500);
            }
        } catch (error) {
            console.error('AI move error:', error);
            setThinking(false);
        }
    };

    const [moveFrom, setMoveFrom] = useState('');
    const [optionSquares, setOptionSquares] = useState({});

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
                    game.get(move.to as any) && game.get(move.to as any)?.color !== game.get(square as any)?.color
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
        // Check turn
        if (mode === 'online' && game.turn() !== playerColor[0]) return;
        if (mode === 'ai' && game.turn() !== playerColor[0]) return;

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
            setGame(gameCopy);
            setMoveHistory(gameCopy.history());
            setMoveFrom('');
            setOptionSquares({});

            // Emit move to server
            if (socket && mode !== 'ai') {
                socket.emit('makeMove', {
                    roomId: gameId,
                    move: { from: moveFrom, to: square, promotion: 'q' }
                });
            }

            // If AI mode, get AI response
            if (mode === 'ai' && !gameCopy.isGameOver()) {
                makeAIMove(gameCopy);
            }

            // Note: Game over logic is handled by backend moveMade event
            // Don't check isGameOver here to avoid duplicate notifications

            return;
        } catch (error) {
            console.error('Move error:', error);
            setMoveFrom('');
            setOptionSquares({});
        }
    }

    const onDrop = (sourceSquare: string, targetSquare: string) => {
        // Check if it's the player's turn
        if (mode === 'online' && game.turn() !== playerColor[0]) {
            toast.error('Not your turn!');
            return false;
        }

        if (mode === 'ai' && game.turn() !== playerColor[0]) {
            return false;
        }

        try {
            // Create a new game instance to validate move without mutating state directly first
            const gameCopy = new Chess(game.fen());

            const move = gameCopy.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: 'q'
            });

            if (move === null) return false;

            // Update local state immediately for smooth UI
            setGame(gameCopy);
            setMoveHistory(gameCopy.history());

            // Emit move to server
            if (socket && mode !== 'ai') {
                socket.emit('makeMove', {
                    roomId: gameId,
                    move: { from: sourceSquare, to: targetSquare, promotion: 'q' }
                });
            }

            // If AI mode, get AI response
            if (mode === 'ai' && !gameCopy.isGameOver()) {
                makeAIMove(gameCopy);
            }

            // Note: Game over logic is handled by backend moveMade event
            // Don't check isGameOver here to avoid duplicate notifications

            return true;
        } catch (error) {
            console.error('Move error:', error);
            return false;
        }
    };

    const handleResign = () => {
        if (socket) {
            socket.emit('resign', { roomId: gameId, userId: user?.id });
            toast.success('You resigned');
            router.push('/lobby');
        }
    };

    const handleOfferDraw = () => {
        if (socket) {
            socket.emit('offerDraw', { roomId: gameId, username: user?.username });
            toast.success('Draw offer sent');
        }
    };

    const sendChatMessage = () => {
        if (!chatInput.trim() || !socket) return;

        socket.emit('chatMessage', {
            roomId: gameId,
            message: chatInput,
            username: user?.username
        });

        setChatInput('');
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen">
            <Navbar />

            <div className="pt-24 pb-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Main Board */}
                        <div className="lg:col-span-2">
                            <div className="card">
                                {/* Player Info - Top */}
                                <div className="flex items-center justify-between mb-4 p-4 bg-dark-800 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={mode === 'ai' ? 'https://api.dicebear.com/7.x/bottts/svg?seed=ai' : opponent?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=opponent'}
                                            alt="Opponent"
                                            className="w-12 h-12 rounded-full"
                                        />
                                        <div>
                                            <div className="font-semibold flex items-center gap-2">
                                                {mode === 'ai' ? (
                                                    <>
                                                        <FaRobot className="text-primary-500" />
                                                        Stockfish AI (Level {difficulty})
                                                    </>
                                                ) : (
                                                    opponent?.username || 'Waiting for opponent...'
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                {playerColor === 'white' ? 'Black' : 'White'}
                                            </div>
                                        </div>
                                    </div>
                                    {thinking && (
                                        <div className="text-sm text-primary-400 flex items-center gap-2">
                                            <div className="spinner w-4 h-4 border-2"></div>
                                            Thinking...
                                        </div>
                                    )}
                                </div>

                                {/* Chessboard */}
                                <div className="flex justify-center bg-dark-900/50 p-4 rounded-lg">
                                    <div className="chess-board w-full max-w-[600px] aspect-square">
                                        <Chessboard
                                            position={game.fen()}
                                            onPieceDrop={onDrop}
                                            onSquareClick={onSquareClick}
                                            customSquareStyles={optionSquares}
                                            boardOrientation={playerColor}
                                            customBoardStyle={{
                                                borderRadius: '4px',
                                                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)'
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Player Info - Bottom */}
                                <div className="flex items-center justify-between mt-4 p-4 bg-dark-800 rounded-lg border-2 border-primary-500">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={user?.avatar}
                                            alt={user?.username}
                                            className="w-12 h-12 rounded-full"
                                        />
                                        <div>
                                            <div className="font-semibold">{user?.username}</div>
                                            <div className="text-sm text-gray-400">
                                                {playerColor} • Elo: {user?.elo}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm font-semibold">
                                        {game.turn() === playerColor[0] ? (
                                            <span className="text-green-400">Your turn</span>
                                        ) : (
                                            <span className="text-gray-400">Opponent's turn</span>
                                        )}
                                    </div>
                                </div>

                                {/* Game Controls */}
                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={handleResign}
                                        className="btn-secondary flex items-center gap-2 flex-1"
                                    >
                                        <FaFlag />
                                        Resign
                                    </button>
                                    <button
                                        onClick={handleOfferDraw}
                                        className="btn-secondary flex items-center gap-2 flex-1"
                                        disabled={mode === 'ai'}
                                    >
                                        <FaHandshake />
                                        Offer Draw
                                    </button>
                                </div>
                                <div className="mt-3">
                                    <button
                                        onClick={() => {
                                            const url = window.location.href;
                                            navigator.clipboard.writeText(url);
                                            toast.success('Link phòng đấu đã copy! Gửi cho bạn bè ngay.');
                                        }}
                                        className="w-full py-3 bg-dark-700 hover:bg-dark-600 border border-dark-600 rounded-lg flex items-center justify-center gap-2 text-primary-400 font-bold transition-all"
                                    >
                                        <FaUserPlus className="text-xl" /> Mời bạn đấu (Copy Link)
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Move History */}
                            <div className="card">
                                <h3 className="text-xl font-bold mb-4">Move History</h3>
                                <div className="max-h-64 overflow-y-auto space-y-1">
                                    {moveHistory.length === 0 ? (
                                        <p className="text-gray-400 text-center py-4">No moves yet</p>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            {moveHistory.map((move, index) => (
                                                <div
                                                    key={index}
                                                    className={`p-2 rounded ${index % 2 === 0 ? 'bg-dark-700' : 'bg-dark-800'}`}
                                                >
                                                    {Math.floor(index / 2) + 1}. {move}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Chat */}
                            {mode !== 'ai' && (
                                <div className="card">
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                        <FaComments />
                                        Chat
                                    </h3>
                                    <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                                        {chatMessages.length === 0 ? (
                                            <p className="text-gray-400 text-center py-4 text-sm">
                                                No messages yet
                                            </p>
                                        ) : (
                                            chatMessages.map((msg, index) => (
                                                <div key={index} className="text-sm">
                                                    <span className="font-semibold text-primary-400">
                                                        {msg.username}:
                                                    </span>{' '}
                                                    <span className="text-gray-300">{msg.message}</span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                                            placeholder="Type a message..."
                                            className="input-field flex-1"
                                        />
                                        <button onClick={sendChatMessage} className="btn-primary px-4">
                                            Send
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Confetti Effect */}
            {showConfetti && game.isCheckmate() && (
                <Confetti
                    width={typeof window !== 'undefined' ? window.innerWidth : 300}
                    height={typeof window !== 'undefined' ? window.innerHeight : 200}
                    recycle={false}
                    numberOfPieces={500}
                    colors={['#FFD700', '#FFA500', '#FF6347', '#4169E1', '#32CD32']}
                />
            )}

            {/* Enhanced Game Over Modal */}
            {isGameOver && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="card max-w-2xl w-full text-center p-8 md:p-12 animate-scale-up relative overflow-hidden">
                        {/* Decorative Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-purple-500/10 pointer-events-none"></div>

                        {/* Content */}
                        <div className="relative z-10">
                            {/* Trophy Icon */}
                            {game.isCheckmate() && (
                                <div className="flex justify-center mb-6">
                                    <div className="relative">
                                        <FaTrophy className="text-8xl text-yellow-400 drop-shadow-2xl animate-bounce" />
                                        <div className="absolute inset-0 animate-ping">
                                            <FaTrophy className="text-8xl text-yellow-400 opacity-20" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Title */}
                            <h2 className="text-5xl md:text-6xl font-bold mb-4">
                                {game.isCheckmate() ? (
                                    <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                                        Victory!
                                    </span>
                                ) : (
                                    <span className="gradient-text">Draw</span>
                                )}
                            </h2>

                            {/* Winner Information */}
                            <div className="mb-8">
                                {game.isCheckmate() ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-center gap-4">
                                            <img
                                                src={
                                                    (game.turn() === 'w' ? (playerColor === 'black' ? user?.avatar : opponent?.avatar || mode === 'ai' ? 'https://api.dicebear.com/7.x/bottts/svg?seed=ai' : user?.avatar)
                                                        : (playerColor === 'white' ? user?.avatar : opponent?.avatar || mode === 'ai' ? 'https://api.dicebear.com/7.x/bottts/svg?seed=ai' : user?.avatar))
                                                }
                                                alt="Winner"
                                                className="w-20 h-20 rounded-full border-4 border-yellow-400 shadow-xl"
                                            />
                                            <div className="text-left">
                                                <div className="text-3xl font-bold text-white">
                                                    {game.turn() === 'w' ? (
                                                        playerColor === 'black' ? user?.username : (mode === 'ai' ? `Stockfish AI (Lvl ${difficulty})` : opponent?.username || 'Black')
                                                    ) : (
                                                        playerColor === 'white' ? user?.username : (mode === 'ai' ? `Stockfish AI (Lvl ${difficulty})` : opponent?.username || 'White')
                                                    )}
                                                </div>
                                                <div className="text-xl text-yellow-400 flex items-center gap-2">
                                                    <FaMedal /> Won by Checkmate!
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : game.isStalemate() ? (
                                    <p className="text-2xl text-gray-300">Stalemate - Game Drawn</p>
                                ) : game.isThreefoldRepetition() ? (
                                    <p className="text-2xl text-gray-300">Draw by Threefold Repetition</p>
                                ) : game.isInsufficientMaterial() ? (
                                    <p className="text-2xl text-gray-300">Draw by Insufficient Material</p>
                                ) : (
                                    <p className="text-2xl text-gray-300">Game Drawn</p>
                                )}
                            </div>

                            {/* Game Statistics */}
                            <div className="grid grid-cols-3 gap-4 mb-8 bg-dark-800/50 rounded-xl p-6 backdrop-blur-sm">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-primary-400">{moveHistory.length}</div>
                                    <div className="text-sm text-gray-400 mt-1">Total Moves</div>
                                </div>
                                <div className="text-center border-x border-dark-600">
                                    <div className="text-3xl font-bold text-purple-400">
                                        {Math.floor((new Date().getTime() - gameStartTime.getTime()) / 60000)}m
                                    </div>
                                    <div className="text-sm text-gray-400 mt-1">Duration</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-400">
                                        {game.isCheckmate() ? '+12' : '+6'}
                                    </div>
                                    <div className="text-sm text-gray-400 mt-1">Rating Points</div>
                                </div>
                            </div>

                            {/* Rating Change Display */}
                            {ratingChange !== null && (
                                <div className="mt-6 mb-6 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                                    <div className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Rating Change</div>
                                    <div className="flex items-center justify-center gap-4">
                                        <div className={`text-4xl font-black ${ratingChange > 0 ? 'text-green-400 drop-shadow-glow-green' : 'text-red-400 drop-shadow-glow-red'}`}>
                                            {ratingChange > 0 ? '+' : ''}{ratingChange}
                                        </div>
                                        <div className="h-10 w-px bg-white/20"></div>
                                        <div className="flex flex-col items-start">
                                            <div className="text-xs text-gray-500">New Rating</div>
                                            <div className="text-xl font-bold text-white">{newRating}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => router.push('/analyze?pgn=' + encodeURIComponent(game.pgn()))}
                                    className="btn-secondary flex items-center justify-center gap-2"
                                >
                                    <FaChartLine />
                                    Analyze Game
                                </button>
                                <button
                                    onClick={() => router.push('/lobby')}
                                    className="btn-secondary"
                                >
                                    Back to Lobby
                                </button>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="btn-primary"
                                >
                                    Play Again
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
