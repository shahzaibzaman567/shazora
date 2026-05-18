import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();

const seedAdmin = async () => {
  await connectDB();

  try {
    const adminExists = await User.findOne({ email: 'shahzaibzaman465@gmail.com' });

    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'shahzaibzaman465@gmail.com',
        password: '@Shahzora', // This will be hashed by the User pre-save hook
        role: 'admin',
      });
      console.log('Admin user created successfully!');
    } else {
      console.log('Admin user already exists.');
    }
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
