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

  // Validate email format
  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Validate password requirements
  const isValidPassword = (password) => {
    return password.length >= 6;
  };

  const handleLogin = async () => {
    // Reset status
    setStatus({ loading: false, error: '', success: '' });

    // Input validation checks
    if (!email || !password) {
      setStatus({ loading: false, error: 'Please enter both email and password', success: '' });
      return;
    }

    if (!isValidEmail(email)) {
      setStatus({ loading: false, error: 'Please enter a valid email address', success: '' });
      return;
    }

    if (!isValidPassword(password)) {
      setStatus({ loading: false, error: 'Password must be at least 8 characters long', success: '' });
      return;
    }

    setStatus({ loading: true, error: '', success: '' });

    try {
      const response = await login({ email, password });

      // Response validation checks
      if (!response) {
        setStatus({ loading: false, error: 'No response received from server', success: '' });
        return;
      }

      if (response.error) {
        setStatus({ loading: false, error: response.error, success: '' });
        return;
      }

      if (!response.user) {
        const errorMsg = response?.message || 'Login failed. Invalid user data received.';
        setStatus({ loading: false, error: errorMsg, success: '' });
        return;
      }

      // User data validation checks
      if (!response.user.hr_id) {
        console.warn('HR ID missing from user data - using fallback value');
        response.user.hr_id = 'temp_hr_id'; // Fallback value
      }

      try {
        localStorage.setItem('hr_id', response.user.hr_id);
        localStorage.setItem('user', JSON.stringify(response.user));
        console.log("User data saved to localStorage:", response.user);
      } catch (storageError) {
        console.error('LocalStorage error:', storageError);
        setStatus({ loading: false, error: 'Failed to save session data', success: '' });
        return;
      }

      setStatus({ loading: false, error: '', success: 'Login successful!' });
      console.log("Login response user object:", response.user);

      // Navigation with fallback
      setTimeout(() => {
        try {
          navigate('/hrmenu');
        } catch (navigationError) {
          console.error('Navigation error:', navigationError);
          window.location.href = '/hrmenu'; // Fallback navigation
        }
      }, 1500);
    } catch (error) {
      console.error('Login error:', error);
      const errorMsg = error.response?.data?.message || 
                      error.message || 
                      'An error occurred during login. Please try again.';
      setStatus({ loading: false, error: errorMsg, success: '' });
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
          aria-label="Email input"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          aria-label="Password input"
          minLength="8"
        />

        <button 
          onClick={handleLogin} 
          disabled={status.loading}
          aria-busy={status.loading}
        >
          {status.loading ? 'Logging in...' : 'Login'}
        </button>

        {status.error && (
          <p className="error-message" role="alert">
            {status.error}
          </p>
        )}
        {status.success && (
          <p className="success-message" role="status">
            {status.success}
          </p>
        )}

        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;