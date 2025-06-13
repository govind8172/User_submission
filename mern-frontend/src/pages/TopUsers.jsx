import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

function TopUsers() {
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const response = await apiService.getTopUsers();
        setTopUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching top users.');
        setLoading(false);
        console.error(err);
      }
    };
    fetchTopUsers();
  }, []);

  if (loading) {
    return <div className="page-container">Loading top users report...</div>;
  }

  if (error) {
    return <div className="page-container error-message">{error}</div>;
  }

  return (
    <div className="page-container">
      <h1>Top 3 Users by Submissions</h1>
      {topUsers.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>User Name</th>
              <th>Total Submissions</th>
            </tr>
          </thead>
          <tbody>
            {topUsers.map((user, index) => (
              <tr key={user.userId}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.totalSubmissions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No top users data available yet. Make some submissions!</p>
      )}
    </div>
  );
}

export default TopUsers;