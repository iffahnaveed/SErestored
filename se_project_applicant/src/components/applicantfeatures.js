import React from 'react';
import { Link } from 'react-router-dom';
import './applicantfeatures.css'; // you can improve styling here

function ApplicantFeatures() {
  return (
    <div className="menu-container">
      <h2 className="menu-title">Applicant Menu</h2>
      <div className="menu-items">
        <div className="menu-card">
          <Link to="/jobs" className="menu-link">
            <div className="menu-card-content">
              <i className="menu-icon fas fa-briefcase"></i>
              <h3>View & Apply for Available Jobs</h3>
            </div>
          </Link>
        </div>
        <div className="menu-card">
          <Link to="/viewportfolio" className="menu-link">
            <div className="menu-card-content">
              <i className="menu-icon fas fa-id-card"></i>
              <h3>View Portfolio</h3>
            </div>
          </Link>
        </div>
        <div className="menu-card">
          <Link to="/viewstatus" className="menu-link">
            <div className="menu-card-content">
              <i className="menu-icon fas fa-tasks"></i>
              <h3>View Application Status</h3>
            </div>
          </Link>
        </div>
        <div className="menu-card">
          <Link to="/recievemsghr" className="menu-link">
            <div className="menu-card-content">
              <i className="menu-icon fas fa-envelope-open-text"></i>
              <h3>Receive Messages from HR</h3>
            </div>
          </Link>
        </div>
        <div className="menu-card">
          <Link to="/sendmsghr" className="menu-link">
            <div className="menu-card-content">
              <i className="menu-icon fas fa-paper-plane"></i>
              <h3>Send Message to HR</h3>
            </div>
          </Link>
        </div>
        <div className="menu-card">
          <Link to="/recievemsgrec" className="menu-link">
            <div className="menu-card-content">
              <i className="menu-icon fas fa-comments"></i>
              <h3>Receive Messages from Recruiter</h3>
            </div>
          </Link>
        </div>
        <div className="menu-card">
          <Link to="/sendmsgrecruiter" className="menu-link">
            <div className="menu-card-content">
              <i className="menu-icon fas fa-comment-dots"></i>
              <h3>Send Message to Recruiter</h3>
            </div>
          </Link>
        </div>
        <div className="menu-card">
          <Link to="/viewappoitment" className="menu-link">
            <div className="menu-card-content">
              <i className="menu-icon fas fa-calendar-check"></i>
              <h3>View Appointments</h3>
            </div>
          </Link>
        </div>
        <div className="menu-card">
          <Link to="/viewcontract" className="menu-link">
            <div className="menu-card-content">
              <i className="menu-icon fas fa-file-contract"></i>
              <h3>View Contracts</h3>
            </div>
          </Link>
        </div>
        <div className="menu-card">
          <Link to="/insertqualification" className="menu-link">
            <div className="menu-card-content">
              <i className="menu-icon fas fa-user-graduate"></i>
              <h3>Insert Qualifications</h3>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ApplicantFeatures;
