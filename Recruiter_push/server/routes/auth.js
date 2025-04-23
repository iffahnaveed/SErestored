// routes/auth.js
const express = require('express');
const { pool } = require('../config/db');  // Import the pool from db.js

const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
  const { username, email, password, age, gender, experience } = req.body;

  try {
    const existingUser = await pool.query('SELECT * FROM recruiter WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Assuming you have a function to create the user
    const newUser = await pool.query('INSERT INTO recruiter (username, email, password, age, gender, experience) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', 
      [username, email, password, age, gender, experience]);
    
    res.status(201).json({ message: 'User created', user: newUser.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const userResult = await pool.query('SELECT * FROM recruiter WHERE email = $1', [email]);
  
      if (userResult.rows.length === 0) {
        return res.status(404).json({ message: 'No account exists' });
      }
  
      const user = userResult.rows[0];
  
      if (user.password !== password) {
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      // Send back recruiter ID so frontend can store it
      res.status(200).json({
        message: 'Login successful',
        user: {
          id: user.id, // recruiter ID
          email: user.email,
          username: user.username
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error during login' });
    }
  });  
// In your job.routes.js or similar
router.post('/jobs', async (req, res) => {
    const {
      job_title,
      job_description,
      company_name,
      qualification_skills_required,
      job_type,
      job_experience,
      cgpa_required,
      application_deadline,
      recruiter_id,
      job_status
    } = req.body;
  
    try {
      const newJob = await pool.query(
        `INSERT INTO job (
          job_title, job_description, company_name,
          qualification_skills_required, job_type, job_experience,
          cgpa_required, application_deadline, recruiter_id, job_status
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
        [
          job_title,
          job_description,
          company_name,
          qualification_skills_required,
          job_type,
          job_experience,
          cgpa_required,
          application_deadline,
          recruiter_id,
          job_status
        ]
      );
  
      res.status(201).json({ message: 'Job posted successfully', job: newJob.rows[0] });
    } catch (error) {
      console.error('Job Post Error:', error);
      res.status(500).json({ message: 'Server error while posting job' });
    }
  });
  router.post('/qualifications', async (req, res) => {
    const {
      qual_type,
      university_school_name,
      year_completed,
      cgpa,
      field,
      recruiter_id
    } = req.body;
  
    try {
      // Step 1: Insert into `qualification` table
      const qualificationResult = await pool.query(
        `INSERT INTO qualification (
          qual_type, university_school_name, year_completed, cgpa, field
        ) VALUES ($1, $2, $3, $4, $5) RETURNING qual_id`,
        [qual_type, university_school_name, year_completed, cgpa, field]
      );
  
      const qual_id = qualificationResult.rows[0].qual_id;
  
      // Step 2: Insert into `recruiter_contains_qualification` table
      await pool.query(
        `INSERT INTO recruiter_contains_qualification (
          recruiter_id, quali_id
        ) VALUES ($1, $2)`,
        [recruiter_id, qual_id]
      );
  
      res.status(201).json({ message: 'Qualification added and linked to recruiter', qual_id });
    } catch (error) {
      console.error('Add Qualification Error:', error);
      res.status(500).json({ message: 'Server error while adding qualification' });
    }
  });  
  router.get('/recruiter/:recruiterId', async (req, res) => {
    const { recruiterId } = req.params;
  
    try {
      // Step 1: Get recruiter details
      const recruiterResult = await pool.query(
        `SELECT * FROM recruiter WHERE id = $1`,
        [recruiterId]
      );
  
      if (recruiterResult.rows.length === 0) {
        return res.status(404).json({ message: 'Recruiter not found' });
      }
  
      const recruiter = recruiterResult.rows[0];
  
      // Step 2: Get qualifications linked to recruiter
      const qualificationsResult = await pool.query(
        `SELECT q.*
         FROM qualification q
         JOIN recruiter_contains_qualification rcq
         ON q.qual_id = rcq.quali_id
         WHERE rcq.recruiter_id = $1`,
        [recruiterId]
      );
  
      const qualifications = qualificationsResult.rows;
  
      // Combine and send response
      res.status(200).json({
        recruiter,
        qualifications,
      });
    } catch (error) {
      console.error('Error fetching recruiter details and qualifications:', error);
      res.status(500).json({ message: 'Server error while retrieving recruiter info' });
    }
  });  
  router.get('/recruiter/:id/jobs', async (req, res) => {
    const { id } = req.params;
    console.log("Recruiter ID:", id);
    try {
      const jobsResult = await pool.query(
        `SELECT * FROM job WHERE recruiter_id = $1`,
        [id]
      );
  
      res.status(200).json(jobsResult.rows);
    } catch (error) {
      console.error('Error fetching jobs by recruiter:', error);
      res.status(500).json({ message: 'Server error while retrieving jobs' });
    }
  });
  router.get('/recruiter/:id/job-ids', async (req, res) => {
    const { id } = req.params;
    console.log("Recruiter ID:", id);
  
    try {
      const jobsResult = await pool.query(
        `SELECT jobid FROM job WHERE recruiter_id = $1`,
        [id]
      );
  
      console.log("Fetched Job IDs:", jobsResult.rows); // <-- Logs job IDs to console
  
      res.status(200).json(jobsResult.rows);
    } catch (error) {
      console.error('Error fetching job IDs by recruiter:', error);
      res.status(500).json({ message: 'Server error while retrieving job IDs' });
    }
  });   
  router.get('/jobs/:jobId/applications', async (req, res) => {
    const { jobId } = req.params;
  
    try {
      const applicationsResult = await pool.query(
        `SELECT * FROM application WHERE job_id = $1`,
        [jobId]
      );
  
      res.status(200).json(applicationsResult.rows);
    } catch (error) {
      console.error('Error fetching applications for job:', error);
      res.status(500).json({ message: 'Server error while retrieving applications' });
    }
  });
  router.post('/tests', async (req, res) => {
    const {
      recruiter_id,
      job_id,
      no_of_questions,
      min_score
    } = req.body;
  
    try {
      const newTest = await pool.query(
        `INSERT INTO test (
          recruiter_id, job_id, no_of_questions, min_score
        ) VALUES ($1, $2, $3, $4) RETURNING *`,
        [
          recruiter_id,
          job_id,
          no_of_questions,
          min_score
        ]
      );
  
      res.status(201).json({ message: 'Test created successfully', test: newTest.rows[0] });
    } catch (error) {
      console.error('Test Creation Error:', error);
      res.status(500).json({ message: 'Server error while creating test' });
    }
  });  
  // Fetch applicants for a specific job
  router.get('/job/:jobId/applicants', async (req, res) => {
    const { jobId } = req.params;

    try {
      const applicantsResult = await pool.query(
        `SELECT a.applicant_id, a.name, a.email
        FROM application a
        WHERE a.job_id = $1`, 
        [jobId]
      );
      res.status(200).json(applicantsResult.rows); // Return applicants for the job
    } catch (error) {
      console.error('Error fetching applicants for job:', error);
      res.status(500).json({ message: 'Server error while retrieving applicants' });
    }
  });
  router.post('/testEvaluation/submit-score', async (req, res) => {
    const { applicant_id, test_id, score, total_score } = req.body;
  
    // Check for required fields
    if (!applicant_id || !test_id || score === undefined || total_score === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
  
    try {
      const query = `
        INSERT INTO test_scores (applicant_id, test_id, score, total_score, submitted_at)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING *;
      `;
  
      const values = [applicant_id, test_id, score, total_score];
  
      const result = await pool.query(query, values);
  
      res.status(201).json({
        message: 'Test score submitted successfully',
        data: result.rows[0],
      });
    } catch (error) {
      console.error('Error saving test score:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });  
module.exports = router;