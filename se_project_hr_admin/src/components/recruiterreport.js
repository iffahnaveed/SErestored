import { useState, useEffect } from "react";
import axios from "axios";
import "./recruiterreport.css";

function RecruiterReportPage() {
  const [recruiterList, setRecruiterList] = useState([]);
  const [selectedRecruiterId, setSelectedRecruiterId] = useState("");
  const [recruiterData, setRecruiterData] = useState(null);
  const [loading, setLoading] = useState({
    list: true,
    details: false
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecruiterData = async () => {
      try {
        const response = await axios.get("http://localhost:5002/api/auth/recruiters");
        setRecruiterList(response.data.data || response.data);
        setLoading(prev => ({ ...prev, list: false }));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch recruiters");
        setLoading(prev => ({ ...prev, list: false }));
        console.error("Error fetching recruiters:", err);
      }
    };

    fetchRecruiterData();
  }, []);

  useEffect(() => {
    if (!selectedRecruiterId) return;

    const fetchRecruiterDetails = async () => {
      try {
        setLoading(prev => ({ ...prev, details: true }));
        const response = await axios.get(`http://localhost:5002/api/auth/recruiters/${selectedRecruiterId}`);
        setRecruiterData(response.data.data || response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch recruiter details");
        console.error("Error fetching recruiter details:", err);
      } finally {
        setLoading(prev => ({ ...prev, details: false }));
      }
    };

    fetchRecruiterDetails();
  }, [selectedRecruiterId]);

  const handleRecruiterSelect = (e) => {
    setSelectedRecruiterId(e.target.value);
  };

  if (loading.list) {
    return <div className="recruiter-report-container">Loading recruiters...</div>;
  }

  if (error) {
    return (
      <div className="recruiter-report-container error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="recruiter-report-container">
      <h2>Recruiter Report</h2>

      <div className="recruiter-select-container">
        <label htmlFor="recruiter-select">Select Recruiter:</label>
        <select
          id="recruiter-select"
          value={selectedRecruiterId}
          onChange={handleRecruiterSelect}
          disabled={recruiterList.length === 0}
        >
          <option value="">-- Choose a Recruiter --</option>
          {recruiterList.map((recruiter) => (
            <option key={recruiter.recruiter_id} value={recruiter.recruiter_id}>
              {recruiter.username} (ID: {recruiter.recruiter_id})
            </option>
          ))}
        </select>
      </div>

      {loading.details && <div className="loading-details">Loading details...</div>}

      {recruiterData && !loading.details ? (
        <div className="recruiter-details">
          <h3>Recruiter Report - {recruiterData.username}</h3>

          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">ID:</span>
              <span className="detail-value">{recruiterData.recruiter_id}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">
                <a href={`mailto:${recruiterData.email}`}>{recruiterData.email}</a>
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Age:</span>
              <span className="detail-value">{recruiterData.age}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Gender:</span>
              <span className="detail-value">{recruiterData.gender}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Experience:</span>
              <span className="detail-value">{recruiterData.experience} years</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Created At:</span>
              <span className="detail-value">{new Date(recruiterData.created_at).toLocaleString()}</span>
            </div>
          </div>
        </div>
      ) : (
        !loading.details && (
          <p className="select-prompt">
            {recruiterList.length > 0
              ? "Please select a recruiter from the dropdown to view details."
              : "No recruiters found."}
          </p>
        )
      )}
    </div>
  );
}

export default RecruiterReportPage;
