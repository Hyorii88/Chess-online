import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import gameRoutes from './routes/game.js';
import puzzleRoutes from './routes/puzzle.js';
import lessonRoutes from './routes/lesson.js';
import analysisRoutes from './routes/analysis.js';
import chatbotRoutes from './routes/chatbot.js';
import { initializeGameSocket } from './socket/gameSocket.js';
import { initializeMatchmakingSocket } from './socket/matchmakingSocket.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.NODE_ENV === 'production'
            ? (process.env.FRONTEND_URL || 'http://localhost:3000')
            : true, // Allow all origins in development
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Middleware
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? (process.env.FRONTEND_URL || 'http://localhost:3000')
        : true, // Allow all origins in development
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chess-platform')
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => console.error('❌ MongoDB connection error:', err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/puzzles', puzzleRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Chess platform server is running' });
});

// Socket.IO initialization
initializeGameSocket(io);
initializeMatchmakingSocket(io);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Socket.IO ready for connections`);
});

export { io };
