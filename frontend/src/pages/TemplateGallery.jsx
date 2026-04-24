import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { TEMPLATES } from '../templates';

const CATEGORIES = ['All', 'Classic', 'Modern', 'Minimal', 'Creative', 'ATS-friendly'];

export default function TemplateGallery() {
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState(null);
  const [creating, setCreating] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const filtered = category === 'All' ? TEMPLATES : TEMPLATES.filter((t) => t.category === category);

  const useTemplate = async (tpl) => {
    if (!user) {
      toast('Please log in to create a resume', { icon: '🔒' });
      navigate('/login');
      return;
    }
    setCreating(true);
    try {
      const { data } = await api.post('/resumes', {
        title: `My ${tpl.name} Resume`,
        templateId: tpl.id,
        colors: { primary: tpl.color, accent: '#1E293B' },
      });
      toast.success(`${tpl.name} template selected!`);
      navigate(`/builder/${data._id}`);
    } catch (err) {
      toast.error('Failed to create resume');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen mesh-gradient">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <p className="text-sm uppercase tracking-widest text-brand-700 mb-3" style={{ fontWeight: 700 }}>Choose your template</p>
          <h1 className="font-display text-5xl md:text-6xl text-ink-900 mb-4" style={{ fontWeight: 700 }}>Pick a resume that <em className="italic text-brand-600">wins jobs</em></h1>
          <p className="text-ink-600 max-w-2xl mx-auto">All templates are ATS-friendly and fully customizable. Pick one and make it yours in minutes.</p>
        </motion.div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                category === c
                  ? 'bg-ink-900 text-white'
                  : 'bg-white text-ink-600 hover:bg-ink-100'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((tpl, i) => {
            const TemplateComp = tpl.component;
            const isSelected = selected === tpl.id;
            return (
              <motion.div
                key={tpl.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onMouseEnter={() => setSelected(tpl.id)}
                onMouseLeave={() => setSelected(null)}
                className="template-card card !p-0 overflow-hidden cursor-pointer"
              >
                {/* Mini preview */}
                <div className="h-80 bg-gray-100 overflow-hidden relative">
                  <div
                    className="origin-top-left"
                    style={{
                      transform: 'scale(0.3)',
                      width: '210mm',
                      height: '297mm',
                      pointerEvents: 'none',
                    }}
                  >
                    <TemplateComp data={SAMPLE_DATA} />
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-ink-900/60 flex items-center justify-center"
                    >
                      <button
                        onClick={() => useTemplate(tpl)}
                        disabled={creating}
                        className="btn-primary !bg-white !text-ink-900 hover:!bg-brand-500 hover:!text-white"
                      >
                        {creating ? 'Creating...' : <>Use this template <ArrowRight size={14} /></>}
                      </button>
                    </motion.div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-display text-xl">{tpl.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-ink-100 text-ink-600">{tpl.category}</span>
                  </div>
                  <p className="text-xs text-ink-500 leading-relaxed">{tpl.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Sample data used only for preview thumbnails
const SAMPLE_DATA = {
  personalInfo: {
    fullName: 'Alex Morgan',
    jobTitle: 'Senior Software Engineer',
    email: 'alex@example.com',
    phone: '+1 555 1234',
    address: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexmorgan',
    github: 'github.com/alexmorgan',
    website: 'alexmorgan.dev',
    summary: 'Senior engineer with 7+ years building scalable web applications. Expertise in React, Node.js, and distributed systems. Passionate about clean code and mentoring.',
  },
  experience: [
    { jobTitle: 'Senior Software Engineer', company: 'Stripe', location: 'Remote', startDate: 'Jan 2022', endDate: 'Present', current: true, description: 'Led migration of payments API to microservices. Reduced latency by 40% and improved reliability.' },
    { jobTitle: 'Software Engineer', company: 'Airbnb', location: 'SF', startDate: 'Mar 2019', endDate: 'Dec 2021', description: 'Built booking flow used by 500M+ users. Improved Lighthouse score from 68 to 94.' },
  ],
  education: [
    { degree: 'B.S. Computer Science', institution: 'Stanford University', location: 'Stanford, CA', startDate: '2015', endDate: '2019', gpa: '3.8' },
  ],
  skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL', 'Redis', 'Python', 'Kubernetes'],
  projects: [
    { name: 'OpenAPI Explorer', description: 'Open-source tool for visualizing REST APIs.', technologies: 'React, Node.js' },
    { name: 'DevOps Bot', description: 'Slack bot automating CI/CD operations.', technologies: 'Python, Docker' },
  ],
  certifications: [
    { name: 'AWS Solutions Architect', issuer: 'Amazon', date: '2023' },
    { name: 'CKA Kubernetes', issuer: 'CNCF', date: '2022' },
  ],
  languages: [{ name: 'English', proficiency: 'Native' }, { name: 'Spanish', proficiency: 'Fluent' }],
  achievements: ['Tech Lead Award 2023', 'Open source contributor with 1K+ GitHub stars'],
  colors: { primary: '#4F46E5' },
};
