// Template 8: Timeline — Vertical timeline with dots, elegant
import React from 'react';

export default function Template8({ data }) {
  const p = data.personalInfo || {};
  const primary = data.colors?.primary || '#DC2626';
  return (
    <div className="resume-preview bg-white p-10 text-[11px] leading-relaxed" style={{ fontFamily: '"Lora", Georgia, serif', minHeight: '297mm', width: '210mm', color: '#1f2937' }}>
      <header className="mb-6">
        <h1 className="text-4xl font-bold" style={{ color: primary }}>{p.fullName || 'Your Name'}</h1>
        <p className="text-lg text-gray-600">{p.jobTitle}</p>
        <div className="flex gap-4 text-[10px] text-gray-600 mt-2 flex-wrap">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.address && <span>{p.address}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
        </div>
      </header>
      {p.summary && (
        <p className="pb-4 mb-4 border-b text-gray-700 italic">{p.summary}</p>
      )}
      {data.experience?.length > 0 && (
        <section className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: primary }}>Career Timeline</h2>
          <div className="relative pl-6 border-l-2" style={{ borderColor: primary + '40' }}>
            {data.experience.map((e, i) => (
              <div key={i} className="relative mb-5 last:mb-0">
                <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full border-2 border-white" style={{ background: primary, boxShadow: `0 0 0 2px ${primary}` }}></div>
                <div className="text-[10px] font-semibold uppercase" style={{ color: primary }}>{e.startDate} – {e.current ? 'Present' : e.endDate}</div>
                <strong className="text-[12px]">{e.jobTitle}</strong>
                <div className="italic text-gray-600">{e.company} • {e.location}</div>
                <p className="mt-1 text-gray-700">{e.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
      <div className="grid grid-cols-2 gap-6">
        {data.education?.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: primary }}>Education</h2>
            {data.education.map((e, i) => (
              <div key={i} className="mb-2">
                <strong>{e.degree}</strong>
                <div>{e.institution}</div>
                <div className="text-[10px] text-gray-500">{e.startDate} – {e.endDate}</div>
              </div>
            ))}
          </section>
        )}
        {data.skills?.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: primary }}>Skills</h2>
            <div className="flex flex-wrap gap-1">
              {data.skills.map((s, i) => (
                <span key={i} className="px-2 py-0.5 text-[10px] rounded-full border" style={{ borderColor: primary + '60', color: primary }}>{s}</span>
              ))}
            </div>
          </section>
        )}
      </div>
      {data.projects?.length > 0 && (
        <section className="mt-4">
          <h2 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: primary }}>Notable Projects</h2>
          {data.projects.map((pr, i) => (
            <div key={i} className="mb-2">
              <strong>{pr.name}</strong> — <span className="text-gray-700">{pr.description}</span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
