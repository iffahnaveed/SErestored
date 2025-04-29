import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginadmin } from '../services/api';

import './loginadmin.css';

function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const navigate = useNavigate();

  // Email validation regex (basic)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Handle login
  const handleLogin = async () => {
    setStatus({ loading: true, error: '', success: '' });

    // Validation: Check if the email is valid
    if (!email || !emailRegex.test(email)) {
      setStatus({ loading: false, error: 'Please enter a valid email address.', success: '' });
      return;
    }

    // Validation: Check if the password is entered
    if (!password) {
      setStatus({ loading: false, error: 'Password cannot be empty.', success: '' });
      return;
    }

    // Optional: Validate password length (if needed)
    if (password.length < 6) {
      setStatus({ loading: false, error: 'Password must be at least 6 characters long.', success: '' });
      return;
    }

    try {
      const result = await loginadmin({ email, password });
      
      if (!result.success) {
        throw new Error(result.error);
      }
  
      // Store admin data
      localStorage.setItem('admin_id', result.admin.admin_id);
      localStorage.setItem('admin', JSON.stringify(result.admin));
  
      setStatus({ 
        loading: false, 
        error: '', 
        success: 'Login successful!' 
      });
      
      setTimeout(() => navigate('/adminmenu'), 1500);
      
    } catch (error) {
      setStatus({
        loading: false,
        error: error.message,
        success: ''
      });
    }
  };

  // Handle Enter key press to trigger login
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-container">
      <div className="form-box">
        <h2>Admin Login</h2>

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyPress} // Changed from onKeyPress which is deprecated
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyPress} // Changed from onKeyPress which is deprecated
        />

        <button 
          onClick={handleLogin} 
          disabled={status.loading}
          className={status.loading ? 'loading' : ''}
        >
          {status.loading ? 'Logging in...' : 'Login'}
        </button>

        {status.error && <p className="error-message">{status.error}</p>}
        {status.success && <p className="success-message">{status.success}</p>}
      </div>
    </div>
  );
}

export default AdminLoginPage;
