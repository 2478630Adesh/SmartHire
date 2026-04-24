const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

async function extractTextFromFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  try {
    if (ext === '.pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text || '';
    }
    if (ext === '.docx') {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value || '';
    }
    if (ext === '.txt') {
      return fs.readFileSync(filePath, 'utf-8');
    }
    throw new Error('Unsupported file format. Use PDF, DOCX, or TXT.');
  } catch (err) {
    console.error('File parsing error:', err.message);
    throw err;
  }
}

module.exports = { extractTextFromFile };
