import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Users, CheckCircle2, TrendingUp, Plus, Eye, Trash2, Edit3, Target, Building2, ArrowRight } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function HRDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const [s, j] = await Promise.all([
        api.get('/applications/hr/stats'),
        api.get('/jobs/my/posts'),
      ]);
      setStats(s.data);
      setJobs(j.data);
    } catch {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  }

  const deleteJob = async (jobId) => {
    if (!confirm('Delete this job and all its applications?')) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      toast.success('Job deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] mesh-gradient">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10">
        {/* Welcome banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-br from-accent-600 via-accent-500 to-accent-700 text-white rounded-3xl p-8 md:p-10 mb-8 shadow-xl shadow-accent-500/20"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500 opacity-20 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-accent-100 text-sm uppercase tracking-wider mb-2" style={{ fontWeight: 700 }}>
                HR Portal • {user?.company || 'Your Company'}
              </p>
              <h1 className="font-display text-4xl md:text-5xl mb-2" style={{ fontWeight: 700 }}>
                Welcome, {user?.name?.split(' ')[0]}
              </h1>
              <p className="text-white text-lg opacity-90">Post jobs, review applicants, find your next great hire.</p>
            </div>
            <Link to="/hr/post-job" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-accent-700 hover:bg-ink-50 hover:shadow-xl transition-all whitespace-nowrap" style={{ fontWeight: 700 }}>
              <Plus size={16} /> Post New Job
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Jobs',       value: stats.totalJobs,          icon: Briefcase,    gradient: 'from-sky-500 to-sky-700',       bg: 'bg-sky-50',    text: 'text-sky-700' },
              { label: 'Open Positions',   value: stats.openJobs,           icon: TrendingUp,   gradient: 'from-brand-500 to-brand-700',   bg: 'bg-brand-50',  text: 'text-brand-700' },
              { label: 'Applications',     value: stats.totalApplications,  icon: Users,        gradient: 'from-accent-500 to-accent-700', bg: 'bg-accent-50', text: 'text-accent-700' },
              { label: 'Avg ATS Score',    value: `${stats.avgAtsScore}%`,  icon: Target,       gradient: 'from-rose-500 to-rose-700',     bg: 'bg-rose-50',   text: 'text-rose-700' },
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
        )}

        {/* Jobs list */}
        <div className="card !p-0 overflow-hidden">
          <div className="p-6 border-b-2 border-ink-100 flex justify-between items-center">
            <div>
              <h2 className="font-display text-2xl" style={{ fontWeight: 700 }}>Your Job Postings</h2>
              <p className="text-sm text-ink-500">Manage all your active and closed job listings</p>
            </div>
            <Link to="/hr/post-job" className="btn-primary !py-2 !px-4 !text-sm">
              <Plus size={14} /> New Job
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-16 text-ink-400">Loading...</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20 px-6">
              <div className="w-16 h-16 rounded-2xl bg-accent-100 flex items-center justify-center mx-auto mb-4">
                <Briefcase size={28} className="text-accent-600" />
              </div>
              <h3 className="font-display text-xl mb-2" style={{ fontWeight: 700 }}>No jobs posted yet</h3>
              <p className="text-ink-500 text-sm mb-5">Create your first job and start reviewing applicants.</p>
              <Link to="/hr/post-job" className="btn-primary">
                <Plus size={14} /> Post your first job
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-ink-100">
              {jobs.map((j, i) => (
                <motion.div
                  key={j._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-5 md:p-6 hover:bg-ink-50 transition flex flex-col md:flex-row md:items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center flex-shrink-0">
                    <Building2 className="text-brand-700" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-base" style={{ fontWeight: 700 }}>{j.title}</h3>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          j.status === 'Open' ? 'bg-brand-100 text-brand-700' : 'bg-ink-200 text-ink-600'
                        }`}
                        style={{ fontWeight: 700 }}
                      >
                        {j.status}
                      </span>
                    </div>
                    <p className="text-sm text-ink-500">{j.location} · {j.type} · {j.experience}</p>
                    <div className="flex gap-3 mt-2 text-xs text-ink-500 flex-wrap">
                      <span>Posted {new Date(j.createdAt).toLocaleDateString()}</span>
                      <span>·</span>
                      <span className="text-accent-600 flex items-center gap-1" style={{ fontWeight: 700 }}>
                        <Users size={12} /> {j.applicationCount} applicant{j.applicationCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/hr/job/${j._id}/applicants`} className="btn-primary !py-2 !px-3 !text-xs">
                      <Eye size={12} /> Applicants
                    </Link>
                    <button
                      onClick={() => navigate(`/hr/post-job?edit=${j._id}`)}
                      className="p-2 rounded-full border-2 border-ink-200 hover:border-brand-500 hover:text-brand-600 transition"
                    >
                      <Edit3 size={12} />
                    </button>
                    <button
                      onClick={() => deleteJob(j._id)}
                      className="p-2 rounded-full border-2 border-ink-200 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 transition"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
