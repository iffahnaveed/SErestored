


const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // PostgreSQL connection
const authRoutes = require('./routes/auth');
//const { v4: uuidv4 } = require('uuid');

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
  password: process.env.DB_PASSWORD || 'wajiha2003',
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


app.post('/api/jobs/apply', async (req, res) => {
  const { user_id, job_id } = req.body;

  try {
    // Check if user has already applied to this job
    console.log("Applying with:", user_id, job_id);

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

    const { job_experience, cgpa_required, application_deadline } = jobResult.rows[0];
    const deadline = new Date(application_deadline);
    const now = new Date();

    // Validations
    if (userExperience < job_experience) {
      return res.status(400).json({ message: "Your experience does not meet the requirement." });
    }

    if (cgpa < cgpa_required) {
     
      return res.status(400).json({ message: "Your CGPA is lower than the required threshold." });
    }

    if (now > deadline) {
      return res.status(400).json({ message: "The application deadline has passed." });
    }

    // Insert into application table
    
    const applicationDate = new Date();

    await pool.query(
      `INSERT INTO application ( applicant_id, job_id, qualification_id, experience, gpa, application_date)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [ user_id, job_id, qualification_id, userExperience, cgpa, applicationDate]
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
  const {
    cgpa,
    school,
    type,
    subject,
    yearGraduated,
    applicant_id // Make sure this is sent from the frontend
  } = req.body;

  console.log("Received qualification:", {
    cgpa,
    school,
    type,
    subject,
    yearGraduated,
    applicant_id
  });

  try {
    console.log("Inserting with values:", [cgpa, school, type, subject, yearGraduated]);

    // Insert into qualification table and return the qual_id
    const result = await pool.query(
      `INSERT INTO qualification (qual_type, university_school_name, year_completed, cgpa, field)
       VALUES ($1, $2, $3, $4, $5) RETURNING qual_id`,
      [type, school, yearGraduated, cgpa, subject]
    );

    const qual_id = result.rows[0].qual_id;

    // Now insert into qualification_applicant
    await pool.query(
      `INSERT INTO qualification_applicant (applicant_id, quali_id)
       VALUES ($1, $2)`,
      [applicant_id, qual_id]
    );

    res.status(201).json({ message: "Qualification and link added successfully." });

  } catch (error) {
    console.error("Error inserting qualification or linking applicant:", error);
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
    // Fetch all recruiter IDs
    const result = await pool.query('SELECT id FROM recruiter');

    // If there are no recruiters, return an empty array
    if (result.rows.length === 0) {
      return res.status(200).json([]);  // No recruiters found
    }

    // Return the recruiter IDs
    const recruiterIds = result.rows.map(row => row.id);
    res.status(200).json(recruiterIds);
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
//view status 
app.get("/api/applications/:applicantId", async (req, res) => {
  const { applicantId } = req.params;
  try {
    const result = await pool.query(`
      SELECT a.application_id
      FROM application a
      JOIN applicant ap ON a.applicant_id = ap.applicant_id
      WHERE ap.applicant_id = $1
    `, [applicantId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/api/jobid/:applicationId", async (req, res) => {
  const { applicationId } = req.params;
  try {
    const result = await pool.query(
      "SELECT job_id FROM application WHERE application_id = $1",
      [applicationId]
    );
    if (result.rows.length > 0) {
      res.json({ jobId: result.rows[0].job_id });
    } else {
      res.status(404).json({ message: "Job ID not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/api/jobstatus/:jobId", async (req, res) => {
  const { jobId } = req.params;
  try {
    const result = await pool.query(
      "SELECT job_status FROM job WHERE jobid = $1",
      [jobId]
    );

    const status = result.rows.length > 0 ? result.rows[0].job_status : -1;

    let message;
    if (status === -1) message = "No status found for the job.";
    else if (status === 0) message = "Pending";
    else if (status === 1) message = "Congratulations, you got the job!";
    else message = "Unknown status for the job.";

    res.json({ message });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
//contracts
app.get("/api/contract/:jobId", async (req, res) => {
  const { jobId } = req.params;
  try {
    const result = await pool.query(`
      SELECT contract_id, hr_id, salary, probation_period,  contract_start_date, 
              contract_end_date, benefits
      FROM hr_contract
      WHERE job_id = $1
    `, [jobId]);

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: "Contract not found for this job ID" });
    }
  } catch (err) {
    console.error("Error fetching contract:", err);
    res.status(500).send("Server error");
  }
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
module.exports = app;
