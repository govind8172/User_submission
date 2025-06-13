import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Replace with your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiService = {
  // User APIs
  createUser: (userData) => api.post('/users', userData),
  getAllUsers: () => api.get('/users'), // Might need this for selecting a user in submission form

  // Submission APIs
  createSubmission: (formData) => api.post('/submissions', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Important for file uploads
    },
  }),
  getSubmissionDetails: (id) => api.get(`/submissions/${id}`),

  // Analytics APIs
  getTopUsers: () => api.get('/analytics/top-users'),
  getFilesReport: () => api.get('/analytics/files-report'),
};

export default apiService;