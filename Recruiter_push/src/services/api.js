export const login = async (userData) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {  // Ensure this is the correct backend endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to login');
      }
  
      const data = await response.json();
      return data;  // Returning the response object from the backend
    } catch (error) {
      console.error('Login error:', error);
      throw error;  // This will be handled in the frontend (login.js)
    }
  };  
  export async function signup(data) {
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', { // adjust URL if needed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      return await response.json();
    } catch (error) {
      console.error('Signup error:', error);
      return { message: 'Signup failed' };
    }
  }
  export async function postJob(jobData) {
    try {
      const response = await fetch('http://localhost:5000/api/auth/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });
  
      return await response.json();
    } catch (error) {
      console.error('Post Job Error:', error);
      return { message: 'Failed to post job' };
    }
  }
  export async function addQualification(qualificationData) {
    try {
      const response = await fetch('http://localhost:5000/api/auth/qualifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(qualificationData),
      });
  
      return await response.json();
    } catch (error) {
      console.error('Add Qualification Error:', error);
      return { message: 'Failed to add qualification' };
    }
  } 
  export async function getRecruiterWithQualifications(recruiterId) {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/recruiter/${recruiterId}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching recruiter with qualifications:', error);
      return { message: 'Failed to fetch recruiter and qualifications' };
    }
  }  
  export async function getJobsByRecruiter(recruiterId) {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/recruiter/${recruiterId}/jobs`);
      const data = await response.json();
  
      if (Array.isArray(data)) {
        return data;
      }
  
      if (data.jobs && Array.isArray(data.jobs)) {
        return data.jobs;
      }
  
      return []; // fallback
    } catch (error) {
      console.error('Error fetching jobs by recruiter:', error);
      return [];
    }
  }  
  export async function getApplicationsByJobId(jobId) {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/jobs/${jobId}/applications`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching applications by job ID:', error);
      return { message: 'Failed to fetch applications for job' };
    }
  }
  export const createTest = async (testData) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });
      return await response.json();
    } catch (error) {
      console.error('Error creating test:', error);
      return { message: 'Error occurred while creating test' };
    }
  };
  // Fetch all jobs posted by recruiter
  export async function getJobsForRecruiter(recruiterId) {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/recruiter/${recruiterId}/job-ids`);
  
      if (!response.ok) {
        // The server responded with a status like 404 or 500
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return await response.json(); // Only if response is OK
    } catch (error) {
      console.error('Error fetching jobs for recruiter:', error);
      return []; // Or handle gracefully
    }
  }
// Fetch all applicants for a job
export async function getApplicantsForJob(recruiterId, jobId) {
  try {
    const response = await fetch(`http://localhost:5000/api/auth/recruiter/${recruiterId}/jobs`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching applicants for job:', error);
    return { message: 'Failed to fetch applicants' };
  }
}

// Submit test score for an applicant
export async function submitTestScore(scoreData) {
  try {
    const response = await fetch('http://localhost:5000/api/auth/testEvaluation/submit-score', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scoreData),
    });
    return await response.json();
  } catch (error) {
    console.error('Error submitting test score:', error);
    return { message: 'Error occurred while submitting score' };
  }
}
  
  
  
  