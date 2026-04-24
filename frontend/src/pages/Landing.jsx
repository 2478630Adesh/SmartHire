import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, FileCheck, Zap, Award, TrendingUp, Target, Users, Briefcase, CheckCircle2, ArrowRight, Star, Layers, Bot } from 'lucide-react';

const testimonials = [
  { name: 'Anna Peterson',  text: "I applied to 20+ job postings with no luck. But once I made an ATS-friendly resume on SmartHireX, I've started getting a lot more responses from recruiters.", role: 'Marketing Lead' },
  { name: 'Mark Heighter',  text: "SmartHireX's ATS scoring saved me tons of time. Now I have a professional resume, and it was so easy to make. Thanks!", role: 'Software Engineer' },
  { name: 'Byron Moreno',   text: 'I struggled to create a resume before. This tool fixed it, and now I finally have a job!', role: 'Designer' },
  { name: 'Sophia Miller',  text: 'The ATS analyzer with relevant keywords made my bullet-points much more persuasive. I got 3 interviews just this week!', role: 'Data Analyst' },
  { name: 'Valerie Madron', text: 'I was so stuck describing my experience, but SmartHireX did the job for me. Got my interview the same day!', role: 'Product Manager' },
  { name: 'Laura Nguyen',   text: 'Way less stress, more time saved. Now I know my resume is created the right way!', role: 'Business Analyst' },
];

