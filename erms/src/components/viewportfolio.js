// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// function ViewPortfolio() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   const loggedInEmail = localStorage.getItem('userEmail'); 

//   useEffect(() => {
//     if (!loggedInEmail) {
//       setError("No user logged in");
//       setLoading(false);
//       return;
//     }

//     axios.get(`http://localhost:5000/api/user/${loggedInEmail}`)
//       .then(response => {
//         console.log("API Response:", response.data); // Debugging
//         setUser(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching user data:', error);
//         setError("Failed to fetch user data");
//       })
//       .finally(() => setLoading(false));
//   }, [loggedInEmail]);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p style={{ color: "red" }}>{error}</p>;

//   return (
//     <div className="portfolio-container">
//       <h2>User Portfolio</h2>
//       <table border="1">
//         <thead>
//           <tr>
//             <th>Username</th>
//             <th>Email</th>
//             <th>Age</th>
//             <th>Gender</th>
//             <th>Experience</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td>{user.username}</td>
//             <td>{user.email}</td>
//             <td>{user.age}</td>
//             <td>{user.gender}</td>
//             <td>{user.experience}</td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default ViewPortfolio;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './viewportfolio.css'; // Ensure CSS is imported

function ViewPortfolio() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const loggedInEmail = localStorage.getItem('userEmail'); 

  useEffect(() => {
    if (!loggedInEmail) {
      setError("No user logged in");
      setLoading(false);
      return;
    }

    axios.get(`http://localhost:5000/api/user/${loggedInEmail}`)
      .then(response => {
        console.log("API Response:", response.data);
        setUser(response.data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        setError("Failed to fetch user data");
      })
      .finally(() => setLoading(false));
  }, [loggedInEmail]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="portfolio-wrapper">
      <div className="portfolio-card">
        <h2 className="profile-heading">User Profile</h2>
        <div className="profile-row"><span className="label">Username:</span> {user.username}</div>
        <div className="profile-row"><span className="label">Email:</span> {user.email}</div>
        <div className="profile-row"><span className="label">Age:</span> {user.age}</div>
        <div className="profile-row"><span className="label">Gender:</span> {user.gender}</div>
        <div className="profile-row"><span className="label">Experience:</span> {user.experience}</div>
      </div>
    </div>
  );
}

export default ViewPortfolio;
