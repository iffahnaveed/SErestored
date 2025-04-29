import LandingPage from './components/landing';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SignupPage from './components/signup';
import LoginPage from './components/login';
import ApplicantFeatures from './components/applicantfeatures';
import JObs from './components/jobs';
import View from './components/viewportfolio';
import InsertQual from './components/insertqualification';
import SendHr from './components/sendmsghr';
import RecvHr from './components/recievemsghr';
import SendRec from './components/sendmsgrecruiter';
import RecvRec from './components/recievemsgrec';
import ViewApp from './components/viewappoitment';
import ViewStat from './components/viewstatus';
import ViewCont from './components/viewcontract';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/applicantfeatures" element={<ApplicantFeatures />} />
        <Route path="/jobs" element={<JObs/>} />
        <Route path="/viewportfolio" element={<View/>} />
        <Route path="/insertqualification" element={<InsertQual/>} />
        <Route path="/sendmsghr" element={<SendHr/>} />
        <Route path="/recievemsghr"  element={<RecvHr/>} />
        <Route path="/sendmsgrecruiter"  element={<SendRec/>} />
        <Route path="/recievemsgrec"  element={<RecvRec/>} />
        <Route path="/viewappoitment"  element={<ViewApp/>} />
        <Route path="/viewstatus"  element={<ViewStat/>} />
        <Route path="/viewcontract"  element={<ViewCont/>} />
      </Routes>
    </Router>
  );
}

export default App;
