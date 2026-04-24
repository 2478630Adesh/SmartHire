// Run with: node utils/seed.js
// Creates demo accounts, jobs, resumes, and applications

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Resume = require('../models/Resume');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { computeATSScore, resumeToText } = require('./atsScorer');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Clearing old data...');
  await Promise.all([
    User.deleteMany({}),
    Resume.deleteMany({}),
    Job.deleteMany({}),
    Application.deleteMany({}),
  ]);

  const hash = (p) => bcrypt.hashSync(p, 10);

  // --- Users ---
  const hr = await User.create({
    name: 'Priya Sharma',
    email: 'hr@smarthirex.com',
    password: 'hr12345',
    role: 'hr',
    company: 'TechCorp India',
  });
  const hr2 = await User.create({
    name: 'Rahul Mehta',
    email: 'rahul@innovatech.com',
    password: 'hr12345',
    role: 'hr',
    company: 'InnovaTech Solutions',
  });

  const user1 = await User.create({
    name: 'Aarav Kumar',
    email: 'user@smarthirex.com',
    password: 'user12345',
    role: 'user',
  });
  const user2 = await User.create({
    name: 'Sneha Iyer',
    email: 'sneha@example.com',
    password: 'user12345',
    role: 'user',
  });
  const user3 = await User.create({
    name: 'Vikram Rao',
    email: 'vikram@example.com',
    password: 'user12345',
    role: 'user',
  });

  console.log('✓ Users created');

  // --- Resumes ---
  const resume1 = await Resume.create({
    user: user1._id,
    title: 'Full Stack Developer Resume',
    templateId: 'template1',
    personalInfo: {
      fullName: 'Aarav Kumar',
      jobTitle: 'Full Stack Developer',
      email: 'user@smarthirex.com',
      phone: '+91 98765 43210',
      address: 'Chennai, India',
      website: 'https://aaravkumar.dev',
      linkedin: 'linkedin.com/in/aaravkumar',
      github: 'github.com/aaravkumar',
      summary:
        'Passionate full-stack developer with 3+ years building scalable web applications using React, Node.js, and MongoDB. Strong focus on clean code, REST APIs, and responsive UI design.',
    },
    experience: [
      {
        jobTitle: 'Software Engineer',
        company: 'Zyntra Labs',
        location: 'Bengaluru',
        startDate: 'Jun 2023',
        endDate: 'Present',
        current: true,
        description:
          'Built a multi-tenant SaaS dashboard in React and Node.js. Designed REST APIs in Express, integrated MongoDB aggregations, and deployed on AWS EC2. Improved page load by 40% using code splitting and lazy loading.',
      },
      {
        jobTitle: 'Frontend Developer Intern',
        company: 'Pixelcraft Studios',
        location: 'Chennai',
        startDate: 'Jan 2023',
        endDate: 'May 2023',
        description:
          'Developed pixel-perfect UIs in React and Tailwind CSS from Figma designs. Integrated REST APIs and improved Lighthouse accessibility score from 72 to 95.',
      },
    ],
    education: [
      {
        degree: 'B.Tech in Computer Science',
        institution: 'Anna University',
        location: 'Chennai',
        startDate: '2019',
        endDate: '2023',
        gpa: '8.6 / 10',
      },
    ],
    skills: [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Express', 'MongoDB',
      'PostgreSQL', 'REST API', 'GraphQL', 'Docker', 'AWS', 'Git', 'Jest', 'Tailwind CSS',
    ],
    projects: [
      {
        name: 'SmartHireX',
        description: 'MERN-stack resume builder with ATS analyzer and HR dashboard.',
        technologies: 'React, Node.js, Express, MongoDB',
        link: 'github.com/aaravkumar/smarthirex',
      },
      {
        name: 'ShopSphere',
        description: 'E-commerce platform with Stripe payments, product reviews, and admin panel.',
        technologies: 'Next.js, MongoDB, Stripe, Tailwind',
        link: 'github.com/aaravkumar/shopsphere',
      },
    ],
    certifications: [
      { name: 'AWS Certified Cloud Practitioner', issuer: 'Amazon', date: '2024' },
      { name: 'Meta Front-End Developer', issuer: 'Coursera', date: '2023' },
    ],
    languages: [
      { name: 'English', proficiency: 'Professional' },
      { name: 'Hindi', proficiency: 'Native' },
      { name: 'Tamil', proficiency: 'Conversational' },
    ],
    achievements: [
      'Winner — Smart India Hackathon 2022 (Software Edition)',
      'Open source contributor with 200+ GitHub stars across repos',
    ],
    colors: { primary: '#0A66C2', accent: '#1E293B' },
  });

  const resume2 = await Resume.create({
    user: user2._id,
    title: 'Data Scientist Resume',
    templateId: 'template3',
    personalInfo: {
      fullName: 'Sneha Iyer',
      jobTitle: 'Data Scientist',
      email: 'sneha@example.com',
      phone: '+91 99887 12345',
      address: 'Bengaluru, India',
      linkedin: 'linkedin.com/in/snehaiyer',
      summary:
        'Data scientist with expertise in machine learning, NLP, and large-scale data pipelines. Experienced in Python, TensorFlow, and productionizing ML models.',
    },
    experience: [
      {
        jobTitle: 'Data Scientist',
        company: 'Quantix AI',
        location: 'Bengaluru',
        startDate: 'Aug 2022',
        endDate: 'Present',
        current: true,
        description:
          'Built NLP classification models using PyTorch. Deployed ML services on AWS SageMaker, serving 10M predictions/day. Led data visualization initiatives with Tableau.',
      },
    ],
    education: [
      {
        degree: 'M.Sc. Data Science',
        institution: 'IIT Madras',
        location: 'Chennai',
        startDate: '2020',
        endDate: '2022',
        gpa: '9.1 / 10',
      },
    ],
    skills: [
      'Python', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn',
      'SQL', 'Tableau', 'Power BI', 'AWS SageMaker', 'NLP', 'Machine Learning',
    ],
    projects: [
      {
        name: 'Sentiment Analysis Engine',
        description: 'Production-grade sentiment classifier trained on 2M tweets with 94% accuracy.',
        technologies: 'Python, PyTorch, FastAPI',
      },
    ],
    colors: { primary: '#7C3AED', accent: '#1E1B4B' },
  });

  const resume3 = await Resume.create({
    user: user3._id,
    title: 'Product Manager Resume',
    templateId: 'template5',
    personalInfo: {
      fullName: 'Vikram Rao',
      jobTitle: 'Product Manager',
      email: 'vikram@example.com',
      phone: '+91 90000 11122',
      address: 'Mumbai, India',
      summary:
        'Product manager with 5 years turning customer insights into shipped products. Led cross-functional teams to launch 8 features, driving 30% DAU growth.',
    },
    experience: [
      {
        jobTitle: 'Senior Product Manager',
        company: 'Nimbus Systems',
        location: 'Mumbai',
        startDate: 'Mar 2021',
        endDate: 'Present',
        current: true,
        description:
          'Owned roadmap for B2B SaaS product. Led agile sprints with engineering, design, and data teams. Launched mobile app reaching 500K users.',
      },
    ],
    education: [
      {
        degree: 'MBA',
        institution: 'IIM Bangalore',
        location: 'Bengaluru',
        startDate: '2018',
        endDate: '2020',
      },
    ],
    skills: [
      'Product Management', 'Agile', 'Scrum', 'Roadmap', 'Jira', 'Figma',
      'SQL', 'Analytics', 'A/B Testing', 'Stakeholder Management', 'Leadership',
    ],
    colors: { primary: '#EA580C', accent: '#1C1917' },
  });

  console.log('✓ Resumes created');

  // --- Jobs ---
  const job1 = await Job.create({
    hr: hr._id,
    title: 'Full Stack Developer (MERN)',
    company: 'TechCorp India',
    location: 'Bengaluru (Hybrid)',
    type: 'Full-time',
    experience: '2-4 years',
    salary: '₹12-18 LPA',
    description:
      'We are hiring a full-stack developer to build and maintain a SaaS platform. You will work across React, Node.js, Express, and MongoDB to deliver scalable features, REST APIs, and responsive UI. Experience with AWS, Docker, and CI/CD is a plus.',
    requirements:
      'Strong JavaScript and TypeScript. Deep knowledge of React hooks, state management, and REST API design. MongoDB aggregation pipelines, Git workflows, and unit testing with Jest.',
    skills: ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'TypeScript', 'REST API', 'Git', 'AWS', 'Docker'],
  });

  const job2 = await Job.create({
    hr: hr._id,
    title: 'Data Scientist',
    company: 'TechCorp India',
    location: 'Remote',
    type: 'Full-time',
    experience: '3-5 years',
    salary: '₹18-25 LPA',
    description:
      'Looking for a data scientist to build NLP and ML models. You will work with large datasets, train deep learning models, deploy on AWS SageMaker, and communicate findings through Tableau dashboards.',
    requirements:
      'Strong Python, TensorFlow or PyTorch, SQL, and experience productionizing ML models. Background in NLP preferred.',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'NLP', 'SQL', 'AWS', 'Tableau', 'Pandas', 'NumPy'],
  });

  const job3 = await Job.create({
    hr: hr2._id,
    title: 'Product Manager — Growth',
    company: 'InnovaTech Solutions',
    location: 'Mumbai',
    type: 'Full-time',
    experience: '4-6 years',
    salary: '₹22-30 LPA',
    description:
      'Drive product strategy and growth for our B2B SaaS platform. Own the roadmap, lead cross-functional teams, define OKRs, and run A/B tests to optimize activation and retention.',
    requirements:
      'Proven product management experience with agile teams. Strong analytical skills, SQL proficiency, stakeholder communication, and familiarity with tools like Jira and Figma.',
    skills: ['Product Management', 'Agile', 'Scrum', 'Roadmap', 'SQL', 'A/B Testing', 'Analytics', 'Jira', 'Figma', 'Leadership'],
  });

  const job4 = await Job.create({
    hr: hr2._id,
    title: 'Frontend Developer Intern',
    company: 'InnovaTech Solutions',
    location: 'Chennai',
    type: 'Internship',
    experience: 'Entry-level',
    salary: '₹25,000/month',
    description:
      'Internship for final-year students. Work on production React apps, contribute to design system, and build accessible, responsive UIs.',
    requirements:
      'React, JavaScript, HTML, CSS, Tailwind. Familiarity with Git and responsive design.',
    skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Git', 'Responsive Design'],
  });

  console.log('✓ Jobs created');

  // --- Applications (with live ATS scoring) ---
  async function apply(user, resume, job) {
    const text = resumeToText(resume);
    const jd = `${job.title} ${job.description} ${job.requirements} ${job.skills.join(' ')}`;
    const ats = computeATSScore(text, jd, job.skills);
    await Application.create({
      job: job._id,
      applicant: user._id,
      resume: resume._id,
      resumeText: text,
      atsScore: ats.score,
      matchedKeywords: ats.matchedKeywords,
      missingKeywords: ats.missingKeywords,
    });
  }

  await apply(user1, resume1, job1); // strong match
  await apply(user2, resume2, job1); // weaker match
  await apply(user2, resume2, job2); // strong match
  await apply(user3, resume3, job3); // strong match
  await apply(user1, resume1, job4); // strong match

  console.log('✓ Applications created');
  console.log('\n=== Demo Accounts ===');
  console.log('HR:   hr@smarthirex.com   / hr12345');
  console.log('User: user@smarthirex.com / user12345');
  console.log('\nSeed complete!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
