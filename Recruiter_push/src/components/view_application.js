import { useEffect, useState } from 'react';
import { getJobsByRecruiter, getApplicationsByJobId } from '../services/api';
import './view_application.css';

function RecruiterJobsAndApplications() {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');

  const recruiterId = localStorage.getItem('recruiterId');

  // Fetch jobs posted by the recruiter
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobsByRecruiter(recruiterId);
        setJobs(data);
      } catch (err) {
        setError('Failed to fetch jobs');
      }
    };

    if (recruiterId) fetchJobs();
  }, [recruiterId]);

  // Fetch applications for selected job
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (selectedJobId) {
          const data = await getApplicationsByJobId(selectedJobId);
          setApplications(data);
        }
      } catch (err) {
        setError('Failed to fetch applications');
      }
    };

    fetchApplications();
  }, [selectedJobId]);

  return (
    <div className="recruiter-jobs-container">
      <h2>📄 Jobs Posted by You</h2>
      {error && <p className="error">{error}</p>}

      <ul className="job-list">
        {jobs.map((job) => (
            <li key={job.jobid} onClick={() => setSelectedJobId(job.jobid)}>
            <div>
                <strong>{job.title}</strong> - {job.department}
            </div>
            <span className="view-applications">
                View Applications (Job ID: {job.jobid})
            </span>
            </li>
        ))}
        </ul>
      {selectedJobId && (
        <div className="applications-section">
          <h3>📋 Applications for Job ID: {selectedJobId}</h3>
          {applications.length > 0 ? (
            <table className="application-table">
              <thead>
                <tr>
                  <th>Applicant ID</th>
                  <th>Qualification ID</th>
                  <th>Experience</th>
                  <th>GPA</th>
                  <th>Application Date</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.application_id}>
                    <td>{app.applicant_id}</td>
                    <td>{app.qualification_id}</td>
                    <td>{app.experience} yrs</td>
                    <td>{app.gpa}</td>
                    <td>{app.application_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No applications found for this job.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default RecruiterJobsAndApplications;
