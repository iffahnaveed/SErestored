import { useState } from 'react';
import { signup } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import './signup.css';

function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    experience: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Validation functions
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateAge = (age) => {
    const ageNum = parseInt(age);
    return !isNaN(ageNum) && ageNum >= 18 && ageNum <= 100;
  };

  const validateExperience = (experience) => {
    const expNum = parseInt(experience);
    return !isNaN(expNum) && expNum >= 0 && expNum <= 50;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setErrorMessage('Full name is required');
      return false;
    }

    if (!validateEmail(formData.email)) {
      setErrorMessage('Please enter a valid email address');
      return false;
    }

    if (!validatePassword(formData.password)) {
      setErrorMessage('Password must be at least 8 characters long');
      return false;
    }

    if (!validateAge(formData.age)) {
      setErrorMessage('Age must be between 18 and 100');
      return false;
    }

    if (!formData.gender) {
      setErrorMessage('Please select a gender');
      return false;
    }

    if (!validateExperience(formData.experience)) {
      setErrorMessage('Experience must be between 0 and 50 years');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    const userData = { 
      username: formData.name, 
      email: formData.email, 
      password: formData.password, 
      age: formData.age, 
      gender: formData.gender, 
      experience: formData.experience 
    };

    try {
      const response = await signup(userData);
      
      if (!response) {
        throw new Error('No response from server');
      }

      if (response.error) {
        setErrorMessage(response.error);
        return;
      }

      if (response.message === 'User already exists') {
        setErrorMessage('An account with this email already exists');
        return;
      }

      setSuccessMessage('Signup successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);

    } catch (error) {
      console.error('Signup error:', error);
      const errorMsg = error.response?.data?.message || 
                      error.message || 
                      'Error signing up. Please try again.';
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="signup-container">
      <div className="form-box">
        <h2>Sign Up</h2>
        
        <input 
          type="text" 
          name="name"
          placeholder="Full Name" 
          value={formData.name} 
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          aria-label="Full name"
          required
        />
        
        <input 
          type="email" 
          name="email"
          placeholder="Email" 
          value={formData.email} 
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          aria-label="Email"
          required
        />
        
        <input 
          type="password" 
          name="password"
          placeholder="Password" 
          value={formData.password} 
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          aria-label="Password"
          minLength="8"
          required
        />
        
        <input 
          type="number" 
          name="age"
          placeholder="Age" 
          value={formData.age} 
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          aria-label="Age"
          min="18"
          max="100"
          required
        />
        
        <select 
          name="gender"
          value={formData.gender} 
          onChange={handleChange}
          aria-label="Gender"
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        
        <input 
          type="number" 
          name="experience"
          placeholder="Experience (in years)" 
          value={formData.experience} 
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          aria-label="Experience"
          min="0"
          max="50"
          required
        />
        
        <button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Sign Up'}
        </button>

        {errorMessage && (
          <p className="error-message" role="alert">
            {errorMessage}
          </p>
        )}
        
        {successMessage && (
          <p className="success-message" role="status">
            {successMessage}
          </p>
        )}

        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}

export default SignupPage;