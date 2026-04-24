// Template 5: Creative — Accent stripe on the left, warm colors
import React from 'react';

export default function Template5({ data }) {
  const p = data.personalInfo || {};
  const primary = data.colors?.primary || '#EA580C';
  return (
    <div className="resume-preview bg-white text-[11px] leading-relaxed relative" style={{ fontFamily: '"Poppins", sans-serif', minHeight: '297mm', width: '210mm', color: '#111827' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '14px', background: primary }}></div>
      <div className="p-10 pl-14">
        <div className="flex justify-between items-end border-b pb-4 mb-5" style={{ borderColor: primary }}>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: primary }}>{p.fullName || 'Your Name'}</h1>
            <p className="text-sm text-gray-600 uppercase tracking-wider mt-1">{p.jobTitle}</p>
          </div>
          <div className="text-right text-[10px] text-gray-600">
            {p.email && <div>{p.email}</div>}
            {p.phone && <div>{p.phone}</div>}
            {p.address && <div>{p.address}</div>}
            {p.linkedin && <div>{p.linkedin}</div>}
          </div>
        </div>
        {p.summary && <p className="mb-5 text-gray-700">{p.summary}</p>}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            {data.experience?.length > 0 && (
              <section>
                <h2 className="text-xs uppercase tracking-[0.2em] font-bold mb-2" style={{ color: primary }}>Experience</h2>
                {data.experience.map((e, i) => (
                  <div key={i} className="mb-3">
                    <strong>{e.jobTitle}</strong> <span className="text-gray-500">@ {e.company}</span>
                    <div className="text-[10px] text-gray-500">{e.startDate} – {e.current ? 'Present' : e.endDate} • {e.location}</div>
                    <p className="mt-1">{e.description}</p>
                  </div>
                ))}
              </section>
            )}
            {data.projects?.length > 0 && (
              <section>
                <h2 className="text-xs uppercase tracking-[0.2em] font-bold mb-2" style={{ color: primary }}>Projects</h2>
                {data.projects.map((pr, i) => (
                  <div key={i} className="mb-2">
                    <strong>{pr.name}</strong>
                    <p className="text-gray-700">{pr.description}</p>
                  </div>
                ))}
              </section>
            )}
          </div>
          <div className="space-y-4">
            {data.skills?.length > 0 && (
              <section>
                <h2 className="text-xs uppercase tracking-[0.2em] font-bold mb-2" style={{ color: primary }}>Skills</h2>
                <ul className="space-y-0.5">
                  {data.skills.map((s, i) => (<li key={i}>• {s}</li>))}
                </ul>
              </section>
            )}
            {data.education?.length > 0 && (
              <section>
                <h2 className="text-xs uppercase tracking-[0.2em] font-bold mb-2" style={{ color: primary }}>Education</h2>
                {data.education.map((e, i) => (
                  <div key={i} className="mb-2">
                    <strong>{e.degree}</strong>
                    <div className="text-gray-600">{e.institution}</div>
                    <div className="text-[10px] text-gray-500">{e.startDate} – {e.endDate}</div>
                  </div>
                ))}
              </section>
            )}
            {data.certifications?.length > 0 && (
              <section>
                <h2 className="text-xs uppercase tracking-[0.2em] font-bold mb-2" style={{ color: primary }}>Certifications</h2>
                {data.certifications.map((c, i) => (
                  <div key={i} className="mb-1">
                    <strong className="text-[10px]">{c.name}</strong>
                    <div className="text-[10px] text-gray-500">{c.issuer}</div>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
