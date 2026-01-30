import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
    white: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    black: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mode: {
        type: String,
        enum: ['online', 'ai', 'puzzle'],
        default: 'online'
    },
    aiDifficulty: {
        type: Number,
        min: 1,
        max: 20,
        default: null
    },
    pgn: {
        type: String,
        default: ''
    },
    fen: {
        type: String,
        default: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    },
    moves: [{
        from: String,
        to: String,
        piece: String,
        captured: String,
        promotion: String,
        san: String,
        timestamp: { type: Date, default: Date.now }
    }],
    result: {
        type: String,
        enum: ['white', 'black', 'draw', 'ongoing'],
        default: 'ongoing'
    },
    endReason: {
        type: String,
        enum: ['checkmate', 'resignation', 'timeout', 'draw_agreement', 'stalemate', 'insufficient_material', null],
        default: null
    },
    duration: {
        type: Number, // in seconds
        default: 0
    },
    whiteRatingBefore: Number,
    whiteRatingAfter: Number,
    whiteRatingChange: Number,
    blackRatingBefore: Number,
    blackRatingAfter: Number,
    blackRatingChange: Number,
    startTime: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

const Game = mongoose.model('Game', gameSchema);

export default Game;
