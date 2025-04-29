// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   username: String,
//   email: String,
//   password: String,
// });

// module.exports = mongoose.model('User', userSchema);
const pool = require('../config/db');

async function findUserByEmail(email) {
  const result = await pool.query('SELECT * FROM applicant WHERE email = $1', [email]);
  return result.rows[0];
}

async function createUser(username, email, password, age, gender, experience) {
  const result = await pool.query(
    `INSERT INTO applicant (username, email, password, age, gender, experience) 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [username, email, password, age, gender, experience]
  );
  return result.rows[0];
}

module.exports = { findUserByEmail, createUser };