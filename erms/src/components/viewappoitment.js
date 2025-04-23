import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './sendmsghr.css'; // Reusing same styles

const ViewAppointments = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [selectedRecruiter, setSelectedRecruiter] = useState('');
  const [applicantId, setApplicantId] = useState('');
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Get applicant ID from localStorage
    const id = localStorage.getItem('userId');
    setApplicantId(id);

    // Fetch recruiter list
    axios.get('http://localhost:5000/api/recruiters')
      .then(res => setRecruiters(res.data))
      .catch(err => console.error('Failed to fetch recruiters:', err));
  }, []);

  const handleFetchAppointments = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get('http://localhost:5000/api/appointments', {
        params: {
          applicant_id: applicantId,
          recruiter_id: selectedRecruiter
        }
      });

      setAppointments(res.data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      alert('Failed to fetch appointments');
    }
  };

  return (
    <form onSubmit={handleFetchAppointments}>
      <div>
        <label>Applicant ID:</label>
        <input type="text" value={applicantId} readOnly />
      </div>

      <div>
        <label>Select Recruiter:</label>
        <select value={selectedRecruiter} onChange={(e) => setSelectedRecruiter(e.target.value)} required>
          <option value="">-- Choose Recruiter --</option>
          {recruiters.map(rec => (
            <option key={rec.recruiter_id} value={rec.recruiter_id}>
              {rec.recruiter_id}
            </option>
          ))}
        </select>
      </div>

      <button type="submit">View Appointments</button>

      {appointments.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Appointments:</h3>
          <ul>
            {appointments.map(appt => (
              <li key={appt.appointment_id}>
                <strong>Date & Time:</strong> {new Date(appt.appointment_time).toLocaleString()}<br />
                <strong>Description:</strong> {appt.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
};

export default ViewAppointments;
