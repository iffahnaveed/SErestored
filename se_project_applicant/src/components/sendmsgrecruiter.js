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
    axios.get('http://localhost:5003/api/recruiters')
      .then(res => {
        console.log('Fetched recruiters:', res.data);
        setRecruiterList(res.data);  // The response is an array of IDs [1, 2, 3, 4]
      })
      .catch(err => console.error('Failed to fetch recruiter list:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5003/api/messages/recruiter', {
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
          {recruiterList.map((r) => (
            // Use the recruiter ID for both key and value since the data is an array of IDs
            <option key={r} value={r}>
              Recruiter {r}  {/* You can display something more meaningful if you have extra data */}
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
