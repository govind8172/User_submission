const express = require('express');
const { createSubmission, getSubmissionDetails } = require('../controllers/submissionController');
const upload = require('../middleware/multer'); // Multer for upload handling. 

const router = express.Router();

router.post('/', upload.array('files', 10), createSubmission); // Accept multiple files 
router.get('/:id', getSubmissionDetails); // GET/api/submissions/:id 

module.exports = router;