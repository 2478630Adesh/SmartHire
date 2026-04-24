// Template 6: Executive — Sophisticated dark header, gold accents
import React from 'react';

export default function Template6({ data }) {
  const p = data.personalInfo || {};
  const primary = data.colors?.primary || '#C19A6B';
  return (
    <div className="resume-preview bg-white text-[11px] leading-relaxed" style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', minHeight: '297mm', width: '210mm', color: '#1f2937' }}>
      <div className="bg-[#1F2937] text-white p-10 text-center">
        <h1 className="text-4xl font-bold tracking-wide">{p.fullName || 'Your Name'}</h1>
        <div className="w-16 h-[2px] mx-auto my-3" style={{ background: primary }}></div>
        <p className="uppercase tracking-[0.3em] text-xs" style={{ color: primary }}>{p.jobTitle}</p>
        <div className="mt-4 text-[11px] opacity-90 flex justify-center gap-5 flex-wrap">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.address && <span>{p.address}</span>}
        </div>
      </div>
      <div className="p-10 space-y-5">
        {p.summary && (
          <section>
            <h2 className="text-center text-xs uppercase tracking-[0.3em] mb-2" style={{ color: primary }}>Executive Summary</h2>
            <p className="text-center italic text-gray-700">{p.summary}</p>
          </section>
        )}
        {data.experience?.length > 0 && (
          <section>
            <h2 className="text-xs uppercase tracking-[0.3em] mb-3 border-b pb-1" style={{ color: primary, borderColor: primary }}>Professional Experience</h2>
            {data.experience.map((e, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between">
                  <strong className="text-[13px]">{e.jobTitle}</strong>
                  <span className="text-[10px]" style={{ color: primary }}>{e.startDate} – {e.current ? 'Present' : e.endDate}</span>
                </div>
                <div className="italic">{e.company} • {e.location}</div>
                <p className="mt-1 text-gray-700">{e.description}</p>
              </div>
            ))}
          </section>
        )}
        <div className="grid grid-cols-2 gap-6">
          {data.education?.length > 0 && (
            <section>
              <h2 className="text-xs uppercase tracking-[0.3em] mb-2 border-b pb-1" style={{ color: primary, borderColor: primary }}>Education</h2>
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
              <h2 className="text-xs uppercase tracking-[0.3em] mb-2 border-b pb-1" style={{ color: primary, borderColor: primary }}>Core Competencies</h2>
              <p>{data.skills.join(' · ')}</p>
            </section>
          )}
        </div>
        {data.achievements?.length > 0 && (
          <section>
            <h2 className="text-xs uppercase tracking-[0.3em] mb-2 border-b pb-1" style={{ color: primary, borderColor: primary }}>Key Achievements</h2>
            <ul className="list-none">
              {data.achievements.map((a, i) => (
                <li key={i} className="mb-1">▸ {a}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
