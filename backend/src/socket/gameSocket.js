import { Chess } from 'chess.js';

// Store active game rooms
const gameRooms = new Map();

// Helper to start move timer
function startMoveTimer(roomId, turnColor, gameNamespace) {
    const room = gameRooms.get(roomId);
    if (!room) return;

    if (room.moveTimer) clearTimeout(room.moveTimer);

    room.moveTimer = setTimeout(() => {
        if (gameRooms.has(roomId)) {
            const currentRoom = gameRooms.get(roomId);
            if (currentRoom.chess.turn() === (turnColor === 'white' ? 'w' : 'b')) {
                const winnerColor = turnColor === 'white' ? 'black' : 'white';
                console.log(`⏰ Timeout! ${turnColor} lost by time.`);
                handleGameEnd(roomId, winnerColor, 'timeout', gameNamespace);
            }
        }
    }, 10000);
}

// Helper to handle game end (DB + ELO + Room Cleanup)
async function handleGameEnd(roomId, result, endReason, gameNamespace) {
    const room = gameRooms.get(roomId);
    if (!room) return;

    if (room.moveTimer) clearTimeout(room.moveTimer);


    console.log(`🏁 Game Over in ${roomId}. Result: ${result}, Reason: ${endReason}`);

    // Emit Game Over Event
    // If specific winner logic needed for UI, we calculate it here
    room.players.forEach(player => {
        const isWinner = player.color === result;
        gameNamespace.to(player.socketId).emit('gameEnded', {
            result,
            reason: endReason,
            isWinner // Helpful for UI
        });
    });

    // DB Update & ELO
    try {
        const { default: Game } = await import('../models/Game.js');
        const { default: User } = await import('../models/User.js');
        const { calculateRatingChanges } = await import('../utils/eloCalculator.js');

        const gameDoc = await Game.findById(roomId);
        if (gameDoc && gameDoc.result === 'ongoing') { // Only if not already finished
            const updateData = {
                $set: {
                    result: result,
                    endReason: endReason,
                    completedAt: new Date(),
                    fen: room.chess.fen(),
                    pgn: room.chess.pgn()
                }
            };

            // ELO Calculation
            if (gameDoc.white && gameDoc.black) {
                const whitePlayer = await User.findById(gameDoc.white);
                const blackPlayer = await User.findById(gameDoc.black);

                if (whitePlayer && blackPlayer) {
                    const ratingChanges = calculateRatingChanges(
                        whitePlayer.rating,
                        blackPlayer.rating,
                        result
                    );

                    // Update White
                    await User.findByIdAndUpdate(whitePlayer._id, {
                        rating: ratingChanges.whiteNewRating,
                        elo: ratingChanges.whiteNewRating,
                        $inc: {
                            gamesPlayed: 1,
                            wins: result === 'white' ? 1 : 0,
                            losses: result === 'black' ? 1 : 0,
                            draws: result === 'draw' ? 1 : 0
                        }
                    });

                    // Update Black
                    await User.findByIdAndUpdate(blackPlayer._id, {
                        rating: ratingChanges.blackNewRating,
                        elo: ratingChanges.blackNewRating,
                        $inc: {
                            gamesPlayed: 1,
                            wins: result === 'black' ? 1 : 0,
                            losses: result === 'white' ? 1 : 0,
                            draws: result === 'draw' ? 1 : 0
                        }
                    });

                    // Snapshot ratings
                    updateData.$set.whiteRatingBefore = whitePlayer.rating;
                    updateData.$set.whiteRatingAfter = ratingChanges.whiteNewRating;
                    updateData.$set.whiteRatingChange = ratingChanges.whiteChange;
                    updateData.$set.blackRatingBefore = blackPlayer.rating;
                    updateData.$set.blackRatingAfter = ratingChanges.blackNewRating;
                    updateData.$set.blackRatingChange = ratingChanges.blackChange;

                    console.log(`Ratings updated: White ${whitePlayer.rating}->${ratingChanges.whiteNewRating}, Black ${blackPlayer.rating}->${ratingChanges.blackNewRating}`);

                    // Notify players of ELO change
                    room.players.forEach(p => {
                        if (p.isOnline) {
                            const newRating = p.color === 'white' ? ratingChanges.whiteNewRating : ratingChanges.blackNewRating;
                            const oldRating = p.color === 'white' ? whitePlayer.rating : blackPlayer.rating;
                            gameNamespace.to(p.socketId).emit('ratingUpdate', {
                                oldRating,
                                newRating,
                                change: newRating - oldRating
                            });
                        }
                    });
                }
            }

            await Game.findByIdAndUpdate(roomId, updateData);
        }
    } catch (e) {
        console.error('Error in handleGameEnd persistence:', e);
    }

    // Cleanup room (delayed to allow analysis/chat for a bit, or immediate?)
    // User requested "one side resigned, other stays".
    // We should NOT delete the room immediately if users are still there?
    // BUT user said "when searching for new match, it goes back to old one".
    // Use clear logic: The room remains in memory for chat/analysis, BUT database says 'completed'.
    // Matchmaking checks DB. Since DB is 'completed', matchmaking will create NEW game. OK.

    // We can keep the room in memory for a while.
    // gameRooms.delete(roomId); // Do NOT delete immediately so players can chat?
    // Actually, if we don't delete, re-join logic might still catch it? 
    // joinRoom checks gameRooms.has(roomId).
    // If user reloads, joinRoom finds memory room. 
    // BUT Matchmaking creates NEW roomId. So that's fine.
    // ONLY issue is if "Quick Match" tries to reconnect to ongoing games.
    // The "reconnect" logic in matchmakingSocket checks for 'ongoing'.
    // Since we set DB to result!=ongoing, matchmaking WON'T redirect here.
    // So safe to keep room in memory.
}

