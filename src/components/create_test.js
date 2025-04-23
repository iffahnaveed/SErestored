import { useState } from 'react';
import { createTest } from '../services/api'; // Make sure this API exists
import './create_test.css'; // Optional: Add styles like you did for qualifications

function AddTest() {
  const [jobId, setJobId] = useState('');
  const [noOfQuestions, setNoOfQuestions] = useState('');
  const [minScore, setMinScore] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const recruiterId = localStorage.getItem('recruiterId');

  const handleSubmit = async () => {
    const testData = {
      recruiter_id: parseInt(recruiterId),
      job_id: parseInt(jobId),
      no_of_questions: parseInt(noOfQuestions),
      min_score: parseFloat(minScore),
    };

    const result = await createTest(testData);

    if (result.message === 'Test created successfully') {
      setSuccessMessage(result.message);
      setErrorMessage('');
      setJobId('');
      setNoOfQuestions('');
      setMinScore('');
    } else {
      setErrorMessage(result.message || 'Failed to create test');
      setSuccessMessage('');
    }
  };

  return (
    <div className="test-container">
      <div className="test-form">
        <h2>Create Test</h2>

        <label>Job ID</label>
        <input
          type="number"
          value={jobId}
          onChange={(e) => setJobId(e.target.value)}
        />

        <label>Number of Questions</label>
        <input
          type="number"
          value={noOfQuestions}
          onChange={(e) => setNoOfQuestions(e.target.value)}
        />

        <label>Minimum Score (%)</label>
        <input
          type="number"
          step="0.01"
          value={minScore}
          onChange={(e) => setMinScore(e.target.value)}
        />

        <button onClick={handleSubmit}>Create Test</button>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      </div>
    </div>
  );
}

export default AddTest;
