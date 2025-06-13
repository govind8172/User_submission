import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

function SubmissionForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(''); // Default or select from options
  const [userId, setUserId] = useState('');
  const [files, setFiles] = useState([]); // Array of File objects
  const [users, setUsers] = useState([]); // List of users for dropdown
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiService.getAllUsers();
        setUsers(response.data);
        setLoadingUsers(false);
      } catch (err) {
        setError('Error fetching users. Please create a user first.');
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  const handleFileChange = (e) => {
    // Convert FileList to Array and filter for allowed types
    const selectedFiles = Array.from(e.target.files).filter(file => {
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      return allowedTypes.includes(file.type);
    });
    setFiles(selectedFiles);
    if (selectedFiles.length !== e.target.files.length) {
      alert('Only .jpg, .png, and .pdf files are allowed and have been selected.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!userId) {
      setError('Please select a user.');
      return;
    }
    if (files.length === 0) {
      setError('Please upload at least one file.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('userId', userId);
    files.forEach(file => {
      formData.append('files', file); // 'files' is the field name Multer expects
    });

    try {
      const response = await apiService.createSubmission(formData);
      setMessage(`Submission "${response.data.title}" created successfully!`);
      // Clear form
      setTitle('');
      setDescription('');
      setCategory('');
      setUserId('');
      setFiles([]);
      // Clear file input manually
      document.getElementById('files').value = '';

    } catch (err) {
      setError(err.response?.data?.message || 'Error creating submission.');
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <h1>New Submission</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option value="Research">Research</option>
            <option value="Application">Application</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="userId">User:</label>
          {loadingUsers ? (
            <p>Loading users...</p>
          ) : (
            <select
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            >
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          )}
        </div>
        <div>
          <label htmlFor="files">Upload Files (JPG, PNG, PDF):</label>
          <input
            type="file"
            id="files"
            multiple
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.pdf"
          />
          {files.length > 0 && <p>{files.length} files selected.</p>}
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default SubmissionForm;