
const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Import database connection
const { 
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
  sendMessage,
  getMessagesByHR,
  getMessagesByApplicant,
  getAllJobs,
  findAdminByEmail
} = require('../models/Users');

const handleError = (res, error, defaultMessage = 'Server error') => {
  console.error(error);
  res.status(500).json({ 
    success: false,
    message: error.message || defaultMessage 
  });
};
// Signup route
router.post('/signup', async (req, res) => {
  const { username, email, password,age,gender,quali_id,experience} = req.body;

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newUser = await createUser(username, email, password,age,gender,quali_id,experience);
    res.status(201).json({ message: 'User created', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});




// POST /adminlogin
router.post('/adminlogin', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find admin by email
    const admin = await findAdminByEmail(email);

    // 2. Check if admin exists
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 3. Direct string comparison of passwords
    if (admin.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 4. Return success response with admin data
    res.json({
      success: true,
      admin: {
        admin_id: admin.admin_id,
        email: admin.email
      }
    });

  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query('SELECT * FROM hr WHERE hr_email = $1', [email]);

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'No account exists' });
    }

    const user = userResult.rows[0];
    
    // Add debug logging to see what we're comparing
    console.log('Comparing passwords:');
    console.log('Password from request:', password);
    console.log('Password from database:', user.hr_password);

    // Check if password matches (more forgiving comparison)
    if (String(password).trim() !== String(user.hr_password).trim()) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Return the user data with HR ID included
    res.json({ 
      message: 'Login successful', 
      user: { 
        hr_id: user.hr_id, 
        hr_name: user.hr_name, 
        hr_email: user.hr_email,
        hr_age: user.hr_age,
        hr_gender: user.hr_gender,
        quali_id: user.quali_id,
        hr_experience: user.hr_experience
      } 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


//// Get all contracts
router.get('/all', async (req, res) => {
  try {
    const contracts = await getContracts();
    res.status(200).json(contracts);
  } catch (error) {
    console.error("❌ Error fetching all contracts:", error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get contracts for specific HR
router.get('/hrs/:id/contracts', async (req, res) => {
  try {
    const hrId = parseInt(req.params.id, 10);
    const contracts = await getHRContracts(hrId);
    res.json({
      success: true,
      data: contracts
    });
  } catch (error) {
    console.error("❌ Error fetching HR contracts:", error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create contract
router.post('/create', async (req, res) => {
  try {
    const {
      job_id, hr_id, salary,
      probation_period, start_date, end_date,
      benefits
    } = req.body;

    // Log input
    console.log("📥 Request body received:", req.body);
    console.log("📊 Type check:", {
      job_id: typeof job_id,
      hr_id: typeof hr_id,
      salary: typeof salary,
      probation_period: typeof probation_period,
      start_date: typeof start_date,
      end_date: typeof end_date,
      benefits: typeof benefits
    });

    // Type enforcement
    const parsedJobId = parseInt(job_id, 10);
    const parsedHrId = parseInt(hr_id, 10);
    const parsedSalary = parseFloat(salary);
    const parsedProbation = parseInt(probation_period, 10);

    if (
      isNaN(parsedJobId) || isNaN(parsedHrId) ||
      isNaN(parsedSalary) || isNaN(parsedProbation) ||
      !start_date || !end_date || !benefits
    ) {
      return res.status(400).json({ message: "Invalid or missing contract fields" });
    }

    const newContract = await createContract(
      parsedJobId, parsedHrId, parsedSalary, parsedProbation,
      start_date, end_date, benefits
    );

    console.log("✅ Contract created successfully:", newContract);

    res.status(201).json({
      message: 'Contract created successfully',
      contract: newContract
    });
  } catch (error) {
    console.error("❌ ERROR IN CONTRACT CREATION:");
    console.error("🧾 Message:", error.message);
    console.error("📄 Stack:", error.stack);

    res.status(500).json({
      message: 'Server error',
      errorDetails: error.message,
      errorType: error.name
    });
  }
});

// Get all HRs
router.get('/hrs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM hr');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;



// ==================== HR REPORT ROUTES ====================

/**
 * @route GET /hrs
 * @desc Get all HRs (for dropdown)
 * @access Private
 */
router.get('/hrs', async (req, res) => {
  try {
    const hrs = await getAllHRs();
    res.json({ 
      success: true,
      data: hrs
    });
  } catch (error) {
    handleError(res, error);
  }
});

/**
 * @route GET /hrs/:id
 * @desc Get HR details by ID
 * @access Private
 */
router.get('/hrs/:id', async (req, res) => {
  try {
    const hr = await getHRById(req.params.id);
    if (!hr) {
      return res.status(404).json({ 
        success: false,
        message: 'HR not found' 
      });
    }
    res.json({ 
      success: true,
      data: hr
    });
  } catch (error) {
    handleError(res, error);
  }
});





// ==================== APPLICANT REPORT ROUTES ====================

/**
 * @route GET /applicants
 * @desc Get all applicants (for dropdown)
 * @access Private
 */
router.get('/applicants', async (req, res) => {
  try {
    const applicants = await getAllApplicants();
    res.json({ 
      success: true,
      data: applicants
    });
  } catch (error) {
    handleError(res, error);
  }
});

/**
 * @route GET /applicants/:id
 * @desc Get applicant details by ID
 * @access Private
 */
router.get('/applicants/:id', async (req, res) => {
  try {
    const applicant = await getApplicantById(req.params.id);
    if (!applicant) {
      return res.status(404).json({ 
        success: false,
        message: 'Applicant not found' 
      });
    }
    res.json({ 
      success: true,
      data: applicant
    });
  } catch (error) {
    handleError(res, error);
  }
});

// ==================== RECRUITER REPORT ROUTES ====================

/**
 * @route GET /recruiters
 * @desc Get all recruiters (for dropdown)
 * @access Private
 */
router.get('/recruiters', async (req, res) => {
  try {
    const recruiters = await getAllRecruiters();
    res.json({ 
      success: true,
      data: recruiters
    });
  } catch (error) {
    handleError(res, error);
  }
});

/**
 * @route GET /recruiters/:id
 * @desc Get recruiter details by ID
 * @access Private
 */
router.get('/recruiters/:id', async (req, res) => {
  try {
    const recruiter = await getRecruiterById(req.params.id);
    if (!recruiter) {
      return res.status(404).json({ 
        success: false,
        message: 'Recruiter not found' 
      });
    }
    res.json({ 
      success: true,
      data: recruiter
    });
  } catch (error) {
    handleError(res, error);
  }
});
router.post('/recommendations', async (req, res) => {
  try {
    console.log('Received request body:', req.body);

    // Destructure request body to match the front-end field names
    const { hr_id, applicant_id, recommendation } = req.body;

    // Ensure all required fields are provided
    if (!hr_id || !applicant_id || !recommendation) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Create a new recommendation using the provided data
    const newRecommendation = await createRecommendation(hr_id, applicant_id, recommendation);
    res.json({ success: true, data: newRecommendation });
  } catch (error) {
    handleError(res, error, 'Failed to create recommendation');
  }
});

router.get('/recommendations', async (req, res) => {
  try {
    const recommendations = await getRecommendations();
    res.json({ success: true, data: recommendations });
  } catch (error) {
    handleError(res, error, 'Failed to get recommendations');
  }
});

router.get('/recommendations/applicant/:id', async (req, res) => {
  try {
    const recommendations = await getRecommendationsByApplicant(req.params.id);
    res.json({ success: true, data: recommendations });
  } catch (error) {
    handleError(res, error, 'Failed to get recommendations for applicant');
  }
});

router.get('/recommendations/hr/:id', async (req, res) => {
  try {
    const recommendations = await getRecommendationsByHR(req.params.id);
    res.json({ success: true, data: recommendations });
  } catch (error) {
    handleError(res, error, 'Failed to get recommendations by HR');
  }
});


/**
 * @route GET /shortlisted-applicants
 * @desc Get all shortlisted applicants with their HR relationships
 * @access Private
 */
router.get('/shortlisted-applicants', async (req, res) => {
  try {
    const shortlistedApplicants = await getShortlistedApplicants();
    res.json(shortlistedApplicants);
  } catch (error) {
    handleError(res, error, 'Failed to fetch shortlisted applicants');
  }
});

/**
 * @route GET /shortlisted-applicants/hr/:id
 * @desc Get shortlisted applicants for a specific HR
 * @access Private
 */
router.get('/shortlisted-applicants/hr/:id', async (req, res) => {
  try {
    const shortlistedApplicants = await getShortlistedApplicantsByHR(req.params.id);
    res.json(shortlistedApplicants);
  } catch (error) {
    handleError(res, error, 'Failed to fetch shortlisted applicants for HR');
  }
});


// ==================== MESSAGE ROUTES ====================
// Updated message route
router.post('/send-message', async (req, res) => {
  try {
    console.log('Received message request:', req.body);
    
    const { hr_id, applicant_id, message } = req.body;
    
    // Validate required fields
    if (!hr_id || !applicant_id || !message) {
      return res.status(400).json({
        success: false,
        message: 'HR ID, Applicant ID, and message text are required'
      });
    }
    
    // Send the message
    const sentMessage = await sendMessage(hr_id, applicant_id, message);
    
    res.json({
      success: true,
      message: 'Message sent successfully',
      data: sentMessage
    });
  } catch (error) {
    handleError(res, error, 'Failed to send message');
  }
});
/**
 * @route GET /messages/hr/:id
 * @desc Get all messages sent by a specific HR
 * @access Private
 */
router.get('/messages/hr/:id', async (req, res) => {
  try {
    const messages = await getMessagesByHR(req.params.id);
    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    handleError(res, error, 'Failed to fetch HR messages');
  }
});

/**
 * @route GET /messages/applicant/:id
 * @desc Get all messages sent to a specific applicant
 * @access Private
 */
router.get('/messages/applicant/:id', async (req, res) => {
  try {
    const messages = await getMessagesByApplicant(req.params.id);
    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    handleError(res, error, 'Failed to fetch applicant messages');
  }
});

// ==================== JOB ROUTES ====================

/**
 * @route GET /jobs
 * @desc Return all job_id + job_title pairs for the contract dropdown
 * @access Private (or Public, depending on your auth middleware)
 */
router.get('/jobs', async (_req, res) => {
  try {
    const jobs = await getAllJobs();
    res.json({ success: true, data: jobs });
  } catch (error) {
    handleError(res, error, 'Failed to fetch jobs list');
  }
});


