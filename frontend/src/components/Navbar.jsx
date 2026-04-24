import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  Sparkles, LogOut, User, Briefcase, LayoutDashboard,
  FileText, Target, Search, PlusCircle, Menu, X, ChevronDown,
  BarChart3,
} from 'lucide-react';
import NotificationBell from './NotificationBell';

// Nav items configured per user role
const NAV_ITEMS = {
  guest: [
    { to: '/templates',   label: 'Templates',   icon: FileText },
    { to: '/jobs',        label: 'Find Jobs',   icon: Search },
    { to: '/ats-checker', label: 'ATS Checker', icon: Target },
  ],
  user: [
    { to: '/dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
    { to: '/templates',   label: 'Templates',   icon: FileText },
    { to: '/jobs',        label: 'Find Jobs',   icon: Search },
    { to: '/ats-checker', label: 'ATS Checker', icon: Target },
  ],
  hr: [
    { to: '/hr/dashboard',  label: 'Dashboard',   icon: LayoutDashboard },
    { to: '/hr/analytics',  label: 'Analytics',   icon: BarChart3 },
    { to: '/hr/post-job',   label: 'Post a Job',  icon: PlusCircle },
    { to: '/jobs',          label: 'Browse Jobs', icon: Search },
  ],
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const role = user ? user.role : 'guest';
  const items = NAV_ITEMS[role] || NAV_ITEMS.guest;

  const isActive = (path) => {
    if (path === '/hr/dashboard') return location.pathname.startsWith('/hr');
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b-2 border-ink-100"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        {/* LEFT: Logo */}
        <Link to={user ? (user.role === 'hr' ? '/hr/dashboard' : '/dashboard') : '/'} className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-2xl shadow-lg shadow-brand-500/25 transition-transform group-hover:-rotate-6"
               style={{ fontWeight: 700 }}>
            S
          </div>
          <div>
            <div className="font-display text-2xl leading-none" style={{ fontWeight: 700 }}>SmartHireX</div>
            {user?.role === 'hr' && (
              <div className="text-[11px] font-bold text-brand-700 uppercase tracking-wider mt-1">HR Portal</div>
            )}
            {user?.role === 'user' && (
              <div className="text-[11px] font-bold text-ink-500 uppercase tracking-wider mt-1">Job Seeker</div>
            )}
          </div>
        </Link>

        {/* CENTER: Nav links (desktop) */}
        <div className="hidden lg:flex items-center gap-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-[15px] transition-all ${
                  active
                    ? 'bg-ink-900 text-white shadow-md'
                    : 'text-ink-700 hover:bg-ink-100'
                }`}
                style={{ fontWeight: 700 }}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* RIGHT: User menu / auth buttons */}
        <div className="flex items-center gap-3">
          {user && <NotificationBell />}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 pl-2 pr-4 py-2 rounded-full border-2 border-ink-200 hover:border-brand-500 bg-white transition"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm shadow ${
                  user.role === 'hr' ? 'bg-gradient-to-br from-accent-500 to-accent-700' : 'bg-gradient-to-br from-brand-500 to-brand-700'
                }`} style={{ fontWeight: 700 }}>
                  {user.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm text-ink-900 leading-none" style={{ fontWeight: 700 }}>{user.name?.split(' ')[0]}</div>
                  <div className="text-[10px] text-ink-500 uppercase tracking-wider mt-0.5 font-bold">
                    {user.role === 'hr' ? 'HR Manager' : 'Job Seeker'}
                  </div>
                </div>
                <ChevronDown size={14} className={`text-ink-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)}></div>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border-2 border-ink-100 shadow-xl overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-ink-100 bg-gradient-to-br from-ink-50 to-white">
                      <div className="text-sm text-ink-900" style={{ fontWeight: 700 }}>{user.name}</div>
                      <div className="text-xs text-ink-500 mt-0.5">{user.email}</div>
                      {user.company && (
                        <div className="text-xs text-brand-700 mt-1.5 flex items-center gap-1" style={{ fontWeight: 700 }}>
                          <Briefcase size={11} /> {user.company}
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <Link
                        to={user.role === 'hr' ? '/hr/dashboard' : '/dashboard'}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-ink-100 text-ink-700"
                        style={{ fontWeight: 700 }}
                      >
                        <LayoutDashboard size={14} /> My Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-rose-50 text-rose-600 text-left"
                        style={{ fontWeight: 700 }}
                      >
                        <LogOut size={14} /> Sign out
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="hidden md:inline-flex items-center px-5 py-2.5 text-[15px] text-ink-700 hover:text-ink-900 transition" style={{ fontWeight: 700 }}>
                Log in
              </Link>
              <Link to="/register" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink-900 text-white text-[15px] hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-500/25 transition-all hover:-translate-y-0.5" style={{ fontWeight: 700 }}>
                <Sparkles size={16} /> Get started
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg border-2 border-ink-200 hover:border-brand-500"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE menu drawer */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden border-t-2 border-ink-100 bg-white"
        >
          <div className="px-6 py-4 space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    isActive(item.to) ? 'bg-ink-900 text-white' : 'text-ink-700 hover:bg-ink-100'
                  }`}
                  style={{ fontWeight: 700 }}
                >
                  <Icon size={18} /> {item.label}
                </Link>
              );
            })}
            {!user && (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block text-center px-4 py-3 rounded-xl border-2 border-ink-200 mt-2"
                style={{ fontWeight: 700 }}
              >
                Log in
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
