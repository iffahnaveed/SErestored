import { useEffect, useState } from 'react';
import { getRecruiterWithQualifications } from '../services/api';
import './view_recruiter_port.css';

function RecruiterProfile() {
  const [recruiter, setRecruiter] = useState(null);
  const [qualifications, setQualifications] = useState([]);
  const [error, setError] = useState('');

  const recruiterId = localStorage.getItem('recruiterId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRecruiterWithQualifications(recruiterId);
        if (data.message) {
          setError(data.message);
        } else {
          setRecruiter(data.recruiter);
          setQualifications(data.qualifications);
        }
      } catch (err) {
        setError('Failed to fetch profile data');
      }
    };

    fetchData();
  }, [recruiterId]);

  return (
    <div className="recruiter-profile-container">
      <div className="recruiter-details-box">
        <h2>Recruiter Profile</h2>

        {error && <p className="error-message">{error}</p>}

        {recruiter && (
          <div className="recruiter-details">
            <p><strong>👤 Username:</strong> {recruiter.username}</p>
            <p><strong>📧 Email:</strong> {recruiter.email}</p>
            <p><strong>🎂 Age:</strong> {recruiter.age}</p>
            <p><strong>🚻 Gender:</strong> {recruiter.gender}</p>
            <p><strong>💼 Experience:</strong> {recruiter.experience} years</p>
          </div>
        )}

        <h3>🎓 Qualifications</h3>
        {qualifications.length > 0 ? (
          <table className="qualification-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Field</th>
                <th>University</th>
                <th>Year Completed</th>
                <th>CGPA</th>
              </tr>
            </thead>
            <tbody>
              {qualifications.map((qual, index) => (
                <tr key={index}>
                  <td>{qual.qual_type}</td>
                  <td>{qual.field}</td>
                  <td>{qual.university_school_name}</td>
                  <td>{qual.year_completed}</td>
                  <td>{qual.cgpa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No qualifications found.</p>
        )}
      </div>
    </div>
  );
}

export default RecruiterProfile;
