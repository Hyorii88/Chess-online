import Game from '../models/Game.js';
import User from '../models/User.js';

// Calculate new Elo rating
const calculateElo = (winnerElo, loserElo, kFactor = 32) => {
    const expectedWinner = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400));
    const expectedLoser = 1 / (1 + Math.pow(10, (winnerElo - loserElo) / 400));

    const newWinnerElo = Math.round(winnerElo + kFactor * (1 - expectedWinner));
    const newLoserElo = Math.round(loserElo + kFactor * (0 - expectedLoser));

    return { newWinnerElo, newLoserElo };
};

export const createGame = async (req, res) => {
    try {
        const { whiteId, blackId, mode, aiDifficulty } = req.body;

        const game = new Game({
            white: whiteId,
            black: blackId,
            mode: mode || 'online',
            aiDifficulty: mode === 'ai' ? aiDifficulty : null
        });

        await game.save();

        res.status(201).json({
            message: 'Game created',
            game: await game.populate(['white', 'black'])
        });
    } catch (error) {
        console.error('Create game error:', error);
        res.status(500).json({ error: 'Failed to create game' });
    }
};

export const getGameById = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id)
            .populate('white', 'username avatar elo')
            .populate('black', 'username avatar elo');

        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }

        res.json({ game });
    } catch (error) {
        console.error('Get game error:', error);
        res.status(500).json({ error: 'Failed to fetch game' });
    }
};

export const getUserGames = async (req, res) => {
    try {
        const userId = req.params.userId || req.user._id;
        const { limit = 20, skip = 0 } = req.query;

        const games = await Game.find({
            $or: [{ white: userId }, { black: userId }],
            result: { $ne: 'ongoing' }
        })
            .populate('white', 'username avatar elo')
            .populate('black', 'username avatar elo')
            .sort({ completedAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        const total = await Game.countDocuments({
            $or: [{ white: userId }, { black: userId }],
            result: { $ne: 'ongoing' }
        });

        res.json({ games, total });
    } catch (error) {
        console.error('Get user games error:', error);
        res.status(500).json({ error: 'Failed to fetch games' });
    }
};

export const updateGame = async (req, res) => {
    try {
        const { moves, fen, pgn } = req.body;
        const game = await Game.findById(req.params.id);

        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }

        if (moves) game.moves = moves;
        if (fen) game.fen = fen;
        if (pgn) game.pgn = pgn;

        await game.save();

        res.json({ message: 'Game updated', game });
    } catch (error) {
        console.error('Update game error:', error);
        res.status(500).json({ error: 'Failed to update game' });
    }
};

export const endGame = async (req, res) => {
    try {
        const { result, endReason } = req.body;
        const game = await Game.findById(req.params.id);

        if (!game) {
            return res.status(404).json({ error: 'Game not found' });
        }

        game.result = result;
        game.endReason = endReason;
        game.completedAt = new Date();
        game.duration = Math.floor((game.completedAt - game.createdAt) / 1000);

        await game.save();

        // Update user stats and Elo
        if (result !== 'draw' && game.mode === 'online') {
            const winner = await User.findById(result === 'white' ? game.white : game.black);
            const loser = await User.findById(result === 'white' ? game.black : game.white);

            const { newWinnerElo, newLoserElo } = calculateElo(winner.elo, loser.elo);

            winner.elo = newWinnerElo;
            winner.stats.wins += 1;
            await winner.save();

            loser.elo = newLoserElo;
            loser.stats.losses += 1;
            await loser.save();
        } else if (result === 'draw') {
            const white = await User.findById(game.white);
            const black = await User.findById(game.black);

            white.stats.draws += 1;
            black.stats.draws += 1;

            await white.save();
            await black.save();
        }

        res.json({ message: 'Game ended', game });
    } catch (error) {
        console.error('End game error:', error);
        res.status(500).json({ error: 'Failed to end game' });
    }
};
