const Resume = require('../models/Resume');

// @desc Create resume
// @route POST /api/resumes
exports.createResume = async (req, res) => {
  try {
    const data = { ...req.body, user: req.user._id };
    const resume = await Resume.create(data);
    res.status(201).json(resume);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get all my resumes
// @route GET /api/resumes
exports.getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort('-updatedAt');
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get single resume
// @route GET /api/resumes/:id
exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(resume);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Update resume
// @route PUT /api/resumes/:id
exports.updateResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    Object.assign(resume, req.body);
    await resume.save();
    res.json(resume);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Delete resume
// @route DELETE /api/resumes/:id
exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    if (resume.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await resume.deleteOne();
    res.json({ message: 'Resume deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
