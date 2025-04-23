
import { useState, useEffect } from "react";
import axios from "axios";
import "./hrreport.css";

function HRReportPage() {
  const [hrList, setHrList] = useState([]);
  const [selectedHrId, setSelectedHrId] = useState("");
  const [hrData, setHrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch HR data from backend
  useEffect(() => {
    const fetchHrData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/hrs");
        setHrList(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch HR data");
        setLoading(false);
        console.error("Error fetching HR data:", err);
      }
    };

    fetchHrData();
  }, []);

  const handleHrSelect = (e) => {
    const selectedId = e.target.value;
    setSelectedHrId(selectedId);
    
    if (selectedId === "") {
      setHrData(null);
      return;
    }
    
    const selectedHr = hrList.find((hr) => hr.hr_id.toString() === selectedId);
    setHrData(selectedHr || null);
  };

  if (loading) {
    return <div className="hr-report-container">Loading HR data...</div>;
  }

  if (error) {
    return <div className="hr-report-container">{error}</div>;
  }

  return (
    <div className="hr-report-container">
      <h2>HR Report</h2>

      <div className="hr-select-container">
        <label htmlFor="hr-select">Select HR:</label>
        <select 
          id="hr-select" 
          value={selectedHrId} 
          onChange={handleHrSelect}
          disabled={hrList.length === 0}
        >
          <option value="">-- Choose an HR --</option>
          {hrList.map((hr) => (
            <option key={hr.hr_id} value={hr.hr_id}>
              {hr.hr_name} (ID: {hr.hr_id})
            </option>
          ))}
        </select>
      </div>

      {hrData ? (
        <div className="hr-details">
          <h3>HR Report - {hrData.hr_name}</h3>
          <div className="detail-row">
            <span className="detail-label">ID:</span>
            <span className="detail-value">{hrData.hr_id}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{hrData.hr_email}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Age:</span>
            <span className="detail-value">{hrData.hr_age}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Gender:</span>
            <span className="detail-value">{hrData.hr_gender}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Qualification ID:</span>
            <span className="detail-value">{hrData.quali_id}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Experience:</span>
            <span className="detail-value">{hrData.hr_experience} years</span>
          </div>
        </div>
      ) : (
        <p className="select-prompt">Please select an HR from the dropdown to view their details.</p>
      )}
    </div>
  );
}

export default HRReportPage;

