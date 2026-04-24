// Template 9: Compact — Dense two-column, perfect for experienced professionals
import React from 'react';

export default function Template9({ data }) {
  const p = data.personalInfo || {};
  const primary = data.colors?.primary || '#0891B2';
  return (
    <div className="resume-preview bg-white p-10 text-[10.5px] leading-snug" style={{ fontFamily: '"IBM Plex Sans", sans-serif', minHeight: '297mm', width: '210mm', color: '#111827' }}>
      <header className="flex justify-between items-center border-b-4 pb-3 mb-4" style={{ borderColor: primary }}>
        <div>
          <h1 className="text-2xl font-bold">{p.fullName || 'Your Name'}</h1>
          <p className="text-[12px]" style={{ color: primary }}>{p.jobTitle}</p>
        </div>
        <div className="text-right text-[10px]">
          {p.email && <div>{p.email}</div>}
          {p.phone && <div>{p.phone}</div>}
          {p.address && <div>{p.address}</div>}
          {p.linkedin && <div>{p.linkedin}</div>}
        </div>
      </header>
      {p.summary && <p className="mb-3">{p.summary}</p>}
      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-3 space-y-3">
          {data.experience?.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-wider border-b pb-0.5 mb-2" style={{ color: primary, borderColor: primary + '40' }}>Experience</h2>
              {data.experience.map((e, i) => (
                <div key={i} className="mb-2.5">
                  <div className="flex justify-between">
                    <strong>{e.jobTitle}</strong>
                    <span className="text-[9px] text-gray-500">{e.startDate} – {e.current ? 'Present' : e.endDate}</span>
                  </div>
                  <div className="italic text-gray-600">{e.company} • {e.location}</div>
                  <p>{e.description}</p>
                </div>
              ))}
            </section>
          )}
          {data.projects?.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-wider border-b pb-0.5 mb-2" style={{ color: primary, borderColor: primary + '40' }}>Projects</h2>
              {data.projects.map((pr, i) => (
                <div key={i} className="mb-1.5">
                  <strong>{pr.name}</strong>
                  <p>{pr.description}</p>
                </div>
              ))}
            </section>
          )}
        </div>
        <div className="col-span-2 space-y-3">
          {data.skills?.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-wider border-b pb-0.5 mb-2" style={{ color: primary, borderColor: primary + '40' }}>Skills</h2>
              {data.skills.map((s, i) => (
                <div key={i} className="mb-0.5">▪ {s}</div>
              ))}
            </section>
          )}
          {data.education?.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-wider border-b pb-0.5 mb-2" style={{ color: primary, borderColor: primary + '40' }}>Education</h2>
              {data.education.map((e, i) => (
                <div key={i} className="mb-1.5">
                  <strong>{e.degree}</strong>
                  <div>{e.institution}</div>
                  <div className="text-[9px] text-gray-500">{e.startDate} – {e.endDate}</div>
                </div>
              ))}
            </section>
          )}
          {data.certifications?.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-wider border-b pb-0.5 mb-2" style={{ color: primary, borderColor: primary + '40' }}>Certifications</h2>
              {data.certifications.map((c, i) => (
                <div key={i}>• {c.name}</div>
              ))}
            </section>
          )}
          {data.languages?.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-wider border-b pb-0.5 mb-2" style={{ color: primary, borderColor: primary + '40' }}>Languages</h2>
              {data.languages.map((l, i) => (<div key={i}>{l.name} ({l.proficiency})</div>))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