export const initializeGameSocket = (io) => {
    const gameNamespace = io.of('/game');

    gameNamespace.on('connection', (socket) => {
        // ... (connection logic remains same)
        console.log(`Game socket connected: ${socket.id}`);

        socket.on('joinRoom', async ({ roomId, userId, username }) => {
            // ... (keep existing joinRoom logic up to catch)
            socket.join(roomId);
            try {
                if (!gameRooms.has(roomId)) {
                    const { default: Game } = await import('../models/Game.js');
                    const gameFromDb = await Game.findById(roomId);
                    const chess = new Chess();
                    if (gameFromDb) {
                        try {
                            if (gameFromDb.pgn) chess.loadPgn(gameFromDb.pgn);
                            else if (gameFromDb.fen) chess.load(gameFromDb.fen);
                        } catch (e) { console.error(e); if (gameFromDb.fen) chess.load(gameFromDb.fen); }
                    }
                    gameRooms.set(roomId, { players: [], chess, spectators: [] });
                }
                const room = gameRooms.get(roomId);
                const existingPlayer = room.players.find(p => p.userId === userId);

                if (existingPlayer) {
                    if (existingPlayer.disconnectTimeout) {
                        clearTimeout(existingPlayer.disconnectTimeout); existingPlayer.disconnectTimeout = null;
                    }
                    existingPlayer.socketId = socket.id;
                    existingPlayer.isOnline = true;
                    socket.emit('playerJoined', { color: existingPlayer.color, fen: room.chess.fen(), pgn: room.chess.pgn(), players: room.players.map(p => ({ ...p, disconnectTimeout: undefined })) });
                    gameNamespace.to(roomId).emit('playerReconnected', { username: existingPlayer.username, players: room.players.map(p => ({ ...p, disconnectTimeout: undefined })) });
                } else if (room.players.length < 2) {
                    const { default: Game } = await import('../models/Game.js');
                    const gameFromDb = await Game.findById(roomId);
                    let color = 'white';
                    if (gameFromDb && gameFromDb.white && gameFromDb.white.toString() === userId) color = 'white';
                    else if (gameFromDb && gameFromDb.black && gameFromDb.black.toString() === userId) color = 'black';
                    else color = room.players.length === 0 ? 'white' : 'black';

                    const { default: User } = await import('../models/User.js');
                    const userDoc = await User.findById(userId);
                    const elo = userDoc ? userDoc.elo : 1500;
                    const avatar = userDoc ? userDoc.avatar : null;

                    room.players.push({ socketId: socket.id, userId, username, color, isOnline: true, elo, avatar });
                    socket.emit('playerJoined', {
                        color,
                        fen: room.chess.fen(),
                        pgn: room.chess.pgn(),
                        players: room.players.map(p => ({ ...p, disconnectTimeout: undefined }))
                    });
                    gameNamespace.to(roomId).emit('roomUpdate', { players: room.players.map(p => ({ ...p, disconnectTimeout: undefined })), spectators: room.spectators.length });

                    // Start timer if game is ready (2 players)
                    if (room.players.length === 2) {
                        const turn = room.chess.turn() === 'w' ? 'white' : 'black';
                        startMoveTimer(roomId, turn, gameNamespace);
                    }
                } else {
                    room.spectators.push({ socketId: socket.id, userId, username });
                    socket.emit('spectatorJoined', { fen: room.chess.fen(), pgn: room.chess.pgn(), players: room.players.map(p => ({ ...p, disconnectTimeout: undefined })), history: room.chess.history({ verbose: true }) });
                }
            } catch (error) { console.error('Error in joinRoom:', error); }
        });

        // Make move
        socket.on('makeMove', ({ roomId, move }) => {
            const room = gameRooms.get(roomId);
            if (!room) return;
            const player = room.players.find(p => p.socketId === socket.id);
            if (!player || player.color[0] !== room.chess.turn()) {
                socket.emit('invalidMove', { error: 'Not your turn or invalid player' });
                return;
            }

            try {
                const result = room.chess.move(move);
                if (result) {
                    const fen = room.chess.fen();
                    const isGameOver = room.chess.isGameOver();

                    let gameResult = null;
                    let endReason = null;

                    if (isGameOver) {
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
                    }

                    // Emit move
                    gameNamespace.to(roomId).emit('moveMade', {
                        move: result,
                        fen,
                        pgn: room.chess.pgn(),
                        isGameOver,
                        result: gameResult,
                        endReason
                    });

                    // Save move
                    import('../models/Game.js').then(async ({ default: Game }) => {
                        try {
                            await Game.findByIdAndUpdate(roomId, {
                                $push: { moves: { ...result, san: result.san, timestamp: new Date() } },
                                $set: { fen, pgn: room.chess.pgn() }
                            });
                        } catch (e) { console.error('Save move failed', e); }
                    });

                    // Handle End
                    if (isGameOver) {
                        handleGameEnd(roomId, gameResult, endReason, gameNamespace);
                    } else {
                        // Start timer for next player
                        const nextTurn = room.chess.turn() === 'w' ? 'white' : 'black';
                        startMoveTimer(roomId, nextTurn, gameNamespace);
                    }
                }
            } catch (e) { console.error(e); }
        });

        socket.on('chatMessage', ({ roomId, message, username }) => {
            gameNamespace.to(roomId).emit('chatMessage', { username, message, timestamp: new Date() });
        });

        socket.on('offerDraw', ({ roomId, username }) => {
            socket.to(roomId).emit('drawOffered', { username });
        });

        socket.on('acceptDraw', ({ roomId }) => {
            handleGameEnd(roomId, 'draw', 'draw_agreement', gameNamespace);
        });

        socket.on('declineDraw', ({ roomId, username }) => {
            socket.to(roomId).emit('drawDeclined', { username });
        });

        socket.on('resign', ({ roomId, userId }) => {
            console.log(`🏳️ Resign requested in ${roomId} by ${userId}`);
            const room = gameRooms.get(roomId);
            if (!room) {
                console.error(`❌ Resign failed: Room ${roomId} not found`);
                return;
            }

            const player = room.players.find(p => p.userId === userId);
            if (player) {
                if (!['white', 'black'].includes(player.color)) {
                    console.error(`❌ Resign failed: Invalid player color ${player.color}`);
                    return;
                }
                const winner = player.color === 'white' ? 'black' : 'white';
                console.log(`🏳️ Resign processed for ${player.username} (${player.color}). Winner: ${winner}`);
                handleGameEnd(roomId, winner, 'resignation', gameNamespace);
            } else {
                console.error(`❌ Resign failed: Player ${userId} not found in room`);
            }
        });

        socket.on('leaveRoom', ({ roomId, userId }) => {
            socket.leave(roomId);
            const room = gameRooms.get(roomId);
            if (room) {
                const player = room.players.find(p => p.userId === userId);
                if (player && player.disconnectTimeout) clearTimeout(player.disconnectTimeout);

                room.players = room.players.filter(p => p.userId !== userId);
                room.spectators = room.spectators.filter(s => s.userId !== userId);

                if (room.players.length === 0 && room.spectators.length === 0) gameRooms.delete(roomId);
                else gameNamespace.to(roomId).emit('roomUpdate', { players: room.players.map(p => ({ ...p, disconnectTimeout: undefined })), spectators: room.spectators.length });
            }
        });

        socket.on('disconnect', () => {
            gameRooms.forEach((room, roomId) => {
                const player = room.players.find(p => p.socketId === socket.id);
                if (player) {
                    player.isOnline = false;
                    gameNamespace.to(roomId).emit('playerDisconnected', {
                        username: player.username,
                        message: `Player ${player.username} disconnected. Waiting 30s...`,
                        timeout: 30000
                    });

                    player.disconnectTimeout = setTimeout(() => {
                        if (gameRooms.has(roomId) && !player.isOnline) {
                            const winner = player.color === 'white' ? 'black' : 'white';
                            handleGameEnd(roomId, winner, 'abandonment', gameNamespace);
                            // Keep room in memory? Or delete logic inside handleGameEnd?
                            // For abandonment, usually strictly over.
                            gameRooms.delete(roomId);
                        }
                    }, 30000);
                } else {
                    room.spectators = room.spectators.filter(s => s.socketId !== socket.id);
                }
            });
        });

    });
    console.log('Game socket handlers initialized (Refactored)');
};
