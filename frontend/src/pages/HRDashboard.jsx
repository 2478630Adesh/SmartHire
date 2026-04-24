import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Users, CheckCircle2, TrendingUp, Plus, Eye, Trash2, Edit3 } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-display text-4xl mb-1">Welcome, {user?.name?.split(' ')[0]}</h1>
          <p className="text-ink-600">Manage your job postings and review applicants.</p>
        </div>
        <Link to="/hr/post-job" className="btn-primary">
          <Plus size={14} /> Post New Job
        </Link>
      </motion.div>

      {/* Stats */}
      {stats && (
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Jobs',       value: stats.totalJobs,          icon: Briefcase,    color: 'from-brand-500 to-brand-600' },
            { label: 'Open Positions',   value: stats.openJobs,           icon: TrendingUp,   color: 'from-green-500 to-emerald-500' },
            { label: 'Applications',     value: stats.totalApplications,  icon: Users,        color: 'from-purple-500 to-pink-500' },
            { label: 'Avg ATS Score',    value: `${stats.avgAtsScore}%`,  icon: CheckCircle2, color: 'from-amber-500 to-orange-500' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
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
      )}

      {/* Jobs */}
      <div className="card !p-0 overflow-hidden">
        <div className="p-5 border-b border-ink-100">
          <h2 className="font-display text-2xl">Your Job Postings</h2>
        </div>
        {loading ? (
          <div className="text-center py-12 text-ink-400">Loading...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase size={48} className="text-ink-200 mx-auto mb-3" />
            <p className="text-ink-500 mb-4">You haven't posted any jobs yet.</p>
            <Link to="/hr/post-job" className="btn-primary">Post your first job</Link>
          </div>
        ) : (
          <div className="divide-y divide-ink-100">
            {jobs.map((j) => (
              <div key={j._id} className="p-5 hover:bg-ink-50 transition flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{j.title}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${j.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {j.status}
                    </span>
                  </div>
                  <p className="text-sm text-ink-500">{j.location} • {j.type} • {j.experience}</p>
                  <div className="flex gap-3 mt-2 text-xs text-ink-500">
                    <span>Posted {new Date(j.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="text-brand-600 font-medium">{j.applicationCount} applicant{j.applicationCount !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/hr/job/${j._id}/applicants`} className="btn-primary !py-2 !px-3 !text-xs">
                    <Eye size={12} /> View applicants
                  </Link>
                  <button onClick={() => navigate(`/hr/post-job?edit=${j._id}`)} className="p-2 rounded-full border border-ink-200 hover:border-brand-500 hover:text-brand-600">
                    <Edit3 size={12} />
                  </button>
                  <button onClick={() => deleteJob(j._id)} className="p-2 rounded-full border border-ink-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
