// routes/analyticsRoutes.js
const express = require('express');
const { getTopUsers, getFilesReport } = require('../controllers/analyticsController'); // Import analytics controllers

const router = express.Router();

// Route to get top users
router.get('/top-users', getTopUsers);

// Route to get files report
router.get('/files-report', getFilesReport);

module.exports = router;