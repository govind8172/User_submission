const Submission = require('../models/Submission');
const User = require('../models/User');
const FileUpload = require('../models/FileUpload');
const { extractImageMetadata, extractPdfMetadata } = require('../services/fileService');
const Joi = require('joi'); // For validation 
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs'); 

dotenv.config();
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads/';

// Joi schema for submission creation
const createSubmissionSchema = Joi.object({
  title: Joi.string().min(5).required(),
  description: Joi.string().allow('').optional(),
  category: Joi.string().valid('Research', 'Application', 'Other').required(), // Example categories 
  userId: Joi.string().hex().length(24).required(), // Expecting ObjectId string
});

// @desc    Create a new form submission linked to a user
// @route   POST /api/submissions 
// @access  Public
const createSubmission = async (req, res, next) => {
  try {
    // Validate request body
    const { error: bodyError, value: bodyValue } = createSubmissionSchema.validate(req.body);
    if (bodyError) {
      // Clean up uploaded files if validation fails
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => fs.unlinkSync(file.path));
      }
      return res.status(400).json({ message: bodyError.details[0].message });
    }

    const { title, description, category, userId } = bodyValue;

    const userExists = await User.findById(userId);
    if (!userExists) {
      // Clean up uploaded files if user doesn't exist
      if (req.files && req.files.length > 0) {
        req.files.forEach(file => fs.unlinkSync(file.path));
      }
      return res.status(404).json({ message: 'User not found' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded for submission' });
    }

    const fileUploadPromises = req.files.map(async (file) => {
      const fileType = file.mimetype.startsWith('image/') ? 'image' : 'pdf';
      let fileMeta = {};

      if (fileType === 'image') {
        fileMeta = await extractImageMetadata(file.path); // Extract metadata: width and height using sharp or image-size 
      } else if (fileType === 'pdf') {
        fileMeta = await extractPdfMetadata(file.path); // Extract metadata: page count using pdf-parse or pdfjs-dist 
      }

      if (!fileMeta) {
        throw new Error(`Failed to extract metadata for file: ${file.originalname}`);
      }

      const fileUpload = await FileUpload.create({
        submissionId: null, // Will be linked after submission is created
        fileType, // 'image' or 'pdf' 
        fileName: file.filename,
        fileUrl: path.join(UPLOAD_DIR, file.filename), // Adjust URL based on your serving strategy
        fileMeta,
      });
      return fileUpload._id;
    });

    const uploadedFileIds = await Promise.all(fileUploadPromises);

    const submission = await Submission.create({
      title,
      description,
      category,
      userId,
      files: uploadedFileIds, // Store reference to user and files 
    });

    // Update FileUpload documents with the submissionId
    await FileUpload.updateMany(
      { _id: { $in: uploadedFileIds } },
      { $set: { submissionId: submission._id } }
    );

    res.status(201).json(submission);
  } catch (error) {
    // If an error occurs, delete the uploaded files to prevent orphan files
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        try {
          fs.unlinkSync(file.path);
        } catch (unlinkError) {
          console.error(`Failed to delete uploaded file ${file.path}:`, unlinkError);
        }
      });
    }
    next(error);
  }
};

// @desc    Get full details of a submission
// @route   GET /api/submissions/:id 
// @access  Public
const getSubmissionDetails = async (req, res, next) => {
  try {
    const submissionId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(submissionId)) {
      return res.status(400).json({ message: 'Invalid Submission ID' });
    }

    const submission = await Submission.findById(submissionId)
      .populate('userId', 'name email') // Associated user info 
      .populate('files', 'fileType fileName fileUrl fileMeta uploadedAt'); // File data with metadata 

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    res.status(200).json(submission);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSubmission,
  getSubmissionDetails,
};