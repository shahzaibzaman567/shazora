// Vercel Serverless Entry Point for Express Backend
import app from '../server/src/app.js';
import connectDB from '../server/src/config/db.js';

// Connect to MongoDB
connectDB();

export default app;
