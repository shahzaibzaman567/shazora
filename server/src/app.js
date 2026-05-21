import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from './config/passport.js';
import productRoutes from './routes/productRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { handleWebhook } from './controllers/paymentController.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import connectDB from './config/db.js';

dotenv.config();

const app = express();

// Trust proxy for secure cookies in production behind Vercel reverse proxy
app.set('trust proxy', 1);

// Middleware

const origin = process.env.NODE_ENV === 'production' 
  ? process.env.FRONTEND_URL 
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: origin || '*',
  credentials: true
}));
app.use(cookieParser());
app.use(
  session({
    name: 'connect.sid',
    secret: process.env.SESSION_SECRET || 'shazora-session-secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shazora',
      collectionName: 'sessions',
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Stripe Webhook MUST be placed BEFORE express.json()
app.post('/api/payment/webhook', express.raw({ type: 'application/json' }), handleWebhook);

app.use(express.json()); // Body parser

// Connect to MongoDB on each request (cached connection)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection failed:', error.message);
    res.status(500).json({
      message: 'Database connection failed. Please ensure that the IP Address of this Vercel deployment is whitelisted in your MongoDB Atlas Dashboard (Network Access -> Add IP Address -> Allow Access From Anywhere / 0.0.0.0/0).',
      error: error.message,
    });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Serve frontend in production
const __dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
  );
} else {
  // Base route
  app.get('/', (req, res) => {
    res.send('Shazora API is running...');
  });
}

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

export default app;
