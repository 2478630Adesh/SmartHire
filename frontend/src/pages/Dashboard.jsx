import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FilePlus, Briefcase, TrendingUp, FileCheck, ExternalLink, Trash2, Edit3 } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getTemplate } from '../templates';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const [r, a] = await Promise.all([
        api.get('/resumes'),
        api.get('/applications/my'),
      ]);
      setResumes(r.data);
      setApps(a.data);
    } catch (err) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }

  const deleteResume = async (id) => {
    if (!confirm('Delete this resume?')) return;
    try {
      await api.delete(`/resumes/${id}`);
      toast.success('Resume deleted');
      setResumes((r) => r.filter((x) => x._id !== id));
    } catch {
      toast.error('Delete failed');
    }
  };

  const avgScore = apps.length
    ? Math.round(apps.reduce((s, a) => s + a.atsScore, 0) / apps.length)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-4xl mb-1">Hi {user?.name?.split(' ')[0]} 👋</h1>
        <p className="text-ink-600">Here's what's happening with your job hunt.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Resumes',       value: resumes.length, icon: FileCheck,  color: 'from-brand-500 to-brand-600' },
          { label: 'Applications',  value: apps.length,    icon: Briefcase,  color: 'from-purple-500 to-pink-500' },
          { label: 'Avg ATS Score', value: `${avgScore}%`, icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
          { label: 'Shortlisted',   value: apps.filter(a => a.status === 'Shortlisted').length, icon: FilePlus, color: 'from-amber-500 to-orange-500' },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white`}>
              <s.icon size={22} />
            </div>
            <div>
              <div className="font-display text-3xl">{s.value}</div>
              <div className="text-xs text-ink-500 uppercase tracking-wider">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Resumes */}
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-2xl">Your Resumes</h2>
            <Link to="/templates" className="btn-primary !py-2 !px-4 !text-sm">
              <FilePlus size={14} /> New Resume
            </Link>
          </div>
          {loading ? (
            <div className="card text-center py-12 text-ink-400">Loading...</div>
          ) : resumes.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-ink-600 mb-4">You haven't created any resumes yet.</p>
              <Link to="/templates" className="btn-primary">Create your first resume</Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {resumes.map((r) => {
                const tpl = getTemplate(r.templateId);
                return (
                  <motion.div
                    key={r._id}
                    whileHover={{ y: -4 }}
                    className="card relative group"
                  >
                    <div
                      className="h-32 rounded-lg mb-4 flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${tpl.color}20 0%, ${tpl.color}40 100%)` }}
                    >
                      <FileCheck size={36} style={{ color: tpl.color }} />
                    </div>
                    <h3 className="font-semibold">{r.title}</h3>
                    <p className="text-xs text-ink-500 mt-1">{tpl.name} template • Updated {new Date(r.updatedAt).toLocaleDateString()}</p>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => navigate(`/builder/${r._id}`)} className="flex-1 btn-outline !py-1.5 !text-xs">
                        <Edit3 size={12} /> Edit
                      </button>
                      <button onClick={() => deleteResume(r._id)} className="p-2 rounded-full border border-ink-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Applications */}
        <div>
          <h2 className="font-display text-2xl mb-4">Recent Applications</h2>
          {apps.length === 0 ? (
            <div className="card text-center py-10">
              <p className="text-ink-600 text-sm mb-3">No applications yet.</p>
              <Link to="/jobs" className="btn-outline !text-xs">Browse jobs</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {apps.slice(0, 6).map((a) => (
                <div key={a._id} className="card !p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-sm">{a.job?.title}</h4>
                      <p className="text-xs text-ink-500">{a.job?.company}</p>
                    </div>
                    <ScoreBadge score={a.atsScore} />
                  </div>
                  <div className="flex justify-between items-center mt-2 text-xs">
                    <StatusPill status={a.status} />
                    <span className="text-ink-400">{new Date(a.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ScoreBadge({ score }) {
  const color = score >= 80 ? 'bg-green-100 text-green-700' : score >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700';
  return <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${color}`}>{score}%</span>;
}

function StatusPill({ status }) {
  const map = {
    Applied: 'bg-blue-100 text-blue-700',
    Shortlisted: 'bg-green-100 text-green-700',
    Rejected: 'bg-red-100 text-red-700',
    Hired: 'bg-purple-100 text-purple-700',
  };
  return <span className={`px-2 py-0.5 rounded-full ${map[status] || 'bg-gray-100'}`}>{status}</span>;
}
