import express from 'express';
import {
    getUserProfile,
    updateUserProfile,
    getUserStats,
    getLeaderboard,
    getAllUsers,
    deleteUser
} from '../controllers/UserController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', authenticateToken, getUserProfile);
router.get('/profile/:id', getUserProfile);
router.put('/profile', authenticateToken, updateUserProfile);
router.get('/stats/:id?', getUserStats);
router.get('/leaderboard', getLeaderboard);
router.get('/all', authenticateToken, requireAdmin, getAllUsers);
router.delete('/:id', authenticateToken, requireAdmin, deleteUser);

export default router;
