import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Sparkles, LogOut, User, Briefcase, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-ink-100"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg transition-transform group-hover:rotate-6">
            S
          </div>
          <span className="font-display text-2xl tracking-tight">SmartHireX</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-ink-600">
          <Link to="/templates" className="hover:text-ink-900 transition">Templates</Link>
          <Link to="/jobs" className="hover:text-ink-900 transition">Jobs</Link>
          <Link to="/ats-checker" className="hover:text-ink-900 transition">ATS Checker</Link>
          {user && <Link to="/dashboard" className="hover:text-ink-900 transition">Dashboard</Link>}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to={user.role === 'hr' ? '/hr/dashboard' : '/dashboard'}
                className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-full bg-ink-100 hover:bg-ink-200 transition"
              >
                {user.role === 'hr' ? <Briefcase size={14} /> : <User size={14} />}
                <span className="font-medium">{user.name.split(' ')[0]}</span>
              </Link>
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="p-2 rounded-full hover:bg-ink-100 transition"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-ink-600 hover:text-ink-900 px-3 py-1.5">Log in</Link>
              <Link to="/register" className="btn-primary !py-2 !px-5 !text-sm">
                <Sparkles size={14} /> Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
