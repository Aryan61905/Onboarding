import React, { useState, useEffect } from 'react';

import './Data.css';

const Data = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/users');
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatBirthdate = (birth_date) => {
    if (!birth_date) return 'Not set';
    const date = new Date(birth_date);
    return date.toLocaleDateString();
  };
  
  const formatAddress = (user) => {
    if (!user.street) return 'Not set';
    return `${user.street}, ${user.city}, ${user.state} ${user.zip_code}`;
  };

  if (loading) return <div className="data-container">Loading user data...</div>;
  if (error) return <div className="data-container">Error: {error}</div>;

  return (
    <div className="data-container">
      <h1>User Data Dashboard</h1>
      <div className="controls">
        <button onClick={() => window.location.reload()} className="refresh-button">
          Refresh Data
        </button>
        <span className="update-notice">Auto-updates every 3 seconds</span>
      </div>

      <div className="table-wrapper">
        <table className="user-data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>About Me</th>
              <th>Address</th>
              <th>Birthdate</th>
              <th>Registered</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td className="about-cell">
                  {user.about_me || <span className="empty">Not provided</span>}
                </td>
                <td>{formatAddress(user)}</td>
                <td>{formatBirthdate(user.birth_date)}</td>
                <td>{new Date(user.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Data;