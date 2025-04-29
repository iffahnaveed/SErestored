

// HRMenuPage.js
import { Link } from 'react-router-dom';
import './hrmenu.css';

function HRMenuPage() {
  

  return (
    <div className="hr-menu-container">
      <h2>HR Menu</h2>
      <nav className="hr-menu-options">
        <Link to="/contract" className="hr-menu-option">Make Contract</Link>
        <Link to="/recommendation" className="hr-menu-option">Provide Recommendations</Link>
        <Link to="/communication" className="hr-menu-option">Communicate with Applicant</Link>
      </nav>
      
    </div>
  );
}

export default HRMenuPage;