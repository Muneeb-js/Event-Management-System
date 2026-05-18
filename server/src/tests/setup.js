import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

// Ensure we target a dedicated test sandbox database
const testDbName = 'event_management_test';

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
    // Remove trailing slash if present
    const baseUri = uri.endsWith('/') ? uri.slice(0, -1) : uri;
    await mongoose.connect(`${baseUri}/${testDbName}`);
  }
});

afterEach(async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      try {
        await collections[key].deleteMany();
      } catch (err) {
        // Silently skip clean failures on uninitialized collections
      }
    }
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});
