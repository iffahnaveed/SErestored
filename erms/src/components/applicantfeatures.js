import { useNavigate } from 'react-router-dom';
import './applicantfeatures.css';

function ApplicantFeatures() {
  const navigate = useNavigate();

  return (
    <div className="applicant-container">
      <div className="feature-box">
      <div className="feature-scroll">
        <h2>Applicant Features</h2>
        <button onClick={() => navigate('/jobs')}>🔍 View & Apply for Available Jobs</button>
        <button onClick={() => navigate('/viewportfolio')}>📂 View Portfolio</button>
        <button onClick={() => navigate('/viewstatus')}>📊 View Application Status</button>
        <button onClick={() => navigate('/recievemsghr')}>📨 Receive Messages from HR</button>
        <button onClick={() => navigate('/sendmsghr')}>✉️ Send Message to HR</button>
        <button onClick={() => navigate('/recievemsgrec')}>📨 Receive Messages from Recruiter</button>
        <button onClick={() => navigate('/sendmsgrecruiter')}>✉️ Send Message to Recruiter</button>
        <button onClick={() => navigate('/viewappoitment')}>📅 View Appointments</button>
        <button onClick={() => navigate('/viewcontracts')}>📄 View Contracts</button>
         <button onClick={() => navigate('/insertqualification')}>🎓 Insert Qualifications</button>
      </div>
      </div>
    </div>
  );
}

export default ApplicantFeatures;
