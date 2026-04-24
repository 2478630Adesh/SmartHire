// Template 10: Gradient — Bold gradient header, modern cards
import React from 'react';

export default function Template10({ data }) {
  const p = data.personalInfo || {};
  const primary = data.colors?.primary || '#6366F1';
  return (
    <div className="resume-preview bg-white text-[11px] leading-relaxed" style={{ fontFamily: '"Manrope", sans-serif', minHeight: '297mm', width: '210mm', color: '#111827' }}>
      <div className="p-8 text-white" style={{ background: `linear-gradient(135deg, ${primary} 0%, ${shift(primary, -40)} 100%)` }}>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
            {(p.fullName || 'YN').split(' ').map(w => w[0]).slice(0, 2).join('')}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold leading-tight">{p.fullName || 'Your Name'}</h1>
            <p className="text-sm opacity-90">{p.jobTitle}</p>
            <div className="flex gap-4 text-[10px] mt-2 opacity-90 flex-wrap">
              {p.email && <span>✉ {p.email}</span>}
              {p.phone && <span>☎ {p.phone}</span>}
              {p.address && <span>📍 {p.address}</span>}
            </div>
          </div>
        </div>
      </div>
      <div className="p-8 space-y-4">
        {p.summary && (
          <div className="p-4 rounded-xl bg-gray-50 border-l-4" style={{ borderColor: primary }}>
            <p>{p.summary}</p>
          </div>
        )}
        {data.experience?.length > 0 && (
          <section>
            <h2 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: primary }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: primary }}></span> EXPERIENCE
            </h2>
            {data.experience.map((e, i) => (
              <div key={i} className="mb-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200">
                <div className="flex justify-between">
                  <strong>{e.jobTitle}</strong>
                  <span className="text-[10px] text-gray-500">{e.startDate} – {e.current ? 'Present' : e.endDate}</span>
                </div>
                <div className="text-gray-600">{e.company} • {e.location}</div>
                <p className="mt-1 text-gray-700">{e.description}</p>
              </div>
            ))}
          </section>
        )}
        <div className="grid grid-cols-2 gap-4">
          {data.education?.length > 0 && (
            <section>
              <h2 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: primary }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: primary }}></span> EDUCATION
              </h2>
              {data.education.map((e, i) => (
                <div key={i} className="mb-2">
                  <strong>{e.degree}</strong>
                  <div className="text-gray-600">{e.institution}</div>
                  <div className="text-[10px] text-gray-500">{e.startDate} – {e.endDate}</div>
                </div>
              ))}
            </section>
          )}
          {data.skills?.length > 0 && (
            <section>
              <h2 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: primary }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: primary }}></span> SKILLS
              </h2>
              <div className="flex flex-wrap gap-1">
                {data.skills.map((s, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md text-[10px] text-white" style={{ background: primary }}>{s}</span>
                ))}
              </div>
            </section>
          )}
        </div>
        {data.projects?.length > 0 && (
          <section>
            <h2 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: primary }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: primary }}></span> PROJECTS
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {data.projects.map((pr, i) => (
                <div key={i} className="p-3 rounded-lg bg-gray-50">
                  <strong>{pr.name}</strong>
                  <p className="text-gray-700 text-[10px] mt-1">{pr.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function shift(hex, amount) {
  // Darken/lighten a hex color by `amount` (-100 to 100)
  const h = hex.replace('#', '');
  const num = parseInt(h, 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0xff) + amount;
  let b = (num & 0xff) + amount;
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}
