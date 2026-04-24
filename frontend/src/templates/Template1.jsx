// Template 1: Professional — Blue banner header, two-column body
import React from 'react';

export default function Template1({ data }) {
  const p = data.personalInfo || {};
  const primary = data.colors?.primary || '#0A66C2';
  return (
    <div className="resume-preview bg-white text-[11px] leading-relaxed" style={{ fontFamily: 'Georgia, serif', minHeight: '297mm', width: '210mm', color: '#1f2937' }}>
      <div style={{ background: primary, color: 'white', padding: '32px 40px' }}>
        <h1 className="text-3xl font-bold tracking-tight">{p.fullName || 'Your Name'}</h1>
        <p className="text-sm opacity-90 mt-1">{p.jobTitle}</p>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] mt-3 opacity-90">
          {p.email && <span>✉ {p.email}</span>}
          {p.phone && <span>☎ {p.phone}</span>}
          {p.address && <span>📍 {p.address}</span>}
          {p.linkedin && <span>in/{p.linkedin.replace(/.*\//, '')}</span>}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6 p-10">
        <div className="col-span-2 space-y-5">
          {p.summary && (
            <section>
              <h2 className="font-bold uppercase tracking-wider text-xs border-b-2 pb-1 mb-2" style={{ borderColor: primary }}>Summary</h2>
              <p>{p.summary}</p>
            </section>
          )}
          {data.experience?.length > 0 && (
            <section>
              <h2 className="font-bold uppercase tracking-wider text-xs border-b-2 pb-1 mb-2" style={{ borderColor: primary }}>Experience</h2>
              {data.experience.map((e, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between">
                    <strong>{e.jobTitle}</strong>
                    <span className="text-[10px] text-gray-500">{e.startDate} – {e.current ? 'Present' : e.endDate}</span>
                  </div>
                  <div className="italic text-gray-600">{e.company} • {e.location}</div>
                  <p className="mt-1">{e.description}</p>
                </div>
              ))}
            </section>
          )}
          {data.projects?.length > 0 && (
            <section>
              <h2 className="font-bold uppercase tracking-wider text-xs border-b-2 pb-1 mb-2" style={{ borderColor: primary }}>Projects</h2>
              {data.projects.map((pr, i) => (
                <div key={i} className="mb-2">
                  <strong>{pr.name}</strong>
                  {pr.technologies && <span className="text-gray-500 text-[10px]"> — {pr.technologies}</span>}
                  <p>{pr.description}</p>
                </div>
              ))}
            </section>
          )}
        </div>
        <div className="space-y-5">
          {data.education?.length > 0 && (
            <section>
              <h2 className="font-bold uppercase tracking-wider text-xs border-b-2 pb-1 mb-2" style={{ borderColor: primary }}>Education</h2>
              {data.education.map((e, i) => (
                <div key={i} className="mb-2">
                  <strong>{e.degree}</strong>
                  <div>{e.institution}</div>
                  <div className="text-[10px] text-gray-500">{e.startDate} – {e.endDate}</div>
                  {e.gpa && <div>GPA: {e.gpa}</div>}
                </div>
              ))}
            </section>
          )}
          {data.skills?.length > 0 && (
            <section>
              <h2 className="font-bold uppercase tracking-wider text-xs border-b-2 pb-1 mb-2" style={{ borderColor: primary }}>Skills</h2>
              <div className="flex flex-wrap gap-1">
                {data.skills.map((s, i) => (
                  <span key={i} className="px-2 py-0.5 rounded text-[10px]" style={{ background: primary + '20', color: primary }}>{s}</span>
                ))}
              </div>
            </section>
          )}
          {data.certifications?.length > 0 && (
            <section>
              <h2 className="font-bold uppercase tracking-wider text-xs border-b-2 pb-1 mb-2" style={{ borderColor: primary }}>Certifications</h2>
              {data.certifications.map((c, i) => (
                <div key={i} className="mb-1">
                  <strong className="text-[11px]">{c.name}</strong>
                  <div className="text-[10px] text-gray-600">{c.issuer} • {c.date}</div>
                </div>
              ))}
            </section>
          )}
          {data.languages?.length > 0 && (
            <section>
              <h2 className="font-bold uppercase tracking-wider text-xs border-b-2 pb-1 mb-2" style={{ borderColor: primary }}>Languages</h2>
              {data.languages.map((l, i) => (
                <div key={i} className="flex justify-between">
                  <span>{l.name}</span>
                  <span className="text-[10px] text-gray-500">{l.proficiency}</span>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
