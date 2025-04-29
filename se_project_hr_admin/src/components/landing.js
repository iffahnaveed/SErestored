import './landing.css';
import { Link } from 'react-router-dom';
import centerImage from './img.png';
import { useState } from 'react';

function LandingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">ERMS</div>
        <div className="navbar-center-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/faq">FAQ</Link>
        </div>
        <div className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </div>
      </nav>

      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
     
        <h3>Quick Links</h3>
        <Link to="http://localhost:3000">Recruiter</Link> {/* Link for Recruiter on localhost:3000 */}
        <Link to="http://localhost:3002">Applicant</Link>
        <Link to="/login">HR</Link>
        <Link to="/loginadmin">Admin</Link>
      </div>

      <div className="container">
        <h1>Welcome to Talent Pulse</h1>
        <div className="options">
        </div>
        <div className="image-container">
          <img src={centerImage} alt="Employee Recruitment System" />
        </div>
      </div>
    </>
  );
}

export default LandingPage;