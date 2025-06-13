import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import apiService from '../services/api';

function SubmissionDetails() {
  const { id } = useParams(); // Get the ID from the URL
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await apiService.getSubmissionDetails(id);
        setSubmission(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching submission details.');
        setLoading(false);
        console.error(err);
      }
    };
    fetchSubmission();
  }, [id]);

  if (loading) {
    return <div className="page-container">Loading submission details...</div>;
  }

  if (error) {
    return <div className="page-container error-message">{error}</div>;
  }

  if (!submission) {
    return <div className="page-container">No submission found.</div>;
  }

  return (
    <div className="page-container">
      <h1>Submission Details: {submission.title}</h1>
      <p><strong>Description:</strong> {submission.description}</p>
      <p><strong>Category:</strong> {submission.category}</p>
      <p><strong>Submitted By:</strong> {submission.userId?.name} ({submission.userId?.email})</p>
      <p><strong>Submitted At:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>

      <h2>Associated Files:</h2>
      {submission.files && submission.files.length > 0 ? (
        <ul>
          {submission.files.map((file) => (
            <li key={file._id}>
              <p><strong>File Name:</strong> {file.fileName}</p>
              <p><strong>Type:</strong> {file.fileType}</p>
              <p><strong>Size:</strong> {(file.fileMeta.size / 1024).toFixed(2)} KB</p>
              {file.fileType === 'image' && file.fileMeta.dimensions && (
                <p><strong>Dimensions:</strong> {file.fileMeta.dimensions.width}x{file.fileMeta.dimensions.height}</p>
              )}
              {file.fileType === 'pdf' && file.fileMeta.pageCount && (
                <p><strong>Page Count:</strong> {file.fileMeta.pageCount}</p>
              )}
              {/* Display the file if it's an image, or a link for PDF */}
              {file.fileType === 'image' ? (
                <img src={`http://localhost:5000/${file.fileUrl}`} alt={file.fileName} style={{ maxWidth: '200px', maxHeight: '200px' }} />
              ) : (
                <a href={`http://localhost:5000/${file.fileUrl}`} target="_blank" rel="noopener noreferrer">View PDF</a>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No files associated with this submission.</p>
      )}
    </div>
  );
}

export default SubmissionDetails;