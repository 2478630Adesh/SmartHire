import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Briefcase, Clock, DollarSign, Send, CheckCircle2, Building2 } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [showApply, setShowApply] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [resumeId, setResumeId] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [atsResult, setAtsResult] = useState(null);

  useEffect(() => {
    api.get(`/jobs/${id}`).then((r) => setJob(r.data)).catch(() => {
      toast.error('Job not found');
      navigate('/jobs');
    });
    if (user?.role === 'user') api.get('/resumes').then((r) => setResumes(r.data)).catch(() => {});
  }, [id, user, navigate]);

  const apply = async () => {
    if (!resumeId) { toast.error('Please select a resume'); return; }
    setApplying(true);
    try {
      const { data } = await api.post('/applications', { jobId: id, resumeId, coverLetter });
      setAtsResult(data.ats);
      toast.success('Application submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Application failed');
    } finally {
      setApplying(false);
    }
  };

  if (!job) return <div className="text-center py-20 text-ink-400">Loading...</div>;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-ink-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900 mb-4">
          <ArrowLeft size={14} /> Back to jobs
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-100 to-purple-100 flex items-center justify-center">
              <Building2 className="text-brand-600" size={24} />
            </div>
            <div className="flex-1">
              <h1 className="font-display text-3xl">{job.title}</h1>
              <p className="text-ink-600">{job.company}</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">{job.status}</span>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-ink-600 mb-6">
            <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
            <span className="flex items-center gap-1"><Briefcase size={14} /> {job.type}</span>
            <span className="flex items-center gap-1"><Clock size={14} /> {job.experience}</span>
            {job.salary && <span className="flex items-center gap-1"><DollarSign size={14} /> {job.salary}</span>}
          </div>

          <div className="space-y-5">
            <section>
              <h2 className="font-semibold mb-2">Job Description</h2>
              <p className="text-ink-700 text-sm whitespace-pre-wrap">{job.description}</p>
            </section>
            {job.requirements && (
              <section>
                <h2 className="font-semibold mb-2">Requirements</h2>
                <p className="text-ink-700 text-sm whitespace-pre-wrap">{job.requirements}</p>
              </section>
            )}
            {job.skills?.length > 0 && (
              <section>
                <h2 className="font-semibold mb-2">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((s, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs font-medium">{s}</span>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-ink-100">
            {!user && (
              <div className="text-center py-4">
                <p className="text-ink-600 mb-3">Log in as a job seeker to apply.</p>
                <Link to="/login" className="btn-primary">Log in to apply</Link>
              </div>
            )}
            {user?.role === 'user' && !showApply && !atsResult && (
              <button onClick={() => setShowApply(true)} className="btn-primary w-full">
                <Send size={14} /> Apply to this job
              </button>
            )}
            {user?.role === 'user' && showApply && !atsResult && (
              <div className="space-y-3">
                <div>
                  <label className="label">Choose resume to apply with</label>
                  {resumes.length === 0 ? (
                    <p className="text-sm text-ink-500">You need to create a resume first. <Link to="/templates" className="text-brand-600 font-medium">Create one</Link>.</p>
                  ) : (
                    <select className="input" value={resumeId} onChange={(e) => setResumeId(e.target.value)}>
                      <option value="">-- Select --</option>
                      {resumes.map((r) => (<option key={r._id} value={r._id}>{r.title}</option>))}
                    </select>
                  )}
                </div>
                <div>
                  <label className="label">Cover letter (optional)</label>
                  <textarea
                    className="input h-28"
                    placeholder="Why are you a great fit?"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowApply(false)} className="btn-outline flex-1">Cancel</button>
                  <button onClick={apply} disabled={applying || !resumeId} className="btn-primary flex-1">
                    {applying ? 'Submitting...' : <><Send size={14} /> Submit application</>}
                  </button>
                </div>
              </div>
            )}
            {atsResult && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6">
                <CheckCircle2 size={48} className="text-green-500 mx-auto mb-3" />
                <h2 className="font-display text-2xl mb-1">Application Submitted!</h2>
                <p className="text-ink-600 mb-4">Your ATS match score for this role:</p>
                <div className="inline-block px-6 py-3 rounded-full bg-ink-900 text-white text-3xl font-display">
                  {atsResult.score}%
                </div>
                <div className="grid grid-cols-2 gap-3 mt-6 text-left">
                  <div>
                    <h3 className="text-xs font-semibold text-green-700 mb-1">Matched</h3>
                    <div className="flex flex-wrap gap-1">
                      {atsResult.matchedKeywords?.slice(0, 10).map((k, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full">{k}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-red-600 mb-1">Missing</h3>
                    <div className="flex flex-wrap gap-1">
                      {atsResult.missingKeywords?.slice(0, 10).map((k, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-red-100 text-red-700 rounded-full">{k}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <Link to="/dashboard" className="btn-primary mt-6">Go to dashboard</Link>
              </motion.div>
            )}
            {user?.role === 'hr' && (
              <p className="text-sm text-ink-500 text-center">HR accounts can't apply. Log in as a job seeker.</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
