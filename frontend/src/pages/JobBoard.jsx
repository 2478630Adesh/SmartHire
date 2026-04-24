import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase, Clock, DollarSign, Filter, Building2 } from 'lucide-react';
import api from '../utils/api';

const CARD_GRADIENTS = [
  'from-brand-400 to-brand-600',
  'from-accent-400 to-accent-600',
  'from-sky-400 to-sky-600',
  'from-rose-400 to-rose-600',
  'from-amber-400 to-amber-600',
];

export default function JobBoard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (location) params.location = location;
      if (type) params.type = type;
      const { data } = await api.get('/jobs', { params });
      setJobs(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] mesh-gradient">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <p className="text-sm uppercase tracking-widest text-brand-700 mb-3" style={{ fontWeight: 700 }}>
            Job Board
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-ink-900 mb-3" style={{ fontWeight: 700 }}>
            Find your next role
          </h1>
          <p className="text-ink-600 max-w-2xl mx-auto">
            Browse openings from top companies and apply with your resume in one click.
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-8 !p-4 shadow-lg"
        >
          <div className="grid md:grid-cols-4 gap-3">
            <div className="relative md:col-span-2">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                className="input pl-10"
                placeholder="Job title, company, or keyword"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && load()}
              />
            </div>
            <div className="relative">
              <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                className="input pl-10"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && load()}
              />
            </div>
            <div className="flex gap-2">
              <select className="input flex-1" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">All types</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
              <button onClick={load} className="btn-primary !px-4">
                <Filter size={16} />
              </button>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center py-20 text-ink-400">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="card text-center py-20 border-dashed border-2 border-ink-200">
            <div className="w-16 h-16 rounded-2xl bg-ink-100 flex items-center justify-center mx-auto mb-4">
              <Briefcase size={28} className="text-ink-400" />
            </div>
            <h3 className="font-display text-xl mb-2" style={{ fontWeight: 700 }}>No jobs match your search</h3>
            <p className="text-ink-500 text-sm">Try different keywords or clear the filters.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-ink-600 mb-4">
              Showing <span style={{ fontWeight: 700 }}>{jobs.length}</span> open positions
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {jobs.map((j, i) => (
                <motion.div
                  key={j._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={`/jobs/${j._id}`}
                    className="card block hover:shadow-xl hover:-translate-y-1 transition-all h-full border-2 border-transparent hover:border-brand-500 overflow-hidden relative"
                  >
                    <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${CARD_GRADIENTS[i % CARD_GRADIENTS.length]} opacity-10 rounded-full blur-3xl -mr-10 -mt-10`}></div>

                    <div className="relative">
                      <div className="flex justify-between items-start mb-3">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${CARD_GRADIENTS[i % CARD_GRADIENTS.length]} flex items-center justify-center text-white shadow-lg`}>
                          <Building2 size={20} />
                        </div>
                        <span className="text-[10px] px-2.5 py-1 rounded-full bg-brand-100 text-brand-700" style={{ fontWeight: 700 }}>
                          {j.type}
                        </span>
                      </div>
                      <h3 className="font-display text-xl mb-1 leading-tight" style={{ fontWeight: 700 }}>{j.title}</h3>
                      <p className="text-sm text-ink-600" style={{ fontWeight: 700 }}>{j.company}</p>

                      <div className="flex flex-wrap gap-3 mt-3 text-xs text-ink-500">
                        <span className="flex items-center gap-1">
                          <MapPin size={11} /> {j.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} /> {j.experience}
                        </span>
                        {j.salary && (
                          <span className="flex items-center gap-1 text-brand-700" style={{ fontWeight: 700 }}>
                            <DollarSign size={11} /> {j.salary}
                          </span>
                        )}
                      </div>

                      {j.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-4 pt-3 border-t border-ink-100">
                          {j.skills.slice(0, 4).map((s, idx) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-ink-100 text-ink-700" style={{ fontWeight: 700 }}>
                              {s}
                            </span>
                          ))}
                          {j.skills.length > 4 && (
                            <span className="text-[10px] text-ink-500" style={{ fontWeight: 700 }}>
                              +{j.skills.length - 4} more
                            </span>
                          )}
                        </div>
                      )}

                      <p className="text-[11px] text-ink-400 mt-3">
                        Posted {new Date(j.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
