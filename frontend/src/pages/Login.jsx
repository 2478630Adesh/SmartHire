import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Briefcase, User } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const fillDemo = (role) => {
    if (role === 'hr') setForm({ email: 'hr@smarthirex.com', password: 'hr12345' });
    else setForm({ email: 'user@smarthirex.com', password: 'user12345' });
  };

  const handle = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = await login(form.email, form.password);
      toast.success(`Welcome back, ${data.name.split(' ')[0]}!`);
      navigate(data.role === 'hr' ? '/hr/dashboard' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
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
          <h1 className="font-display text-4xl mb-2">Welcome back</h1>
          <p className="text-ink-600 text-sm">Log in to continue building your career.</p>
        </div>
        <div className="card shadow-xl">
          <form onSubmit={handle} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input pl-9"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input pl-9"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Logging in...' : <><LogIn size={14} /> Log in</>}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-ink-100">
            <p className="text-xs text-ink-500 text-center mb-3">Try a demo account</p>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => fillDemo('user')} className="btn-outline text-xs !py-2">
                <User size={12} /> Job Seeker
              </button>
              <button type="button" onClick={() => fillDemo('hr')} className="btn-outline text-xs !py-2">
                <Briefcase size={12} /> HR Manager
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-ink-600 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-600 font-semibold">Sign up</Link>
        </p>
      </motion.div>
    </div>
  );
}
