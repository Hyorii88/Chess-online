import User from '../models/User.js';

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.params.id || req.user._id;
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const { username, avatar } = req.body;
        const updates = {};

        if (username) updates.username = username;
        if (avatar) updates.avatar = avatar;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        res.json({ message: 'Profile updated', user });
    } catch (error) {
        console.error('Update user profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

export const getUserStats = async (req, res) => {
    try {
        const userId = req.params.id || req.user._id;
        const user = await User.findById(userId).select('username elo stats');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const totalGames = user.stats.wins + user.stats.losses + user.stats.draws;
        const winRate = totalGames > 0 ? ((user.stats.wins / totalGames) * 100).toFixed(1) : 0;

        res.json({
            username: user.username,
            elo: user.elo,
            stats: {
                ...user.stats.toObject(),
                totalGames,
                winRate: parseFloat(winRate)
            }
        });
    } catch (error) {
        console.error('Get user stats error:', error);
        res.status(500).json({ error: 'Failed to fetch user stats' });
    }
};

export const getLeaderboard = async (req, res) => {
    try {
        const { limit = 100 } = req.query;

        const users = await User.find()
            .select('username avatar elo stats')
            .sort({ elo: -1 })
            .limit(parseInt(limit));

        res.json({ leaderboard: users });
    } catch (error) {
        console.error('Get leaderboard error:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const { limit = 50, skip = 0 } = req.query;

        const users = await User.find()
            .select('-password')
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .sort({ createdAt: -1 });

        const total = await User.countDocuments();

        res.json({ users, total });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};
