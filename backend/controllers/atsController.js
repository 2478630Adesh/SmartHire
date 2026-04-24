const { computeATSScore, resumeToText } = require('../utils/atsScorer');
const { extractTextFromFile } = require('../utils/fileParser');
const { analyzeResumeQuality } = require('../utils/resumeQuality');
const Resume = require('../models/Resume');
const fs = require('fs');

// @desc Analyze a built resume against a pasted job description
// @route POST /api/ats/analyze-resume
exports.analyzeBuiltResume = async (req, res) => {
  try {
    const { resumeId, jobDescription } = req.body;
    if (!resumeId || !jobDescription)
      return res.status(400).json({ message: 'resumeId and jobDescription are required' });
    const resume = await Resume.findById(resumeId);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    if (resume.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not your resume' });

    const resumeText = resumeToText(resume);
    const ats = computeATSScore(resumeText, jobDescription);
    const quality = analyzeResumeQuality(resumeText);
    res.json({
      ...ats,
      extractedText: resumeText,
      source: 'saved',
      wordCount: resumeText.split(/\s+/).filter(Boolean).length,
      quality,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Analyze an uploaded resume file against a pasted job description
// @route POST /api/ats/analyze-upload  (multipart: resume file + jobDescription field)
exports.analyzeUploadedResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Resume file is required' });
    const { jobDescription } = req.body;
    if (!jobDescription)
      return res.status(400).json({ message: 'jobDescription is required' });

    const resumeText = await extractTextFromFile(req.file.path);
    if (!resumeText || resumeText.trim().length < 20) {
      try { fs.unlinkSync(req.file.path); } catch {}
      return res.status(400).json({
        message: 'Could not extract enough text from the file. If it is a scanned PDF, please upload a text-based PDF or DOCX.',
      });
    }
    const ats = computeATSScore(resumeText, jobDescription);
    const quality = analyzeResumeQuality(resumeText);

    try { fs.unlinkSync(req.file.path); } catch {}

    res.json({
      ...ats,
      extractedText: resumeText,
      source: 'uploaded',
      fileName: req.file.originalname,
      wordCount: resumeText.split(/\s+/).filter(Boolean).length,
      quality,
    });
  } catch (err) {
    if (req.file) { try { fs.unlinkSync(req.file.path); } catch {} }
    res.status(500).json({ message: err.message });
  }
};

// @desc General resume health check (no job description) — just structural
// @route POST /api/ats/check-upload
exports.checkUploadedResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Resume file is required' });
    const resumeText = await extractTextFromFile(req.file.path);
    const genericJD =
      'professional experience education skills communication teamwork leadership problem solving project management responsibilities achievements';
    const ats = computeATSScore(resumeText, genericJD);

    try { fs.unlinkSync(req.file.path); } catch {}
    res.json({
      ...ats,
      extractedText: resumeText,
      source: 'uploaded',
      fileName: req.file.originalname,
      wordCount: resumeText.split(/\s+/).filter(Boolean).length,
    });
  } catch (err) {
    if (req.file) { try { fs.unlinkSync(req.file.path); } catch {} }
    res.status(500).json({ message: err.message });
  }
};
