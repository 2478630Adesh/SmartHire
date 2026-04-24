import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FilePlus, Briefcase, TrendingUp, FileCheck, Trash2, Edit3, Target, Sparkles, ArrowRight } from 'lucide-react';
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

  useEffect(() => { load(); }, []);

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
    <div className="min-h-[calc(100vh-5rem)] mesh-gradient">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10">
        {/* Welcome banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-brand-700 text-white rounded-3xl p-8 md:p-10 mb-8 shadow-xl shadow-brand-500/20"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500 opacity-20 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="relative">
            <p className="text-brand-100 text-sm uppercase tracking-wider mb-2" style={{ fontWeight: 700 }}>
              Welcome back
            </p>
            <h1 className="font-display text-4xl md:text-5xl mb-2" style={{ fontWeight: 700 }}>
              Hi {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-white text-lg opacity-90">Here's what's happening with your job hunt.</p>
            <div className="flex gap-3 mt-5 flex-wrap">
              <Link to="/templates" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-brand-700 text-sm hover:bg-ink-50 hover:shadow-lg transition-all" style={{ fontWeight: 700 }}>
                <FilePlus size={14} /> New Resume
              </Link>
              <Link to="/jobs" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 text-white border-2 border-white/30 text-sm hover:bg-white/30 transition-all" style={{ fontWeight: 700 }}>
                <Briefcase size={14} /> Browse Jobs
              </Link>
              <Link to="/ats-checker" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 text-white border-2 border-white/30 text-sm hover:bg-white/30 transition-all" style={{ fontWeight: 700 }}>
                <Target size={14} /> Check ATS
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Resumes',       value: resumes.length,                                           icon: FileCheck,  gradient: 'from-sky-500 to-sky-700',       bg: 'bg-sky-50',    text: 'text-sky-700' },
            { label: 'Applications',  value: apps.length,                                               icon: Briefcase,  gradient: 'from-brand-500 to-brand-700',   bg: 'bg-brand-50',  text: 'text-brand-700' },
            { label: 'Avg ATS Score', value: `${avgScore}%`,                                           icon: TrendingUp, gradient: 'from-accent-500 to-accent-700', bg: 'bg-accent-50', text: 'text-accent-700' },
            { label: 'Shortlisted',   value: apps.filter(a => a.status === 'Shortlisted').length,     icon: Sparkles,   gradient: 'from-rose-500 to-rose-700',     bg: 'bg-rose-50',   text: 'text-rose-700' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card relative overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              <div className={`absolute top-0 right-0 w-24 h-24 ${s.bg} rounded-full blur-2xl opacity-60 -mr-8 -mt-8`}></div>
              <div className="relative">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white shadow-lg mb-3`}>
                  <s.icon size={20} />
                </div>
                <div className="font-display text-4xl text-ink-900" style={{ fontWeight: 700 }}>{s.value}</div>
                <div className={`text-xs ${s.text} uppercase tracking-wider mt-1`} style={{ fontWeight: 700 }}>{s.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Resumes */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="font-display text-2xl" style={{ fontWeight: 700 }}>Your Resumes</h2>
                <p className="text-sm text-ink-500">Edit, download, or delete — all in one place</p>
              </div>
              <Link to="/templates" className="btn-primary !py-2 !px-4 !text-sm">
                <FilePlus size={14} /> New
              </Link>
            </div>

            {loading ? (
              <div className="card text-center py-16 text-ink-400">Loading...</div>
            ) : resumes.length === 0 ? (
              <div className="card text-center py-16 border-dashed border-2 border-ink-200">
                <FileCheck size={48} className="text-ink-300 mx-auto mb-3" />
                <p className="text-ink-600 mb-4" style={{ fontWeight: 700 }}>You haven't created any resumes yet</p>
                <Link to="/templates" className="btn-primary">
                  <Sparkles size={14} /> Create your first resume
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {resumes.map((r, i) => {
                  const tpl = getTemplate(r.templateId);
                  return (
                    <motion.div
                      key={r._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ y: -4 }}
                      className="card relative group overflow-hidden"
                    >
                      <div
                        className="h-36 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden"
                        style={{ background: `linear-gradient(135deg, ${tpl.color}20, ${tpl.color}50)` }}
                      >
                        <FileCheck size={44} style={{ color: tpl.color }} />
                        <div className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-white/80 backdrop-blur" style={{ color: tpl.color, fontWeight: 700 }}>
                          {tpl.name}
                        </div>
                      </div>
                      <h3 className="text-base" style={{ fontWeight: 700 }}>{r.title}</h3>
                      <p className="text-xs text-ink-500 mt-1">Updated {new Date(r.updatedAt).toLocaleDateString()}</p>
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => navigate(`/builder/${r._id}`)} className="flex-1 btn-outline !py-1.5 !px-3 !text-xs">
                          <Edit3 size={12} /> Edit
                        </button>
                        <button
                          onClick={() => deleteResume(r._id)}
                          className="p-2 rounded-full border-2 border-ink-200 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 transition"
                        >
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
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="font-display text-2xl" style={{ fontWeight: 700 }}>Recent Applications</h2>
                <p className="text-sm text-ink-500">Track your job hunt</p>
              </div>
            </div>

            {apps.length === 0 ? (
              <div className="card text-center py-12 border-dashed border-2 border-ink-200">
                <Briefcase size={40} className="text-ink-300 mx-auto mb-3" />
                <p className="text-ink-600 text-sm mb-3" style={{ fontWeight: 700 }}>No applications yet</p>
                <Link to="/jobs" className="btn-outline !text-xs">Browse jobs <ArrowRight size={12} /></Link>
              </div>
            ) : (
              <div className="space-y-3">
                {apps.slice(0, 6).map((a, i) => (
                  <motion.div
                    key={a._id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="card !p-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm truncate" style={{ fontWeight: 700 }}>{a.job?.title}</h4>
                        <p className="text-xs text-ink-500 truncate">{a.job?.company}</p>
                      </div>
                      <ScoreBadge score={a.atsScore} />
                    </div>
                    <div className="flex justify-between items-center mt-2 text-xs">
                      <StatusPill status={a.status} />
                      <span className="text-ink-400">{new Date(a.createdAt).toLocaleDateString()}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreBadge({ score }) {
  const color = score >= 80
    ? 'bg-brand-100 text-brand-700'
    : score >= 60
    ? 'bg-amber-100 text-amber-700'
    : 'bg-rose-100 text-rose-700';
  return <span className={`text-xs px-2.5 py-1 rounded-full ${color}`} style={{ fontWeight: 700 }}>{score}%</span>;
}

function StatusPill({ status }) {
  const map = {
    Applied: 'bg-sky-100 text-sky-700',
    Shortlisted: 'bg-brand-100 text-brand-700',
    Rejected: 'bg-rose-100 text-rose-700',
    Hired: 'bg-accent-100 text-accent-700',
  };
  return <span className={`px-2 py-0.5 rounded-full ${map[status] || 'bg-ink-100'}`} style={{ fontWeight: 700 }}>{status}</span>;
}
