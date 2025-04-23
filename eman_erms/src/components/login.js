import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { Link } from 'react-router-dom';
import './login.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setStatus({ loading: false, error: 'Please enter both email and password', success: '' });
      return;
    }

    setStatus({ loading: true, error: '', success: '' });

    try {
      const response = await login({ email, password });

      if (!response || !response.user) {
        const errorMsg = response?.message || 'Login failed. Please check your credentials.';
        setStatus({ loading: false, error: errorMsg, success: '' });
        return;
      }

      if (response.user.hr_id === undefined) {
        console.warn('HR ID missing from user data');
      }
      const { hr_id } = response.user;

if (!hr_id) {
  console.warn('⚠️ HR ID is missing in response.user');
} else {
  localStorage.setItem('hr_id', hr_id); // ✅ Now it's saved!
  console.log("✅ HR ID saved to localStorage:", hr_id);
}
      localStorage.setItem('user', JSON.stringify(response.user));

      setStatus({ loading: false, error: '', success: 'Login successful!' });
      console.log("Login response user object:", response.user);

      setTimeout(() => navigate('/hrmenu'), 1500);
    } catch (error) {
      console.error('Login error:', error);
      setStatus({ loading: false, error: 'An error occurred during login. Please try again.', success: '' });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
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
          onKeyPress={handleKeyPress}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
        />

        <button onClick={handleLogin} disabled={status.loading}>
          {status.loading ? 'Logging in...' : 'Login'}
        </button>

        {status.error && <p className="error-message">{status.error}</p>}
        {status.success && <p className="success-message">{status.success}</p>}

        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
