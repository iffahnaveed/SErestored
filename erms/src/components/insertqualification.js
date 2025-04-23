import { useState } from 'react';
import './insertqualification.css';

function AddQualification() {
  const [cgpa, setCgpa] = useState('');
  const [school, setSchool] = useState('');
  const [type, setType] = useState('Bachelors');
  const [subject, setSubject] = useState('Computer Science');
  const [yearGraduated, setYearGraduated] = useState(new Date().getFullYear());
  const [message, setMessage] = useState('');

  const csFields = [
    'Computer Science', 'Software Engineering', 'Artificial Intelligence',
    'Data Science', 'Cybersecurity', 'Information Technology',
  ];

  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const applicant_id = localStorage.getItem('userId');
  
    if (!applicant_id) {
      setMessage("You must be logged in to add qualification.");
      return;
    }
  
    try {
      const res = await fetch('http://localhost:5000/api/qualification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cgpa,
          school,
          type,
          subject,
         yearGraduated,  // use this name if backend expects it
         applicant_id: parseInt(applicant_id)
        }),
      });
  
      const data = await res.json();
      if (res.ok) {
        setMessage("Qualification added successfully!");
      } else {
        setMessage(data.message || "Error adding qualification.");
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("Server error.");
    }
  };
  

  return (
    <div className="qualification-container">
      <div className="form-box">
        <h2>Add Qualification</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="CGPA"
            value={cgpa}
            onChange={(e) => setCgpa(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="School/University"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            required
          />
          <select value={type} onChange={(e) => setType(e.target.value)} required>
            <option>Bachelors</option>
            <option>Masters</option>
            <option>PhD</option>
          </select>
          <select value={subject} onChange={(e) => setSubject(e.target.value)} required>
            {csFields.map(field => (
              <option key={field}>{field}</option>
            ))}
          </select>
          <select value={yearGraduated} onChange={(e) => setYearGraduated(e.target.value)} required>
            {years.map(year => (
              <option key={year}>{year}</option>
            ))}
          </select>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default AddQualification;
