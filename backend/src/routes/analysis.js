import express from 'express';
import stockfishService from '../services/StockfishService.js';

const router = express.Router();

// Analyze position
router.post('/position', async (req, res) => {
    try {
        const { fen } = req.body;

        if (!fen) {
            return res.status(400).json({ error: 'FEN string required' });
        }

        const analysis = await stockfishService.analyzePosition(fen);

        res.json({
            message: 'Position analyzed',
            analysis
        });
    } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ error: 'Failed to analyze position' });
    }
});

// Get best move
router.post('/best-move', async (req, res) => {
    try {
        const { fen, difficulty = 10 } = req.body;

        if (!fen) {
            return res.status(400).json({ error: 'FEN string required' });
        }

        const result = await stockfishService.getBestMove(fen, difficulty);

        res.json({
            message: 'Best move calculated',
            ...result
        });
    } catch (error) {
        console.error('Best move error:', error);
        res.status(500).json({ error: 'Failed to get best move' });
    }
});

// Get top moves
router.post('/top-moves', async (req, res) => {
    try {
        const { fen, count = 3 } = req.body;

        if (!fen) {
            return res.status(400).json({ error: 'FEN string required' });
        }

        const moves = await stockfishService.getTopMoves(fen, count);

        res.json({
            message: 'Top moves calculated',
            moves
        });
    } catch (error) {
        console.error('Top moves error:', error);
        res.status(500).json({ error: 'Failed to get top moves' });
    }
});

export default router;
