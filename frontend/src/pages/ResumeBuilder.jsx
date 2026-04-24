import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, Download, Plus, Trash2, ArrowLeft, Layers, Palette, Eye, EyeOff, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import api from '../utils/api';
import { TEMPLATES, getTemplate } from '../templates';

const SECTIONS = [
  { key: 'personal',    label: 'Personal Info' },
  { key: 'summary',     label: 'Summary' },
  { key: 'experience',  label: 'Experience' },
  { key: 'education',   label: 'Education' },
  { key: 'skills',      label: 'Skills' },
  { key: 'projects',    label: 'Projects' },
  { key: 'certifications', label: 'Certifications' },
  { key: 'languages',   label: 'Languages' },
  { key: 'achievements',label: 'Achievements' },
];

export default function ResumeBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [activeSection, setActiveSection] = useState('personal');
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const previewRef = useRef(null);

  useEffect(() => { load(); }, [id]); // eslint-disable-line
  async function load() {
    try {
      const { data } = await api.get(`/resumes/${id}`);
      setResume(data);
    } catch {
      toast.error('Resume not found');
      navigate('/dashboard');
    }
  }

  const update = (path, value) => {
    setResume((r) => {
      const copy = JSON.parse(JSON.stringify(r));
      const keys = path.split('.');
      let obj = copy;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return copy;
    });
  };

  const save = async (silent = false) => {
    setSaving(true);
    try {
      const { data } = await api.put(`/resumes/${id}`, resume);
      setResume(data);
      if (!silent) toast.success('Saved!');
    } catch {
      if (!silent) toast.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  // autosave every 5 seconds if dirty (simple debounce via setTimeout)
  useEffect(() => {
    if (!resume) return;
    const t = setTimeout(() => save(true), 3000);
    return () => clearTimeout(t);
  }, [resume]); // eslint-disable-line

  const exportPDF = async () => {
    if (!previewRef.current) return;
    toast.loading('Generating PDF...', { id: 'pdf' });
    try {
      const node = previewRef.current.querySelector('.resume-preview');
      if (!node) throw new Error('Preview not ready');
      const canvas = await html2canvas(node, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const img = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = (canvas.height * pdfW) / canvas.width;
      pdf.addImage(img, 'PNG', 0, 0, pdfW, pdfH);
      pdf.save(`${resume.title || 'resume'}.pdf`);
      toast.success('PDF downloaded!', { id: 'pdf' });
    } catch (err) {
      toast.error('Export failed: ' + err.message, { id: 'pdf' });
    }
  };

  const changeTemplate = (tplId) => {
    update('templateId', tplId);
    const tpl = getTemplate(tplId);
    update('colors.primary', tpl.color);
    setShowTemplates(false);
    toast.success('Template changed!');
  };

  if (!resume) return <div className="text-center py-20 text-ink-400">Loading...</div>;

  const tpl = getTemplate(resume.templateId);
  const TemplateComp = tpl.component;

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-ink-50 overflow-hidden">
      {/* LEFT: Section nav */}
      <div className="w-56 bg-white border-r border-ink-100 flex flex-col">
        <div className="p-4 border-b border-ink-100">
          <button onClick={() => navigate('/dashboard')} className="text-xs text-ink-500 hover:text-ink-900 flex items-center gap-1">
            <ArrowLeft size={12} /> Back
          </button>
          <input
            value={resume.title}
            onChange={(e) => update('title', e.target.value)}
            className="w-full mt-2 font-display text-lg bg-transparent border-0 focus:outline-none focus:ring-0 p-0"
          />
        </div>
        <nav className="flex-1 p-2 overflow-y-auto">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition mb-0.5 ${
                activeSection === s.key ? 'bg-ink-900 text-white' : 'text-ink-600 hover:bg-ink-100'
              }`}
            >
              {s.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-ink-100 space-y-2">
          <button onClick={() => setShowTemplates(true)} className="btn-outline w-full !text-xs !py-2">
            <Layers size={12} /> Change template
          </button>
          <button onClick={() => save()} disabled={saving} className="btn-primary w-full !text-xs !py-2">
            <Save size={12} /> {saving ? 'Saving...' : 'Save'}
          </button>
          <button onClick={exportPDF} className="btn-secondary w-full !text-xs !py-2">
            <Download size={12} /> Export PDF
          </button>
        </div>
      </div>

      {/* CENTER: Form */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto p-8">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeSection === 'personal' && <PersonalForm data={resume.personalInfo} update={update} />}
            {activeSection === 'summary' && <SummaryForm data={resume.personalInfo} update={update} />}
            {activeSection === 'experience' && (
              <ArrayForm
                title="Work Experience"
                items={resume.experience}
                onChange={(items) => update('experience', items)}
                schema={[
                  { key: 'jobTitle',   label: 'Job title',    placeholder: 'Software Engineer' },
                  { key: 'company',    label: 'Company',      placeholder: 'Acme Corp' },
                  { key: 'location',   label: 'Location',     placeholder: 'Bangalore' },
                  { key: 'startDate',  label: 'Start date',   placeholder: 'Jan 2023' },
                  { key: 'endDate',    label: 'End date',     placeholder: 'Present' },
                  { key: 'description',label: 'Description',  placeholder: 'What did you accomplish?', type: 'textarea' },
                ]}
              />
            )}
            {activeSection === 'education' && (
              <ArrayForm
                title="Education"
                items={resume.education}
                onChange={(items) => update('education', items)}
                schema={[
                  { key: 'degree',      label: 'Degree',        placeholder: 'B.Tech in Computer Science' },
                  { key: 'institution', label: 'Institution',   placeholder: 'Anna University' },
                  { key: 'location',    label: 'Location',      placeholder: 'Chennai' },
                  { key: 'startDate',   label: 'Start date',    placeholder: '2019' },
                  { key: 'endDate',     label: 'End date',      placeholder: '2023' },
                  { key: 'gpa',         label: 'GPA / Grade',   placeholder: '8.5 / 10' },
                ]}
              />
            )}
            {activeSection === 'skills' && <SkillsForm data={resume.skills} update={(v) => update('skills', v)} />}
            {activeSection === 'projects' && (
              <ArrayForm
                title="Projects"
                items={resume.projects}
                onChange={(items) => update('projects', items)}
                schema={[
                  { key: 'name',         label: 'Project name',  placeholder: 'SmartHireX' },
                  { key: 'description',  label: 'Description',   placeholder: 'What does it do?', type: 'textarea' },
                  { key: 'technologies', label: 'Tech used',     placeholder: 'React, Node.js, MongoDB' },
                  { key: 'link',         label: 'Link',          placeholder: 'github.com/...' },
                ]}
              />
            )}
            {activeSection === 'certifications' && (
              <ArrayForm
                title="Certifications"
                items={resume.certifications}
                onChange={(items) => update('certifications', items)}
                schema={[
                  { key: 'name',   label: 'Name',   placeholder: 'AWS Cloud Practitioner' },
                  { key: 'issuer', label: 'Issuer', placeholder: 'Amazon' },
                  { key: 'date',   label: 'Date',   placeholder: '2024' },
                ]}
              />
            )}
            {activeSection === 'languages' && (
              <ArrayForm
                title="Languages"
                items={resume.languages}
                onChange={(items) => update('languages', items)}
                schema={[
                  { key: 'name',        label: 'Language',    placeholder: 'English' },
                  { key: 'proficiency', label: 'Proficiency', placeholder: 'Native / Fluent / Intermediate' },
                ]}
              />
            )}
            {activeSection === 'achievements' && (
              <AchievementsForm items={resume.achievements} onChange={(v) => update('achievements', v)} />
            )}
          </motion.div>

          {/* Colors */}
          <div className="mt-10 card">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Palette size={14} /> Customize colors
            </h3>
            <div className="flex gap-2 flex-wrap">
              {['#0A66C2','#7C3AED','#DC2626','#EA580C','#10B981','#0891B2','#6366F1','#1E293B','#C19A6B','#DB2777'].map((c) => (
                <button
                  key={c}
                  onClick={() => update('colors.primary', c)}
                  className={`w-8 h-8 rounded-full border-2 transition ${
                    resume.colors?.primary === c ? 'border-ink-900 scale-110' : 'border-white'
                  }`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Live preview */}
      {showPreview && (
        <div className="w-[45%] bg-ink-100 overflow-y-auto p-6">
          <div className="sticky top-0 flex justify-between items-center mb-3 pb-2 border-b border-ink-200">
            <span className="text-xs uppercase tracking-wider text-ink-500">Live preview</span>
            <button onClick={() => setShowPreview(false)} className="text-ink-500 hover:text-ink-900">
              <EyeOff size={14} />
            </button>
          </div>
          <div ref={previewRef} className="shadow-2xl mx-auto" style={{ width: '210mm', transform: 'scale(0.7)', transformOrigin: 'top left', height: '600px' }}>
            <TemplateComp data={resume} />
          </div>
        </div>
      )}
      {!showPreview && (
        <button
          onClick={() => setShowPreview(true)}
          className="fixed right-4 bottom-4 btn-primary"
        >
          <Eye size={14} /> Show preview
        </button>
      )}

      {/* Template picker modal */}
      {showTemplates && (
        <div className="fixed inset-0 z-50 bg-ink-900/70 flex items-center justify-center p-6" onClick={() => setShowTemplates(false)}>
          <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-2xl mb-4">Choose a template</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => changeTemplate(t.id)}
                  className={`card !p-4 text-left transition hover:-translate-y-1 ${
                    resume.templateId === t.id ? 'ring-2 ring-brand-500' : ''
                  }`}
                >
                  <div className="h-24 rounded-lg mb-2" style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}80)` }} />
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{t.name}</h3>
                    {resume.templateId === t.id && <Sparkles size={14} className="text-brand-600" />}
                  </div>
                  <p className="text-xs text-ink-500">{t.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Subforms ---

function PersonalForm({ data, update }) {
  const fields = [
    { key: 'fullName', label: 'Full name', placeholder: 'Aarav Kumar' },
    { key: 'jobTitle', label: 'Job title', placeholder: 'Full Stack Developer' },
    { key: 'email',    label: 'Email',     placeholder: 'aarav@example.com' },
    { key: 'phone',    label: 'Phone',     placeholder: '+91 98765 43210' },
    { key: 'address',  label: 'Location',  placeholder: 'Chennai, India' },
    { key: 'website',  label: 'Website',   placeholder: 'yourportfolio.dev' },
    { key: 'linkedin', label: 'LinkedIn',  placeholder: 'linkedin.com/in/...' },
    { key: 'github',   label: 'GitHub',    placeholder: 'github.com/...' },
  ];
  return (
    <>
      <h2 className="font-display text-3xl mb-5">Personal information</h2>
      <div className="grid grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.key} className={f.key === 'fullName' || f.key === 'jobTitle' ? 'col-span-2' : ''}>
            <label className="label">{f.label}</label>
            <input
              className="input"
              placeholder={f.placeholder}
              value={data?.[f.key] || ''}
              onChange={(e) => update(`personalInfo.${f.key}`, e.target.value)}
            />
          </div>
        ))}
      </div>
    </>
  );
}

