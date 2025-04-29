

const { Pool } = require('pg');
require('dotenv').config();


const pool = new Pool({
  user: "postgres",  // Ensure this is correct
  host: "localhost",
  database: "ermsDB",
  password: "wajiha2003", // Use the correct password
  port: 5432,
});

pool.connect()
  .then(() => console.log('PostgreSQL connected'))
  .catch(err => console.error('Connection error', err));

module.exports = pool;