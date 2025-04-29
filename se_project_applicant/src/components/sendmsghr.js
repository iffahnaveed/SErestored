import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './sendmsghr.css';

const SendMessageToHR = () => {
  const [hrList, setHrList] = useState([]);
  const [selectedHr, setSelectedHr] = useState('');
  const [message, setMessage] = useState('');
  const [applicantId, setApplicantId] = useState('');

  useEffect(() => {
    // Load applicant ID from localStorage
    const id = localStorage.getItem('userId');
    setApplicantId(id);

    // Fetch HRs
    axios.get('http://localhost:5003/api/hr')
      .then(res => setHrList(res.data))
      .catch(err => console.error('Failed to fetch HR list:', err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5003/api/messages', {
        hr_id: selectedHr,
        applicant_id: applicantId,
        message
      });

      alert('Message sent successfully!');
      setMessage('');
      setSelectedHr('');
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
        <label>Select HR:</label>
        <select value={selectedHr} onChange={(e) => setSelectedHr(e.target.value)} required>
          <option value="">-- Choose HR --</option>
          {hrList.map(hr => (
            <option key={hr.hr_id} value={hr.hr_id}>
              {hr.hr_id}
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

export default SendMessageToHR;
