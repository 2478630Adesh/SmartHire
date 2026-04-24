import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-white mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center font-bold">S</div>
              <span className="font-display text-2xl">SmartHireX</span>
            </div>
            <p className="text-sm text-ink-400 leading-relaxed">
              We help job seekers stand out in the highly competitive labor market with AI-powered resume building and ATS optimization.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-ink-400">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/templates" className="hover:text-white text-ink-400">Resume Builder</Link></li>
              <li><Link to="/templates" className="hover:text-white text-ink-400">Templates</Link></li>
              <li><Link to="/ats-checker" className="hover:text-white text-ink-400">ATS Checker</Link></li>
              <li><Link to="/jobs" className="hover:text-white text-ink-400">Find Jobs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-ink-400">For Employers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/register" className="hover:text-white text-ink-400">Post a Job</Link></li>
              <li><Link to="/hr/dashboard" className="hover:text-white text-ink-400">HR Dashboard</Link></li>
              <li><Link to="/login" className="hover:text-white text-ink-400">HR Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-ink-400">Connect</h4>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full border border-ink-600 flex items-center justify-center hover:bg-white hover:text-ink-900 transition">
                <Github size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-ink-600 flex items-center justify-center hover:bg-white hover:text-ink-900 transition">
                <Twitter size={16} />
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-ink-600 flex items-center justify-center hover:bg-white hover:text-ink-900 transition">
                <Linkedin size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-ink-800 mt-12 pt-6 text-sm text-ink-400 flex flex-col md:flex-row justify-between gap-3">
          <p>© 2026 SmartHireX. Final Year Project.</p>
          <p>Built by Group A-11</p>
        </div>
      </div>
    </footer>
  );
}
