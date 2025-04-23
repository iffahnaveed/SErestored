


// import { useEffect, useState } from 'react';
// import './jobs.css';

// function Jobs() {
//   const [jobs, setJobs] = useState([]);
//   const [user, setUser] = useState(null);
//   const [error, setError] = useState("");

//   // Fetch jobs
//   useEffect(() => {
//     fetch('http://localhost:5000/api/jobs')
//       .then(response => response.json())
//       .then(data => setJobs(data))
//       .catch(error => console.error('Error fetching jobs:', error));
//   }, []);

//   // Fetch user details (assuming user is logged in and email is stored in localStorage)
//   useEffect(() => {
//     const userEmail = localStorage.getItem('userEmail');
//     if (userEmail) {
//       fetch(`http://localhost:5000/api/user/${userEmail}`)
//         .then(response => response.json())
//         .then(data => setUser(data))
//         .catch(error => console.error('Error fetching user:', error));
//     }
//   }, []);
//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       const userData = JSON.parse(storedUser);
//       setUser(userData);
//     }
//   }, []);
//   // Apply for a job
//   const applyForJob = async (job) => {
//     if (!user) {
//       setError("Please log in to apply for jobs.");
//       return;
//     }

//     if (user.experience < job.job_experience) {
//       setError("You do not meet the experience requirement for this job.");
//       return;
//     }

//     try {
//       const response = await fetch('http://localhost:5000/api/jobs/apply', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ user_id: user.id, job_id: job.jobid }),
//       });

//       const result = await response.json();
//       if (response.ok) {
//         setJobs(prevJobs => prevJobs.filter(j => j.jobid !== job.jobid)); // Remove applied job
//         setError(""); // Clear error
//       } else {
//         setError(result.message);
//       }
//     } catch (error) {
//       console.error("Error applying for job:", error);
//       setError("Server error. Try again later.");
//     }
//   };

//   return (
//     <div className="jobs-container">
//       <h2>Available Jobs</h2>
//       {error && <div className="error">{error}</div>}
//       <table>
//         <thead>
//           <tr>
//             <th>Job Title</th>
//             <th>Company</th>
//             <th>Skills Required</th>
//             <th>Job Type</th>
//             <th>Experience</th>
//             <th>Deadline</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {jobs.map(job => (
//             <tr key={job.jobid}>
//               <td>{job.job_title}</td>
//               <td>{job.company_name}</td>
//               <td>{job.qualification_skills_required}</td>
//               <td>{job.job_type}</td>
//               <td>{job.job_experience} years</td>
//               <td>{new Date(job.application_deadline).toLocaleDateString()}</td>
//               <td>
//                 <button onClick={() => applyForJob(job)}>Apply</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default Jobs;









import { useEffect, useState } from 'react';
import './jobs.css';

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  // Fetch jobs
  useEffect(() => {
    fetch('http://localhost:5000/api/jobs')
      .then(response => response.json())
      .then(data => setJobs(data))
      .catch(error => console.error('Error fetching jobs:', error));
  }, []);

  // Fetch user details (assuming user is logged in and email is stored in localStorage)
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      fetch(`http://localhost:5000/api/user/${userEmail}`)

        .then(response => response.json())
        .then(data => setUser(data))
        .catch(error => console.error('Error fetching user:', error));
    }
  }, []);

  // Apply for a job
  const applyForJob = async (job) => {
    if (!user) {
      setError("Please log in to apply for jobs.");
      return;
    }

    if (user.experience < job.job_experience) {
      setError("You do not meet the experience requirement for this job.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/jobs/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
     // body: JSON.stringify({ user_id: user.id, job_id: job.jobid }),
      body: JSON.stringify({ user_id: user.applicant_id, job_id: job.jobid }),

      });

      const result = await response.json();
      if (response.ok) {
        setJobs(prevJobs => prevJobs.filter(j => j.jobid !== job.jobid)); // Remove applied job
        setError(""); // Clear error
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      setError("Server error. Try again later.");
    }
  };

  return (
    <div className="jobs-container">
      <h2>Available Jobs</h2>
      {error && <div className="error">{error}</div>}
      <table>
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Company</th>
            <th>Skills Required</th>
            <th>Job Type</th>
            <th>Experience</th>
            <th>Deadline</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map(job => (
            <tr key={job.jobid}>
              <td>{job.job_title}</td>
              <td>{job.company_name}</td>
              <td>{job.qualification_skills_required}</td>
              <td>{job.job_type}</td>
              <td>{job.job_experience} years</td>
              <td>{new Date(job.application_deadline).toLocaleDateString()}</td>
              <td>
                <button onClick={() => applyForJob(job)}>Apply</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Jobs;
