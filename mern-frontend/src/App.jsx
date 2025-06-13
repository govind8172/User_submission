import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CreateUser from './pages/CreateUser';
import SubmissionForm from './pages/SubmissionForm';
import SubmissionDetails from './pages/SubmissionDetails';
import TopUsers from './pages/TopUsers';
import FilesReport from './pages/FilesReport';
import './App.css'; // Your main CSS file

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            <ul>
              <li><Link to="/create-user">Create User</Link></li>
              <li><Link to="/submit">New Submission</Link></li>
              <li><Link to="/analytics/top-users">Top Users</Link></li>
              <li><Link to="/analytics/files-report">Files Report</Link></li>
            </ul>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/create-user" element={<CreateUser />} />
            <Route path="/submit" element={<SubmissionForm />} />
            <Route path="/submissions/:id" element={<SubmissionDetails />} />
            <Route path="/analytics/top-users" element={<TopUsers />} />
            <Route path="/analytics/files-report" element={<FilesReport />} />
            <Route path="/" element={<h2>Welcome to the Submission Tracker!</h2>} />
            {/* Catch-all for undefined routes */}
            <Route path="*" element={<h3>Page Not Found</h3>} />
          </Routes>
        </main>

        <footer>
          <p>&copy; 2025 Submission Tracker</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;