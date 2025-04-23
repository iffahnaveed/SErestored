import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
        console.log("API Response:", response.data); // Debugging
        setUser(response.data);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        setError("Failed to fetch user data");
      })
      .finally(() => setLoading(false));
  }, [loggedInEmail]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="portfolio-container">
      <h2>User Portfolio</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Experience</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.age}</td>
            <td>{user.gender}</td>
            <td>{user.experience}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ViewPortfolio;
