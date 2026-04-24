import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Briefcase, Clock, DollarSign, Filter } from 'lucide-react';
import api from '../utils/api';

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
    <div className="min-h-[calc(100vh-4rem)] bg-ink-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-5xl mb-2">Find your next role</h1>
          <p className="text-ink-600">Browse openings and apply with one click using your built resume.</p>
        </motion.div>

        {/* Search bar */}
        <div className="card mb-6 !p-4">
          <div className="grid md:grid-cols-4 gap-3">
            <div className="relative md:col-span-2">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input className="input pl-9" placeholder="Job title, company, or keyword" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="relative">
              <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input className="input pl-9" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <select className="input flex-1" value={type} onChange={(e) => setType(e.target.value)}>
                <option value="">All types</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
              <button onClick={load} className="btn-primary !px-4"><Filter size={14} /></button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-ink-400">Loading jobs...</div>
        ) : jobs.length === 0 ? (
          <div className="card text-center py-16 text-ink-500">No jobs match your search. Try different keywords.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {jobs.map((j, i) => (
              <motion.div
                key={j._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/jobs/${j._id}`} className="card block hover:shadow-lg hover:-translate-y-0.5 transition">
                  <div className="flex justify-between items-start mb-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-100 to-purple-100 flex items-center justify-center">
                      <Briefcase className="text-brand-600" size={20} />
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">{j.type}</span>
                  </div>
                  <h3 className="font-display text-xl mb-1">{j.title}</h3>
                  <p className="text-sm text-ink-600">{j.company}</p>
                  <div className="flex flex-wrap gap-3 mt-3 text-xs text-ink-500">
                    <span className="flex items-center gap-1"><MapPin size={10} /> {j.location}</span>
                    <span className="flex items-center gap-1"><Clock size={10} /> {j.experience}</span>
                    {j.salary && <span className="flex items-center gap-1"><DollarSign size={10} /> {j.salary}</span>}
                  </div>
                  {j.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {j.skills.slice(0, 5).map((s, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-ink-100 text-ink-600">{s}</span>
                      ))}
                      {j.skills.length > 5 && <span className="text-[10px] text-ink-500">+{j.skills.length - 5}</span>}
                    </div>
                  )}
                  <p className="text-xs text-ink-400 mt-3">Posted {new Date(j.createdAt).toLocaleDateString()}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
