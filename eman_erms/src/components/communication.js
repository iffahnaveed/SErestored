import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./communication.css";

function CommunicationPage() {
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sendStatus, setSendStatus] = useState({ type: null, message: "" });
  
  // Get the HR ID from localStorage or sessionStorage
  // This assumes you store the HR's ID when they log in
  const hr_id = localStorage.getItem('hr_id') || sessionStorage.getItem('hr_id') || 1;

  // Fetch applicants from your database
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/applicants");
        const applicantsData = Array.isArray(response.data)
          ? response.data
          : response.data?.data || [];
        setApplicants(applicantsData);
      } catch (err) {
        console.error("Error fetching applicants:", err);
        setError("Failed to fetch applicants. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplicants();
  }, []);

  // Handle sending the message
  const handleSendMessage = async () => {
    setSendStatus({ type: null, message: "" });
    if (!selectedApplicant || !message.trim()) {
      setSendStatus({ type: "error", message: "Please select an applicant and type a message." });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/send-message",
        {
          hr_id: parseInt(hr_id),
          applicant_id: parseInt(selectedApplicant),
          message: message.trim()
        },
        {
          headers: { "Content-Type": "application/json" }
        }
      );
      console.log("Message send response:", response);

      if (response.data?.success) {
        setSendStatus({ type: "success", message: "Message sent successfully!" });
        setMessage(""); // Clear message after sending
      } else {
        setSendStatus({ type: "error", message: response.data?.message || "Failed to send message." });
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setSendStatus({ type: "error", message: "Failed to send message. Please try again." });
    }
  };

  if (isLoading) {
    return (
      <div className="communication-container">
        <div className="loading-spinner"></div>
        <p>Loading applicants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="communication-container error">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Refresh Page</button>
      </div>
    );
  }

  return (
    <div className="communication-container">
      <h2>Communicate with Applicant</h2>

      {sendStatus.type && (
        <div className={`status-message ${sendStatus.type}`}>
          {sendStatus.message}
        </div>
      )}

      <div className="form-group">
        <label>👤 Select Applicant:</label>
        <select
          value={selectedApplicant}
          onChange={(e) => setSelectedApplicant(e.target.value)}
          required
          disabled={!applicants.length}
        >
          <option value="">-- Select Applicant --</option>
          {applicants.map((applicant) => (
            <option key={applicant.applicant_id} value={applicant.applicant_id}>
              {applicant.username} (ID: {applicant.applicant_id})
            </option>
          ))}
        </select>
        {!applicants.length && <p className="form-hint">No applicants available</p>}
      </div>

      <div className="form-group">
        <label>📝 Message:</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          rows="5"
          required
        />
      </div>

      <div className="form-actions">
        <button className="primary-button" onClick={handleSendMessage}>
          Send
        </button>
        <button className="secondary-button" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </div>
  );
}

export default CommunicationPage;