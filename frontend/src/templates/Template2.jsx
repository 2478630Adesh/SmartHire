// Template 2: Editorial — Serif minimal, single column, elegant
import React from 'react';

export default function Template2({ data }) {
  const p = data.personalInfo || {};
  const primary = data.colors?.primary || '#1E293B';
  return (
    <div className="resume-preview bg-white p-12 text-[11px] leading-relaxed" style={{ fontFamily: '"Playfair Display", Georgia, serif', minHeight: '297mm', width: '210mm', color: '#111827' }}>
      <div className="text-center border-b pb-5 mb-6" style={{ borderColor: primary }}>
        <h1 className="text-4xl font-bold tracking-tight">{p.fullName || 'Your Name'}</h1>
        <p className="text-sm italic text-gray-600 mt-2">{p.jobTitle}</p>
        <div className="flex justify-center flex-wrap gap-x-4 text-[10px] text-gray-500 mt-3">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>•</span>}{p.phone && <span>{p.phone}</span>}
          {p.address && <span>•</span>}{p.address && <span>{p.address}</span>}
          {p.linkedin && <span>•</span>}{p.linkedin && <span>{p.linkedin}</span>}
        </div>
      </div>
      {p.summary && <p className="text-center italic mb-6 text-gray-700">{p.summary}</p>}
      {data.experience?.length > 0 && (
        <section className="mb-5">
          <h2 className="text-center text-xs tracking-[0.3em] uppercase mb-3" style={{ color: primary }}>Experience</h2>
          {data.experience.map((e, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between items-baseline">
                <strong className="text-[12px]">{e.jobTitle}</strong>
                <span className="text-[10px] text-gray-500">{e.startDate} – {e.current ? 'Present' : e.endDate}</span>
              </div>
              <div className="italic text-gray-700">{e.company}, {e.location}</div>
              <p className="mt-1 text-gray-700">{e.description}</p>
            </div>
          ))}
        </section>
      )}
      {data.education?.length > 0 && (
        <section className="mb-5">
          <h2 className="text-center text-xs tracking-[0.3em] uppercase mb-3" style={{ color: primary }}>Education</h2>
          {data.education.map((e, i) => (
            <div key={i} className="mb-2 text-center">
              <strong>{e.degree}</strong> — {e.institution} <span className="text-gray-500 text-[10px]">({e.startDate} – {e.endDate})</span>
            </div>
          ))}
        </section>
      )}
      {data.skills?.length > 0 && (
        <section className="mb-5">
          <h2 className="text-center text-xs tracking-[0.3em] uppercase mb-3" style={{ color: primary }}>Skills</h2>
          <p className="text-center text-gray-700">{data.skills.join(' • ')}</p>
        </section>
      )}
      {data.projects?.length > 0 && (
        <section className="mb-5">
          <h2 className="text-center text-xs tracking-[0.3em] uppercase mb-3" style={{ color: primary }}>Projects</h2>
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
