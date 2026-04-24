const Application = require('../models/Application');
const Job = require('../models/Job');
const Resume = require('../models/Resume');
const { computeATSScore, resumeToText } = require('../utils/atsScorer');

// @desc Apply to a job using a built resume
// @route POST /api/applications
exports.applyJob = async (req, res) => {
  try {
    const { jobId, resumeId, coverLetter } = req.body;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.status !== 'Open')
      return res.status(400).json({ message: 'This job is no longer accepting applications' });

    const resume = await Resume.findById(resumeId);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    if (resume.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not your resume' });

    const existing = await Application.findOne({ job: jobId, applicant: req.user._id });
    if (existing)
      return res.status(400).json({ message: 'You have already applied to this job' });

    const resumeText = resumeToText(resume);
    const jobText = `${job.title} ${job.description} ${job.requirements} ${(job.skills || []).join(' ')}`;
    const ats = computeATSScore(resumeText, jobText, job.skills || []);

    const app = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resume: resumeId,
      resumeText,
      atsScore: ats.score,
      matchedKeywords: ats.matchedKeywords,
      missingKeywords: ats.missingKeywords,
      coverLetter: coverLetter || '',
    });

    res.status(201).json({ application: app, ats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// @desc Get my applications
// @route GET /api/applications/my
exports.getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ applicant: req.user._id })
      .populate('job')
      .populate('resume', 'title templateId')
      .sort('-createdAt');
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get all applicants for a job (HR only, sorted by ATS score)
// @route GET /api/applications/job/:jobId
exports.getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.hr.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    const apps = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email phone')
      .populate('resume')
      .sort('-atsScore');

    res.json({ job, applications: apps });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Update application status (HR only)
// @route PUT /api/applications/:id/status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const app = await Application.findById(req.params.id).populate('job');
    if (!app) return res.status(404).json({ message: 'Application not found' });
    if (app.job.hr.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    app.status = status;
    await app.save();
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc HR dashboard stats
// @route GET /api/applications/hr/stats
exports.getHRStats = async (req, res) => {
  try {
    const jobs = await Job.find({ hr: req.user._id });
    const jobIds = jobs.map((j) => j._id);
    const totalApps = await Application.countDocuments({ job: { $in: jobIds } });
    const shortlisted = await Application.countDocuments({ job: { $in: jobIds }, status: 'Shortlisted' });
    const hired = await Application.countDocuments({ job: { $in: jobIds }, status: 'Hired' });
    const openJobs = jobs.filter((j) => j.status === 'Open').length;
    const avgScore = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: null, avg: { $avg: '$atsScore' } } },
    ]);
    res.json({
      totalJobs: jobs.length,
      openJobs,
      totalApplications: totalApps,
      shortlisted,
      hired,
      avgAtsScore: avgScore[0]?.avg ? Math.round(avgScore[0].avg) : 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
