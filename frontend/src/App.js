import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';

const App = () => {
  // Track login status and role in state
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  // Listen for token/role changes in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    setIsLoggedIn(!!token); // Update login status
    setRole(userRole);      // Update role
  }, []);

  return (
    <Router>
      <Routes>
        {/* Home route: Show AuthForm if not logged in, redirect based on role if logged in */}
        <Route
          path="/"
          element={
            !isLoggedIn ? (
              <AuthForm />
            ) : role === 'admin' ? (
              <Navigate to="/admin" />
            ) : (
              <Navigate to="/user" />
            )
          }
        />

        {/* Admin Dashboard route */}
        <Route
          path="/admin"
          element={role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />}
        />

        {/* User Dashboard route */}
        <Route
          path="/user"
          element={role === 'user' ? <UserDashboard /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
