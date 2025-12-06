import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/techopedia';
  
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

