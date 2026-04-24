const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc Create job (HR only)
// @route POST /api/jobs
exports.createJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      hr: req.user._id,
      company: req.body.company || req.user.company || 'SmartHireX',
    });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get all open jobs (public-ish, requires auth for the full view)
// @route GET /api/jobs
exports.getJobs = async (req, res) => {
  try {
    const { search, location, type } = req.query;
    const filter = { status: 'Open' };
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { company: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') },
      ];
    }
    if (location) filter.location = new RegExp(location, 'i');
    if (type) filter.type = type;
    const jobs = await Job.find(filter).sort('-createdAt').populate('hr', 'name company');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get one job
// @route GET /api/jobs/:id
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('hr', 'name company');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get jobs posted by current HR
// @route GET /api/jobs/my/posts
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ hr: req.user._id }).sort('-createdAt');
    const withCounts = await Promise.all(
      jobs.map(async (j) => {
        const applicationCount = await Application.countDocuments({ job: j._id });
        return { ...j.toObject(), applicationCount };
      })
    );
    res.json(withCounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Update job
// @route PUT /api/jobs/:id
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.hr.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Delete job
// @route DELETE /api/jobs/:id
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.hr.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await Application.deleteMany({ job: job._id });
    await job.deleteOne();
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
