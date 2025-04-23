
  const BASE_URL = 'http://localhost:5000/api/auth';

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
    const response = await fetch('http://localhost:5000/api/auth/login', {
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



export const createContract = async (contractData) => {
  const response = await fetch(`${BASE_URL}/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contractData),
  });

  return response.json();
};

export const getContracts = async () => {
  const response = await fetch(`${BASE_URL}/all`);
  return response.json();
};

