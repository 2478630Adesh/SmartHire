const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, default: 'Untitled Resume' },
    templateId: { type: String, default: 'template1' },
    personalInfo: {
      fullName: { type: String, default: '' },
      jobTitle: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      address: { type: String, default: '' },
      website: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      summary: { type: String, default: '' },
      photo: { type: String, default: '' },
    },
    experience: [
      {
        jobTitle: String,
        company: String,
        location: String,
        startDate: String,
        endDate: String,
        current: { type: Boolean, default: false },
        description: String,
      },
    ],
    education: [
      {
        degree: String,
        institution: String,
        location: String,
        startDate: String,
        endDate: String,
        gpa: String,
        description: String,
      },
    ],
    skills: [{ type: String }],
    projects: [
      {
        name: String,
        description: String,
        technologies: String,
        link: String,
      },
    ],
    certifications: [
      {
        name: String,
        issuer: String,
        date: String,
        link: String,
      },
    ],
    languages: [
      {
        name: String,
        proficiency: String,
      },
    ],
    achievements: [{ type: String }],
    colors: {
      primary: { type: String, default: '#0A66C2' },
      accent: { type: String, default: '#1E293B' },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);
