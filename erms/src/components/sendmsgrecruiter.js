import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './sendmsghr.css';

const SendMessageToRecruiter = () => {
  const [recruiterList, setRecruiterList] = useState([]);
  const [selectedRecruiter, setSelectedRecruiter] = useState('');
  const [message, setMessage] = useState('');
  const [applicantId, setApplicantId] = useState('');

  useEffect(() => {
    const id = localStorage.getItem('userId');
    setApplicantId(id);

    // Fetch recruiters
    axios.get('http://localhost:5000/api/recruiters')
      .then(res => setRecruiterList(res.data))
      .catch(err => console.error('Failed to fetch recruiter list:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/messages/recruiter', {
        recruiter_id: selectedRecruiter,
        applicant_id: applicantId,
        message
      });

      alert('Message sent successfully!');
      setMessage('');
      setSelectedRecruiter('');
    } catch (err) {
      console.error('Failed to send message:', err);
      alert('Failed to send message');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Applicant ID:</label>
        <input type="text" value={applicantId} readOnly />
      </div>

      <div>
        <label>Select Recruiter:</label>
        <select value={selectedRecruiter} onChange={(e) => setSelectedRecruiter(e.target.value)} required>
          <option value="">-- Choose Recruiter --</option>
          {recruiterList.map(r => (
            <option key={r.recruiter_id} value={r.recruiter_id}>
              {r.recruiter_id}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Message:</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          maxLength={1000}
        />
      </div>

      <button type="submit">Send Message</button>
    </form>
  );
};

export default SendMessageToRecruiter;
