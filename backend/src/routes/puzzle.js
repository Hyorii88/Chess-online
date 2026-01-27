import express from 'express';
import {
    getRandomPuzzle,
    getPuzzleById,
    validatePuzzleSolution,
    getAllPuzzles,
    createPuzzle,
    updatePuzzle,
    deletePuzzle
} from '../controllers/PuzzleController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/random', getRandomPuzzle);
router.get('/all', getAllPuzzles);
router.get('/:id', getPuzzleById);
router.post('/validate', authenticateToken, validatePuzzleSolution);
router.post('/create', authenticateToken, requireAdmin, createPuzzle);
router.put('/:id', authenticateToken, requireAdmin, updatePuzzle);
router.delete('/:id', authenticateToken, requireAdmin, deletePuzzle);

export default router;
