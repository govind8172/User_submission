const mongoose = require('mongoose');

const fileUploadSchema = mongoose.Schema({
  submissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Submission',
    // required: true, // <--- REMOVE OR COMMENT OUT THIS LINE
  },
  fileType: {
    type: String, // 'image' or 'pdf'
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileMeta: {
    size: { type: Number, required: true },
    dimensions: {
      width: Number, // for image
      height: Number, // for image
    },
    pageCount: Number, // for pdf
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const FileUpload = mongoose.model('FileUpload', fileUploadSchema);
module.exports = FileUpload;