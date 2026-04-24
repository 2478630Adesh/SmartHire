const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    hr: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, default: 'Remote' },
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
      default: 'Full-time',
    },
    experience: { type: String, default: 'Entry-level' },
    salary: { type: String, default: '' },
    description: { type: String, required: true },
    requirements: { type: String, default: '' },
    skills: [{ type: String }],
    status: {
      type: String,
      enum: ['Open', 'Closed'],
      default: 'Open',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
