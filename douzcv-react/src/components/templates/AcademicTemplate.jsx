import React from 'react'

export default function AcademicTemplate({ personalInfo, experiences, education, skills, languages, accentColor }) {
  return (
    <div style={{ color: '#1F2937', lineHeight: '1.5', fontSize: '13px', fontFamily: "'Merriweather', serif" }}>
      {/* Centered Academic Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px', borderBottom: `2px double ${accentColor}`, paddingBottom: '16px' }}>
        {personalInfo.avatar && (
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 12px auto', overflow: 'hidden', border: `2px solid ${accentColor}` }}>
            <img src={personalInfo.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <h1 style={{ fontSize: '26px', fontWeight: '700', color: accentColor, marginBottom: '4px' }}>
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        <div style={{ fontStyle: 'italic', fontSize: '15px', color: '#4B5563', marginBottom: '8px' }}>
          {personalInfo.title}
        </div>
        <div className="flex justify-center flex-wrap gap-3" style={{ fontSize: '12px', color: '#4B5563' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
        </div>
      </div>

      {/* Summary / Research interests */}
      {personalInfo.summary && (
        <section style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: accentColor, borderBottom: '1px solid #E5E7EB', paddingBottom: '4px', marginBottom: '8px' }}>
            Domaines de Compétences & Recherche
          </h2>
          <div style={{ textAlign: 'justify', color: '#374151', }} className="rich-text-content" dangerouslySetInnerHTML={{ __html: personalInfo.summary }} />
        </section>
      )}

      {/* Education (Prioritized in Academic CVs) */}
      <section style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: accentColor, borderBottom: '1px solid #E5E7EB', paddingBottom: '4px', marginBottom: '10px' }}>
          Cursus Universitaire & Diplômes
        </h2>
        {education.map(edu => (
          <div key={edu.id} style={{ marginBottom: '10px' }}>
            <div className="flex justify-between items-baseline flex-wrap">
              <strong>{edu.degree}</strong>
              <span style={{ fontSize: '12px', color: '#6B7280' }}>{edu.startDate} – {edu.endDate}</span>
            </div>
            <div style={{ fontStyle: 'italic', color: '#4B5563', fontSize: '12.5px' }}>{edu.school}</div>
          </div>
        ))}
      </section>

      {/* Experience */}
      <section style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: accentColor, borderBottom: '1px solid #E5E7EB', paddingBottom: '4px', marginBottom: '10px' }}>
          Expériences & Enseignement
        </h2>
        {experiences.map(exp => (
          <div key={exp.id} style={{ marginBottom: '14px' }}>
            <div className="flex justify-between items-baseline flex-wrap">
              <strong>{exp.title}</strong>
              <span style={{ fontSize: '12px', color: '#6B7280' }}>{exp.startDate} – {exp.endDate}</span>
            </div>
            <div style={{ color: accentColor, fontStyle: 'italic', fontSize: '12.5px', marginBottom: '4px' }}>{exp.company}</div>
            <div style={{ color: '#374151', }} className="rich-text-content" dangerouslySetInnerHTML={{ __html: exp.description }} />
          </div>
        ))}
      </section>

      {/* Skills and Languages */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: accentColor, borderBottom: '1px solid #E5E7EB', paddingBottom: '3px', marginBottom: '6px' }}>
            Compétences Spécifiques
          </h2>
          <p style={{ color: '#374151', fontSize: '12.5px' }}>{skills.join(', ')}</p>
        </div>
        <div>
          <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: accentColor, borderBottom: '1px solid #E5E7EB', paddingBottom: '3px', marginBottom: '6px' }}>
            Langues Étrangères
          </h2>
          <p style={{ color: '#374151', fontSize: '12.5px' }}>{languages.map(l => `${l.name} (${l.level})`).join(', ')}</p>
        </div>
      </div>
    </div>
  )
}
