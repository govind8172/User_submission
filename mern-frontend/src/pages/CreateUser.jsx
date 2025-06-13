import React, { useState } from 'react';
import apiService from '../services/api';

function CreateUser() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await apiService.createUser({ name, email });
      setMessage(`User created: ${response.data.name} (${response.data.email})`);
      setName('');
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating user.');
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <h1>Create New User</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create User</button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default CreateUser;