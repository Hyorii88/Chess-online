import express from 'express';
import chatbotService from '../services/ChatbotService.js';

const router = express.Router();

// Chat with AI
router.post('/chat', async (req, res) => {
    try {
        const { message, context = [] } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message required' });
        }

        const response = await chatbotService.chat(message, context);

        res.json({
            message: 'Response generated',
            response,
            timestamp: new Date()
        });
    } catch (error) {
        console.error('Chatbot error:', error);
        res.status(500).json({ error: 'Failed to get chatbot response' });
    }
});

export default router;
