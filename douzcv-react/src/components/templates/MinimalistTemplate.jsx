import React from 'react'

export default function MinimalistTemplate({ personalInfo, experiences, education, skills, languages, accentColor }) {
  return (
    <div style={{ color: '#111827', maxWidth: '100%', margin: '0 auto', fontSize: '13.5px' }}>
      {/* Centered ATS Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px', borderBottom: '1px solid #111827', paddingBottom: '16px' }}>
        {personalInfo.avatar && (
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', margin: '0 auto 12px auto', overflow: 'hidden', border: '1px solid #111827' }}>
            <img src={personalInfo.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <h1 style={{ 
          fontSize: 'clamp(24px, 3.5vw, 32px)', 
          fontWeight: '800', 
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '4px',
          color: accentColor
        }}>
          {personalInfo.firstName || 'Prénom'} {personalInfo.lastName || 'Nom'}
        </h1>
        <div style={{ fontSize: '15px', fontWeight: '600', color: '#4B5563', marginBottom: '8px' }}>
          {personalInfo.title || 'Titre professionnel'}
        </div>
        <div className="flex justify-center flex-wrap gap-3" style={{ fontSize: '12.5px', color: '#4B5563' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <section style={{ marginBottom: '24px' }}>
          <h2 style={{ 
            fontSize: '13px', 
            fontWeight: '800', 
            textTransform: 'uppercase', 
            letterSpacing: '0.08em', 
            borderBottom: '1px solid #D1D5DB', 
            paddingBottom: '3px',
            marginBottom: '8px',
            color: accentColor
          }}>
            Résumé Professionnel
          </h2>
          <p style={{ lineHeight: '1.6', color: '#374151', whiteSpace: 'pre-line' }}>
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      <section style={{ marginBottom: '24px' }}>
        <h2 style={{ 
          fontSize: '13px', 
          fontWeight: '800', 
          textTransform: 'uppercase', 
          letterSpacing: '0.08em', 
          borderBottom: '1px solid #D1D5DB', 
          paddingBottom: '3px',
          marginBottom: '12px',
          color: accentColor
        }}>
          Expérience Professionnelle
        </h2>
        {experiences.map(exp => (
          <div key={exp.id} style={{ marginBottom: '16px' }}>
            <div className="flex justify-between items-baseline flex-wrap gap-1">
              <span style={{ fontSize: '14.5px', fontWeight: '700', color: '#111827' }}>
                {exp.title} <span style={{ fontWeight: '400', color: '#4B5563' }}>— {exp.company}</span>
              </span>
              <span style={{ fontSize: '12.5px', fontWeight: '600', color: '#4B5563' }}>
                {exp.startDate} – {exp.endDate}
              </span>
            </div>
            <p style={{ marginTop: '4px', lineHeight: '1.55', color: '#374151', whiteSpace: 'pre-line' }}>
              {exp.description}
            </p>
          </div>
        ))}
      </section>

      {/* Education */}
      <section style={{ marginBottom: '24px' }}>
        <h2 style={{ 
          fontSize: '13px', 
          fontWeight: '800', 
          textTransform: 'uppercase', 
          letterSpacing: '0.08em', 
          borderBottom: '1px solid #D1D5DB', 
          paddingBottom: '3px',
          marginBottom: '12px',
          color: accentColor
        }}>
          Formation
        </h2>
        {education.map(edu => (
          <div key={edu.id} className="flex justify-between items-baseline flex-wrap gap-1" style={{ marginBottom: '8px' }}>
            <div>
              <strong style={{ color: '#111827' }}>{edu.degree}</strong>, <span style={{ color: '#4B5563' }}>{edu.school}</span>
            </div>
            <div style={{ fontSize: '12.5px', color: '#4B5563' }}>
              {edu.startDate} – {edu.endDate}
            </div>
          </div>
        ))}
      </section>

      {/* Skills & Languages combined for ATS efficiency */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <div>
          <h2 style={{ 
            fontSize: '13px', 
            fontWeight: '800', 
            textTransform: 'uppercase', 
            letterSpacing: '0.08em', 
            borderBottom: '1px solid #D1D5DB', 
            paddingBottom: '3px',
            marginBottom: '8px',
            color: accentColor
          }}>
            Compétences Clés
          </h2>
          <p style={{ color: '#374151', lineHeight: '1.5' }}>
            {skills.join(' • ')}
          </p>
        </div>

        <div>
          <h2 style={{ 
            fontSize: '13px', 
            fontWeight: '800', 
            textTransform: 'uppercase', 
            letterSpacing: '0.08em', 
            borderBottom: '1px solid #D1D5DB', 
            paddingBottom: '3px',
            marginBottom: '8px',
            color: accentColor
          }}>
            Langues
          </h2>
          <p style={{ color: '#374151', lineHeight: '1.5' }}>
            {languages.map(l => `${l.name} (${l.level})`).join(' • ')}
          </p>
        </div>
      </section>
    </div>
  )
}
