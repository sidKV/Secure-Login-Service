import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserDashboard = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/'; // Redirect if no token
        } else {
          const response = await axios.get('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUsername(response.data.username);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        alert(error.response?.data?.error || 'Failed to fetch user details');
        window.location.href = '/'; // Redirect on error
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/';
  };

  return (
    <div style={styles.container}>
      <h1>Hi, {username || 'Guest'}, welcome to the dashboard!</h1>
      <button style={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    color: '#fff',
  },
  logoutButton: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#007BFF',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
};

export default UserDashboard;
