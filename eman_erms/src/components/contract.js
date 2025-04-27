import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createContract, getJobs } from "../services/api";   // ⬅️ import helper
import "./contract.css";

function ContractPage() {
  const navigate = useNavigate();

  // ───────── State ─────────
  const [formData, setFormData] = useState({
    job_id: "",
    hr_id: "",
    salary: "",
    probation_period: "",
    start_date: "",
    end_date: "",
    benefits: "",
  });

  const [jobOptions, setJobOptions] = useState([]);      // ⬅️ dropdown options
  const [loadingJobs, setLoadingJobs] = useState(true);  // UX while fetching
  const [successMessage, setSuccessMessage] = useState("");
  const [createdContract, setCreatedContract] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ───────── Initial load: HR‑ID + jobs ─────────
  useEffect(() => {
    // HR id from storage
    const storedHrId =
      localStorage.getItem("hr_id") || sessionStorage.getItem("hr_id");

    setFormData((prev) => ({ ...prev, hr_id: storedHrId }));

    // Jobs list
    (async () => {
      try {
        const { data } = await getJobs(); // { success, data: [...] }
        setJobOptions(data);
      } catch (err) {
        console.error("Failed to load jobs:", err);
        alert("Could not fetch job list. Please refresh or contact admin.");
      } finally {
        setLoadingJobs(false);
      }
    })();
  }, []);

  // ───────── Handlers ─────────
  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setSuccessMessage("");
    setCreatedContract(null);
    setIsSubmitting(true);

    const required = [
      "job_id",
      "salary",
      "probation_period",
      "start_date",
      "end_date",
      "benefits",
    ];
    const empty = required.filter((f) => !String(formData[f]).trim());

    if (empty.length) {
      alert(`Please fill in all required fields: ${empty.join(", ")}`);
      setIsSubmitting(false);
      return;
    }

    // Additional validation checks
    if (parseFloat(formData.salary) <= 0) {
      alert("Salary must be a positive number.");
      setIsSubmitting(false);
      return;
    }

    if (parseInt(formData.probation_period) <= 0) {
      alert("Probation period must be a positive number.");
      setIsSubmitting(false);
      return;
    }

    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);

    if (startDate >= endDate) {
      alert("Contract start date must be before the end date.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await createContract(formData);
      const contractData = res.data?.contract || {
        ...formData,
        id: Date.now(),
      };

      setCreatedContract(contractData);
      setSuccessMessage("Contract Created Successfully!");

      // reset (keep hr_id)
      setFormData((p) => ({
        ...p,
        job_id: "",
        salary: "",
        probation_period: "",
        start_date: "",
        end_date: "",
        benefits: "",
      }));
    } catch (err) {
      console.error("Error creating contract:", err);
      alert("Failed to create contract. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => navigate(-1);

  // ───────── UI ─────────
  return (
    <div className="contract-page-container">
      <div className="contract-header">
        <button className="contract-back-button" onClick={handleBack}>
          Back
        </button>
        <h2>Create New Contract</h2>
      </div>

      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="contract-content-wrapper">
        {/* ───────── Left column: Form ───────── */}
        <div className="contract-form-section">
          <div className="contract-form">
            {/* Job select */}
            <div className="form-group">
              <label>Job *</label>
              {loadingJobs ? (
                <p style={{ marginTop: "0.4rem" }}>Loading jobs…</p>
              ) : (
                <select
                  name="job_id"
                  value={formData.job_id}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select a job
                  </option>
                  {jobOptions.map((j) => (
                    <option key={j.jobid} value={j.jobid}>
                      {j.jobid} — {j.job_title}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Salary */}
            <div className="form-group">
              <label>Salary *</label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            {/* Probation */}
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

            {/* Start date */}
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

            {/* End date */}
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

            {/* Benefits */}
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

            {/* Submit */}
            <button
              className="contract-submit-button"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating…" : "Create Contract"}
            </button>
          </div>
        </div>

        {/* ───────── Right column: Preview ───────── */}
        <div className="contract-display-section">
          <div className="contract-display-area">
            <h3>Created Contract Details</h3>
            {createdContract ? (
              <div className="contract-details">
                <Detail label="Job ID" value={createdContract.job_id} />
                <Detail label="HR ID" value={createdContract.hr_id} />
                <Detail label="Salary" value={createdContract.salary} />
                <Detail
                  label="Probation Period"
                  value={`${createdContract.probation_period || 0} days`}
                />
                <Detail label="Start Date" value={createdContract.start_date} />
                <Detail label="End Date" value={createdContract.end_date} />
                <Detail label="Benefits" value={createdContract.benefits} />
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

// Small helper for cleaner markup
const Detail = ({ label, value }) => (
  <div className="detail-item">
    <span className="detail-label">{label}:</span>
    <span className="detail-value">{value || "N/A"}</span>
  </div>
);

export default ContractPage;
