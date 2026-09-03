const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const welcomeAuthRoutes = require('./routes/WelcomeAuthRoutes');
const productRoutes = require('./routes/ProductRoutes');
const transactionRoutes = require('./routes/TransactionRoutes');
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/welcome-auth', welcomeAuthRoutes);
app.use('/api/products', productRoutes);
app.use('/api/transactions', transactionRoutes);

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/marketpulse';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });
