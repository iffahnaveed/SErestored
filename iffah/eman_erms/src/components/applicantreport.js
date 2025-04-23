
import { useState, useEffect } from "react";
import axios from "axios";
import "./applicantreport.css";

function ApplicantReportPage() {
  const [applicantList, setApplicantList] = useState([]);
  const [selectedApplicantId, setSelectedApplicantId] = useState("");
  const [applicantData, setApplicantData] = useState(null);
  const [loading, setLoading] = useState({
    list: true,
    details: false
  });
  const [error, setError] = useState(null);

  // Fetch all applicants data
  useEffect(() => {
    const fetchApplicantData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/applicants");
        setApplicantList(response.data.data || response.data);
        setLoading(prev => ({ ...prev, list: false }));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch applicants");
        setLoading(prev => ({ ...prev, list: false }));
        console.error("Error fetching applicants:", err);
      }
    };

    fetchApplicantData();
  }, []);

  // Fetch detailed applicant data when selected
  useEffect(() => {
    if (!selectedApplicantId) return;

    const fetchApplicantDetails = async () => {
      try {
        setLoading(prev => ({ ...prev, details: true }));
        const response = await axios.get(`http://localhost:5000/api/auth/applicants/${selectedApplicantId}`);
        setApplicantData(response.data.data || response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch applicant details");
        console.error("Error fetching applicant details:", err);
      } finally {
        setLoading(prev => ({ ...prev, details: false }));
      }
    };

    fetchApplicantDetails();
  }, [selectedApplicantId]);

  const handleApplicantSelect = (e) => {
    setSelectedApplicantId(e.target.value);
  };

  if (loading.list) {
    return <div className="applicant-report-container">Loading applicants...</div>;
  }

  if (error) {
    return (
      <div className="applicant-report-container error">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="applicant-report-container">
      <h2>Applicant Report</h2>

      <div className="applicant-select-container">
        <label htmlFor="applicant-select">Select Applicant:</label>
        <select
          id="applicant-select"
          value={selectedApplicantId}
          onChange={handleApplicantSelect}
          disabled={applicantList.length === 0}
        >
          <option value="">-- Choose an Applicant --</option>
          {applicantList.map((applicant) => (
            <option key={applicant.applicant_id} value={applicant.applicant_id}>
              {applicant.username} (ID: {applicant.applicant_id})
            </option>
          ))}
        </select>
      </div>

      {loading.details && (
        <div className="loading-details">Loading details...</div>
      )}

      {applicantData && !loading.details ? (
        <div className="applicant-details">
          <h3>Applicant Report - {applicantData.username}</h3>
          
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">ID:</span>
              <span className="detail-value">{applicantData.applicant_id}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">
                <a href={`mailto:${applicantData.email}`}>
                  {applicantData.email}
                </a>
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Age:</span>
              <span className="detail-value">{applicantData.age}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Gender:</span>
              <span className="detail-value">{applicantData.gender}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Experience:</span>
              <span className="detail-value">
                {applicantData.experience} years
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Created At:</span>
              <span className="detail-value">
                {new Date(applicantData.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      ) : (
        !loading.details && (
          <p className="select-prompt">
            {applicantList.length > 0 
              ? "Please select an applicant from the dropdown to view details."
              : "No applicants found."}
          </p>
        )
      )}
    </div>
  );
}

export default ApplicantReportPage;


