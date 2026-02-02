// Matchmaking queue
const matchmakingQueue = [];

export const initializeMatchmakingSocket = (io) => {
    const matchmakingNamespace = io.of('/matchmaking');

    matchmakingNamespace.on('connection', (socket) => {
        console.log(`Matchmaking socket connected: ${socket.id}`);

        // Join matchmaking queue
        socket.on('joinQueue', async ({ userId, username, elo }) => {
            console.log(`Join request from: ${username} (${userId})`);

            // Check for existing active game in DB
            try {
                const { default: Game } = await import('../models/Game.js');

                // Find latest game for this user
                const activeGame = await Game.findOne({
                    $or: [{ white: userId }, { black: userId }]
                }).sort({ createdAt: -1 }).populate('white').populate('black');

                // Check if it's ongoing
                if (activeGame && (!activeGame.result || activeGame.result === 'ongoing')) {
                    console.log(`♻️ Found active game ${activeGame._id} for ${username}. Redirecting...`);

                    const isWhite = activeGame.white._id.toString() === userId;

                    socket.emit('matchFound', {
                        roomId: activeGame._id.toString(),
                        white: activeGame.white,
                        black: activeGame.black,
                        yourColor: isWhite ? 'white' : 'black',
                        opponent: isWhite ? activeGame.black : activeGame.white,
                        reconnect: true
                    });
                    return;
                }
            } catch (error) {
                console.error('Error checking for active games:', error);
            }



            // Check if user already in queue
            const existingIndex = matchmakingQueue.findIndex(p => p.userId === userId);
            if (existingIndex !== -1) {
                console.log(`WARNING: User ${username} already in queue. Removing previous entry to avoid duplicates.`);
                matchmakingQueue.splice(existingIndex, 1);
            }

            // Add to queue
            matchmakingQueue.push({
                socketId: socket.id,
                userId,
                username,
                elo,
                joinedAt: Date.now()
            });

            console.log(`➕ Player joined queue: ${username} (Elo: ${elo}). Queue size: ${matchmakingQueue.length}`);

            socket.emit('queueJoined', {
                position: matchmakingQueue.length,
                message: 'Looking for opponent...'
            });

            // Try to find a match
            tryMatch(matchmakingNamespace);
        });

        // Leave queue
        socket.on('leaveQueue', ({ userId }) => {
            const index = matchmakingQueue.findIndex(p => p.userId === userId);
            if (index !== -1) {
                matchmakingQueue.splice(index, 1);
                socket.emit('queueLeft', { message: 'Left matchmaking queue' });
            }
        });

        // Disconnect
        socket.on('disconnect', () => {
            const index = matchmakingQueue.findIndex(p => p.socketId === socket.id);
            if (index !== -1) {
                console.log(`➖ Player left queue: ${matchmakingQueue[index].username}`);
                matchmakingQueue.splice(index, 1);
            }
        });
    });

    console.log('Matchmaking socket handlers initialized');
};

// Try to match players
async function tryMatch(namespace) {
    if (matchmakingQueue.length < 2) return;

    // Sort by join time
    matchmakingQueue.sort((a, b) => a.joinedAt - b.joinedAt);

    // Simple pairing: match first two in queue
    // In production, you'd match by Elo range
    const player1 = matchmakingQueue.shift();
    const player2 = matchmakingQueue.shift();

    // Randomly assign colors
    const isPlayer1White = Math.random() < 0.5;

    const whitePlayer = isPlayer1White ? player1 : player2;
    const blackPlayer = isPlayer1White ? player2 : player1;

    try {
        // Create game in Database
        // We need to dynamically import to avoid circular dependencies if any, 
        // or just standard import usage. Since this is a module, dynamic import is safe.
        const { default: Game } = await import('../models/Game.js');

        const newGame = new Game({
            white: whitePlayer.userId,
            black: blackPlayer.userId,
            mode: 'online',
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            pgn: '',
            moves: []
        });

        await newGame.save();
        const roomId = newGame._id.toString();

        const matchData = {
            roomId,
            white: whitePlayer,
            black: blackPlayer
        };

        // Notify both players
        namespace.to(player1.socketId).emit('matchFound', {
            ...matchData,
            yourColor: isPlayer1White ? 'white' : 'black',
            opponent: player2
        });

        namespace.to(player2.socketId).emit('matchFound', {
            ...matchData,
            yourColor: isPlayer1White ? 'black' : 'white',
            opponent: player1
        });

        console.log(`Match created in DB: ${player1.username} vs ${player2.username} (Room: ${roomId})`);
    } catch (error) {
        console.error('❌ Error creating matchmaking game:', error);
        // Refund players to queue? For now just log.
    }
}
