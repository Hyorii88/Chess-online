
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/chess-platform';

mongoose.connect(uri)
    .then(async () => {
        console.log('Connected to MongoDB for migration');

        try {
            const users = await User.find({});
            console.log(`Found ${users.length} users. Starting migration...`);

            let updatedCount = 0;
            for (const user of users) {
                // Logic: rating is the source of truth because it was being updated by game logic previously.
                // elo was static/default.
                // We want to sync elo = rating.
                // If rating is missing (?), use 1500.

                let newRating = user.rating;
                if (newRating === undefined || newRating === null) newRating = 1500;

                // If user has 0 games, force 1500 to be clean?
                // Actually, if gamesPlayed is 0, let's reset to 1500 to be fair to new system.
                if (user.gamesPlayed === 0) {
                    newRating = 1500;
                }

                if (user.elo !== newRating || user.rating !== newRating) {
                    user.elo = newRating;
                    user.rating = newRating;
                    await user.save();
                    updatedCount++;
                }
            }

            console.log(`Migration complete. Updated ${updatedCount} users.`);

        } catch (err) {
            console.error('Migration error:', err);
        } finally {
            mongoose.disconnect();
        }
    })
    .catch(err => console.error('Connection failed:', err));
