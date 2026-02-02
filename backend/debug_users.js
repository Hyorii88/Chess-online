
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/chess-platform';

console.log('Connecting to:', uri);

mongoose.connect(uri)
    .then(async () => {
        console.log('Connected to MongoDB');

        try {
            const users = await User.find({}).sort({ _id: -1 }).limit(10);
            console.log(`Found ${users.length} users (showing last 10):`);

            users.forEach(u => {
                console.log(`- User: ${u.username}, ELO: ${u.elo}, Rating: ${u.rating}, ID: ${u._id}`);

                // Fix logic: if ELO is 1200 (old default) and Rating is 1500 (new default intent),
                // we should probably bump them to 1500? Or sync them.
                // If user played games, ELO might be different. 
                // Let's just print for now.
            });

            const count = await User.countDocuments();
            console.log(`Total users in DB: ${count}`);

        } catch (err) {
            console.error('Error querying users:', err);
        } finally {
            mongoose.disconnect();
        }
    })
    .catch(err => console.error('Connection failed:', err));
