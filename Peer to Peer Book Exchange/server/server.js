import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import userRoutes from './routes/users.js';
import bookRoutes from './routes/books.js';
import requestRoutes from './routes/requests.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/requests', requestRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'BookSwap API is running' });
});

// 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint not found.' });
});

// Centralized Error Handling Middleware (Sanitizes all errors)
app.use((err, req, res, next) => {
  // 1. Log technical details to the terminal/server logs only
  console.error('--- INTERNAL SERVER ERROR ---');
  console.error('Path:', req.path);
  console.error('Error Details:', err);
  console.error('-----------------------------');

  // 2. Handle invalid JSON payload from client
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Malformed JSON payload provided.' });
  }

  // 3. Handle Mongoose Schema Validation Errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: 'Validation failed. Please verify all required fields.' });
  }

  // 4. Handle Mongoose Invalid ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format provided.' });
  }

  // 5. Generic sanitized fallback (never leak err.stack or model details to client)
  res.status(err.status || 500).json({
    message: 'An unexpected error occurred. Please try again later.'
  });
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Atlas Connected successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
  });