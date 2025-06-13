const Submission = require('../models/Submission');
const FileUpload = require('../models/FileUpload'); // Corrected import path

// @desc    Return top 3 users who made the most submissions
// @route   GET /api/analytics/top-users
// @access  Public
const getTopUsers = async (req, res, next) => {
  try {
    const topUsers = await Submission.aggregate([
      {
        $group: {
          _id: '$userId',
          totalSubmissions: { $sum: 1 },
        },
      },
      {
        $sort: { totalSubmissions: -1 },
      },
      {
        $limit: 3, // Top 3 users
      },
      {
        $lookup: {
          from: 'users', // The collection name for the User model
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $unwind: '$userDetails', // Unwind the userDetails array
      },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          name: '$userDetails.name',
          totalSubmissions: 1,
        },
      },
    ]);
    res.status(200).json(topUsers);
  } catch (error) {
    console.error("Error in getTopUsers aggregation:", error);
    next(error); // Pass the error to the error handling middleware
  }
};

// @desc    Return report grouped by submission category and file type
// @route   GET /api/analytics/files-report
// @access  Public
const getFilesReport = async (req, res, next) => {
  try {
    const filesReport = await Submission.aggregate([
      {
        $lookup: {
          from: 'fileuploads', // The collection name for the FileUpload model
          localField: 'files',
          foreignField: '_id',
          as: 'uploadedFiles',
        },
      },
      {
        $unwind: '$uploadedFiles',
      },
      {
        $group: {
          _id: {
            category: '$category',
            fileType: '$uploadedFiles.fileType',
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.category',
          fileCounts: {
            $push: {
              k: '$_id.fileType',
              v: '$count',
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          fileTypes: { $arrayToObject: '$fileCounts' },
        },
      },
      {
        $group: {
          _id: null,
          report: { $push: { k: '$category', v: '$fileTypes' } },
        },
      },
      {
        $replaceRoot: { newRoot: { $arrayToObject: '$report' } },
      },
    ]);

    // If no data, return an empty object or a more appropriate default structure
    res.status(200).json(filesReport[0] || {});
  } catch (error) {
    console.error("Error in getFilesReport aggregation:", error);
    next(error); // Pass the error to the error handling middleware
  }
};

module.exports = {
  getTopUsers,
  getFilesReport,
};