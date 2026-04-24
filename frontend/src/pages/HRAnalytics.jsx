import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { BarChart3, TrendingUp, Users, Target, CheckCircle2, XCircle, Award } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function HRAnalytics() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications/hr/stats').then((r) => {
      setStats(r.data);
      setLoading(false);
    }).catch(() => {
      toast.error('Failed to load analytics');
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-center py-20 text-ink-400">Loading analytics...</div>;
  if (!stats) return <div className="text-center py-20 text-ink-400">No data available</div>;

  const hasAnyData = stats.totalApplications > 0;

  return (
    <div className="min-h-[calc(100vh-5rem)] mesh-gradient">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center text-white shadow-lg">
              <BarChart3 size={22} />
            </div>
            <div>
              <h1 className="font-display text-4xl" style={{ fontWeight: 700 }}>Analytics</h1>
              <p className="text-sm text-ink-600">Deep insights into your hiring pipeline — {user?.company || 'your company'}</p>
            </div>
          </div>
        </motion.div>

        {!hasAnyData ? (
          <div className="card text-center py-20 border-dashed border-2 border-ink-200">
            <BarChart3 size={48} className="text-ink-300 mx-auto mb-3" />
            <h3 className="font-display text-xl mb-2" style={{ fontWeight: 700 }}>No data yet</h3>
            <p className="text-ink-500 text-sm">Once applicants start applying, charts will appear here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={Users}   label="Total Applicants"  value={stats.totalApplications} gradient="from-brand-500 to-brand-700"   bg="bg-brand-50" />
              <StatCard icon={Target}  label="Avg ATS Score"     value={`${stats.avgAtsScore}%`} gradient="from-accent-500 to-accent-700" bg="bg-accent-50" />
              <StatCard icon={Award}   label="Shortlisted"       value={stats.shortlisted}       gradient="from-sky-500 to-sky-700"       bg="bg-sky-50" />
              <StatCard icon={CheckCircle2} label="Hired"        value={stats.hired}             gradient="from-rose-500 to-rose-700"     bg="bg-rose-50" />
            </div>

            {/* Row 1: Timeline chart + Status pie */}
            <div className="grid lg:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card lg:col-span-2"
              >
                <div className="mb-4">
                  <h2 className="font-display text-xl" style={{ fontWeight: 700 }}>Applications over time</h2>
                  <p className="text-xs text-ink-500">Last 14 days</p>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={stats.timeline}>
                    <defs>
                      <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"  stopColor="#10B981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
                    <XAxis dataKey="label" stroke="#78716C" fontSize={11} />
                    <YAxis stroke="#78716C" fontSize={11} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: '#1C1917', border: 'none', borderRadius: 10, color: '#fff', fontSize: 12 }} />
                    <Line
                      type="monotone" dataKey="count"
                      stroke="#10B981" strokeWidth={3}
                      dot={{ fill: '#10B981', r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Applications"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card"
              >
                <div className="mb-4">
                  <h2 className="font-display text-xl" style={{ fontWeight: 700 }}>Status breakdown</h2>
                  <p className="text-xs text-ink-500">Where applicants stand</p>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={stats.statusBreakdown}
                      dataKey="count"
                      nameKey="status"
                      cx="50%" cy="50%"
                      outerRadius={80}
                      innerRadius={45}
                      paddingAngle={3}
                      label={(entry) => entry.status}
                      labelLine={false}
                      fontSize={10}
                    >
                      {stats.statusBreakdown.map((s, i) => (
                        <Cell key={i} fill={s.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#1C1917', border: 'none', borderRadius: 10, color: '#fff', fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-2">
                  {stats.statusBreakdown.map((s) => (
                    <div key={s.status} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: s.color }} />
                        <span className="text-ink-700" style={{ fontWeight: 700 }}>{s.status}</span>
                      </div>
                      <span className="text-ink-500" style={{ fontWeight: 700 }}>{s.count}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Row 2: Score distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <div className="mb-4">
                <h2 className="font-display text-xl" style={{ fontWeight: 700 }}>ATS Score Distribution</h2>
                <p className="text-xs text-ink-500">How well candidates match your jobs</p>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={stats.scoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
                  <XAxis dataKey="bucket" stroke="#78716C" fontSize={11} />
                  <YAxis stroke="#78716C" fontSize={11} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: '#1C1917', border: 'none', borderRadius: 10, color: '#fff', fontSize: 12 }}
                    formatter={(v, n, p) => [`${v} candidates`, p.payload.label]}
                  />
                  <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                    {stats.scoreDistribution.map((d, i) => {
                      const colors = ['#F43F5E', '#F97316', '#F59E0B', '#3B82F6', '#10B981'];
                      return <Cell key={i} fill={colors[i]} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex justify-around text-center mt-2 text-xs text-ink-500">
                {stats.scoreDistribution.map((d, i) => (
                  <div key={i}>
                    <div style={{ fontWeight: 700 }}>{d.count}</div>
                    <div>{d.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Row 3: Top keywords */}
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card"
              >
                <div className="mb-4 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-brand-600" />
                  <div>
                    <h2 className="font-display text-xl" style={{ fontWeight: 700 }}>Top Matched Skills</h2>
                    <p className="text-xs text-ink-500">What applicants are bringing</p>
                  </div>
                </div>
                {stats.topMatched.length === 0 ? (
                  <p className="text-sm text-ink-400 py-8 text-center">No data yet</p>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={stats.topMatched} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
                      <XAxis type="number" stroke="#78716C" fontSize={11} allowDecimals={false} />
                      <YAxis dataKey="keyword" type="category" stroke="#78716C" fontSize={11} width={85} />
                      <Tooltip contentStyle={{ background: '#1C1917', border: 'none', borderRadius: 10, color: '#fff', fontSize: 12 }} />
                      <Bar dataKey="count" fill="#10B981" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card"
              >
                <div className="mb-4 flex items-center gap-2">
                  <XCircle size={18} className="text-rose-600" />
                  <div>
                    <h2 className="font-display text-xl" style={{ fontWeight: 700 }}>Top Missing Skills</h2>
                    <p className="text-xs text-ink-500">Gaps in your applicant pool</p>
                  </div>
                </div>
                {stats.topMissing.length === 0 ? (
                  <p className="text-sm text-ink-400 py-8 text-center">No data yet</p>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={stats.topMissing} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
                      <XAxis type="number" stroke="#78716C" fontSize={11} allowDecimals={false} />
                      <YAxis dataKey="keyword" type="category" stroke="#78716C" fontSize={11} width={85} />
                      <Tooltip contentStyle={{ background: '#1C1917', border: 'none', borderRadius: 10, color: '#fff', fontSize: 12 }} />
                      <Bar dataKey="count" fill="#F43F5E" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </motion.div>
            </div>

            {/* Row 4: Applications per job */}
            {stats.perJob?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="card"
              >
                <div className="mb-4">
                  <h2 className="font-display text-xl" style={{ fontWeight: 700 }}>Applications per Job</h2>
                  <p className="text-xs text-ink-500">Which postings are getting the most interest</p>
                </div>
                <ResponsiveContainer width="100%" height={Math.max(220, stats.perJob.length * 40)}>
                  <BarChart data={stats.perJob} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
                    <XAxis type="number" stroke="#78716C" fontSize={11} allowDecimals={false} />
                    <YAxis dataKey="title" type="category" stroke="#78716C" fontSize={11} width={180} />
                    <Tooltip contentStyle={{ background: '#1C1917', border: 'none', borderRadius: 10, color: '#fff', fontSize: 12 }} />
                    <Bar dataKey="count" fill="#F97316" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, gradient, bg }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card relative overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-24 h-24 ${bg} rounded-full blur-2xl opacity-60 -mr-8 -mt-8`}></div>
      <div className="relative">
        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg mb-3`}>
          <Icon size={18} />
        </div>
        <div className="font-display text-3xl text-ink-900" style={{ fontWeight: 700 }}>{value}</div>
        <div className="text-[11px] text-ink-600 uppercase tracking-wider mt-1" style={{ fontWeight: 700 }}>{label}</div>
      </div>
    </motion.div>
  );
}
