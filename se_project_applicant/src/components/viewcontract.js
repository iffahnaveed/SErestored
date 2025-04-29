

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewContract = () => {
  const [applicantId, setApplicantId] = useState('');
  const [applicationIds, setApplicationIds] = useState([]);
  const [selectedApplicationId, setSelectedApplicationId] = useState('');
  const [jobId, setJobId] = useState('');
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    setApplicantId(id);

    if (id) {
      axios
        .get(`http://localhost:5003/api/applications/${id}`)
        .then((res) => setApplicationIds(res.data))
        .catch((err) => console.error('Failed to fetch application IDs:', err));
    }
  }, []);

  const handleLoadJobId = () => {
    if (!selectedApplicationId) return alert('Please select an application ID');

    axios
      .get(`http://localhost:5003/api/jobid/${selectedApplicationId}`)
      .then((res) => {
        setJobId(res.data.jobId);
        console.log('Loaded Job ID:', res.data.jobId);
      })
      .catch((err) => {
        console.error('Error loading job ID:', err);
        alert('Failed to load job ID');
      });
  };

  const handleViewContract = () => {
    if (!jobId) return alert('Job ID not loaded');

    axios
      .get(`http://localhost:5003/api/contract/${jobId}`)
      .then((res) => {
        setContract(res.data);
        console.log('Contract details:', res.data);
      })
      .catch((err) => {
        console.error('Error fetching contract:', err);
        alert('No contract found for this job ID');
      });
  };

  return (
    <div className="status-form" style={{
        padding: '20px',
        maxWidth: '500px',
        margin: 'auto',
        maxHeight: '90vh',
        overflowY: 'auto',
        border: '1px solid #ccc',
        borderRadius: '10px'
      }}>
      <h2>View Contract</h2>

      <div style={{ marginBottom: '10px' }}>
        <label>Application ID:</label>
        <br />
        <select value={selectedApplicationId} onChange={(e) => setSelectedApplicationId(e.target.value)}>
          <option value="">-- Select Application ID --</option>
          {applicationIds.map((app) => (
            <option key={app.application_id} value={app.application_id}>
              {app.application_id}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleLoadJobId} style={{ marginBottom: '10px' }}>
        Load Job ID
      </button>

      <div style={{ marginBottom: '10px' }}>
        <label>Job ID:</label>
        <br />
        <input type="text" value={jobId} readOnly />
      </div>

      <button onClick={handleViewContract}>View Contract</button>

      {contract && (
        <div style={{ marginTop: '20px', fontWeight: 'bold' }}>
          <h3>Contract Details</h3>
          <p>
            <strong>Contract ID:</strong> {contract.contract_id}
          </p>
          <p>
            <strong>HR ID:</strong> {contract.hr_id}
          </p>
          <p>
            <strong>Salary:</strong> {contract.salary}
          </p>
          <p>
            <strong>Probation Period:</strong> {contract.probation_period} months
          </p>
          <p>
            <strong>Start Date:</strong>{' '}
            {new Date(contract.hr_contractstart_date).toLocaleDateString()}
          </p>
          <p>
            <strong>End Date:</strong>{' '}
            {new Date(contract.hr_contractend_date).toLocaleDateString()}
          </p>
          <p>
            <strong>Benefits:</strong> {contract.benefits}
          </p>
        </div>
      )}
    </div>
  );
};

export default ViewContract;
