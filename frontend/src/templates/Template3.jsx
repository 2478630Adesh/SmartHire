// Template 3: Modern — Dark left sidebar with skills, white right content
import React from 'react';

export default function Template3({ data }) {
  const p = data.personalInfo || {};
  const primary = data.colors?.primary || '#7C3AED';
  return (
    <div className="resume-preview flex bg-white text-[11px] leading-relaxed" style={{ fontFamily: '"Inter", sans-serif', minHeight: '297mm', width: '210mm', color: '#1f2937' }}>
      <aside style={{ background: primary, color: 'white', width: '35%' }} className="p-8 space-y-5">
        <div>
          <h1 className="text-2xl font-bold leading-tight">{p.fullName || 'Your Name'}</h1>
          <p className="text-sm opacity-90 mt-1">{p.jobTitle}</p>
        </div>
        <section>
          <h2 className="uppercase tracking-wider text-[10px] font-bold opacity-80 mb-2">Contact</h2>
          <div className="space-y-1 text-[10px]">
            {p.email && <div>✉ {p.email}</div>}
            {p.phone && <div>☎ {p.phone}</div>}
            {p.address && <div>📍 {p.address}</div>}
            {p.linkedin && <div>in {p.linkedin}</div>}
            {p.github && <div>gh {p.github}</div>}
          </div>
        </section>
        {data.skills?.length > 0 && (
          <section>
            <h2 className="uppercase tracking-wider text-[10px] font-bold opacity-80 mb-2">Skills</h2>
            <div className="flex flex-wrap gap-1">
              {data.skills.map((s, i) => (
                <span key={i} className="px-2 py-0.5 bg-white/20 rounded text-[10px]">{s}</span>
              ))}
            </div>
          </section>
        )}
        {data.education?.length > 0 && (
          <section>
            <h2 className="uppercase tracking-wider text-[10px] font-bold opacity-80 mb-2">Education</h2>
            {data.education.map((e, i) => (
              <div key={i} className="mb-2 text-[10px]">
                <strong className="text-[11px]">{e.degree}</strong>
                <div>{e.institution}</div>
                <div className="opacity-80">{e.startDate} – {e.endDate}</div>
              </div>
            ))}
          </section>
        )}
        {data.languages?.length > 0 && (
          <section>
            <h2 className="uppercase tracking-wider text-[10px] font-bold opacity-80 mb-2">Languages</h2>
            {data.languages.map((l, i) => (
              <div key={i} className="text-[10px] mb-0.5">{l.name} — {l.proficiency}</div>
            ))}
          </section>
        )}
      </aside>
      <main className="flex-1 p-8 space-y-5">
        {p.summary && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: primary }}>Profile</h2>
            <p>{p.summary}</p>
          </section>
        )}
        {data.experience?.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: primary }}>Experience</h2>
            {data.experience.map((e, i) => (
              <div key={i} className="mb-3 relative pl-4 border-l-2" style={{ borderColor: primary + '40' }}>
                <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full" style={{ background: primary }}></div>
                <strong>{e.jobTitle}</strong>
                <div className="text-gray-600">{e.company} • {e.location}</div>
                <div className="text-[10px] text-gray-500">{e.startDate} – {e.current ? 'Present' : e.endDate}</div>
                <p className="mt-1">{e.description}</p>
              </div>
            ))}
          </section>
        )}
        {data.projects?.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: primary }}>Projects</h2>
            {data.projects.map((pr, i) => (
              <div key={i} className="mb-2">
                <strong>{pr.name}</strong>
                <p>{pr.description}</p>
                {pr.technologies && <div className="text-[10px] text-gray-500">{pr.technologies}</div>}
              </div>
            ))}
          </section>
        )}
        {data.certifications?.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: primary }}>Certifications</h2>
            {data.certifications.map((c, i) => (
              <div key={i}>• <strong>{c.name}</strong> — {c.issuer} ({c.date})</div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
