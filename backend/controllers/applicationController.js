const Application = require('../models/Application');
const Job = require('../models/Job');
const Resume = require('../models/Resume');
const { computeATSScore, resumeToText } = require('../utils/atsScorer');
const { createNotification } = require('./notificationController');

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

    // Notifications (fire-and-forget, don't block response)
    createNotification({
      user: req.user._id,
      type: 'application',
      title: `Applied to ${job.title}`,
      message: `Your application was submitted with an ATS match of ${ats.score}%. Track its status in your dashboard.`,
      link: '/dashboard',
    });
    createNotification({
      user: job.hr,
      type: 'new_applicant',
      title: `New applicant for ${job.title}`,
      message: `${req.user.name} applied with an ATS match of ${ats.score}%.`,
      link: `/hr/job/${job._id}/applicants`,
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
    const oldStatus = app.status;
    app.status = status;
    await app.save();

    // Notify the applicant
    if (oldStatus !== status) {
      const statusMessages = {
        Shortlisted: { title: 'You\'ve been shortlisted! 🎉', msg: `Great news! You've been shortlisted for ${app.job.title} at ${app.job.company}.` },
        Rejected:    { title: 'Application update', msg: `Your application for ${app.job.title} at ${app.job.company} wasn't selected this time. Keep going!` },
        Hired:       { title: 'You got the job! 🎊', msg: `Congratulations! ${app.job.company} wants to hire you for ${app.job.title}.` },
        Applied:     { title: 'Status updated', msg: `Your application status for ${app.job.title} is now ${status}.` },
      };
      const m = statusMessages[status] || statusMessages.Applied;
      createNotification({
        user: app.applicant,
        type: 'status_change',
        title: m.title,
        message: m.msg,
        link: '/dashboard',
        meta: { applicationId: app._id, newStatus: status },
      });
    }
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
    const rejected = await Application.countDocuments({ job: { $in: jobIds }, status: 'Rejected' });
    const openJobs = jobs.filter((j) => j.status === 'Open').length;
    const avgScore = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      { $group: { _id: null, avg: { $avg: '$atsScore' } } },
    ]);

    // --- Applications over the last 14 days ---
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13);
    fourteenDaysAgo.setHours(0, 0, 0, 0);
    const appsTimeline = await Application.aggregate([
      { $match: { job: { $in: jobIds }, createdAt: { $gte: fourteenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    // Fill gaps (zero for days with no applications)
    const timelineMap = new Map(appsTimeline.map((x) => [x._id, x.count]));
    const timeline = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(fourteenDaysAgo);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      timeline.push({
        date: key,
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: timelineMap.get(key) || 0,
      });
    }

    // --- Score distribution buckets ---
    const scoreDistribution = [
      { bucket: '0-20',   label: 'Poor',        min: 0,  max: 20, count: 0 },
      { bucket: '21-40',  label: 'Weak',        min: 21, max: 40, count: 0 },
      { bucket: '41-60',  label: 'Fair',        min: 41, max: 60, count: 0 },
      { bucket: '61-80',  label: 'Good',        min: 61, max: 80, count: 0 },
      { bucket: '81-100', label: 'Excellent',   min: 81, max: 100, count: 0 },
    ];
    const allApps = await Application.find({ job: { $in: jobIds } }).select('atsScore matchedKeywords missingKeywords');
    for (const a of allApps) {
      const b = scoreDistribution.find((x) => a.atsScore >= x.min && a.atsScore <= x.max);
      if (b) b.count++;
    }

    // --- Status breakdown ---
    const statusBreakdown = [
      { status: 'Applied',     count: totalApps - shortlisted - rejected - hired, color: '#3B82F6' },
      { status: 'Shortlisted', count: shortlisted, color: '#10B981' },
      { status: 'Rejected',    count: rejected,    color: '#F43F5E' },
      { status: 'Hired',       count: hired,       color: '#F97316' },
    ].filter((x) => x.count > 0);

    // --- Top matched & missing keywords across all applications ---
    const kwCount = new Map();
    const missCount = new Map();
    for (const a of allApps) {
      (a.matchedKeywords || []).forEach((k) => kwCount.set(k, (kwCount.get(k) || 0) + 1));
      (a.missingKeywords || []).forEach((k) => missCount.set(k, (missCount.get(k) || 0) + 1));
    }
    const topMatched = Array.from(kwCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([keyword, count]) => ({ keyword, count }));
    const topMissing = Array.from(missCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([keyword, count]) => ({ keyword, count }));

    // --- Applications per job ---
    const perJob = await Promise.all(
      jobs.slice(0, 10).map(async (j) => {
        const c = await Application.countDocuments({ job: j._id });
        return { title: j.title, count: c };
      })
    );

    res.json({
      totalJobs: jobs.length,
      openJobs,
      totalApplications: totalApps,
      shortlisted,
      rejected,
      hired,
      avgAtsScore: avgScore[0]?.avg ? Math.round(avgScore[0].avg) : 0,
      timeline,
      scoreDistribution,
      statusBreakdown,
      topMatched,
      topMissing,
      perJob,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
