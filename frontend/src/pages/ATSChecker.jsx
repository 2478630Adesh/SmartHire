import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Target, CheckCircle2, AlertCircle, Sparkles, X, Eye, Hash, FileSearch } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function ATSChecker() {
  const { user } = useAuth();
  const [mode, setMode] = useState('upload');
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
    if (!jd.trim()) {
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
        const res = await api.post('/ats/analyze-upload', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        data = res.data;
      } else if (mode === 'saved') {
        if (!selectedResumeId) { toast.error('Please choose a saved resume'); setAnalyzing(false); return; }
        const res = await api.post('/ats/analyze-resume', {
          resumeId: selectedResumeId,
          jobDescription: jd,
        });
        data = res.data;
      }
      setResult(data);
      toast.success('Analysis complete!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] mesh-gradient">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-ink-200 text-xs font-medium text-ink-700 mb-4">
            <FileSearch size={12} className="text-brand-600" />
            ATS Resume Analyzer
          </div>
          <h1 className="font-display text-5xl md:text-6xl text-ink-900 mb-4 leading-tight">
            Check your <em className="italic text-brand-600">ATS match score</em>
          </h1>
          <p className="text-ink-600 max-w-2xl mx-auto">
            We'll extract the text from your resume, match it against the job description, and show you exactly what's working and what's missing.
          </p>
        </motion.div>

        {/* ---------- INPUT + RESULT LAYOUT ---------- */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* INPUT PANEL */}
          <div className="lg:col-span-2">
            <div className="card sticky top-20">
              <div className="flex gap-2 mb-5 p-1 bg-ink-100 rounded-xl">
                <button
                  onClick={() => setMode('upload')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                    mode === 'upload' ? 'bg-white shadow text-ink-900' : 'text-ink-600'
                  }`}
                >
                  Upload file
                </button>
                {user && (
                  <button
                    onClick={() => setMode('saved')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                      mode === 'saved' ? 'bg-white shadow text-ink-900' : 'text-ink-600'
                    }`}
                  >
                    Saved resume
                  </button>
                )}
              </div>

              {mode === 'upload' && <FileDrop file={file} setFile={setFile} />}

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
                    <p className="text-xs text-ink-500 mt-2">
                      No saved resumes yet. Create one from the Templates page first.
                    </p>
                  )}
                </div>
              )}

              <div className="mt-4">
                <label className="label">Job description</label>
                <textarea
                  className="input h-56 font-mono text-xs"
                  placeholder="Paste the complete job description here..."
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                />
                <p className="text-xs text-ink-500 mt-1">
                  Tip: include skills, requirements, and responsibilities for the most accurate score.
                </p>
              </div>

              <button
                onClick={analyze}
                disabled={analyzing}
                className="btn-primary w-full mt-4"
              >
                {analyzing ? 'Analyzing...' : <><Sparkles size={14} /> Analyze my resume</>}
              </button>
            </div>
          </div>

          {/* RESULT PANEL */}
          <div className="lg:col-span-3 space-y-4">
            <AnimatePresence mode="wait">
              {!result && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="card text-center py-24 text-ink-400"
                >
                  <Target size={56} className="mx-auto mb-4 opacity-30" />
                  <h3 className="font-display text-xl text-ink-600 mb-1">Your analysis will appear here</h3>
                  <p className="text-sm">Upload a resume and paste a job description to see the ATS match score, extracted text, and keyword analysis.</p>
                </motion.div>
              )}

              {result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* -------- SCORE CARD -------- */}
                  <div className="card bg-gradient-to-br from-white to-brand-50 border-brand-100">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <ScoreRing score={result.score} />
                      <div className="flex-1 text-center md:text-left">
                        <p className="text-xs uppercase tracking-wider text-ink-500 mb-1">Your ATS Match Score</p>
                        <h2 className="font-display text-5xl text-ink-900 leading-none">
                          {result.score}<span className="text-2xl text-ink-400">/100</span>
                        </h2>
                        <p className="text-sm mt-2 font-medium">
                          {result.score >= 80 ? (
                            <span className="text-brand-700">✓ Excellent match — you're ready to apply!</span>
                          ) : result.score >= 60 ? (
                            <span className="text-amber-700">◐ Good match — a few tweaks will make it great</span>
                          ) : (
                            <span className="text-rose-700">✕ Needs optimization — see suggestions below</span>
                          )}
                        </p>
                        <div className="flex gap-4 mt-3 text-xs text-ink-500">
                          <span className="flex items-center gap-1">
                            <Hash size={11} /> {result.wordCount || 0} words extracted
                          </span>
                          <span className="flex items-center gap-1">
                            <Target size={11} /> {result.totalKeywordsChecked} keywords checked
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* -------- EXTRACTED RESUME TEXT -------- */}
                  <div className="card">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-sm flex items-center gap-2">
                        <FileText size={16} className="text-brand-600" />
                        Extracted Resume Text
                      </h3>
                      {result.fileName && (
                        <span className="text-xs text-ink-500 bg-ink-100 px-2 py-1 rounded-full">
                          {result.fileName}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-ink-500 mb-3">
                      This is what the ATS "sees" from your resume. <span className="bg-brand-100 text-brand-700 px-1 rounded font-medium">Highlighted words</span> are keyword matches with the job description.
                    </p>
                    <div className="extracted-text">
                      <HighlightedText
                        text={result.extractedText || ''}
                        keywords={result.matchedKeywords || []}
                      />
                    </div>
                  </div>

                  {/* -------- MATCHED + MISSING -------- */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="card border-brand-100 bg-brand-50/40">
                      <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-brand-700">
                        <CheckCircle2 size={16} /> Matched Keywords
                        <span className="ml-auto text-xs px-2 py-0.5 bg-brand-100 rounded-full">
                          {result.matchedKeywords?.length || 0}
                        </span>
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {(result.matchedKeywords || []).length === 0 ? (
                          <span className="text-xs text-ink-500">No matches yet</span>
                        ) : (
                          (result.matchedKeywords || []).map((k, i) => (
                            <span key={i} className="px-2 py-1 text-xs bg-brand-100 text-brand-800 rounded-md font-medium">
                              {k}
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="card border-rose-100 bg-rose-50/30">
                      <h3 className="font-semibold text-sm mb-3 flex items-center gap-2 text-rose-700">
                        <AlertCircle size={16} /> Missing Keywords
                        <span className="ml-auto text-xs px-2 py-0.5 bg-rose-100 rounded-full">
                          {result.missingKeywords?.length || 0}
                        </span>
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {(result.missingKeywords || []).length === 0 ? (
                          <span className="text-xs text-ink-500">Nothing missing — great job!</span>
                        ) : (
                          (result.missingKeywords || []).map((k, i) => (
                            <span key={i} className="px-2 py-1 text-xs bg-rose-100 text-rose-800 rounded-md font-medium">
                              {k}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* -------- SUGGESTIONS -------- */}
                  <div className="card">
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Sparkles size={16} className="text-accent-500" />
                      Suggestions to improve
                    </h3>
                    <ul className="space-y-2.5">
                      {(result.suggestions || []).map((s, i) => (
                        <li key={i} className="text-sm flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-accent-100 text-accent-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span className="text-ink-700">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* -------- RESUME QUALITY ANALYSIS (new) -------- */}
                  {result.quality && (
                    <div className="card bg-gradient-to-br from-white to-accent-50/40 border-accent-100">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-display text-xl flex items-center gap-2" style={{ fontWeight: 700 }}>
                            <Sparkles size={18} className="text-accent-500" />
                            Resume Quality Grade
                          </h3>
                          <p className="text-xs text-ink-500 mt-0.5">Beyond keyword matching — writing quality analysis</p>
                        </div>
                        <div className="text-center">
                          <div className="font-display text-5xl" style={{
                            fontWeight: 700,
                            color: result.quality.overallScore >= 85 ? '#10B981' : result.quality.overallScore >= 70 ? '#F59E0B' : '#F43F5E'
                          }}>
                            {result.quality.overallGrade}
                          </div>
                          <div className="text-xs text-ink-500 mt-0.5" style={{ fontWeight: 700 }}>
                            {result.quality.overallScore}/100
                          </div>
                        </div>
                      </div>

                      {/* Metrics grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <QualityMetric label="Action Verbs"     value={result.quality.checks.actionVerbCount}     sub={`${result.quality.checks.actionVerbRatio}% of sentences`} good={result.quality.checks.actionVerbRatio >= 40} />
                        <QualityMetric label="Quantified"       value={result.quality.checks.quantifiedCount}     sub="metrics found" good={result.quality.checks.quantifiedCount >= 3} />
                        <QualityMetric label="Passive Voice"    value={result.quality.checks.passiveCount}        sub="instances" good={result.quality.checks.passiveCount <= 3} invert />
                        <QualityMetric label="Avg Bullet"       value={`${result.quality.checks.avgBulletLength}`} sub="words" good={result.quality.checks.avgBulletLength >= 12 && result.quality.checks.avgBulletLength <= 28} />
                      </div>

                      {/* Highlights */}
                      {result.quality.highlights?.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-xs uppercase tracking-wider text-brand-700 mb-2" style={{ fontWeight: 700 }}>What's Working</h4>
                          <ul className="space-y-1.5">
                            {result.quality.highlights.map((h, i) => (
                              <li key={i} className="text-sm flex items-start gap-2">
                                <CheckCircle2 size={14} className="text-brand-600 mt-0.5 flex-shrink-0" />
                                <span className="text-ink-700">{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Issues */}
                      {result.quality.issues?.length > 0 && (
                        <div>
                          <h4 className="text-xs uppercase tracking-wider text-rose-700 mb-2" style={{ fontWeight: 700 }}>Issues to Fix</h4>
                          <ul className="space-y-2">
                            {result.quality.issues.map((iss, i) => (
                              <li key={i} className={`p-3 rounded-lg border-l-4 ${
                                iss.type === 'error' ? 'bg-rose-50 border-rose-400' :
                                iss.type === 'warning' ? 'bg-amber-50 border-amber-400' :
                                'bg-sky-50 border-sky-400'
                              }`}>
                                <div className="text-sm text-ink-900" style={{ fontWeight: 700 }}>{iss.title}</div>
                                <div className="text-xs text-ink-700 mt-1">{iss.detail}</div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Action verbs used */}
                      {result.quality.checks.foundActionVerbs?.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-accent-100">
                          <p className="text-xs text-ink-600 mb-2" style={{ fontWeight: 700 }}>Action verbs you're using:</p>
                          <div className="flex flex-wrap gap-1">
                            {result.quality.checks.foundActionVerbs.map((v, i) => (
                              <span key={i} className="px-2 py-0.5 rounded-md text-[10px] bg-brand-100 text-brand-800" style={{ fontWeight: 700 }}>
                                {v}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* -------- RESUME HEALTH CHECK -------- */}
                  <div className="card">
                    <h3 className="font-semibold text-sm mb-3">Resume Health Check</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(result.checks || {}).map(([k, v]) => (
                        <div key={k} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${v ? 'bg-brand-50' : 'bg-ink-100'}`}>
                          {v ? (
                            <CheckCircle2 size={14} className="text-brand-600 flex-shrink-0" />
                          ) : (
                            <X size={14} className="text-ink-400 flex-shrink-0" />
                          )}
                          <span className={`text-sm ${v ? 'text-ink-800' : 'text-ink-500'}`}>
                            {formatCheck(k)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* -------- RAW SCORE BREAKDOWN -------- */}
                  <div className="card bg-ink-50 border-ink-200">
                    <h3 className="font-semibold text-sm mb-2">Score Breakdown</h3>
                    <div className="text-xs text-ink-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Keyword match score</span>
                        <span className="font-mono font-semibold">{result.rawKeywordScore}/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Structural bonus (contact, sections, length)</span>
                        <span className="font-mono font-semibold">+{result.bonus}</span>
                      </div>
                      <div className="flex justify-between pt-1 mt-1 border-t border-ink-200">
                        <span className="font-semibold text-ink-800">Final score</span>
                        <span className="font-mono font-bold text-brand-700">{result.score}/100</span>
                      </div>
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

/* ---------- File dropzone ---------- */
function FileDrop({ file, setFile }) {
  const onDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  };
  return (
    <div>
      <label className="label">Upload your resume</label>
      <label
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="block border-2 border-dashed border-ink-200 rounded-xl p-8 text-center cursor-pointer hover:border-brand-500 hover:bg-brand-50/40 transition"
      >
        <input
          type="file"
          accept=".pdf,.docx,.doc,.txt"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />
        {file ? (
          <div className="flex items-center justify-center gap-2">
            <FileText className="text-brand-600" size={18} />
            <span className="text-sm font-medium text-ink-800">{file.name}</span>
            <span className="text-xs text-ink-400">({(file.size / 1024).toFixed(1)} KB)</span>
          </div>
        ) : (
          <>
            <Upload className="mx-auto text-ink-400 mb-2" size={28} />
            <p className="text-sm text-ink-700 font-medium">Click or drag a file here</p>
            <p className="text-xs text-ink-400 mt-1">PDF, DOCX, or TXT • Max 5 MB</p>
          </>
        )}
      </label>
    </div>
  );
}

/* ---------- Animated score ring ---------- */
function ScoreRing({ score }) {
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#F43F5E';
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r={radius} stroke="#E7E5E4" strokeWidth="10" fill="none" />
      <circle
        cx="70" cy="70" r={radius}
        stroke={color} strokeWidth="10" fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 70 70)"
        className="score-ring"
      />
      <text x="70" y="78" textAnchor="middle" fontSize="30" fontWeight="700" fill={color} fontFamily="Inter">
        {score}
      </text>
    </svg>
  );
}

/* ---------- Highlight matched keywords in the extracted text ---------- */
function HighlightedText({ text, keywords }) {
  if (!text) return <span className="text-ink-400 italic">No text extracted</span>;
  if (!keywords || keywords.length === 0) return <>{text}</>;

  // Build a single case-insensitive regex covering all keywords, whole-word
  const escaped = keywords
    .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .filter(Boolean)
    .sort((a, b) => b.length - a.length); // longest first so bigrams match before unigrams
  if (escaped.length === 0) return <>{text}</>;

  const regex = new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) => {
        const isMatch = keywords.some((k) => k.toLowerCase() === part.toLowerCase());
        return isMatch
          ? <mark key={i}>{part}</mark>
          : <span key={i}>{part}</span>;
      })}
    </>
  );
}

function formatCheck(key) {
  const map = {
    hasEmail: 'Email address',
    hasPhone: 'Phone number',
    hasExperience: 'Experience section',
    hasEducation: 'Education section',
    hasSkills: 'Skills section',
    lengthOk: 'Optimal length (200–8000 chars)',
  };
  return map[key] || key;
}

function QualityMetric({ label, value, sub, good, invert = false }) {
  const isGood = good;
  return (
    <div className={`p-3 rounded-xl text-center ${isGood ? 'bg-brand-50 border border-brand-200' : 'bg-rose-50 border border-rose-200'}`}>
      <div className={`text-2xl ${isGood ? 'text-brand-700' : 'text-rose-700'}`} style={{ fontWeight: 700 }}>
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-ink-700 mt-1" style={{ fontWeight: 700 }}>{label}</div>
      <div className="text-[10px] text-ink-500">{sub}</div>
    </div>
  );
}
