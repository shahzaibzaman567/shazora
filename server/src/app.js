import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import productRoutes from './routes/productRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { handleWebhook } from './controllers/paymentController.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Middleware
const origin = process.env.NODE_ENV === 'production' 
  ? process.env.FRONTEND_URL 
  : ['http://localhost:5173', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: origin || '*',
  credentials: true
}));
app.use(cookieParser());

// Stripe Webhook MUST be placed BEFORE express.json()
app.post('/api/payment/webhook', express.raw({ type: 'application/json' }), handleWebhook);

app.use(express.json()); // Body parser

// Routes
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
