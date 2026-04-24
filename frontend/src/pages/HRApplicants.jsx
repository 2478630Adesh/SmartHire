import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Mail, Phone, FileText, TrendingUp } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function HRApplicants() {
  const { jobId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => { load(); }, [jobId]); // eslint-disable-line
  async function load() {
    setLoading(true);
    try {
      const res = await api.get(`/applications/job/${jobId}`);
      setData(res.data);
    } catch {
      toast.error('Failed to load applicants');
    } finally {
      setLoading(false);
    }
  }

  const updateStatus = async (appId, status) => {
    try {
      await api.put(`/applications/${appId}/status`, { status });
      toast.success('Status updated');
      load();
    } catch {
      toast.error('Update failed');
    }
  };

  if (loading) return <div className="text-center py-20 text-ink-400">Loading applicants...</div>;
  if (!data) return null;

  const { job, applications } = data;
  const topScore = applications[0]?.atsScore || 0;
  const avgScore = applications.length ? Math.round(applications.reduce((s, a) => s + a.atsScore, 0) / applications.length) : 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-ink-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <Link to="/hr/dashboard" className="inline-flex items-center gap-1 text-sm text-ink-500 hover:text-ink-900 mb-4">
          <ArrowLeft size={14} /> Back to dashboard
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="font-display text-4xl mb-1">{job.title}</h1>
          <p className="text-ink-600">{job.company} • {job.location}</p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="card flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-brand-100 flex items-center justify-center"><TrendingUp className="text-brand-600" size={20} /></div>
            <div>
              <div className="font-display text-2xl">{applications.length}</div>
              <div className="text-xs text-ink-500">Total Applicants</div>
            </div>
          </div>
          <div className="card flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-amber-100 flex items-center justify-center"><Trophy className="text-amber-600" size={20} /></div>
            <div>
              <div className="font-display text-2xl">{topScore}%</div>
              <div className="text-xs text-ink-500">Top ATS Score</div>
            </div>
          </div>
          <div className="card flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-green-100 flex items-center justify-center"><TrendingUp className="text-green-600" size={20} /></div>
            <div>
              <div className="font-display text-2xl">{avgScore}%</div>
              <div className="text-xs text-ink-500">Average Score</div>
            </div>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="card text-center py-16 text-ink-500">No applicants yet.</div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Candidate list */}
            <div className="lg:col-span-2 space-y-3">
              <h2 className="font-semibold mb-2">Top Candidates (sorted by ATS score)</h2>
              {applications.map((a, i) => (
                <motion.div
                  key={a._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelected(a)}
                  className={`card cursor-pointer transition hover:shadow-md ${selected?._id === a._id ? 'ring-2 ring-brand-500' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-purple-400 flex items-center justify-center text-white font-semibold">
                        {a.applicant?.name?.[0] || '?'}
                      </div>
                      {i < 3 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-white text-[10px] flex items-center justify-center font-bold">
                          {i + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{a.applicant?.name}</h3>
                      <p className="text-xs text-ink-500">{a.applicant?.email}</p>
                      <div className="flex gap-1 mt-1">
                        {a.matchedKeywords?.slice(0, 5).map((k, j) => (
                          <span key={j} className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded">{k}</span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <ScoreBadge score={a.atsScore} />
                      <div className="mt-2">
                        <StatusPill status={a.status} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Detail panel */}
            <div className="lg:col-span-1">
              {!selected ? (
                <div className="card text-center py-10 text-ink-400 text-sm sticky top-20">
                  Select a candidate to see details
                </div>
              ) : (
                <motion.div
                  key={selected._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card sticky top-20"
                >
                  <div className="text-center pb-4 border-b border-ink-100">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-brand-400 to-purple-400 flex items-center justify-center text-white text-2xl font-semibold mb-2">
                      {selected.applicant?.name?.[0] || '?'}
                    </div>
                    <h2 className="font-display text-xl">{selected.applicant?.name}</h2>
                    <p className="text-xs text-ink-500">{selected.applicant?.email}</p>
                  </div>

                  <div className="py-4 border-b border-ink-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">ATS Score</span>
                      <ScoreBadge score={selected.atsScore} />
                    </div>
                    <div className="w-full h-2 bg-ink-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${selected.atsScore}%`,
                          background: selected.atsScore >= 80 ? '#10B981' : selected.atsScore >= 60 ? '#F59E0B' : '#EF4444',
                        }}
                      />
                    </div>
                  </div>

                  <div className="py-4 space-y-3 text-sm">
                    {selected.applicant?.email && (
                      <div className="flex items-center gap-2"><Mail size={14} className="text-ink-400" /> {selected.applicant.email}</div>
                    )}
                    {selected.applicant?.phone && (
                      <div className="flex items-center gap-2"><Phone size={14} className="text-ink-400" /> {selected.applicant.phone}</div>
                    )}
                  </div>

                  <div className="py-4 border-t border-ink-100">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-green-700 mb-2">Matched Keywords</h3>
                    <div className="flex flex-wrap gap-1">
                      {selected.matchedKeywords?.map((k, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full">{k}</span>
                      ))}
                    </div>
                  </div>

                  {selected.missingKeywords?.length > 0 && (
                    <div className="py-4 border-t border-ink-100">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-red-600 mb-2">Missing Keywords</h3>
                      <div className="flex flex-wrap gap-1">
                        {selected.missingKeywords.map((k, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 bg-red-100 text-red-700 rounded-full">{k}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selected.coverLetter && (
                    <div className="py-4 border-t border-ink-100">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-600 mb-2">Cover Letter</h3>
                      <p className="text-sm text-ink-700 whitespace-pre-wrap">{selected.coverLetter}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t border-ink-100 grid grid-cols-2 gap-2">
                    <button onClick={() => updateStatus(selected._id, 'Shortlisted')} className="btn-outline !text-xs !py-2 hover:!bg-green-50 hover:!border-green-300 hover:!text-green-700">Shortlist</button>
                    <button onClick={() => updateStatus(selected._id, 'Rejected')} className="btn-outline !text-xs !py-2 hover:!bg-red-50 hover:!border-red-300 hover:!text-red-600">Reject</button>
                    <button onClick={() => updateStatus(selected._id, 'Hired')} className="btn-outline !text-xs !py-2 col-span-2 hover:!bg-purple-50 hover:!border-purple-300 hover:!text-purple-700">Mark as Hired</button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ScoreBadge({ score }) {
  const color = score >= 80 ? 'bg-green-100 text-green-700' : score >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700';
  return <span className={`text-sm px-3 py-1 rounded-full font-bold ${color}`}>{score}%</span>;
}
function StatusPill({ status }) {
  const map = {
    Applied: 'bg-blue-100 text-blue-700',
    Shortlisted: 'bg-green-100 text-green-700',
    Rejected: 'bg-red-100 text-red-700',
    Hired: 'bg-purple-100 text-purple-700',
  };
  return <span className={`text-[10px] px-2 py-0.5 rounded-full ${map[status] || 'bg-gray-100'}`}>{status}</span>;
}
