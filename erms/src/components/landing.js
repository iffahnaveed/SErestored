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
        <Link to="/">Recruiter</Link>
        <Link to="/login">Applicant</Link>
        <Link to="/">HR</Link>
        <Link to="/">Admin</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
      </div>

      <div className="container">
        <h1>Welcome to Employee Recruitment Management System</h1>
        <div className="options">
          <Link to="/" className="option recruiter">Recruiter</Link>
          <Link to="/login" className="option applicant">Applicant</Link>
          <Link to="/" className="option hr">HR</Link>
          <Link to="/" className="option admin">Admin</Link>
        </div>
        <div className="image-container">
          <img src={centerImage} alt="Employee Recruitment System" />
        </div>
      </div>
    </>
  );
}

export default LandingPage;
