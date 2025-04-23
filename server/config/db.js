// config/db.js
const { Pool } = require('pg');
require('dotenv').config();  // Ensure the .env file is loaded

// Create a new Pool instance with the environment variables
const pool = new Pool({
  user: process.env.PG_USER,  // PostgreSQL user
  host: process.env.PG_HOST,  // PostgreSQL host
  database: process.env.PG_DATABASE,  // Database name
  password: process.env.PG_PASSWORD,  // Database password
  port: process.env.PG_PORT,  // PostgreSQL port
});

// Connect to the PostgreSQL server
const connectDB = async () => {
  try {
    await pool.connect();
    console.log('✅ PostgreSQL connected successfully!');
  } catch (err) {
    console.error('❌ Failed to connect to PostgreSQL', err);
    throw err; // Rethrow the error for better visibility
  }
};

// Export the pool and connectDB function
module.exports = { pool, connectDB };