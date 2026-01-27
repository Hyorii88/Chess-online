import express from 'express';
import {
    getAllLessons,
    getLessonById,
    createLesson,
    updateLesson,
    deleteLesson,
    likeLesson,
    completeLesson
} from '../controllers/LessonController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllLessons);
router.get('/:id', getLessonById);
router.post('/:id/like', authenticateToken, likeLesson);
router.post('/:id/complete', authenticateToken, completeLesson);
router.post('/create', authenticateToken, requireAdmin, createLesson);
router.put('/:id', authenticateToken, requireAdmin, updateLesson);
router.delete('/:id', authenticateToken, requireAdmin, deleteLesson);

export default router;
