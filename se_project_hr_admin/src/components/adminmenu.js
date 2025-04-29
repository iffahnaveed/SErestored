

import { Link } from "react-router-dom";
import "./adminmenu.css";

function AdminMenuPage() {

  return (
    <div className="admin-menu-container">
      <h2>View Reports</h2>
      <nav className="admin-menu-options">
        <Link to="/hrreport" className="admin-menu-option">HR Report</Link>
        <Link to="/applicantreport" className="admin-menu-option">Applicant Report</Link>
        <Link to="/recruiterreport" className="admin-menu-option">Recruiter Report</Link>
      </nav>
    </div>
  );
}

export default AdminMenuPage;