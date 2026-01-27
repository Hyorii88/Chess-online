import mongoose from 'mongoose';

const puzzleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    fen: {
        type: String,
        required: true
    },
    moves: [{
        type: String,
        required: true
    }],
    difficulty: {
        type: Number,
        min: 1,
        max: 10,
        required: true
    },
    tags: [{
        type: String,
        enum: ['mate-in-1', 'mate-in-2', 'mate-in-3', 'fork', 'pin', 'skewer', 'discovery', 'sacrifice', 'endgame', 'opening', 'middlegame']
    }],
    playerColor: {
        type: String,
        enum: ['white', 'black'],
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    attempts: {
        type: Number,
        default: 0
    },
    solves: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 1200
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Calculate success rate
puzzleSchema.virtual('successRate').get(function () {
    if (this.attempts === 0) return 0;
    return ((this.solves / this.attempts) * 100).toFixed(1);
});

const Puzzle = mongoose.model('Puzzle', puzzleSchema);

export default Puzzle;
