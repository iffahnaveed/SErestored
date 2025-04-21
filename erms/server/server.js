// const express = require('express');
// const connectDB = require('./config/db');
// const authRoutes = require('./routes/auth');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Connect to DB
// connectDB();

// // Routes
// app.use('/api/auth', authRoutes);

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// const express = require('express');
// const cors = require('cors');
// const authRoutes = require('./routes/auth');
// require('dotenv').config();

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors());

// // Routes
// app.use('/api/auth', authRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // PostgreSQL connection
const authRoutes = require('./routes/auth');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// PostgreSQL Connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ermsDB',
  password: process.env.DB_PASSWORD || 'wahcantt697',
  port: process.env.DB_PORT || 5432, // Default PostgreSQL port
});

// Routes
app.use('/api/auth', authRoutes);

// Fetch jobs from the database
app.get('/api/jobs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM job'); // Fetch all jobs
    res.json(result.rows); // Send jobs as JSON
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Apply for a job
// app.post('/api/jobs/apply', async (req, res) => {
//   const { user_id, job_id } = req.body;

//   try {
//     // Delete job from database
//     const result = await pool.query('DELETE FROM job WHERE jobid = $1 RETURNING *', [job_id]);

//     if (result.rowCount === 0) {
//       return res.status(404).json({ message: "Job not found or already applied." });
//     }

//     res.json({ message: "Job application successful" });
//   } catch (error) {
//     console.error("Error applying for job:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });
app.post('/api/jobs/apply', async (req, res) => {
  const { user_id, job_id } = req.body;

  try {
    // Check if user has already applied to this job
    const existing = await pool.query(
      'SELECT * FROM application WHERE applicant_id = $1 AND job_id = $2',
      [user_id, job_id]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "You have already applied for this job." });
    }

    // Fetch applicant experience
    const userResult = await pool.query('SELECT experience FROM applicant WHERE applicant_id = $1', [user_id]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const userExperience = userResult.rows[0].experience;

    // Fetch CGPA and qualification_id from qualification table
    const qualResult = await pool.query(
      `SELECT q.qual_id, q.cgpa
       FROM qualification q
       JOIN qualification_applicant qa ON q.qual_id = qa.quali_id
       WHERE qa.applicant_id = $1
       LIMIT 1`,
      [user_id]
    );
    
    if (qualResult.rows.length === 0) {
      return res.status(404).json({ message: "Qualification not found for this user" });
    }
    //const { qualification_id, cgpa } = qualResult.rows[0];
    const { qual_id: qualification_id, cgpa } = qualResult.rows[0];

    // Fetch job requirements
    const jobResult = await pool.query(
      'SELECT job_experience,cgpa_required, application_deadline FROM job WHERE jobid = $1',
      [job_id]
    );
    if (jobResult.rows.length === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    const { job_experience, required_cgpa, application_deadline } = jobResult.rows[0];
    const deadline = new Date(application_deadline);
    const now = new Date();

    // Validations
    if (userExperience < job_experience) {
      return res.status(400).json({ message: "Your experience does not meet the requirement." });
    }

    if (cgpa < required_cgpa) {
      return res.status(400).json({ message: "Your CGPA is lower than the required threshold." });
    }

    if (now > deadline) {
      return res.status(400).json({ message: "The application deadline has passed." });
    }

    // Insert into application table
    const applicationId = uuidv4();
    const applicationDate = new Date();

    await pool.query(
      `INSERT INTO application (application_id, applicant_id, job_id, qualification_id, experience, gpa, application_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [applicationId, user_id, job_id, qualification_id, userExperience, cgpa, applicationDate]
    );

    res.json({ message: "Job application submitted successfully!" });
  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/api/user/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const result = await pool.query('SELECT * FROM applicant WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});
app.post('/api/qualification', async (req, res) => {
  const { cgpa, school, type, subject, yearGraduated } = req.body;
  
  console.log("Received qualification:", {
    cgpa,
    school,
    type,
    subject,
    yearGraduated
  });

  try {
    const graduationDate = `${yearGraduated}-01-01`; // convert to full date string
    console.log("Inserting with values:", [cgpa, school, type, subject, graduationDate]);

    await pool.query(
      `INSERT INTO qualification (qual_type, university_school_name, year_completed, cgpa, field)
       VALUES ($1, $2, $3, $4, $5)`,
      [type, school, graduationDate, cgpa, subject] // Make sure values are in the correct order
    );
    
    res.status(201).json({ message: "Qualification added successfully." });
  } catch (error) {
    console.error("Error inserting qualification:", error); // log detailed error
    res.status(500).json({ message: "Server error." });
  }
});

// GET all HRs
app.get('/api/hr', async (req, res) => {
  try {
    const result = await pool.query('SELECT hr_id FROM hr');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching HRs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST: Applicant sends message to HR
app.post('/api/messages', async (req, res) => {
  const { hr_id, applicant_id, message } = req.body;

  try {
    await pool.query(
      `INSERT INTO receive_message_applicant_hr (hr_id, applicant_id, message)
       VALUES ($1, $2, $3)`,
      [hr_id, applicant_id, message]
    );

    res.json({ message: 'Message sent to HR successfully!' });
  } catch (error) {
    console.error('Error sending message to HR:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
//recieve from HR 
// Example Express route
app.get('/api/messages/fromhr', async (req, res) => {
  const { hr_id, applicant_id } = req.query;

  try {
    const result = await pool.query(`
      SELECT hr_and_applicantmessage 
      FROM send_message_hr_applicant 
      WHERE hr_id = $1 AND send_message_hrapplicant_id = $2
      ORDER BY message_date DESC
      LIMIT 1;
    `, [hr_id, applicant_id]);

    res.json(result.rows[0] || {});
  } catch (err) {
    console.error('Error fetching message from HR:', err);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
});
app.get('/api/recruiters', async (req, res) => {
  try {
    const result = await pool.query('SELECT recruiter_id FROM recruiter');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching recruiters:', err);
    res.status(500).json({ error: 'Failed to fetch recruiters' });
  }
});
app.post('/api/messages/recruiter', async (req, res) => {
  const { recruiter_id, applicant_id, message } = req.body;

  try {
    await pool.query(`
      INSERT INTO receive_message_recruiter_applicant (recruiter_id, applicant_id, message)
      VALUES ($1, $2, $3)
    `, [recruiter_id, applicant_id, message]);

    res.json({ success: true, message: 'Message sent to recruiter' });
  } catch (err) {
    console.error('Error sending message to recruiter:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});
//recieve from rec 
app.get('/api/messages/fromrecruiter', async (req, res) => {
  const { recruiter_id, applicant_id } = req.query;

  try {
    const result = await pool.query(`
      SELECT recruiter_and_applicant_message
      FROM send_message_recruiter_applicant
      WHERE recruiter_id = $1 AND send_message_applicant_id = $2
      ORDER BY message_date DESC
      LIMIT 1;
    `, [recruiter_id, applicant_id]);

    res.json(result.rows[0] || {});
  } catch (err) {
    console.error('Error fetching message from recruiter:', err);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
});
app.get('/api/appointments', async (req, res) => {
  const { applicant_id, recruiter_id } = req.query;

  try {
    const result = await pool.query(
      `SELECT appointment_id, recruiter_id, applicant_id, appointment_time, description
       FROM appointment
       WHERE applicant_id = $1 AND recruiter_id = $2`,
      [applicant_id, recruiter_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
