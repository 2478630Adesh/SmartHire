// Template 7: Tech — Mono headers, code-like feel, perfect for developers
import React from 'react';

export default function Template7({ data }) {
  const p = data.personalInfo || {};
  const primary = data.colors?.primary || '#10B981';
  return (
    <div className="resume-preview bg-white p-10 text-[11px] leading-relaxed" style={{ fontFamily: '"Inter", sans-serif', minHeight: '297mm', width: '210mm', color: '#111827' }}>
      <div className="flex justify-between items-start pb-4 border-b-2" style={{ borderColor: primary }}>
        <div>
          <div className="text-[10px] font-mono mb-1" style={{ color: primary }}>&lt;developer/&gt;</div>
          <h1 className="text-3xl font-bold">{p.fullName || 'Your Name'}</h1>
          <p className="text-sm text-gray-600 font-mono">{p.jobTitle}</p>
        </div>
        <div className="text-right text-[10px] font-mono text-gray-600">
          {p.email && <div>📧 {p.email}</div>}
          {p.phone && <div>📱 {p.phone}</div>}
          {p.github && <div>🐙 {p.github}</div>}
          {p.linkedin && <div>💼 {p.linkedin}</div>}
          {p.website && <div>🌐 {p.website}</div>}
        </div>
      </div>
      {p.summary && (
        <section className="mt-4">
          <h2 className="font-mono text-[10px] mb-1" style={{ color: primary }}># about</h2>
          <p>{p.summary}</p>
        </section>
      )}
      {data.skills?.length > 0 && (
        <section className="mt-4">
          <h2 className="font-mono text-[10px] mb-2" style={{ color: primary }}># tech-stack</h2>
          <div className="flex flex-wrap gap-1.5">
            {data.skills.map((s, i) => (
              <span key={i} className="px-2 py-0.5 rounded font-mono text-[10px] border" style={{ borderColor: primary, color: primary }}>{s}</span>
            ))}
          </div>
        </section>
      )}
      {data.experience?.length > 0 && (
        <section className="mt-4">
          <h2 className="font-mono text-[10px] mb-2" style={{ color: primary }}># experience</h2>
          {data.experience.map((e, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between">
                <strong>{e.jobTitle} <span className="text-gray-500 font-normal">@ {e.company}</span></strong>
                <span className="font-mono text-[10px] text-gray-500">{e.startDate} → {e.current ? 'now' : e.endDate}</span>
              </div>
              <p className="mt-1 text-gray-700">{e.description}</p>
            </div>
          ))}
        </section>
      )}
      {data.projects?.length > 0 && (
        <section className="mt-4">
          <h2 className="font-mono text-[10px] mb-2" style={{ color: primary }}># projects</h2>
          {data.projects.map((pr, i) => (
            <div key={i} className="mb-2">
              <strong>{pr.name}</strong>
              {pr.link && <span className="font-mono text-[10px] text-gray-500"> ({pr.link})</span>}
              <p className="text-gray-700">{pr.description}</p>
              {pr.technologies && <div className="font-mono text-[10px]" style={{ color: primary }}>stack: {pr.technologies}</div>}
            </div>
          ))}
        </section>
      )}
      <div className="grid grid-cols-2 gap-4 mt-4">
        {data.education?.length > 0 && (
          <section>
            <h2 className="font-mono text-[10px] mb-2" style={{ color: primary }}># education</h2>
            {data.education.map((e, i) => (
              <div key={i} className="mb-1">
                <strong>{e.degree}</strong>
                <div>{e.institution}</div>
                <div className="text-[10px] text-gray-500">{e.startDate} – {e.endDate}</div>
              </div>
            ))}
          </section>
        )}
        {data.certifications?.length > 0 && (
          <section>
            <h2 className="font-mono text-[10px] mb-2" style={{ color: primary }}># certifications</h2>
            {data.certifications.map((c, i) => (
              <div key={i}>• {c.name} — <span className="text-gray-500">{c.issuer}</span></div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
