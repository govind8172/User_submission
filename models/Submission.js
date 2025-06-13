const mongoose = require('mongoose');

const submissionSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String, // e.g., "Research", "Application" 
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User 
    ref: 'User',
    required: true,
  },
  files: [
    {
      type: mongoose.Schema.Types.ObjectId, // References to FileUpload 
      ref: 'FileUpload',
    },
  ],
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;