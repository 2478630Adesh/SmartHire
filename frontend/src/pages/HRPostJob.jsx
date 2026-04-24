import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, X, Plus } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function HRPostJob() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const editId = params.get('edit');
  const [form, setForm] = useState({
    title: '', company: '', location: '', type: 'Full-time',
    experience: 'Entry-level', salary: '', description: '',
    requirements: '', skills: [], status: 'Open',
  });
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editId) {
      api.get(`/jobs/${editId}`).then((r) => setForm({ ...r.data, skills: r.data.skills || [] })).catch(() => toast.error('Job not found'));
    }
  }, [editId]);

  const addSkill = () => {
    const v = skillInput.trim();
    if (!v) return;
    setForm((f) => ({ ...f, skills: [...(f.skills || []), v] }));
    setSkillInput('');
  };

  const removeSkill = (i) => setForm((f) => ({ ...f, skills: f.skills.filter((_, idx) => idx !== i) }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await api.put(`/jobs/${editId}`, form);
        toast.success('Job updated');
      } else {
        await api.post('/jobs', form);
        toast.success('Job posted!');
      }
      navigate('/hr/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-4xl mb-1">{editId ? 'Edit job' : 'Post a new job'}</h1>
        <p className="text-ink-600 mb-8">Be clear and specific. Better descriptions attract better candidates.</p>

        <form onSubmit={submit} className="card space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Job title</label>
              <input required className="input" placeholder="Senior Full Stack Developer" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="label">Company</label>
              <input className="input" placeholder="Your company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </div>
            <div>
              <label className="label">Location</label>
              <input className="input" placeholder="Bangalore (Hybrid) / Remote" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div>
              <label className="label">Type</label>
              <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option>
              </select>
            </div>
            <div>
              <label className="label">Experience</label>
              <input className="input" placeholder="2-4 years" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="label">Salary (optional)</label>
              <input className="input" placeholder="₹12-18 LPA" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="label">Description</label>
              <textarea required className="input h-32" placeholder="What will the person do? What's the impact? What's the team like?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="label">Requirements</label>
              <textarea className="input h-24" placeholder="What skills, education, or experience do they need?" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="label">Required Skills</label>
              <div className="flex gap-2 mb-2">
                <input className="input" placeholder="e.g. React" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
                <button type="button" onClick={addSkill} className="btn-primary !py-2 !px-4"><Plus size={14} /></button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {form.skills?.map((s, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-xs flex items-center gap-1.5">
                    {s}
                    <button type="button" onClick={() => removeSkill(i)} className="hover:text-red-600"><X size={10} /></button>
                  </span>
                ))}
              </div>
              <p className="text-xs text-ink-500 mt-2">These weigh heavily in the ATS matching — be specific.</p>
            </div>
            {editId && (
              <div className="col-span-2">
                <label className="label">Status</label>
                <select className="input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option>Open</option><option>Closed</option>
                </select>
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate('/hr/dashboard')} className="btn-outline flex-1">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              <Save size={14} /> {saving ? 'Saving...' : editId ? 'Update job' : 'Post job'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
