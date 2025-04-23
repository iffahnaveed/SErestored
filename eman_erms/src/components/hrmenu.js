

// HRMenuPage.js
import { Link, useNavigate } from 'react-router-dom';
import './hrmenu.css';

function HRMenuPage() {
  const navigate = useNavigate();

  return (
    <div className="hr-menu-container">
      <h2>HR Menu</h2>
      <nav className="hr-menu-options">
        <Link to="/contract" className="hr-menu-option">Contract</Link>
        <Link to="/recommendation" className="hr-menu-option">Provide Recommendations</Link>
        <Link to="/communication" className="hr-menu-option">Communicate with Applicant</Link>
      </nav>
      <button className="hr-back-button" onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}

export default HRMenuPage;