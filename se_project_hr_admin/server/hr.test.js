// hr.test.js

const request = require('supertest');
const app = require('./server'); // <-- Correct: import server.js

describe('HR Routes', () => {
  // ====== TEST: HR login ======
  describe('POST /api/auth/login', () => {
    it('should login HR with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'sara.ali@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Login successful');
      expect(res.body.user).toHaveProperty('hr_email', 'sara.ali@example.com');
    });
  });

  // ====== TEST: Admin login ======
  describe('POST /api/auth/adminlogin', () => {
    it('should login admin with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/adminlogin')
        .send({
          email: 'admin1@example.com', // Make sure this admin exists
          password: 'password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body.admin).toHaveProperty('email', 'admin1@example.com');
    });
  });

  // ====== TEST: Get all contracts ======
  describe('GET /api/auth/all', () => {
    it('should fetch all contracts', async () => {
      const res = await request(app)
        .get('/api/auth/all');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // ====== TEST: Get HR contracts ======
  describe('GET /api/auth/hrs/:id/contracts', () => {
    it('should fetch contracts for a specific HR', async () => {
      const hrId = 6;
      const res = await request(app)
        .get(`/api/auth/hrs/${hrId}/contracts`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ====== TEST: Create contract ======
  describe('POST /api/auth/create', () => {
    it('should create a new contract', async () => {
      const res = await request(app)
        .post('/api/auth/create')
        .send({
          job_id: 1,
          hr_id: 6,
          salary: 50000,
          probation_period: 6,
          start_date: '2025-05-01',
          end_date: '2026-05-01',
          benefits: 'Health Insurance'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('message', 'Contract created successfully');
      expect(res.body).toHaveProperty('contract');
    });
  });
  // ====== TEST: Get HR by ID ======
  describe('GET /api/auth/hrs/:id', () => {
    it('should fetch a single HR by ID', async () => {
      const hrId = 6;
      const res = await request(app)
        .get(`/api/auth/hrs/${hrId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ====== TEST: Get all Applicants ======
  describe('GET /api/auth/applicants', () => {
    it('should fetch all applicants', async () => {
      const res = await request(app)
        .get('/api/auth/applicants');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ====== TEST: Get Applicant by ID ======
  describe('GET /api/auth/applicants/:id', () => {
    it('should fetch a single applicant by ID', async () => {
      const applicantId = 1;
      const res = await request(app)
        .get(`/api/auth/applicants/${applicantId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ====== TEST: Get all Recruiters ======
  describe('GET /api/auth/recruiters', () => {
    it('should fetch all recruiters', async () => {
      const res = await request(app)
        .get('/api/auth/recruiters');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ====== TEST: Get Recruiter by ID ======
  describe('GET /api/auth/recruiters/:id', () => {
    it('should fetch a single recruiter by ID', async () => {
      const recruiterId = 1;
      const res = await request(app)
        .get(`/api/auth/recruiters/${recruiterId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ====== TEST: Create Recommendation ======
  describe('POST /api/auth/recommendations', () => {
    it('should create a new recommendation', async () => {
      const res = await request(app)
        .post('/api/auth/recommendations')
        .send({
          hr_id: 6,
          applicant_id: 1,
          recommendation: 'Very promising candidate.'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ====== TEST: Get all Recommendations ======
  describe('GET /api/auth/recommendations', () => {
    it('should fetch all recommendations', async () => {
      const res = await request(app)
        .get('/api/auth/recommendations');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ====== TEST: Get Recommendations by Applicant ID ======
  describe('GET /api/auth/recommendations/applicant/:id', () => {
    it('should fetch recommendations for an applicant', async () => {
      const applicantId = 1;
      const res = await request(app)
        .get(`/api/auth/recommendations/applicant/${applicantId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // ====== TEST: Get Recommendations by HR ID ======
  describe('GET /api/auth/recommendations/hr/:id', () => {
    it('should fetch recommendations by HR ID', async () => {
      const hrId = 6;
      const res = await request(app)
        .get(`/api/auth/recommendations/hr/${hrId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

});