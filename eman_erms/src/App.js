// App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/landing';
import SignupPage from './components/signup';
import LoginPage from './components/login';
import HRMenuPage from './components/hrmenu';
import ContractPage from './components/contract'; // Import ContractPage
import RecommendationPage from './components/recommendation'; 
import CommunicationPage from './components/communication'; 
import AdminMenuPage from "./components/adminmenu";
import HRReportPage from "./components/hrreport";
import  ApplicantReportPage from "./components/applicantreport";
import  RecruiterReportPage from "./components/recruiterreport";
import  AdminLoginPage from "./components/loginadmin";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/hrmenu" element={<HRMenuPage />} />
        <Route path="/contract" element={<ContractPage />} /> {/* Add Route */}
        <Route path="/recommendation" element={<RecommendationPage />} /> {/* Add Route */}
        <Route path="/communication" element={<CommunicationPage />} /> {/* Add Route */}
        <Route path="/adminmenu" element={<AdminMenuPage />} />
        <Route path="/hrreport" element={<HRReportPage />} />
        <Route path="/applicantreport" element={< ApplicantReportPage />} />
        <Route path="/recruiterreport" element={< RecruiterReportPage />} />
        <Route path="/loginadmin" element={< AdminLoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;