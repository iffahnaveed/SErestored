import { useState } from 'react';
import './insertqualification.css'; // Keep your CSS file

function AddQualification() {
  const [cgpa, setCgpa] = useState('');
  const [school, setSchool] = useState('');
  const [type, setType] = useState('');
  const [subject, setSubject] = useState('');
  const [yearGraduated, setYearGraduated] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const applicantId = localStorage.getItem('userId');

  const csFields = [
    'Computer Science', 'Software Engineering', 'Artificial Intelligence',
    'Data Science', 'Cybersecurity', 'Information Technology',
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const handleSubmit = async () => {
    if (!applicantId) {
      setErrorMessage('You must be logged in to add a qualification.');
      setSuccessMessage('');
      return;
    }
  
    // Validate the fields before submitting
    if (!cgpa || !school || !type || !subject || !yearGraduated) {
      setErrorMessage('Please fill in all fields.');
      setSuccessMessage('');
      return;
    }
  
    // Extract the year from the date and format it as YYYY-01-01
    const formattedYearGraduated = `${yearGraduated.split('-')[0]}-01-01`;
  
    try {
      const res = await fetch('http://localhost:5003/api/qualification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cgpa,
          school,
          type,
          subject,
          yearGraduated: formattedYearGraduated, // Send the full formatted date string
          applicant_id: parseInt(applicantId),
        }),
      });
  
      const data = await res.json();
      if (res.ok) {
        setSuccessMessage('Qualification added successfully!');
        setErrorMessage('');
        // Reset fields
        setCgpa('');
        setSchool('');
        setType('');
        setSubject('');
        setYearGraduated('');
      } else {
        setErrorMessage(data.message || 'Error adding qualification.');
        setSuccessMessage('');
      }
    } catch (err) {
      console.error('Error:', err);
      setErrorMessage('Server error.');
      setSuccessMessage('');
    }
  };
  return (
    <div className="qualification-container">
      <div className="qualification-form">
        <h2>Add Qualification</h2>

        <label>Qualification Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">-- Select Qualification --</option>
          <option value="Bachelors">Bachelors</option>
          <option value="Masters">Masters</option>
          <option value="PhD">PhD</option>
        </select>

        <label>School / University</label>
        <input
          type="text"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
        />

        <label>Field</label>
        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="">-- Select Field --</option>
          {csFields.map(field => (
            <option key={field} value={field}>{field}</option>
          ))}
        </select>

        <label>Year Graduated</label>
        <input
          type="date"
          value={yearGraduated}
          onChange={(e) => setYearGraduated(e.target.value)}
          required
        />

        <label>CGPA</label>
        <input
          type="number"
          step="0.01"
          min="0"
          max="4"
          value={cgpa}
          onChange={(e) => setCgpa(e.target.value)}
        />

        <button onClick={handleSubmit}>Add Qualification</button>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      </div>
    </div>
  );
}

export default AddQualification;
