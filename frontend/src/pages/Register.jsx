import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { User, Briefcase } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user', company: '' });
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handle = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setSubmitting(true);
    try {
      const data = await register(form);
      toast.success('Account created! Welcome to SmartHireX.');
      navigate(data.role === 'hr' ? '/hr/dashboard' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-6 hero-gradient">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl mb-2">Create your account</h1>
          <p className="text-ink-600 text-sm">Start building job-winning resumes in minutes.</p>
        </div>

        <div className="card shadow-xl">
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-2 mb-5 p-1 bg-ink-100 rounded-xl">
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'user' })}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition ${
                form.role === 'user' ? 'bg-white shadow text-ink-900' : 'text-ink-600'
              }`}
            >
              <User size={14} /> Job Seeker
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'hr' })}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition ${
                form.role === 'hr' ? 'bg-white shadow text-ink-900' : 'text-ink-600'
              }`}
            >
              <Briefcase size={14} /> HR Manager
            </button>
          </div>

          <form onSubmit={handle} className="space-y-4">
            <div>
              <label className="label">Full name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
                placeholder="Aarav Kumar"
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input"
                placeholder="you@example.com"
              />
            </div>
            {form.role === 'hr' && (
              <div>
                <label className="label">Company</label>
                <input
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="input"
                  placeholder="Your company name"
                />
              </div>
            )}
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input"
                placeholder="At least 6 characters"
              />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-ink-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 font-semibold">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
}
