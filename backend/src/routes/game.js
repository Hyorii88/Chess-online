import express from 'express';
import {
    createGame,
    getGameById,
    getUserGames,
    updateGame,
    endGame
} from '../controllers/GameController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/create', authenticateToken, createGame);
router.get('/:id', getGameById);
router.get('/user/:userId?', authenticateToken, getUserGames);
router.put('/:id', authenticateToken, updateGame);
router.post('/:id/end', authenticateToken, endGame);

export default router;
