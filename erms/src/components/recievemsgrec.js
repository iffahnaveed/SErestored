import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './sendmsghr.css'; // reused CSS

const ReceiveMessageFromRecruiter = () => {
  const [recruiterList, setRecruiterList] = useState([]);
  const [selectedRecruiter, setSelectedRecruiter] = useState('');
  const [applicantId, setApplicantId] = useState('');
  const [receivedMessage, setReceivedMessage] = useState('');

  useEffect(() => {
    const id = localStorage.getItem('userId');
    setApplicantId(id);

    axios.get('http://localhost:5000/api/recruiters')
      .then(res => setRecruiterList(res.data))
      .catch(err => console.error('Failed to fetch recruiter list:', err));
  }, []);

  const handleReceive = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get(`http://localhost:5000/api/messages/fromrecruiter`, {
        params: {
          recruiter_id: selectedRecruiter,
          applicant_id: applicantId
        }
      });

      if (res.data && res.data.recruiter_and_applicant_message) {
        setReceivedMessage(res.data.recruiter_and_applicant_message);
      } else {
        setReceivedMessage('No message found from this recruiter.');
      }
    } catch (err) {
      console.error('Failed to receive message:', err);
      alert('Failed to retrieve message');
    }
  };

  return (
    <form onSubmit={handleReceive}>
      <div>
        <label>Applicant ID:</label>
        <input type="text" value={applicantId} readOnly />
      </div>

      <div>
        <label>Select Recruiter:</label>
        <select value={selectedRecruiter} onChange={(e) => setSelectedRecruiter(e.target.value)} required>
          <option value="">-- Choose Recruiter --</option>
          {recruiterList.map(recruiter => (
            <option key={recruiter.recruiter_id} value={recruiter.recruiter_id}>
              {recruiter.recruiter_id}
            </option>
          ))}
        </select>
      </div>

      <button type="submit">Receive Message</button>

      {receivedMessage && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e9f5ff', borderRadius: '5px' }}>
          <strong>Message from Recruiter:</strong>
          <p>{receivedMessage}</p>
        </div>
      )}
    </form>
  );
};

export default ReceiveMessageFromRecruiter;
