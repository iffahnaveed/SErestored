// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');

// // Signup route
// router.post('/signup', async (req, res) => {
//   const { username, email, password } = req.body;

//   try {
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const newUser = new User({ username, email, password });
//     await newUser.save();
//     res.status(201).json({ message: 'User created successfully' });
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Login route
// // Login route
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: 'No account exists' });
//     }

//     if (user.password !== password) {
//       return res.status(401).json({ message: 'Invalid password' });
//     }

//     // Output the user data to the terminal
//     console.log('User Data:', user);

//     res.status(200).json({ message: 'Login successful' });
//   } catch (err) {
//     res.status(500).json({ error: 'Server error' });
//   }
// });


// module.exports = router;

const express = require('express');
const pool = require('../config/db'); // Import PostgreSQL connection pool

const router = express.Router();
const { createUser, findUserByEmail } = require('../models/User');

// Signup route
router.post('/signup', async (req, res) => {
  const { username, email, password, age, gender, experience } = req.body;

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Store password as plain text (not recommended for production)
    const newUser = await createUser(username, email, password, age, gender, experience);
    
    res.status(201).json({ message: 'User created', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const userResult = await pool.query('SELECT * FROM applicant WHERE email = $1', [email]);

//     if (userResult.rows.length === 0) {
//       return res.json({ message: 'No account exists' });
//     }

//     const user = userResult.rows[0];

//     // Compare plain-text passwords (Not secure for production)
//     if (password !== user.password) {
//       return res.json({ message: 'Invalid password' });
//     }

//     res.json({ message: 'Login successful', user: { id: user.id, username: user.username, email: user.email } });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query('SELECT * FROM applicant WHERE email = $1', [email]);

    if (userResult.rows.length === 0) {
      return res.json({ message: 'No account exists' });
    }

    const user = userResult.rows[0];

    // Compare plain-text passwords (Not secure for production)
    if (password !== user.password) {
      return res.json({ message: 'Invalid password' });
    }

    // Assuming your table column is named applicant_id
    res.json({
      message: 'Login successful',
      user: {
        id: user.applicant_id,          // Use this if column is applicant_id
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
