import { Chess } from 'chess.js';

// Store active game rooms
const gameRooms = new Map();

export const initializeGameSocket = (io) => {
    const gameNamespace = io.of('/game');

    gameNamespace.on('connection', (socket) => {
        console.log(`🎮 Game socket connected: ${socket.id}`);

        // Join a game room
        socket.on('joinRoom', async ({ roomId, userId, username }) => {
            socket.join(roomId);

            try {
                if (!gameRooms.has(roomId)) {
                    // Try to load from DB first
                    const { default: Game } = await import('../models/Game.js');
                    const gameFromDb = await Game.findById(roomId);

                    const chess = new Chess();
                    let players = [];

                    if (gameFromDb) {
                        try {
                            if (gameFromDb.pgn) {
                                chess.loadPgn(gameFromDb.pgn);
                            } else if (gameFromDb.fen) {
                                chess.load(gameFromDb.fen);
                            }
                        } catch (e) {
                            console.error(`❌ Error loading state from DB for ${roomId}:`, e);
                            if (gameFromDb.fen) chess.load(gameFromDb.fen);
                        }

                        // We might want to restore players/colors too if strictly tracked,
                        // but for now we rely on the Join logic to re-assign based on userId.
                        // However, strictly speaking, we don't store "who was white" in the Game model 
                        // in a way that maps easily back to "active socket players" without `white` and `black` fields.
                        // The Game model HAS `white` and `black` (ObjectIds).
                        // Let's populate local players from DB data if possible or just let them rejoin.
                    }

                    gameRooms.set(roomId, {
                        players: [], // active players will re-register below
                        chess: chess,
                        spectators: []
                    });
                    console.log(`📂 Room ${roomId} loaded from ${gameFromDb ? 'DB' : 'Scratch'}`);
                }

                const room = gameRooms.get(roomId);

                // Add player if not already in room
                const existingPlayer = room.players.find(p => p.userId === userId);

                if (existingPlayer) {
                    // Player reconnecting: Update socket ID
                    console.log(`🔄 Player ${username} reconnected to room ${roomId}`);
                    existingPlayer.socketId = socket.id;
                    existingPlayer.isOnline = true;

                    socket.emit('playerJoined', {
                        color: existingPlayer.color,
                        fen: room.chess.fen(),
                        pgn: room.chess.pgn(),
                        players: room.players
                    });

                    gameNamespace.to(roomId).emit('roomUpdate', {
                        players: room.players,
                        spectators: room.spectators.length
                    });
                } else if (room.players.length < 2) {
                    // New player joining - Check against DB for Color assignment if possible?
                    // Ideally we should check if this userId matches white/black in DB to assign correct color.
                    // For now, simpler queue logic (first come first served) or basic re-join.
                    // Improving: Check if gameFromDb was loaded (we don't have it here easily without re-query or storing in room).
                    // Let's do a quick check if we can improve persistence of "who is who".
                    // But for now, let's keep the existing color logic but ensure we don't double-assign if DB has info? 
                    // Actually, the current logic is: if room has < 2 players, add. 
                    // If the server restarted, room.players is empty. 
                    // The first person to recombine gets White. 
                    // THIS IS A POTENTIAL BUG if Black reconnects first!

                    // QUICK FIX: When loading from DB, better store the white/black IDs in the room object 
                    // so we can assign correctly.
                    // Updating the `if (!gameRooms.has(roomId))` block above to match this.

                    // We need to fetch Game again or pass it down. 
                    // I will do a fetch here to be safe and correct.
                    const { default: Game } = await import('../models/Game.js');
                    const gameFromDb = await Game.findById(roomId);

                    let color = 'white';
                    if (gameFromDb) {
                        if (gameFromDb.white.toString() === userId) color = 'white';
                        else if (gameFromDb.black.toString() === userId) color = 'black';
                        else color = room.players.length === 0 ? 'white' : 'black';
                    } else {
                        color = room.players.length === 0 ? 'white' : 'black';
                    }

                    room.players.push({ socketId: socket.id, userId, username, color });

                    socket.emit('playerJoined', {
                        color,
                        fen: room.chess.fen(),
                        pgn: room.chess.pgn(),
                        players: room.players
                    });

                    gameNamespace.to(roomId).emit('roomUpdate', {
                        players: room.players,
                        spectators: room.spectators.length
                    });
                } else {
                    // Join as spectator
                    room.spectators.push({ socketId: socket.id, userId, username });
                    socket.emit('spectatorJoined', {
                        fen: room.chess.fen(),
                        pgn: room.chess.pgn(),
                        players: room.players,
                        history: room.chess.history({ verbose: true })
                    });
                }
            } catch (error) {
                console.error('Error in joinRoom:', error);
            }
        });

        // Make a move
        socket.on('makeMove', ({ roomId, move }) => {
            const room = gameRooms.get(roomId);
            if (!room) {
                console.error(`❌ Move attempt for non-existent room: ${roomId}`);
                return;
            }

            console.log(`♟️ Move attempt in ${roomId}:`, move);
            console.log(`   Current FEN: ${room.chess.fen()}`);

            try {
                const result = room.chess.move(move);
                if (result) {
                    const fen = room.chess.fen();
                    const isGameOver = room.chess.isGameOver();

                    let gameResult = null;
                    if (isGameOver) {
                        let endReason = null;
                        if (room.chess.isCheckmate()) {
                            gameResult = room.chess.turn() === 'w' ? 'black' : 'white';
                            endReason = 'checkmate';
                        } else if (room.chess.isDraw()) {
                            gameResult = 'draw';
                            endReason = 'draw';
                        } else if (room.chess.isStalemate()) {
                            gameResult = 'draw';
                            endReason = 'stalemate';
                        } else if (room.chess.isThreefoldRepetition()) {
                            gameResult = 'draw';
                            endReason = 'threefold_repetition';
                        } else if (room.chess.isInsufficientMaterial()) {
                            gameResult = 'draw';
                            endReason = 'insufficient_material';
                        }

                        console.log(`🏁 Game Over in ${roomId}. Result: ${gameResult}, Reason: ${endReason}`);


                    }

                    // Broadcast move to all players in room
                    gameNamespace.to(roomId).emit('moveMade', {
                        move: result,
                        fen: fen,
                        pgn: room.chess.pgn(),
                        isGameOver,
                        result: gameResult,
                        endReason: isGameOver ? (room.chess.isCheckmate() ? 'checkmate' : 'draw') : null
                    });
                    console.log(`✅ Move successful: ${result.san}. New FEN: ${fen}`);

                    // Save move to database (Persistence)
                    import('../models/Game.js').then(async ({ default: Game }) => {
                        try {
                            const moveData = {
                                from: result.from,
                                to: result.to,
                                piece: result.piece,
                                captured: result.captured,
                                promotion: result.promotion,
                                san: result.san,
                                timestamp: new Date()
                            };

                            await Game.findByIdAndUpdate(roomId, {
                                $push: { moves: moveData },
                                $set: {
                                    fen: fen,
                                    pgn: room.chess.pgn(),
                                    // Update result ONLY if game is over (to avoid overwriting 'ongoing')
                                    ...(isGameOver && {
                                        result: gameResult,
                                        endReason: isGameOver ? (room.chess.isCheckmate() ? 'checkmate' : 'draw') : null,
                                        completedAt: new Date()
                                    })
                                }
                            });
                            console.log(`💾 Move ${result.san} saved to DB for game ${roomId}`);
                        } catch (err) {
                            console.error('❌ Failed to save move to DB:', err);
                        }
                    });
                } else {
                    console.warn(`⚠️ Move failed (logic):`, move);
                }
            } catch (error) {
                console.error(`❌ Invalid move error:`, error.message);
                socket.emit('invalidMove', { error: 'Invalid move: ' + error.message });
                // Resync client
                socket.emit('playerJoined', {
                    color: room.players.find(p => p.socketId === socket.id)?.color || 'white',
                    fen: room.chess.fen(),
                    players: room.players
                });
            }
        });

        // Chat message
        socket.on('chatMessage', ({ roomId, message, username }) => {
            gameNamespace.to(roomId).emit('chatMessage', {
                username,
                message,
                timestamp: new Date()
            });
        });

        // Offer draw
        socket.on('offerDraw', ({ roomId, username }) => {
            socket.to(roomId).emit('drawOffered', { username });
        });

        // Accept draw
        socket.on('acceptDraw', ({ roomId }) => {
            gameNamespace.to(roomId).emit('gameEnded', {
                result: 'draw',
                reason: 'draw_agreement'
            });
        });

        // Resign
        socket.on('resign', ({ roomId, userId }) => {
            const room = gameRooms.get(roomId);
            if (!room) return;

            const player = room.players.find(p => p.userId === userId);
            if (player) {
                const winner = player.color === 'white' ? 'black' : 'white';
                gameNamespace.to(roomId).emit('gameEnded', {
                    result: winner,
                    reason: 'resignation'
                });
            }
        });

        // Leave room
        socket.on('leaveRoom', ({ roomId, userId }) => {
            socket.leave(roomId);
            const room = gameRooms.get(roomId);

            if (room) {
                room.players = room.players.filter(p => p.userId !== userId);
                room.spectators = room.spectators.filter(s => s.userId !== userId);

                if (room.players.length === 0 && room.spectators.length === 0) {
                    gameRooms.delete(roomId);
                } else {
                    gameNamespace.to(roomId).emit('roomUpdate', {
                        players: room.players,
                        spectators: room.spectators.length
                    });
                }
            }
        });

        // Disconnect
        socket.on('disconnect', () => {
            console.log(`🎮 Game socket disconnected: ${socket.id}`);

            // Remove from all rooms
            gameRooms.forEach((room, roomId) => {
                const wasPlayer = room.players.find(p => p.socketId === socket.id);
                room.players = room.players.filter(p => p.socketId !== socket.id);
                room.spectators = room.spectators.filter(s => s.socketId !== socket.id);

                if (room.players.length === 0 && room.spectators.length === 0) {
                    gameRooms.delete(roomId);
                } else if (wasPlayer) {
                    gameNamespace.to(roomId).emit('playerDisconnected', {
                        message: 'Opponent disconnected'
                    });
                }
            });
        });
    });

    console.log('✅ Game socket handlers initialized');
};
