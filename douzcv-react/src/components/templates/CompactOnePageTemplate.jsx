import React from 'react'

export default function CompactOnePageTemplate({ personalInfo, experiences, education, skills, languages, accentColor }) {
  return (
    <div style={{ color: '#1E293B', fontSize: '12px', lineHeight: '1.4' }}>
      {/* Ultra Compact Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2px solid ${accentColor}`, paddingBottom: '8px', marginBottom: '12px' }}>
        <div className="flex items-center gap-3">
          {personalInfo.avatar && (
            <div style={{ width: '48px', height: '48px', borderRadius: '4px', overflow: 'hidden', border: `1px solid ${accentColor}` }}>
              <img src={personalInfo.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: accentColor, margin: 0 }}>
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>
              {personalInfo.title}
            </div>
          </div>
        </div>
        <div style={{ fontSize: '11px', color: '#64748B', textAlign: 'right', lineHeight: '1.4' }}>
          <div>{personalInfo.email} • {personalInfo.phone}</div>
          <div>{personalInfo.location}</div>
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div style={{ marginBottom: '10px', fontSize: '11.5px', color: '#334155' }} className="rich-text-content" dangerouslySetInnerHTML={{ __html: personalInfo.summary }} />
      )}

      {/* Experience Section */}
      <section style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: accentColor, borderBottom: '1px solid #CBD5E1', paddingBottom: '2px', marginBottom: '6px' }}>
          Expériences Professionnelles
        </div>
        {experiences.map(exp => (
          <div key={exp.id} style={{ marginBottom: '8px' }}>
            <div className="flex justify-between items-baseline">
              <strong style={{ fontSize: '12.5px', color: '#0F172A' }}>{exp.title} — {exp.company}</strong>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>{exp.startDate} - {exp.endDate}</span>
            </div>
            <div style={{ color: '#475569', fontSize: '11.5px', marginTop: '1px', }} className="rich-text-content" dangerouslySetInnerHTML={{ __html: exp.description }} />
          </div>
        ))}
      </section>

      {/* Formation, Compétences & Langues in 3-Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 0.8fr', gap: '14px', borderTop: '1px solid #E2E8F0', paddingTop: '8px' }}>
        <section>
          <div style={{ fontSize: '11.5px', fontWeight: '800', textTransform: 'uppercase', color: accentColor, marginBottom: '4px' }}>
            Formation
          </div>
          {education.map(edu => (
            <div key={edu.id} style={{ marginBottom: '4px', fontSize: '11px' }}>
              <strong>{edu.degree}</strong>, {edu.school} ({edu.startDate}-{edu.endDate})
            </div>
          ))}
        </section>

        <section>
          <div style={{ fontSize: '11.5px', fontWeight: '800', textTransform: 'uppercase', color: accentColor, marginBottom: '4px' }}>
            Compétences
          </div>
          <p style={{ fontSize: '11px', color: '#334155' }}>
            {skills.join(' • ')}
          </p>
        </section>

        <section>
          <div style={{ fontSize: '11.5px', fontWeight: '800', textTransform: 'uppercase', color: accentColor, marginBottom: '4px' }}>
            Langues
          </div>
          <div style={{ fontSize: '11px', color: '#334155' }}>
            {languages.map(l => (
              <div key={l.id}>{l.name}: {l.level}</div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
