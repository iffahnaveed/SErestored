const request = require('supertest');
const app = require('./server'); // or '../app' depending on your filename
const { Pool } = require('pg');

// Create a new pool for test database
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ermsDB',
  password: process.env.DB_PASSWORD || 'wajiha2003',
  port: process.env.DB_PORT || 5432,
});

// Sample email and applicant data for testing
const testEmail = "testuser@example.com";
const testApplicantId = 1; // Make sure this matches a real test applicant
const testRecruiterId = 1;
const testHRId = 6;

describe('Applicant API Tests', () => {

  // Close DB connection after tests
  afterAll(async () => {
    await pool.end();
  });
  test('POST /api/qualification - Add a qualification', async () => {
    const qualificationData = {
      cgpa: 3.5,
      school: "Test University",
      type: "Bachelors",
      subject: "Computer Science",
      yearGraduated: new Date('2023-01-01'),
      applicant_id: testApplicantId
    };

    const response = await request(app)
      .post('/api/qualification')
      .send(qualificationData);

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Qualification and link added successfully.");
  });

  test('POST /api/jobs/apply - Apply for a job', async () => {
    const jobApplicationData = {
      user_id: testApplicantId,
      job_id: 1 // Make sure a job with this ID exists in your test DB
    };

    const response = await request(app)
      .post('/api/jobs/apply')
      .send(jobApplicationData);

    // Could either be success or "already applied" if test is rerun
    expect([200, 400]).toContain(response.statusCode);
  });

  test('POST /api/messages - Send message to HR', async () => {
    const messageData = {
      hr_id: testHRId,
      applicant_id: testApplicantId,
      message: "Hello HR, this is a test message."
    };

    const response = await request(app)
      .post('/api/messages')
      .send(messageData);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Message sent to HR successfully!');
  });

  test('POST /api/messages/recruiter - Send message to recruiter', async () => {
    const messageData = {
      recruiter_id: testRecruiterId,
      applicant_id: testApplicantId,
      message: "Hello Recruiter, test message from applicant."
    };

    const response = await request(app)
      .post('/api/messages/recruiter')
      .send(messageData);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Message sent to recruiter');
  });

  test('GET /api/messages/fromhr - Fetch latest HR message', async () => {
    const response = await request(app)
      .get(`/api/messages/fromhr?hr_id=${testHRId}&applicant_id=${testApplicantId}`);

    expect(response.statusCode).toBe(200);
  });

  test('GET /api/messages/fromrecruiter - Fetch latest recruiter message', async () => {
    const response = await request(app)
      .get(`/api/messages/fromrecruiter?recruiter_id=${testRecruiterId}&applicant_id=${testApplicantId}`);

    expect(response.statusCode).toBe(200);
  });

  test('GET /api/appointments - Fetch appointments with recruiter', async () => {
    const response = await request(app)
      .get(`/api/appointments?applicant_id=${testApplicantId}&recruiter_id=${testRecruiterId}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

});
