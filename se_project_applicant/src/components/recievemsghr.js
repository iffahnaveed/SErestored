import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './sendmsghr.css'; // reusing the same CSS

const ReceiveMessageFromHR = () => {
  const [hrList, setHrList] = useState([]);
  const [selectedHr, setSelectedHr] = useState('');
  const [applicantId, setApplicantId] = useState('');
  const [receivedMessage, setReceivedMessage] = useState('');

  useEffect(() => {
    // Load applicant ID from localStorage
    const id = localStorage.getItem('userId');
    setApplicantId(id);

    // Fetch HRs
    axios.get('http://localhost:5003/api/hr')
      .then(res => setHrList(res.data))
      .catch(err => console.error('Failed to fetch HR list:', err));
  }, []);

  const handleReceive = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.get(`http://localhost:5003/api/messages/fromhr`, {
        params: {
          hr_id: selectedHr,
          applicant_id: applicantId
        }
      });

      if (res.data && res.data.hr_and_applicantmessage) {
        setReceivedMessage(res.data.hr_and_applicantmessage);
      } else {
        setReceivedMessage('No message found from this HR.');
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

      <button type="submit">Receive Message</button>

      {receivedMessage && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e9f5ff', borderRadius: '5px' }}>
          <strong>Message from HR:</strong>
          <p>{receivedMessage}</p>
        </div>
      )}
    </form>
  );
};

export default ReceiveMessageFromHR;
