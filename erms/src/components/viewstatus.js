import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ViewStatus = () => {
  const [applicationIds, setApplicationIds] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState('');
  const [jobId, setJobId] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const applicantId = localStorage.getItem('userId'); // Assumes you store applicant_id in localStorage

  // Fetch application IDs when component mounts
  useEffect(() => {
    if (applicantId) {
      axios.get(`http://localhost:5000/api/applications/${applicantId}`)
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
      axios.get(`http://localhost:5000/api/jobid/${selectedAppId}`)
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
      axios.get(`http://localhost:5000/api/jobstatus/${jobId}`)
        .then(res => {
          setStatusMessage(res.data.message);
        })
        .catch(err => {
          console.error("Error fetching job status:", err);
        });
    }
  };

  return (
    <div className="status-form" style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2>View Application Status</h2>

      <div style={{ marginBottom: "10px" }}>
        <label>Application ID: </label><br />
        <select value={selectedAppId} onChange={(e) => setSelectedAppId(e.target.value)}>
          <option value="">-- Select Application ID --</option>
          {applicationIds.map((id) => (
            <option key={id} value={id}>{id}</option>
          ))}
        </select>
      </div>

      <button onClick={handleLoadJobId} style={{ marginBottom: "10px" }}>Load Job ID</button>

      <div style={{ marginBottom: "10px" }}>
        <label>Job ID: </label><br />
        <input type="text" value={jobId} readOnly />
      </div>

      <button onClick={handleGetStatus}>Get Status</button>

      {statusMessage && (
        <div style={{ marginTop: "20px", fontWeight: "bold" }}>
          Status: {statusMessage}
        </div>
      )}
    </div>
  );
};

export default ViewStatus;
