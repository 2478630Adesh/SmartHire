const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
    },
    resumeText: { type: String, default: '' },
    atsScore: { type: Number, default: 0 },
    matchedKeywords: [{ type: String }],
    missingKeywords: [{ type: String }],
    status: {
      type: String,
      enum: ['Applied', 'Shortlisted', 'Rejected', 'Hired'],
      default: 'Applied',
    },
    coverLetter: { type: String, default: '' },
  },
  { timestamps: true }
);

applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
