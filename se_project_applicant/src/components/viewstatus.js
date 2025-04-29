import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './viewstatus.css'; // Assuming you will add the styles in this file

const ViewStatus = () => {
  const [applicationIds, setApplicationIds] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState('');
  const [jobId, setJobId] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const applicantId = localStorage.getItem('userId'); // Assumes you store applicant_id in localStorage

  // Fetch application IDs when component mounts
  useEffect(() => {
    if (applicantId) {
      axios.get(`http://localhost:5003/api/applications/${applicantId}`)
        .then(res => {
          const ids = res.data.map(row => row.application_id);
          setApplicationIds(ids);
        })
        .catch(err => {
          console.error("Error fetching application IDs:", err);
        });
    }
  }, [applicantId]);

  const handleLoadJobId = () => {
    if (selectedAppId) {
      axios.get(`http://localhost:5003/api/jobid/${selectedAppId}`)
        .then(res => {
          setJobId(res.data.jobId);
          setStatusMessage(""); // Reset
        })
        .catch(err => {
          console.error("Error loading job ID:", err);
        });
    }
  };

  const handleGetStatus = () => {
    if (jobId) {
      axios.get(`http://localhost:5003/api/jobstatus/${jobId}`)
        .then(res => {
          setStatusMessage(res.data.message);
        })
        .catch(err => {
          console.error("Error fetching job status:", err);
        });
    }
  };

  return (
    <div className="status-container">
      <h2 className="status-header">View Application Status</h2>

      <div className="form-group">
        <label htmlFor="applicantId">Application ID:</label>
        <select id="applicantId" value={selectedAppId} onChange={(e) => setSelectedAppId(e.target.value)}>
          <option value="">-- Select Application ID --</option>
          {applicationIds.map((id) => (
            <option key={id} value={id}>{id}</option>
          ))}
        </select>
      </div>

      <button className="btn load-btn" onClick={handleLoadJobId}>Load Job ID</button>

      <div className="form-group">
        <label htmlFor="jobId">Job ID:</label>
        <input type="text" id="jobId" value={jobId} readOnly />
      </div>

      <button className="btn status-btn" onClick={handleGetStatus}>Get Status</button>

      {statusMessage && (
        <div className="status-message">
          <strong>Status: </strong>{statusMessage}
        </div>
      )}
    </div>
  );
};

export default ViewStatus;