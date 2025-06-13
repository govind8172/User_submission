import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

function FilesReport() {
  const [report, setReport] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFilesReport = async () => {
      try {
        const response = await apiService.getFilesReport();
        setReport(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching files report.');
        setLoading(false);
        console.error(err);
      }
    };
    fetchFilesReport();
  }, []);

  if (loading) {
    return <div className="page-container">Loading files report...</div>;
  }

  if (error) {
    return <div className="page-container error-message">{error}</div>;
  }

  const categories = Object.keys(report);

  return (
    <div className="page-container">
      <h1>Files Report by Category and Type</h1>
      {categories.length > 0 ? (
        <div>
          {categories.map((category) => (
            <div key={category} className="category-report-card">
              <h2>{category}</h2>
              <p>PDFs: {report[category].pdf || 0}</p>
              <p>Images: {report[category].image || 0}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No file report data available yet. Make some submissions with files!</p>
      )}
    </div>
  );
}

export default FilesReport;