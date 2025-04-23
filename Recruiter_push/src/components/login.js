import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { Link } from 'react-router-dom';
import './login.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const userData = { email, password };
    const response = await login(userData);

    if (response?.message === 'No account exists' || response?.message === 'Invalid password') {
      setErrorMessage(response.message);
      setSuccessMessage('');
    } else {
      setErrorMessage('');
      setSuccessMessage('Login successful');

      // Store user data in local storage (for session persistence)
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('userEmail', response.user.email); // Store the user email separately
      localStorage.setItem('recruiterId', response.user.id);
      // Redirect user to Menu page after successful login
      setTimeout(() => navigate('/menu'), 1500); // Changed to '/menu' here
    }
  };

  return (
    <div className="login-container">
      <div className="form-box">
        <h2>Login</h2>
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
        <button onClick={handleLogin}>Login</button>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

        {successMessage && (
          <div className="success-box">
            {successMessage}
          </div>
        )}

        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
      </div>
    </div>
  );
}

export default LoginPage;
