import express from 'express';
import { register, login, verifyToken } from '../controllers/AuthController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify', authenticateToken, verifyToken);

export default router;
