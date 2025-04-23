import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/api';  // Make sure to implement this API call in your services file
import { Link } from 'react-router-dom';
import './signup.css';

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [experience, setExperience] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    // Convert to numbers for comparison
    const numericAge = Number(age);
    const numericExperience = Number(experience);
  
    // Validation rules
    if (numericAge <= 18) {
      setErrorMessage('Age must be greater than 18.');
      setSuccessMessage('');
      return;
    }
  
    if (numericExperience >= numericAge) {
      setErrorMessage('Experience must be less than age.');
      setSuccessMessage('');
      return;
    }
  
    const userData = { email, username, password, age, gender, experience };
    const response = await signup(userData);
  
    if (response?.message === 'Email already exists') {
      setErrorMessage(response.message);
      setSuccessMessage('');
    } else {
      setErrorMessage('');
      setSuccessMessage('Account created successfully');
  
      // Redirect user to Login page after successful signup
      setTimeout(() => navigate('/login'), 1500);
    }
  };
  return (
    <div className="signup-container">
      <div className="form-box">
        <h2>Sign Up</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
  
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            margin: '10px 0',
            borderRadius: '8px',
            border: 'none',
            background: 'rgba(255, 255, 255, 0.8)',
            color: 'black',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease'
          }}
        >
          <option value="">Select Gender</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
        </select>
  
        <input
          type="text"
          placeholder="Experience"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />
        <button onClick={handleSignup}>Sign Up</button>
  
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && (
          <div className="success-box">
            {successMessage}
          </div>
        )}
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );  
}

export default SignUpPage;
