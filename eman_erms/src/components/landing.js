

import './landing.css';
import { Link } from 'react-router-dom';
//import centerImage from './1.png'; // Replace with your image path

function LandingPage() {
  return (
    <div className="container">
      <h1>Welcome to Employee Recruitment Management System</h1>
      <div className="options">
        <button className="option recruiter">Recruiter</button>
        <Link to="/signup" className="option applicant">Applicant</Link>
        <Link to="/login" className="option hr">HR</Link>
        <Link to="/loginadmin" className="option admin">Admin</Link>
      </div>
      <div className="image-container">
      
      </div>
    </div>
  );
}

export default LandingPage;