function SummaryForm({ data, update }) {
  return (
    <>
      <h2 className="font-display text-3xl mb-1">Professional summary</h2>
      <p className="text-ink-500 text-sm mb-5">A 2-3 sentence pitch. Keep it punchy and specific.</p>
      <textarea
        className="input h-40"
        placeholder="E.g. Full-stack developer with 3+ years building scalable web applications. Strong focus on clean code, REST APIs, and responsive UI design."
        value={data?.summary || ''}
        onChange={(e) => update('personalInfo.summary', e.target.value)}
      />
      <div className="mt-4 p-4 bg-brand-50 border border-brand-100 rounded-xl text-sm">
        <strong className="text-brand-700">💡 Tip:</strong> Include your years of experience, top skills, and one concrete achievement.
      </div>
    </>
  );
}

function ArrayForm({ title, items = [], onChange, schema }) {
  const add = () => onChange([...(items || []), Object.fromEntries(schema.map((s) => [s.key, '']))]);
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  const patch = (i, k, v) => onChange(items.map((it, idx) => (idx === i ? { ...it, [k]: v } : it)));
  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-display text-3xl">{title}</h2>
        <button onClick={add} className="btn-primary !py-2 !px-4 !text-sm"><Plus size={14} /> Add</button>
      </div>
      {(items || []).length === 0 && (
        <div className="card text-center py-10 text-ink-500 text-sm">
          No entries yet. Click "Add" to create one.
        </div>
      )}
      <div className="space-y-4">
        {(items || []).map((it, i) => (
          <div key={i} className="card relative">
            <button onClick={() => remove(i)} className="absolute top-3 right-3 text-ink-400 hover:text-red-500">
              <Trash2 size={14} />
            </button>
            <div className="grid grid-cols-2 gap-3">
              {schema.map((f) => (
                <div key={f.key} className={f.type === 'textarea' ? 'col-span-2' : ''}>
                  <label className="label">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea
                      className="input h-24"
                      placeholder={f.placeholder}
                      value={it[f.key] || ''}
                      onChange={(e) => patch(i, f.key, e.target.value)}
                    />
                  ) : (
                    <input
                      className="input"
                      placeholder={f.placeholder}
                      value={it[f.key] || ''}
                      onChange={(e) => patch(i, f.key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function SkillsForm({ data = [], update }) {
  const [value, setValue] = useState('');
  const add = () => {
    const v = value.trim();
    if (!v) return;
    update([...(data || []), v]);
    setValue('');
  };
  return (
    <>
      <h2 className="font-display text-3xl mb-1">Skills</h2>
      <p className="text-ink-500 text-sm mb-5">Add each skill separately. Aim for 8–15.</p>
      <div className="flex gap-2 mb-4">
        <input
          className="input"
          placeholder="e.g. React"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
        />
        <button onClick={add} className="btn-primary !py-2 !px-4 !text-sm"><Plus size={14} /></button>
      </div>
      <div className="flex flex-wrap gap-2">
        {(data || []).map((s, i) => (
          <span key={i} className="px-3 py-1.5 rounded-full bg-brand-100 text-brand-700 text-sm flex items-center gap-2">
            {s}
            <button onClick={() => update(data.filter((_, idx) => idx !== i))} className="hover:text-red-600">×</button>
          </span>
        ))}
      </div>
    </>
  );
}

function AchievementsForm({ items = [], onChange }) {
  const [value, setValue] = useState('');
  const add = () => {
    const v = value.trim();
    if (!v) return;
    onChange([...(items || []), v]);
    setValue('');
  };
  return (
    <>
      <h2 className="font-display text-3xl mb-5">Achievements</h2>
      <div className="flex gap-2 mb-4">
        <input
          className="input"
          placeholder="e.g. Winner — Smart India Hackathon 2023"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
        />
        <button onClick={add} className="btn-primary !py-2 !px-4 !text-sm"><Plus size={14} /></button>
      </div>
      <ul className="space-y-2">
        {(items || []).map((a, i) => (
          <li key={i} className="card !p-3 flex justify-between items-center text-sm">
            <span>▸ {a}</span>
            <button onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="text-ink-400 hover:text-red-500">
              <Trash2 size={12} />
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
