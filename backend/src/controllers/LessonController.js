import Lesson from '../models/Lesson.js';
import User from '../models/User.js';

export const getAllLessons = async (req, res) => {
    try {
        const { category, difficulty, limit = 50, skip = 0 } = req.query;

        const filter = {};
        if (category) {
            filter.category = category;
        }
        if (difficulty) {
            filter.difficulty = difficulty;
        }

        const lessons = await Lesson.find(filter)
            .sort({ order: 1, createdAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        const total = await Lesson.countDocuments(filter);

        res.json({ lessons, total });
    } catch (error) {
        console.error('Get all lessons error:', error);
        res.status(500).json({ error: 'Failed to fetch lessons' });
    }
};

export const getLessonById = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);

        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }

        // Increment views
        lesson.views += 1;
        await lesson.save();

        res.json({ lesson });
    } catch (error) {
        console.error('Get lesson error:', error);
        res.status(500).json({ error: 'Failed to fetch lesson' });
    }
};

export const createLesson = async (req, res) => {
    try {
        const {
            title,
            description,
            content,
            contentType,
            videoUrl,
            thumbnail,
            category,
            difficulty,
            duration,
            order,
            isPremium
        } = req.body;

        const lesson = new Lesson({
            title,
            description,
            content,
            contentType,
            videoUrl,
            thumbnail,
            category,
            difficulty,
            duration,
            order,
            isPremium,
            createdBy: req.user._id
        });

        await lesson.save();

        res.status(201).json({
            message: 'Lesson created',
            lesson
        });
    } catch (error) {
        console.error('Create lesson error:', error);
        res.status(500).json({ error: 'Failed to create lesson' });
    }
};

export const updateLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }

        res.json({ message: 'Lesson updated', lesson });
    } catch (error) {
        console.error('Update lesson error:', error);
        res.status(500).json({ error: 'Failed to update lesson' });
    }
};

export const deleteLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findByIdAndDelete(req.params.id);

        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }

        res.json({ message: 'Lesson deleted' });
    } catch (error) {
        console.error('Delete lesson error:', error);
        res.status(500).json({ error: 'Failed to delete lesson' });
    }
};

export const likeLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);

        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }

        lesson.likes += 1;
        await lesson.save();

        res.json({ message: 'Lesson liked', likes: lesson.likes });
    } catch (error) {
        console.error('Like lesson error:', error);
        res.status(500).json({ error: 'Failed to like lesson' });
    }
};

export const completeLesson = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, {
            $inc: { 'stats.lessonsCompleted': 1 }
        });

        res.json({ message: 'Lesson marked as completed' });
    } catch (error) {
        console.error('Complete lesson error:', error);
        res.status(500).json({ error: 'Failed to complete lesson' });
    }
};
