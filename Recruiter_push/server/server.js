// server.js
const express = require('express');
const { connectDB } = require('./config/db');  // Import connectDB function
const authRoutes = require('./routes/auth');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to the database
connectDB().then(() => {
  // Start the server only after DB is connected successfully
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
});

// Routes
app.use('/api/auth', authRoutes);