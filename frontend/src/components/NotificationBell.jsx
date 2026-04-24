import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Trash2, CheckCheck, Sparkles, Briefcase, Users, AlertCircle } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const ICONS = {
  application: Briefcase,
  status_change: Sparkles,
  new_applicant: Users,
  job_posted: Briefcase,
  system: AlertCircle,
};

export default function NotificationBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const pollRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    load();
    pollRef.current = setInterval(load, 30000); // poll every 30s
    return () => clearInterval(pollRef.current);
  }, [user]); // eslint-disable-line

  async function load() {
    try {
      const { data } = await api.get('/notifications');
      setItems(data.notifications || []);
      setUnread(data.unreadCount || 0);
    } catch {}
  }

  const markRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      load();
    } catch {}
  };

  const markAll = async () => {
    try {
      await api.put('/notifications/read-all');
      load();
    } catch {}
  };

  const remove = async (id, e) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await api.delete(`/notifications/${id}`);
      load();
    } catch {}
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2.5 rounded-full border-2 border-ink-200 hover:border-brand-500 bg-white transition"
        aria-label="Notifications"
      >
        <Bell size={18} className="text-ink-700" />
        {unread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center border-2 border-white"
            style={{ fontWeight: 700 }}
          >
            {unread > 9 ? '9+' : unread}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-[380px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl border-2 border-ink-100 shadow-2xl overflow-hidden z-50"
            >
              {/* Header */}
              <div className="p-4 border-b-2 border-ink-100 bg-gradient-to-br from-brand-50 to-white flex justify-between items-center">
                <div>
                  <h3 className="text-base" style={{ fontWeight: 700 }}>Notifications</h3>
                  {unread > 0 && <p className="text-xs text-brand-700" style={{ fontWeight: 700 }}>{unread} unread</p>}
                </div>
                {unread > 0 && (
                  <button
                    onClick={markAll}
                    className="text-xs text-brand-700 hover:text-brand-800 flex items-center gap-1"
                    style={{ fontWeight: 700 }}
                  >
                    <CheckCheck size={12} /> Mark all read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-96 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="p-10 text-center">
                    <Bell size={32} className="text-ink-300 mx-auto mb-2" />
                    <p className="text-sm text-ink-500">You're all caught up!</p>
                  </div>
                ) : (
                  items.map((n) => {
                    const Icon = ICONS[n.type] || AlertCircle;
                    return (
                      <Link
                        key={n._id}
                        to={n.link || '/dashboard'}
                        onClick={() => {
                          if (!n.read) markRead(n._id);
                          setOpen(false);
                        }}
                        className={`block p-4 border-b border-ink-100 hover:bg-ink-50 transition relative ${
                          !n.read ? 'bg-brand-50/40' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                            n.type === 'new_applicant' ? 'bg-accent-100 text-accent-700' :
                            n.type === 'status_change' ? 'bg-brand-100 text-brand-700' :
                            'bg-sky-100 text-sky-700'
                          }`}>
                            <Icon size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm text-ink-900 truncate" style={{ fontWeight: 700 }}>{n.title}</p>
                              {!n.read && <span className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0 mt-1.5" />}
                            </div>
                            <p className="text-xs text-ink-600 mt-0.5 line-clamp-2">{n.message}</p>
                            <p className="text-[10px] text-ink-400 mt-1.5" style={{ fontWeight: 700 }}>
                              {timeAgo(n.createdAt)}
                            </p>
                          </div>
                          <button
                            onClick={(e) => remove(n._id, e)}
                            className="opacity-40 hover:opacity-100 hover:text-rose-500 transition p-1"
                            aria-label="Delete"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(date).toLocaleDateString();
}
