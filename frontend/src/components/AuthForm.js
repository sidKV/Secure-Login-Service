import React, { useState } from 'react';
import axios from 'axios';

const AuthForm = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  // Base API URL
  const BASE_URL = 'http://localhost:5000/api/auth';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegister ? `${BASE_URL}/register` : `${BASE_URL}/login`;

    try {
      const response = await axios.post(endpoint, formData);
      const { token, role } = response.data;

      if (!isRegister) {
        // Store token and role in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        // Redirect user based on role
        window.location.href = role === 'admin' ? '/admin' : '/user';
      } else {
        // Show success message and switch to login
        alert('Registration successful. Please log in.');
        setIsRegister(false);
      }
    } catch (err) {
      // Handle server errors
      setError(err.response?.data?.error || 'Something went wrong');
      if (err.response?.status === 401) {
        alert('Unauthorized: Invalid credentials');
      } else if (err.response?.status === 500) {
        alert('Server error: Please try again later');
      }
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2>{isRegister ? 'Register' : 'Login'}</h2>

        {error && <p style={styles.error}>{error}</p>}

        {isRegister && (
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            style={styles.input}
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          {isRegister ? 'Register' : 'Login'}
        </button>

        <p style={styles.switchText}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <span style={styles.switchLink} onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? ' Login' : ' Register'}
          </span>
        </p>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  form: {
    width: '100%',
    maxWidth: '400px',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007BFF',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
  switchText: {
    fontSize: '14px',
    color: '#666',
  },
  switchLink: {
    color: '#007BFF',
    cursor: 'pointer',
    marginLeft: '5px',
  },
};

export default AuthForm;
