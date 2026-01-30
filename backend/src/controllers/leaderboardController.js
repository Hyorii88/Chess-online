import User from '../models/User.js';

export const getLeaderboard = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;

        const leaderboard = await User.find()
            .select('username rating gamesPlayed wins losses draws avatar')
            .sort({ rating: -1 })
            .limit(limit);

        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
