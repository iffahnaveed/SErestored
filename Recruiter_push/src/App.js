import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/login';
import SignupPage from './components/signup';
import MenuPage from './components/menu';
import JobPage from './components/job';
import QualificationPage from './components/add_qualification';
import ViewRecruiterPage from './components/view_recruiter_port'; // Capitalized import
import ViewApplicationPage from './components/view_application';
import CreateTestPage from './components/create_test';
import EnterTestPage  from './components/enter_testscore';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/job" element={<JobPage />} />
        <Route path="/qualifications" element={<QualificationPage />} />
        <Route path="/recruiterdetails" element={<ViewRecruiterPage />} /> 
        <Route path="/applicationdetails" element={<ViewApplicationPage />} /> 
        <Route path="/testdetails" element={<CreateTestPage />} /> 
        <Route path="/entertestdetails" element={<EnterTestPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;
