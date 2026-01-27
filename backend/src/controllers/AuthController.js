import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create user
        const user = new User({
            username,
            email,
            password,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
        });

        await user.save();

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                elo: user.elo
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Debug logs
        console.log(`Login attempt for: ${email}`);

        // Check if user exists (by email OR username)
        // detailed logs already added above, now making look up more flexible
        const user = await User.findOne({
            $or: [
                { email: email },
                { username: email }
            ]
        });

        if (!user) {
            console.log(`User not found for input: ${email}`);
            return res.status(401).json({ error: 'Invalid credentials (User not found)' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log('Password incorrect');
            return res.status(401).json({ error: 'Invalid credentials (Password mismatch)' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                elo: user.elo,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: `Server Error: ${error.message}`,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

export const verifyToken = async (req, res) => {
    try {
        res.json({
            valid: true,
            user: {
                id: req.user._id,
                username: req.user.username,
                email: req.user.email,
                avatar: req.user.avatar,
                elo: req.user.elo,
                isAdmin: req.user.isAdmin
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};
