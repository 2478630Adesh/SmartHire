// Template 4: ATS Pro — Maximum ATS-compatibility, simple black/white
import React from 'react';

export default function Template4({ data }) {
  const p = data.personalInfo || {};
  return (
    <div className="resume-preview bg-white p-10 text-[11px] leading-relaxed" style={{ fontFamily: '"Calibri", "Arial", sans-serif', minHeight: '297mm', width: '210mm', color: 'black' }}>
      <h1 className="text-2xl font-bold">{p.fullName || 'Your Name'}</h1>
      <div className="text-[11px] mt-1 mb-2">
        {[p.email, p.phone, p.address, p.linkedin].filter(Boolean).join(' | ')}
      </div>
      {p.summary && (
        <>
          <h2 className="font-bold uppercase text-[12px] border-b border-black pb-0.5 mt-3 mb-1">Professional Summary</h2>
          <p>{p.summary}</p>
        </>
      )}
      {data.experience?.length > 0 && (
        <>
          <h2 className="font-bold uppercase text-[12px] border-b border-black pb-0.5 mt-3 mb-1">Work Experience</h2>
          {data.experience.map((e, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between">
                <strong>{e.jobTitle}, {e.company}</strong>
                <span>{e.startDate} – {e.current ? 'Present' : e.endDate}</span>
              </div>
              <div className="italic">{e.location}</div>
              <p>{e.description}</p>
            </div>
          ))}
        </>
      )}
      {data.education?.length > 0 && (
        <>
          <h2 className="font-bold uppercase text-[12px] border-b border-black pb-0.5 mt-3 mb-1">Education</h2>
          {data.education.map((e, i) => (
            <div key={i} className="mb-1">
              <div className="flex justify-between">
                <strong>{e.degree}</strong>
                <span>{e.startDate} – {e.endDate}</span>
              </div>
              <div>{e.institution}, {e.location} {e.gpa && `— GPA: ${e.gpa}`}</div>
            </div>
          ))}
        </>
      )}
      {data.skills?.length > 0 && (
        <>
          <h2 className="font-bold uppercase text-[12px] border-b border-black pb-0.5 mt-3 mb-1">Skills</h2>
          <p>{data.skills.join(', ')}</p>
        </>
      )}
      {data.projects?.length > 0 && (
        <>
          <h2 className="font-bold uppercase text-[12px] border-b border-black pb-0.5 mt-3 mb-1">Projects</h2>
          {data.projects.map((pr, i) => (
            <div key={i} className="mb-1">
              <strong>{pr.name}</strong>: {pr.description}
              {pr.technologies && <span className="italic"> (Tech: {pr.technologies})</span>}
            </div>
          ))}
        </>
      )}
      {data.certifications?.length > 0 && (
        <>
          <h2 className="font-bold uppercase text-[12px] border-b border-black pb-0.5 mt-3 mb-1">Certifications</h2>
          {data.certifications.map((c, i) => (
            <div key={i}>• {c.name} — {c.issuer} ({c.date})</div>
          ))}
        </>
      )}
      {data.achievements?.length > 0 && (
        <>
          <h2 className="font-bold uppercase text-[12px] border-b border-black pb-0.5 mt-3 mb-1">Achievements</h2>
          <ul className="list-disc pl-5">
            {data.achievements.map((a, i) => (<li key={i}>{a}</li>))}
          </ul>
        </>
      )}
    </div>
  );
}
