import React from 'react';
import { Link } from 'react-router-dom';
import './menu.css'; // optional styling file

function Menu() {
  return (
    <div className="menu-container">
      <h2 className="menu-title">Recruiter Menu</h2>
      <div className="menu-items">
        <div className="menu-card">
          <Link to="/recruiterdetails" className="menu-link">
            <div className="menu-card-content">
              <i className="menu-icon fas fa-briefcase"></i>
              <h3>View Portfolio</h3>
            </div>
          </Link>
        </div>
        <div className="menu-card">
          <Link to="/qualifications" className="menu-link">
            <div className="menu-card-content">
              <i className="menu-icon fas fa-graduation-cap"></i>
              <h3>Add Qualification and Skill</h3>
            </div>
          </Link>
        </div>
        <div className="menu-card">
          <Link to="/job" className="menu-link">
            <div className="menu-card-content">
              <i className="menu-icon fas fa-clipboard-list"></i>
              <h3>Post a Job</h3>
            </div>
          </Link>
        </div>
        <div className="menu-card">
          <Link to="/applicationdetails" className="menu-link">
            <div className="menu-card-content">
              <i className="menu-icon fas fa-file-alt"></i>
              <h3>View Applications for Job</h3>
            </div>
          </Link>
        </div>
        <div className="menu-card">
          <Link to="/testdetails" className="menu-link">
            <div className="menu-card-content">
              <i className="menu-icon fas fa-edit"></i>
              <h3>Create Test</h3>
            </div>
          </Link>
        </div>
        <div className="menu-card">
          <Link to="/entertestdetails" className="menu-link">
            <div className="menu-card-content">
              <i className="menu-icon fas fa-tasks"></i>
              <h3>Enter Test Scores</h3>
            </div>
          </Link>
        </div>
        <div className="menu-card">
          <Link to="/send-message" className="menu-link">
            <div className="menu-card-content">
              <i className="menu-icon fas fa-paper-plane"></i>
              <h3>Send Message to Applicant</h3>
            </div>
          </Link>
        </div>
        <div className="menu-card">
          <Link to="/book-appointment" className="menu-link">
            <div className="menu-card-content">
              <i className="menu-icon fas fa-calendar-alt"></i>
              <h3>Book Appointment with Applicant</h3>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Menu;
