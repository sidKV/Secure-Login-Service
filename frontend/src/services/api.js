import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    if (error.response?.status === 401) {
      throw new Error('Invalid credentials. Please try again.');
    } else {
      throw new Error('Something went wrong. Please try again later.');
    }
  }
};
