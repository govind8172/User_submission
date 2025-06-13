const sharp = require('sharp');
const pdf = require('pdf-parse');
const fs = require('fs');

const extractImageMetadata = async (filePath) => {
  try {
    const metadata = await sharp(filePath).metadata();
    return {
      size: fs.statSync(filePath).size,
      dimensions: {
        width: metadata.width,
        height: metadata.height,
      },
    };
  } catch (error) {
    console.error(`Error extracting image metadata from ${filePath}:`, error);
    return null;
  }
};

const extractPdfMetadata = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return {
      size: fs.statSync(filePath).size,
      pageCount: data.numpages,
    };
  } catch (error) {
    console.error(`Error extracting PDF metadata from ${filePath}:`, error);
    return null;
  }
};

module.exports = {
  extractImageMetadata,
  extractPdfMetadata,
};