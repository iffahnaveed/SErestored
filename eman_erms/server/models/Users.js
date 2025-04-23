const pool = require('../config/db');
// User functions
async function createUser(username, email, password, age, gender, quali_id, experience) {
  const result = await pool.query(
    `INSERT INTO hr (hr_name, hr_email, hr_password, hr_age, hr_gender, quali_id, hr_experience) 
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [username, email, password, age, gender, quali_id, experience]
  );
  return result.rows[0];
}

async function findUserByEmail(email) {
  const result = await pool.query('SELECT * FROM hr WHERE hr_email = $1', [email]);
  return result.rows[0];
}


async function createContract(job_id, hr_id, salary, probation_period, start_date, end_date, benefits) {
  try {
    const result = await pool.query(
      `INSERT INTO hr_contract (job_id, hr_id, salary, probation_period, contract_start_date, contract_end_date, benefits)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [job_id, hr_id, salary, probation_period, start_date, end_date, benefits]
    );
    return result.rows[0];
  } catch (err) {
    console.error("❌ Error inserting contract into DB:", err.message);
    throw err;
  }
}

async function getContracts() {
  const result = await pool.query('SELECT * FROM hr_contract');
  return result.rows;
}

async function getHRContracts(hrId) {
  const result = await pool.query('SELECT * FROM hr_contract WHERE hr_id = $1', [hrId]);
  return result.rows;
}

// 

// HR Report functions
async function getAllHRs() {
  const result = await pool.query(`
    SELECT hr_id, hr_name, hr_email, hr_age, hr_gender, quali_id, hr_experience 
    FROM hr
    ORDER BY hr_name
  `);
  return result.rows;
}

async function getHRById(hr_id) {
  const result = await pool.query(`
    SELECT 
      h.hr_id, h.hr_name, h.hr_email,h.hr_password, h.hr_age, h.hr_gender, 
      h.quali_id, h.hr_experience,
    
      COUNT(c.hr_id) AS contract_count
    FROM hr h
    LEFT JOIN qualification q ON h.quali_id = q.quali_id
    LEFT JOIN hr_contract c ON h.hr_id = c.hr_id
    WHERE h.hr_id = $1
    GROUP BY h.hr_id
  `, [hr_id]);
  return result.rows[0];
}


// Get all applicants (without qualification)
async function getAllApplicants() {
  const result = await pool.query(`
    SELECT 
      applicant_id, 
      username, 
      email,
      age,
      gender,
      experience,
      created_at
    FROM applicant
    ORDER BY username
  `);
  return result.rows;
}

async function getApplicantById(applicant_id) {
  const result = await pool.query(`
    SELECT 
      applicant_id, 
      username, 
      email,
      age,
      gender,
      experience,
      created_at
    FROM applicant
    WHERE applicant_id = $1
  `, [applicant_id]);
  return result.rows[0];
}

async function getAllRecruiters() {
  const result = await pool.query(`
    SELECT 
      r.id AS recruiter_id,
      r.username,
      r.email,
      r.age,
      r.gender,
      r.experience,
      r.created_at
    FROM recruiter r
    ORDER BY r.username
  `);
  return result.rows;
}

async function getRecruiterById(recruiter_id) {
  const result = await pool.query(`
    SELECT 
      r.id AS recruiter_id,
      r.username,
      r.email,
      r.age,
      r.gender,
      r.experience,
      r.created_at
    FROM recruiter r
    WHERE r.id = $1
  `, [recruiter_id]);
  return result.rows[0];
}

// Shortlisted applicants functions
async function getShortlistedApplicants() {
  const result = await pool.query(`
    SELECT 
      sh.shortlist_id,
      sh.job_id,
      sh.shortlist_afterhr_applicant_id,
      sh.shortlist_after_hrid,
      a.username AS applicant_name,
      h.hr_name
    FROM shortlist_after_hr sh
    JOIN applicant a ON sh.shortlist_afterhr_applicant_id = a.applicant_id
    JOIN hr h ON sh.shortlist_after_hrid = h.hr_id
    ORDER BY sh.shortlist_after_hrid, a.username
  `);
  return result.rows;
}

async function getShortlistedApplicantsByHR(hr_id) {
  const result = await pool.query(`
    SELECT 
      sh.shortlist_id,
      sh.job_id,
      sh.shortlist_afterhr_applicant_id,
      a.username AS applicant_name
    FROM shortlist_after_hr sh
    JOIN applicant a ON sh.shortlist_afterhr_applicant_id = a.applicant_id
    WHERE sh.shortlist_after_hrid = $1
    ORDER BY a.username
  `, [hr_id]);
  return result.rows;
}

