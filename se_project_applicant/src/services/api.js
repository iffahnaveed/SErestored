const BASE_URL = 'http://localhost:5003/api/auth';

export const signup = async (userData) => {
  const response = await fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  return response.json();
};


export const login = async (userData) => {
  try {
    const response = await fetch('http://localhost:5003/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    return await response.json();
  } catch (error) {
    console.error('Login error:', error);
    return { message: 'Server error' };
  }
};
