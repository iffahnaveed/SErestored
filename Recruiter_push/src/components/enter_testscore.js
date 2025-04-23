import { useEffect, useState } from 'react';
import { getJobsForRecruiter, getApplicantsForJob, submitTestScore } from '../services/api';
import './enter_testscore.css';

function EvaluateApplicants() {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [scores, setScores] = useState({});
  const [message, setMessage] = useState('');
  const recruiterId = localStorage.getItem('recruiterId');
  console.log("Recruiter ID:", recruiterId);
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getJobsForRecruiter(recruiterId);
        console.log("RESPONSE:", response);
        if (response?.length > 0) {
          setJobs(response);
        } else {
          console.log('No jobs found');
          setJobs([]);
        }
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      }
    };
    fetchJobs();
  }, [recruiterId]);

  useEffect(() => {
    const fetchApplicants = async () => {
      if (!selectedJobId) return;
      try {
        const response = await getApplicantsForJob(recruiterId, selectedJobId);
        if (response?.data?.length > 0) {
          setApplicants(response.data);
        } else {
          console.log('No applicants found for this job');
          setApplicants([]);
        }
      } catch (err) {
        console.error("Failed to fetch applicants:", err);
        setApplicants([]);
      }
    };
    fetchApplicants();
  }, [selectedJobId, recruiterId]);

  const handleScoreChange = (applicantId, score) => {
    setScores({ ...scores, [applicantId]: score });
  };

  const handleSubmit = async (applicantId, jobId) => {
    const score = parseFloat(scores[applicantId]);
    if (isNaN(score)) {
      setMessage('Please enter a valid score');
      return;
    }

    try {
      const result = await submitTestScore({
        test_taken_applicant_id: applicantId,
        test_taken_job_id: jobId,
        test_taken_recruiter_id: parseInt(recruiterId),
        test_score: score,
        test_date: new Date().toISOString().split('T')[0],
      });

      setMessage(result.message || 'Test score submitted successfully!');
    } catch (err) {
      setMessage('Failed to submit score');
      console.error(err);
    }
  };

  return (
    <div className="evaluate-container">
      <h2>Evaluate Applicants</h2>

      <div>
        <label>Select a Job</label>
        <select>
        {jobs.map((job) => (
            <option key={job.jobid} value={job.jobid}>
            {job.jobid}
            </option>
        ))}
        </select>
      </div>

      {applicants.length === 0 ? (
        <p>No applicants found for the selected job.</p>
      ) : (
        <table className="applicants-table">
          <thead>
            <tr>
              <th>Applicant ID</th>
              <th>Name</th>
              <th>Test Score (%)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((applicant) => (
              <tr key={applicant.applicant_id}>
                <td>{applicant.applicant_id}</td>
                <td>{applicant.name}</td>
                <td>
                  <input
                    type="number"
                    step="0.01"
                    value={scores[applicant.applicant_id] || ''}
                    onChange={(e) =>
                      handleScoreChange(applicant.applicant_id, e.target.value)
                    }
                  />
                </td>
                <td>
                  <button
                    onClick={() =>
                      handleSubmit(applicant.applicant_id, selectedJobId)
                    }
                  >
                    Submit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {message && <p className="status-message">{message}</p>}
    </div>
  );
}

export default EvaluateApplicants;