async function createRecommendation(hr_id, applicant_id, recommendation) {
  // Check if applicant is shortlisted by the HR
  const shortlistCheck = await pool.query(
    `SELECT 1 FROM shortlist_after_hr 
     WHERE shortlist_after_hrid = $1 
     AND shortlist_afterhr_applicant_id = $2`,
    [hr_id, applicant_id]
  );

  if (shortlistCheck.rowCount === 0) {
    throw new Error("Recommendation not allowed. Applicant not shortlisted by HR.");
  }

  // Insert the recommendation
  const result = await pool.query(
    `INSERT INTO recommendation (
      recommendation_hr_id, 
      recommendation_applicant_id, 
      recommendation_description
    ) VALUES ($1, $2, $3) RETURNING *`,
    [hr_id, applicant_id, recommendation]
  );

  console.log('Inserted Recommendation:', result.rows[0]);
  return result.rows[0];
}

async function getRecommendations() {
  const result = await pool.query(
    `SELECT 
      r.recommendation_id,
      r.recommendation_description,
      r.created_at,
      h.hr_id,
      h.hr_name AS hr_name,
      a.applicant_id,
      a.username AS applicant_name
    FROM recommendation r
    JOIN hr h ON r.recommendation_hr_id = h.hr_id
    JOIN applicant a ON r.recommendation_applicant_id = a.applicant_id
    JOIN shortlist_after_hr s 
      ON r.recommendation_hr_id = s.shortlist_after_hrid 
      AND r.recommendation_applicant_id = s.shortlist_afterhr_applicant_id
    ORDER BY r.created_at DESC`
  );
  return result.rows;
}

async function getRecommendationsByApplicant(applicant_id) {
  const result = await pool.query(
    `SELECT 
      r.recommendation_id,
      r.recommendation_description,
      r.created_at,
      h.hr_id,
      h.hr_name AS hr_name
    FROM recommendation r
    JOIN hr h ON r.recommendation_hr_id = h.hr_id
    JOIN shortlist_after_hr s 
      ON r.recommendation_hr_id = s.shortlist_after_hrid 
      AND r.recommendation_applicant_id = s.shortlist_afterhr_applicant_id
    WHERE r.recommendation_applicant_id = $1
    ORDER BY r.created_at DESC`,
    [applicant_id]
  );
  return result.rows;
}

async function getRecommendationsByHR(hr_id) {
  const result = await pool.query(
    `SELECT 
      r.recommendation_id,
      r.recommendation_description,
      r.created_at,
      a.applicant_id,
      a.username AS applicant_name
    FROM recommendation r
    JOIN applicant a ON r.recommendation_applicant_id = a.applicant_id
    JOIN shortlist_after_hr s 
      ON r.recommendation_hr_id = s.shortlist_after_hrid 
      AND r.recommendation_applicant_id = s.shortlist_afterhr_applicant_id
    WHERE r.recommendation_hr_id = $1
    ORDER BY r.created_at DESC`,
    [hr_id]
  );
  return result.rows;
}

// Message functions with updated table structure
async function sendMessage(hr_id, applicant_id, message_text) {
  try {
    const result = await pool.query(
      `INSERT INTO send_message_hr_applicant (
        hr_id,
        send_message_hrapplicant_id,
        message_date,
        hr_and_applicantmessage
      ) VALUES ($1, $2, CURRENT_DATE, $3) RETURNING *`,
      [hr_id, applicant_id, message_text]
    );
    
    console.log('Message sent:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

async function getMessagesByHR(hr_id) {
  const result = await pool.query(
    `SELECT 
      m.message_id,
      m.hr_and_applicantmessage AS message_text,
      m.message_date AS sent_at,
      m.send_message_hrapplicant_id AS applicant_id,
      a.username AS applicant_name
    FROM send_message_hr_applicant m
    JOIN applicant a ON m.send_message_hrapplicant_id = a.applicant_id
    WHERE m.hr_id = $1
    ORDER BY m.message_date DESC`,
    [hr_id]
  );
  return result.rows;
}

async function getMessagesByApplicant(applicant_id) {
  const result = await pool.query(
    `SELECT 
      m.message_id,
      m.hr_and_applicantmessage AS message_text,
      m.message_date AS sent_at,
      m.hr_id,
      h.hr_name
    FROM send_message_hr_applicant m
    JOIN hr h ON m.hr_id = h.hr_id
    WHERE m.send_message_hrapplicant_id = $1
    ORDER BY m.message_date DESC`,
    [applicant_id]
  );
  return result.rows;
}

module.exports = { 
  createUser, 
  findUserByEmail,
  createContract, 
  getContracts,
  getAllHRs,
  getHRById,
  getHRContracts,
  getAllApplicants,
  getApplicantById,
  getAllRecruiters,
  getRecruiterById,
  getShortlistedApplicants,
  getShortlistedApplicantsByHR,
  createRecommendation,
  getRecommendations,
  getRecommendationsByApplicant,
  getRecommendationsByHR,
    // Add the new message functions
    sendMessage,
    getMessagesByHR,
    getMessagesByApplicant
};