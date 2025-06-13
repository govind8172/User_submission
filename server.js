const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const errorHandler = require('./middleware/errorHandler');
const path = require('path');
const cors = require('cors'); // Import the cors package

dotenv.config();

connectDB();

const app = express();

// Use CORS middleware - add this line
// For development, allowing all origins is fine.
// In production, you would restrict this to your actual frontend domain.
app.use(cors({
  origin: 'http://localhost:5173' // Allow requests from your React frontend's origin
}));

app.use(express.json());

// Serve static files (for uploaded files)
app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads')));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});