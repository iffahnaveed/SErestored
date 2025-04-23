import { useState } from 'react';
import { addQualification } from '../services/api';
import './add_qualification.css';

function AddQualification() {
  const [qualType, setQualType] = useState('');
  const [university, setUniversity] = useState('');
  const [yearCompleted, setYearCompleted] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [field, setField] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const recruiterId = localStorage.getItem('recruiterId');

  const handleSubmit = async () => {
    const qualificationData = {
      qual_type: qualType,
      university_school_name: university,
      year_completed: yearCompleted,
      cgpa: parseFloat(cgpa),
      field,
      recruiter_id: parseInt(recruiterId),
    };

    const result = await addQualification(qualificationData);

    if (result.message === 'Qualification added and linked to recruiter') {
      setSuccessMessage(result.message);
      setErrorMessage('');
      setQualType('');
      setUniversity('');
      setYearCompleted('');
      setCgpa('');
      setField('');
    } else {
      setErrorMessage(result.message || 'Failed to add qualification');
      setSuccessMessage('');
    }
  };

  return (
    <div className="qualification-container">
      <div className="qualification-form">
        <h2>Add Qualification</h2>

        <label>Qualification Type</label>
        <select value={qualType} onChange={(e) => setQualType(e.target.value)}>
          <option value="">-- Select Qualification --</option>
          <option value="Bachelors">Bachelors</option>
          <option value="Masters">Masters</option>
          <option value="PhD">PhD</option>
        </select>

        <label>University / School Name</label>
        <input
          type="text"
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
        />

        <label>Year Completed</label>
        <input
          type="date"
          value={yearCompleted}
          onChange={(e) => setYearCompleted(e.target.value)}
        />

        <label>CGPA (0 - 4)</label>
        <input
          type="number"
          step="0.01"
          min="0"
          max="4"
          value={cgpa}
          onChange={(e) => setCgpa(e.target.value)}
        />

        <label>Field</label>
        <select value={field} onChange={(e) => setField(e.target.value)}>
          <option value="">-- Select Field --</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Artificial Intelligence">Artificial Intelligence</option>
          <option value="Software Engineering">Software Engineering</option>
          <option value="Data Science">Data Science</option>
          <option value="Cybersecurity">Cybersecurity</option>
          <option value="Information Technology">Information Technology</option>
        </select>

        <button onClick={handleSubmit}>Add Qualification</button>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      </div>
    </div>
  );
}

export default AddQualification;
