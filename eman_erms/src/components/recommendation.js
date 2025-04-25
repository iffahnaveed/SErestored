import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./recommendation.css";

function RecommendationPage() {
  const navigate = useNavigate();

  // Get HR ID from storage with fallback to 1
  const storedHrId = localStorage.getItem('hr_id') || sessionStorage.getItem('hr_id') || 1;
  const [defaultHrId] = useState(parseInt(storedHrId));

  // State for dropdown options
  const [applicants, setApplicants] = useState([]);
  const [hrs, setHrs] = useState([]);
  const [shortlistedApplicants, setShortlistedApplicants] = useState({});
  const recommendations = ["Recommended", "Neutral", "Highly Recommended", "Not Recommended"];

  // State for selected values
  const [selectedApplicant, setSelectedApplicant] = useState("");
  const [selectedHR, setSelectedHR] = useState(defaultHrId.toString());
  const [selectedRecommendation, setSelectedRecommendation] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitStatus, setSubmitStatus] = useState({ type: null, message: "" });

  // Fetch applicants who are shortlisted by HR
  const fetchShortlistedApplicants = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/auth/shortlisted-applicants");
      console.log("Shortlisted applicants response:", response.data);
      
      const shortlistedData = Array.isArray(response.data) 
        ? response.data 
        : response.data?.data || [];
      
      // Create a mapping of HR IDs to their shortlisted applicants
      const shortlistMap = {};
      shortlistedData.forEach(item => {
        if (!shortlistMap[item.shortlist_after_hrid]) {
          shortlistMap[item.shortlist_after_hrid] = [];
        }
        shortlistMap[item.shortlist_after_hrid].push(item.shortlist_afterhr_applicant_id);
      });
      
      setShortlistedApplicants(shortlistMap);
      console.log("Shortlist mapping:", shortlistMap);
    } catch (err) {
      console.error("Error fetching shortlisted applicants:", err);
      setError("Failed to fetch shortlisted applicants. Please try again later.");
    }
  };

  // Fetch all applicants
  const fetchApplicants = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/auth/applicants");
      console.log("Applicants response:", response.data);
      
      const applicantsData = Array.isArray(response.data) 
        ? response.data 
        : response.data?.data || [];
      
      if (!applicantsData.length) {
        console.warn("No applicants data received");
      }
      setApplicants(applicantsData);
    } catch (err) {
      console.error("Error fetching applicants:", err);
      setError("Failed to fetch applicants. Please try again later.");
    }
  };

  // Fetch HRs
  const fetchHRData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/auth/hrs");
      console.log("HRs response:", response.data);
      
      const hrsData = Array.isArray(response.data) 
        ? response.data 
        : response.data?.data || [];
      
      if (!hrsData.length) {
        console.warn("No HRs data received");
      }
      setHrs(hrsData);
    } catch (err) {
      console.error("Error fetching HR data:", err);
      setError("Failed to fetch HR data. Please try again later.");
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchApplicants(), fetchHRData(), fetchShortlistedApplicants()]);
      } catch (err) {
        console.error("Error in fetchData:", err);
        setError("Failed to load initial data. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Reset applicant selection when HR changes
  useEffect(() => {
    if (selectedHR) {
      setSelectedApplicant("");
    }
  }, [selectedHR]);

  // Get applicants shortlisted by the selected HR
  const getFilteredApplicants = () => {
    if (!selectedHR) return [];
    
    const shortlistedIds = shortlistedApplicants[selectedHR] || [];
    return applicants.filter(applicant => 
      shortlistedIds.includes(applicant.applicant_id)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ type: null, message: "" });

    // Validate all fields with proper type checking
    if (!selectedApplicant || !selectedHR || !selectedRecommendation) {
      setSubmitStatus({ type: "error", message: "Please fill in all fields" });
      return;
    }

    // Ensure IDs are numbers
    const hrId = parseInt(selectedHR);
    const applicantId = parseInt(selectedApplicant);

    if (isNaN(hrId) || isNaN(applicantId)) {
      setSubmitStatus({ type: "error", message: "Invalid ID values" });
      return;
    }

    try {
      console.log("Submitting with parsed IDs:", {
        hrId,
        applicantId,
        recommendation: selectedRecommendation
      });

      const response = await axios.post("http://localhost:5000/api/auth/recommendations", {
        hr_id: hrId,
        applicant_id: applicantId,
        recommendation: selectedRecommendation
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        transformRequest: [(data) => {
          console.log("Request payload:", data);
          return JSON.stringify(data);
        }]
      });

      console.log("Full server response:", response);

      if (response.data?.success) {
        setSubmitStatus({ 
          type: "success", 
          message: "Recommendation submitted successfully!"
        });
        // Reset form
        setSelectedApplicant("");
        setSelectedRecommendation("");
      } else {
        setSubmitStatus({
          type: "error",
          message: response.data?.message || "Submission failed"
        });
      }
    } catch (err) {
      console.error("Complete error details:", {
        message: err.message,
        response: err.response?.data,
        config: err.config
      });

      setSubmitStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to submit recommendation."
      });
    }
  };

  if (isLoading) {
    return (
      <div className="recommendation-container">
        <div className="loading-spinner"></div>
        <p>Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendation-container error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Refresh Page</button>
      </div>
    );
  }

  // Get filtered applicants based on selected HR
  const filteredApplicants = getFilteredApplicants();

  return (
    <div className="recommendation-container">
      <h2>Provide Recommendation</h2>

      {submitStatus.type && (
        <div className={`status-message ${submitStatus.type}`}>
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* HR Dropdown - First Selection */}
        <div className="form-group">
          <label>🔖 Select HR:</label>
          <select
            onChange={(e) => setSelectedHR(e.target.value)}
            value={selectedHR}
            required
            disabled={!hrs.length}
          >
            <option value="">--Select HR--</option>
            {hrs.map((hr) => (
              <option key={hr.hr_id} value={hr.hr_id}>
                {hr.hr_name || `HR ${hr.hr_id}`}
              </option>
            ))}
          </select>
          {!hrs.length && <p className="form-hint">No HRs available</p>}
        </div>

        {/* Applicant Dropdown - Only shows applicants shortlisted by selected HR */}
        <div className="form-group">
          <label>👤 Select Applicant:</label>
          <select
            onChange={(e) => setSelectedApplicant(e.target.value)}
            value={selectedApplicant}
            required
            disabled={!selectedHR || filteredApplicants.length === 0}
          >
            <option value="">--Select Applicant--</option>
            {filteredApplicants.map((applicant) => (
              <option key={applicant.applicant_id} value={applicant.applicant_id}>
                {applicant.username || `Applicant ${applicant.applicant_id}`}
              </option>
            ))}
          </select>
          {selectedHR && filteredApplicants.length === 0 && (
            <p className="form-hint">No shortlisted applicants for this HR</p>
          )}
          {!selectedHR && (
            <p className="form-hint">Please select an HR first</p>
          )}
        </div>

        {/* Recommendation Dropdown */}
        <div className="form-group">
          <label>📝 Select Recommendation:</label>
          <select
            onChange={(e) => setSelectedRecommendation(e.target.value)}
            value={selectedRecommendation}
            required
            disabled={!selectedApplicant}
          >
            <option value="">--Select Recommendation--</option>
            {recommendations.map((rec) => (
              <option key={rec} value={rec}>
                {rec}
              </option>
            ))}
          </select>
        </div>

        {/* Summary */}
        <div className="form-group">
          <label>📜 Recommendation Summary:</label>
          <textarea
            value={
              `HR: ${hrs.find(h => h.hr_id === parseInt(selectedHR))?.hr_name || "Not selected"}\n` +
              `Applicant: ${filteredApplicants.find(a => a.applicant_id === parseInt(selectedApplicant))?.username || "Not selected"}\n` +
              `Recommendation: ${selectedRecommendation || "Not selected"}`
            }
            readOnly
            rows="4"
          />
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
          <button
            type="submit"
            className="primary-button"
            disabled={!selectedHR || !selectedApplicant || !selectedRecommendation}
          >
            Submit Recommendation
          </button>
        </div>
      </form>
    </div>
  );
}

export default RecommendationPage;