import Puzzle from '../models/Puzzle.js';
import User from '../models/User.js';

export const getRandomPuzzle = async (req, res) => {
    try {
        const { difficulty, tags } = req.query;

        const filter = {};
        if (difficulty) {
            filter.difficulty = parseInt(difficulty);
        }
        if (tags) {
            filter.tags = { $in: tags.split(',') };
        }

        const count = await Puzzle.countDocuments(filter);
        const random = Math.floor(Math.random() * count);

        const puzzle = await Puzzle.findOne(filter).skip(random);

        if (!puzzle) {
            return res.status(404).json({ error: 'No puzzles found' });
        }

        res.json({ puzzle });
    } catch (error) {
        console.error('Get random puzzle error:', error);
        res.status(500).json({ error: 'Failed to fetch puzzle' });
    }
};

export const getPuzzleById = async (req, res) => {
    try {
        const puzzle = await Puzzle.findById(req.params.id);

        if (!puzzle) {
            return res.status(404).json({ error: 'Puzzle not found' });
        }

        res.json({ puzzle });
    } catch (error) {
        console.error('Get puzzle error:', error);
        res.status(500).json({ error: 'Failed to fetch puzzle' });
    }
};

export const validatePuzzleSolution = async (req, res) => {
    try {
        const { puzzleId, moves } = req.body;
        const puzzle = await Puzzle.findById(puzzleId);

        if (!puzzle) {
            return res.status(404).json({ error: 'Puzzle not found' });
        }

        // Update attempts
        puzzle.attempts += 1;

        // Check if solution is correct
        const isCorrect = JSON.stringify(moves) === JSON.stringify(puzzle.moves);

        if (isCorrect) {
            puzzle.solves += 1;

            // Update user stats
            if (req.user) {
                await User.findByIdAndUpdate(req.user._id, {
                    $inc: { 'stats.puzzlesSolved': 1 }
                });
            }
        }

        await puzzle.save();

        res.json({
            correct: isCorrect,
            solution: isCorrect ? null : puzzle.moves,
            message: isCorrect ? 'Correct solution!' : 'Incorrect. Try again!'
        });
    } catch (error) {
        console.error('Validate puzzle error:', error);
        res.status(500).json({ error: 'Failed to validate puzzle' });
    }
};

export const getAllPuzzles = async (req, res) => {
    try {
        const { difficulty, tags, limit = 50, skip = 0 } = req.query;

        const filter = {};
        if (difficulty) {
            filter.difficulty = parseInt(difficulty);
        }
        if (tags) {
            filter.tags = { $in: tags.split(',') };
        }

        const puzzles = await Puzzle.find(filter)
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .sort({ rating: -1 });

        const total = await Puzzle.countDocuments(filter);

        res.json({ puzzles, total });
    } catch (error) {
        console.error('Get all puzzles error:', error);
        res.status(500).json({ error: 'Failed to fetch puzzles' });
    }
};

export const createPuzzle = async (req, res) => {
    try {
        const { title, fen, moves, difficulty, tags, playerColor, description } = req.body;

        const puzzle = new Puzzle({
            title,
            fen,
            moves,
            difficulty,
            tags,
            playerColor,
            description,
            createdBy: req.user._id
        });

        await puzzle.save();

        res.status(201).json({
            message: 'Puzzle created',
            puzzle
        });
    } catch (error) {
        console.error('Create puzzle error:', error);
        res.status(500).json({ error: 'Failed to create puzzle' });
    }
};

export const updatePuzzle = async (req, res) => {
    try {
        const puzzle = await Puzzle.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!puzzle) {
            return res.status(404).json({ error: 'Puzzle not found' });
        }

        res.json({ message: 'Puzzle updated', puzzle });
    } catch (error) {
        console.error('Update puzzle error:', error);
        res.status(500).json({ error: 'Failed to update puzzle' });
    }
};

export const deletePuzzle = async (req, res) => {
    try {
        const puzzle = await Puzzle.findByIdAndDelete(req.params.id);

        if (!puzzle) {
            return res.status(404).json({ error: 'Puzzle not found' });
        }

        res.json({ message: 'Puzzle deleted' });
    } catch (error) {
        console.error('Delete puzzle error:', error);
        res.status(500).json({ error: 'Failed to delete puzzle' });
    }
};
