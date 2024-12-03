import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css';


const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    username: '',
    email: '',
    role: 'user',
    password: '',
  });

  const [isEdit, setIsEdit] = useState(false);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (error) {
      alert(error.response?.data?.error || 'Error fetching users');
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if (isEdit) {
        await axios.put(`/api/user/${formData.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('/api/user', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchUsers();
      setFormData({ id: '', username: '', email: '', role: 'user', password: '' });
      setIsEdit(false);
    } catch (error) {
      alert(error.response?.data?.error || 'Error creating/updating user');
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.error || 'Error deleting user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setFormData({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      password: '', // Password is not updated here
    });
    setIsEdit(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/';
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      <button className="logout-button" onClick={handleLogout}>
  Logout
</button>

      <form onSubmit={handleCreateOrUpdate}>
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required={!isEdit} // Password is required only for new users
        />
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">{isEdit ? 'Update' : 'Create'}</button>
      </form>

      <table style={{ width: '100%', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Edit</button>
                <button onClick={() => handleDelete(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default AdminDashboard;