export default function Landing() {
  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative hero-gradient pt-16 pb-24 px-6">
        <div className="blob bg-brand-500" style={{ width: 400, height: 400, top: -100, left: -100 }}></div>
        <div className="blob bg-amber-300" style={{ width: 500, height: 500, bottom: -150, right: -100 }}></div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur border border-white text-xs font-medium text-ink-800 mb-6">
                <Sparkles size={12} className="text-brand-600" />
                AI-powered resume intelligence
              </div>
              <h1 className="font-display text-5xl md:text-7xl leading-[1.05] text-ink-900 mb-6">
                Create your <em className="italic text-brand-600">job-winning</em> resume in minutes
              </h1>
              <p className="text-lg text-ink-600 mb-8 max-w-lg leading-relaxed">
                The first step to a better job? A better resume. Build, analyze, and optimize your resume against real job descriptions — all in one place.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <Link to="/templates" className="btn-primary">
                  Create New Resume <ArrowRight size={16} />
                </Link>
                <Link to="/ats-checker" className="btn-secondary">
                  Improve My Resume
                </Link>
              </div>
              <div className="flex gap-8 text-sm">
                <div>
                  <div className="font-display text-3xl text-ink-900">48%</div>
                  <div className="text-ink-600">more likely to get hired</div>
                </div>
                <div>
                  <div className="font-display text-3xl text-ink-900">12%</div>
                  <div className="text-ink-600">better pay with next job</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                {/* Main resume card */}
                <div className="bg-white rounded-2xl shadow-2xl p-6 rotate-[-3deg] hover:rotate-0 transition-transform duration-500">
                  <div className="border-b pb-3 mb-3">
                    <div className="h-4 w-1/2 bg-ink-900 rounded mb-2"></div>
                    <div className="h-2 w-1/3 bg-ink-300 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-ink-200 rounded w-full"></div>
                    <div className="h-2 bg-ink-200 rounded w-5/6"></div>
                    <div className="h-2 bg-ink-200 rounded w-4/6"></div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <div className="h-5 w-14 bg-brand-100 rounded-full"></div>
                    <div className="h-5 w-12 bg-amber-100 rounded-full"></div>
                    <div className="h-5 w-16 bg-green-100 rounded-full"></div>
                  </div>
                </div>
                {/* ATS badge floating */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="absolute -top-4 -right-4 bg-green-500 text-white rounded-2xl p-4 shadow-xl"
                >
                  <div className="text-xs font-medium">ATS Score</div>
                  <div className="font-display text-3xl">92%</div>
                  <div className="text-xs opacity-90">Perfect match!</div>
                </motion.div>
                {/* AI suggestion bubble */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1 }}
                  className="absolute -bottom-6 -left-8 bg-white rounded-2xl p-4 shadow-xl max-w-xs"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Bot size={14} className="text-brand-600" />
                    <span className="text-xs font-semibold text-brand-600">AI suggestion</span>
                  </div>
                  <p className="text-xs text-ink-800">Reduced operational costs by 15% through process optimization.</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TRUSTED BY */}
      <section className="py-12 bg-white border-y border-ink-100 overflow-hidden">
        <p className="text-center text-xs uppercase tracking-widest text-ink-400 mb-6">Our users have been hired at</p>
        <div className="flex gap-12 marquee whitespace-nowrap">
          {['Google','Meta','Amazon','Microsoft','Apple','Netflix','Airbnb','Stripe','TCS','Infosys','Wipro','Flipkart','Swiggy','Zomato'].concat(['Google','Meta','Amazon','Microsoft','Apple','Netflix','Airbnb','Stripe','TCS','Infosys','Wipro','Flipkart','Swiggy','Zomato']).map((c, i) => (
            <span key={i} className="font-display text-3xl text-ink-400">{c}</span>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6 bg-ink-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-brand-600 font-semibold mb-3">Why SmartHireX</p>
            <h2 className="font-display text-5xl text-ink-900 mb-4">Why use SmartHireX's Resume Builder?</h2>
            <p className="text-ink-600 max-w-2xl mx-auto">Everything you need to build, analyze, and optimize your resume — powered by intelligent keyword matching and ATS best practices.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Layers,      title: 'Modern templates',       desc: '10+ professional templates for all jobs and experience levels.' },
              { icon: FileCheck,   title: 'ATS-friendly resumes',   desc: 'Your resume will pass the software many companies use to screen applicants.' },
              { icon: Bot,         title: 'Pre-written content',    desc: 'Use ready-made content to save time and avoid the stress of writing from scratch.' },
              { icon: Target,      title: 'Keyword matching',       desc: 'Match your resume to any job description and see exactly what\'s missing.' },
              { icon: TrendingUp,  title: 'Beat the competition',   desc: 'Stand out with an impressive resume that shows off your strengths.' },
              { icon: Award,       title: 'Get paid more',          desc: 'A strong resume opens doors. SmartHireX helps you move toward better offers.' },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card hover:shadow-lg transition"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center mb-4">
                  <f.icon className="text-brand-600" size={22} />
                </div>
                <h3 className="font-display text-2xl mb-2">{f.title}</h3>
                <p className="text-ink-600 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-5xl text-ink-900 mb-4">How to get a job with SmartHireX?</h2>
            <p className="text-ink-600 max-w-2xl mx-auto">Four simple steps to go from blank page to signed offer.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Layers,   title: 'Pick a template',       desc: 'Choose from 10+ professional templates designed for every industry.' },
              { icon: Zap,      title: 'Build in minutes',      desc: 'Fill in your info, pick colors, and watch your resume come together live.' },
              { icon: Target,   title: 'Analyze against jobs',  desc: 'Paste a job description and get an ATS score with missing keywords.' },
              { icon: Briefcase,title: 'Apply & track',         desc: 'Browse jobs, apply with one click, and track every application.' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-ink-900 text-white flex items-center justify-center text-sm font-bold">{i + 1}</div>
                <div className="bg-gradient-to-br from-brand-100 to-purple-100 rounded-2xl p-6 h-48 flex items-center justify-center mb-4">
                  <s.icon size={56} className="text-brand-700" />
                </div>
                <h3 className="font-display text-2xl mb-1">{s.title}</h3>
                <p className="text-sm text-ink-600">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 bg-ink-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-5xl text-ink-900 mb-4">What our users are saying</h2>
            <div className="flex justify-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (<Star key={i} size={18} fill="currentColor" />))}
              <span className="ml-2 text-ink-600 text-sm">Loved by 50,000+ job seekers</span>
            </div>
          </div>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.1 }}
                className="card break-inside-avoid"
              >
                <div className="flex gap-0.5 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (<Star key={i} size={12} fill="currentColor" />))}
                </div>
                <p className="text-ink-800 text-sm leading-relaxed mb-3">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-ink-100">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-purple-400 flex items-center justify-center text-white text-sm font-semibold">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{t.name}</div>
                    <div className="text-xs text-ink-400">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-ink-900 text-white relative overflow-hidden">
        <div className="blob bg-brand-500" style={{ width: 500, height: 500, top: -200, left: -100, opacity: 0.3 }}></div>
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="font-display text-5xl md:text-6xl mb-5">Get noticed, get hired faster</h2>
          <p className="text-ink-400 mb-8 text-lg">It's easier with SmartHireX. Build a professional, job-winning resume in minutes!</p>
          <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-ink-900 font-semibold hover:bg-brand-500 hover:text-white transition">
            Land My Dream Job <ArrowRight size={18} />
          </Link>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-ink-400">
            <div className="flex items-center gap-2"><CheckCircle2 size={14} /> 100% Free to start</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={14} /> ATS-optimized</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={14} /> 10+ templates</div>
          </div>
        </div>
      </section>
    </div>
  );
}
