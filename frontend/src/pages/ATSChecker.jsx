import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Target, CheckCircle2, AlertCircle, Sparkles, X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function ATSChecker() {
  const { user } = useAuth();
  const [mode, setMode] = useState('upload'); // upload | saved
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState('');
  const [savedResumes, setSavedResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (user) api.get('/resumes').then((r) => setSavedResumes(r.data)).catch(() => {});
  }, [user]);

  const analyze = async () => {
    if (!jd.trim() && mode !== 'upload-basic') {
      toast.error('Please paste a job description');
      return;
    }
    setAnalyzing(true);
    setResult(null);
    try {
      let data;
      if (mode === 'upload') {
        if (!file) { toast.error('Please upload a resume file'); setAnalyzing(false); return; }
        const fd = new FormData();
        fd.append('resume', file);
        fd.append('jobDescription', jd);
        const res = await api.post('/ats/analyze-upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        data = res.data;
      } else if (mode === 'saved') {
        if (!selectedResumeId) { toast.error('Please choose a saved resume'); setAnalyzing(false); return; }
        const res = await api.post('/ats/analyze-resume', { resumeId: selectedResumeId, jobDescription: jd });
        data = res.data;
      }
      setResult(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-ink-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <p className="text-sm uppercase tracking-widest text-brand-600 font-semibold mb-3">ATS Resume Checker</p>
          <h1 className="font-display text-5xl md:text-6xl text-ink-900 mb-4">Check your <em className="italic">ATS score</em></h1>
          <p className="text-ink-600 max-w-2xl mx-auto">Upload your resume and paste a job description. We'll analyze the match and show you exactly what's missing.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* LEFT: Input */}
          <div className="card">
            <div className="flex gap-2 mb-5 p-1 bg-ink-100 rounded-xl">
              <button
                onClick={() => setMode('upload')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${mode === 'upload' ? 'bg-white shadow' : 'text-ink-600'}`}
              >
                Upload file
              </button>
              {user && (
                <button
                  onClick={() => setMode('saved')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${mode === 'saved' ? 'bg-white shadow' : 'text-ink-600'}`}
                >
                  Saved resume
                </button>
              )}
            </div>

            {mode === 'upload' && (
              <FileDrop file={file} setFile={setFile} />
            )}

            {mode === 'saved' && (
              <div className="mb-4">
                <label className="label">Select a saved resume</label>
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="input"
                >
                  <option value="">-- Choose --</option>
                  {savedResumes.map((r) => (
                    <option key={r._id} value={r._id}>{r.title}</option>
                  ))}
                </select>
                {savedResumes.length === 0 && (
                  <p className="text-xs text-ink-500 mt-2">No saved resumes yet. Create one from the Templates page.</p>
                )}
              </div>
            )}

            <div className="mt-4">
              <label className="label">Job description</label>
              <textarea
                className="input h-64"
                placeholder="Paste the job description here..."
                value={jd}
                onChange={(e) => setJd(e.target.value)}
              />
            </div>

            <button onClick={analyze} disabled={analyzing} className="btn-primary w-full mt-4">
              {analyzing ? 'Analyzing...' : <><Sparkles size={14} /> Analyze my resume</>}
            </button>
          </div>

          {/* RIGHT: Result */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {!result && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="card text-center py-20 text-ink-400"
                >
                  <Target size={48} className="mx-auto mb-3 opacity-30" />
                  <p>Your ATS analysis will appear here.</p>
                </motion.div>
              )}

              {result && (
                <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  {/* Score ring */}
                  <div className="card flex items-center gap-6">
                    <ScoreRing score={result.score} />
                    <div>
                      <p className="text-sm text-ink-500">Your ATS Score</p>
                      <h2 className="font-display text-5xl">{result.score}<span className="text-2xl text-ink-400">/100</span></h2>
                      <p className="text-sm mt-1">
                        {result.score >= 80 ? <span className="text-green-600 font-medium">Excellent match!</span> :
                         result.score >= 60 ? <span className="text-amber-600 font-medium">Good — with room to improve</span> :
                         <span className="text-red-600 font-medium">Needs optimization</span>}
                      </p>
                    </div>
                  </div>

                  {/* Matched + Missing */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="card">
                      <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-green-700">
                        <CheckCircle2 size={16} /> Matched ({result.matchedKeywords?.length})
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {(result.matchedKeywords || []).map((k, i) => (
                          <span key={i} className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">{k}</span>
                        ))}
                      </div>
                    </div>
                    <div className="card">
                      <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-red-600">
                        <AlertCircle size={16} /> Missing ({result.missingKeywords?.length})
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {(result.missingKeywords || []).map((k, i) => (
                          <span key={i} className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">{k}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div className="card">
                    <h3 className="font-semibold text-sm mb-3">Suggestions to improve</h3>
                    <ul className="space-y-2">
                      {(result.suggestions || []).map((s, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <Sparkles size={14} className="text-brand-600 mt-0.5 flex-shrink-0" /> <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Structural checks */}
                  <div className="card">
                    <h3 className="font-semibold text-sm mb-3">Resume Health Check</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(result.checks || {}).map(([k, v]) => (
                        <div key={k} className="flex items-center gap-2">
                          {v ? <CheckCircle2 size={14} className="text-green-600" /> : <X size={14} className="text-red-500" />}
                          <span className={v ? '' : 'text-ink-500'}>{formatCheck(k)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function FileDrop({ file, setFile }) {
  const onDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };
  return (
    <div>
      <label className="label">Upload your resume (PDF, DOCX, TXT)</label>
      <label
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="block border-2 border-dashed border-ink-200 rounded-xl p-8 text-center cursor-pointer hover:border-brand-500 transition"
      >
        <input
          type="file"
          accept=".pdf,.docx,.doc,.txt"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />
        {file ? (
          <div className="flex items-center justify-center gap-2">
            <FileText className="text-brand-600" />
            <span className="text-sm font-medium">{file.name}</span>
            <span className="text-xs text-ink-400">({(file.size / 1024).toFixed(1)} KB)</span>
          </div>
        ) : (
          <>
            <Upload className="mx-auto text-ink-400 mb-2" />
            <p className="text-sm text-ink-600">Click or drag a file here</p>
            <p className="text-xs text-ink-400 mt-1">Max 5 MB • PDF, DOCX, TXT</p>
          </>
        )}
      </label>
    </div>
  );
}

function ScoreRing({ score }) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444';
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r={radius} stroke="#E5E7EB" strokeWidth="10" fill="none" />
      <circle
        cx="60" cy="60" r={radius}
        stroke={color} strokeWidth="10" fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 60 60)"
        className="score-ring"
      />
      <text x="60" y="68" textAnchor="middle" fontSize="26" fontWeight="700" fill={color}>{score}</text>
    </svg>
  );
}

function formatCheck(key) {
  const map = {
    hasEmail: 'Email present',
    hasPhone: 'Phone number',
    hasExperience: 'Experience section',
    hasEducation: 'Education section',
    hasSkills: 'Skills section',
    lengthOk: 'Optimal length',
  };
  return map[key] || key;
}
