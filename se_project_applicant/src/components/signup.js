import { useState } from 'react';
import { signup } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import './signup.css';

function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [experience, setExperience] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const userData = { username: name, email, password, age, gender, experience };
    
    try {
      const response = await signup(userData);
      console.log(response);

      if (response?.message === 'User already exists') {
        setErrorMessage(response.message);
        setSuccessMessage('');
      } else {
        setErrorMessage('');
        setSuccessMessage('Signup successful! Redirecting to login...');
        
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      setErrorMessage('Error signing up. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <div className="form-box">
        <h2>Sign Up</h2>
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input type="number" placeholder="Experience (in years)" value={experience} onChange={(e) => setExperience(e.target.value)} />
        
        <button onClick={handleSubmit}>Sign Up</button>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}

export default SignupPage;
