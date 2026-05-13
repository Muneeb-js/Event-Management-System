import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/user.model.js';
import { Alert } from '../models/alert.model.js';
import { DB_NAME } from '../constants.js';

dotenv.config({ path: './.env' });

const seedDashboard = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
    await mongoose.connect(`${mongoUri}/${DB_NAME}`);
    console.log('Connected to DB for dashboard seeding');

    // Get admin user (seeded previously)
    const user = await User.findOne({ email: 'admin@example.com' });
    if (!user) {
        console.log('Admin user not found. Run npm run seed first.');
        process.exit(1);
    }

    // Clear existing alerts for this user to avoid duplicates
    await Alert.deleteMany({ user: user._id });

    const alerts = [
      {
        user: user._id,
        title: 'Room Change',
        message: 'Philosophy Ethics panel moved to Room 402B.',
        type: 'warning'
      },
      {
        user: user._id,
        title: 'Registration Confirmed',
        message: 'You are now registered for the Winter Gala.',
        type: 'success'
      },
      {
        user: user._id,
        title: 'Deadline Approaching',
        message: 'Submit abstracts for the Research Fair by Friday.',
        type: 'error'
      }
    ];

    for (const alertData of alerts) {
      await Alert.create(alertData);
      console.log(`Alert created: ${alertData.title}`);
    }

    console.log('Dashboard seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDashboard();
