import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createContract } from '../services/api';
import "./contract.css";

function ContractPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    job_id: "",
    hr_id: "",
    salary: "",
    probation_period: "",
    start_date: "",
    end_date: "",
    benefits: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [createdContract, setCreatedContract] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const hr_id = localStorage.getItem("hr_id") || sessionStorage.getItem("hr_id") ;
    
    alert("HR ID from localStorauuge: " + localStorage.getItem("hr_id"));


    setFormData(prevData => ({
      ...prevData,
      hr_id: hr_id
     
    }));
  }, []);

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
  
    setSuccessMessage("");
    setCreatedContract(null);
    setIsSubmitting(true);
  
    const requiredFields = ['job_id', 'salary', 'probation_period', 'start_date', 'end_date', 'benefits'];
    const emptyFields = requiredFields.filter(field => !formData[field].trim());
  
    if (emptyFields.length > 0) {
      alert(`Please fill in all required fields: ${emptyFields.join(', ')}`);
      setIsSubmitting(false);
      return;
    }
  
    try {
      const response = await createContract(formData);
      const contractData = response.data || {
        ...formData,
        id: Date.now()
      };
  
      setCreatedContract(contractData);
      setSuccessMessage("Contract Created Successfully!");
  
      // Reset form while keeping hr_id
      setFormData(prev => ({
        ...prev,
        job_id: "",
        salary: "",
        probation_period: "",
        start_date: "",
        end_date: "",
        benefits: ""
      }));
  
    } catch (error) {
      console.error("Error creating contract:", error);
      alert("Failed to create contract. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="contract-page-container">
      <div className="contract-header">
        <button className="contract-back-button" onClick={handleBack}>Back</button>
        <h2>Create New Contract</h2>
      </div>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      <div className="contract-content-wrapper">
        <div className="contract-form-section">
          <div className="contract-form">
            <div className="form-group">
              <label>Job ID *</label>
              <input 
                type="text" 
                name="job_id" 
                value={formData.job_id} 
                onChange={handleChange} 
                required
              />
            </div>

            <div className="form-group">
              <label>Salary *</label>
              <input 
                type="text" 
                name="salary" 
                value={formData.salary} 
                onChange={handleChange} 
                required
              />
            </div>

            <div className="form-group">
              <label>Probation Period (days) *</label>
              <input 
                type="number" 
                name="probation_period" 
                value={formData.probation_period} 
                onChange={handleChange} 
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Contract Start Date *</label>
              <input 
                type="date" 
                name="start_date" 
                value={formData.start_date} 
                onChange={handleChange} 
                required
              />
            </div>

            <div className="form-group">
              <label>Contract End Date *</label>
              <input 
                type="date" 
                name="end_date" 
                value={formData.end_date} 
                onChange={handleChange} 
                required
              />
            </div>

            <div className="form-group">
              <label>Benefits *</label>
              <textarea 
                name="benefits" 
                value={formData.benefits} 
                onChange={handleChange} 
                rows="3"
                required
              />
            </div>

            <button 
              className="contract-submit-button" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Contract"}
            </button>
          </div>
        </div>

        <div className="contract-display-section">
        <div className="contract-display-area">
  <h3>Created Contract Details</h3>
  {createdContract ? (
    <div className="contract-details">
      <div className="detail-item">
        <span className="detail-label">Job ID:</span>
        <span className="detail-value">{createdContract.job_id || "N/A"}</span>
      </div>
      <div className="detail-item">
        <span className="detail-label">HR ID:</span>
        <span className="detail-value">{createdContract.hr_id || "N/A"}</span>
      </div>
      <div className="detail-item">
        <span className="detail-label">Salary:</span>
        <span className="detail-value">{createdContract.salary || "N/A"}</span>
      </div>
      <div className="detail-item">
        <span className="detail-label">Probation Period:</span>
        <span className="detail-value">
          {createdContract.probation_period || "0"} days
        </span>
      </div>
      <div className="detail-item">
        <span className="detail-label">Start Date:</span>
        <span className="detail-value">
          {createdContract.start_date || "Not specified"}
        </span>
      </div>
      <div className="detail-item">
        <span className="detail-label">End Date:</span>
        <span className="detail-value">
          {createdContract.end_date || "Not specified"}
        </span>
      </div>
      <div className="detail-item">
        <span className="detail-label">Benefits:</span>
        <span className="detail-value">
          {createdContract.benefits || "None specified"}
        </span>
      </div>
    </div>
  ) : (
    <div className="no-contract">
      <p>No contract created yet.</p>
      <p>Fill the form and submit to create a contract.</p>
    </div>
  )}
</div>

        </div>
      </div>
    </div>
  );
}

export default ContractPage;
