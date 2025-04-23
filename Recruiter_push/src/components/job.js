import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postJob } from '../services/api';
import './job.css';
function Job() {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [skills, setSkills] = useState('');
  const [jobType, setJobType] = useState('');
  const [experience, setExperience] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const recruiterId = localStorage.getItem('recruiterId');

  const handleSubmit = async () => {
    const jobData = {
      job_title: jobTitle,
      job_description: jobDescription,
      company_name: companyName,
      qualification_skills_required: skills,
      job_type: jobType,
      job_experience: parseInt(experience),
      cgpa_required: parseFloat(cgpa),
      application_deadline: deadline,
      recruiter_id: parseInt(recruiterId),
      job_status: parseInt(status),
    };

    const result = await postJob(jobData);

    if (result.error) {
      setErrorMessage(result.error);
      setSuccessMessage('');
    } else {
      setSuccessMessage('Job posted successfully!');
      setErrorMessage('');
      // Optionally reset form
    }
  };

  return (
    <div className="job-container">
      <div className="job-form">
        <h2>Post a New Job</h2>

        <label>Job Title</label>
        <input type="text" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />

        <label>Job Description</label>
        <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />

        <label>Company Name</label>
        <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />

        <label>Qualification & Skills</label>
        <textarea value={skills} onChange={(e) => setSkills(e.target.value)} />

        <label>Job Type</label>
        <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
          <option value="">-- Select Job Type --</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>

        <label>Experience (Years)</label>
        <input type="number" min="0" value={experience} onChange={(e) => setExperience(e.target.value)} />

        <label>Required CGPA (1 - 4)</label>
        <input type="number" step="1.00" min="0" max="4" value={cgpa} onChange={(e) => setCgpa(e.target.value)} />

        <label>Application Deadline</label>
        <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />

        <label>Job Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value={1}>Open</option>
          <option value={0}>Closed</option>
        </select>

        <button onClick={handleSubmit}>Post Job</button>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      </div>
    </div>
  );
}

export default Job;