import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    contentType: {
        type: String,
        enum: ['video', 'article', 'interactive'],
        default: 'article'
    },
    videoUrl: {
        type: String,
        default: null
    },
    thumbnail: {
        type: String,
        default: 'https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=800'
    },
    category: {
        type: String,
        enum: ['opening', 'middlegame', 'endgame', 'tactics', 'strategy', 'basics'],
        required: true
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    duration: {
        type: Number, // in minutes
        default: 10
    },
    order: {
        type: Number,
        default: 0
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
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

const Lesson = mongoose.model('Lesson', lessonSchema);

export default Lesson;
