import React from 'react'
import { Mail, Phone, MapPin, Palette, Award } from 'lucide-react'

export default function PortfolioTemplate({ personalInfo, experiences, education, skills, languages, accentColor }) {
  return (
    <div style={{ color: '#18181B', fontSize: '13px' }}>
      {/* Visual Header with geometric accent */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px', backgroundColor: '#FAFAFA', padding: '24px', borderRadius: '12px', border: `1px solid ${accentColor}20` }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: accentColor, color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '800', flexShrink: 0, overflow: 'hidden' }}>
          {personalInfo.avatar ? (
            <img src={personalInfo.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <Palette size={28} />
          )}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '30px', fontWeight: '800', letterSpacing: '-0.02em', color: '#09090B', margin: 0 }}>
            {personalInfo.firstName} <span style={{ color: accentColor }}>{personalInfo.lastName}</span>
          </h1>
          <div style={{ fontSize: '15px', fontWeight: '600', color: '#71717A', marginTop: '2px' }}>
            {personalInfo.title}
          </div>
          <div className="flex flex-wrap gap-4" style={{ fontSize: '12px', color: '#71717A', marginTop: '8px' }}>
            {personalInfo.email && <div className="flex items-center gap-1"><Mail size={12} color={accentColor} /><span>{personalInfo.email}</span></div>}
            {personalInfo.phone && <div className="flex items-center gap-1"><Phone size={12} color={accentColor} /><span>{personalInfo.phone}</span></div>}
            {personalInfo.location && <div className="flex items-center gap-1"><MapPin size={12} color={accentColor} /><span>{personalInfo.location}</span></div>}
          </div>
        </div>
      </div>

      {/* Profile Manifesto */}
      {personalInfo.summary && (
        <section style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: accentColor, marginBottom: '8px' }}>
            // Manifeste & Approche
          </h3>
          <p style={{ color: '#3F3F46', lineHeight: '1.6', fontSize: '13.5px', whiteSpace: 'pre-line' }}>
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '28px' }}>
        {/* Left: Experiences */}
        <section>
          <h3 style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: accentColor, marginBottom: '14px' }}>
            // Projets & Réalisations
          </h3>
          <div className="flex-col gap-4">
            {experiences.map(exp => (
              <div key={exp.id} style={{ marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px dashed #E4E4E7' }}>
                <div className="flex justify-between items-baseline flex-wrap">
                  <strong style={{ fontSize: '14.5px', color: '#09090B' }}>{exp.title}</strong>
                  <span style={{ fontSize: '11.5px', color: '#A1A1AA', fontWeight: '500' }}>{exp.startDate} — {exp.endDate}</span>
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: accentColor, marginBottom: '4px' }}>{exp.company}</div>
                <p style={{ color: '#52525B', lineHeight: '1.5', whiteSpace: 'pre-line' }}>{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Right: Skills & Formation */}
        <div className="flex-col gap-5">
          <section>
            <h3 style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: accentColor, marginBottom: '10px' }}>
              // Compétences Créatives
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s, i) => (
                <span key={i} style={{ backgroundColor: `${accentColor}12`, color: accentColor, padding: '4px 8px', borderRadius: '6px', fontSize: '11.5px', fontWeight: '600' }}>
                  {s}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h3 style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: accentColor, marginBottom: '10px' }}>
              // Éducation & Design
            </h3>
            {education.map(edu => (
              <div key={edu.id} style={{ marginBottom: '10px' }}>
                <div style={{ fontWeight: '700', fontSize: '13px' }}>{edu.degree}</div>
                <div style={{ fontSize: '12px', color: '#71717A' }}>{edu.school}</div>
                <div style={{ fontSize: '11px', color: '#A1A1AA' }}>{edu.startDate} – {edu.endDate}</div>
              </div>
            ))}
          </section>

          <section>
            <h3 style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: accentColor, marginBottom: '10px' }}>
              // Langues
            </h3>
            {languages.map(l => (
              <div key={l.id} className="flex justify-between items-center" style={{ fontSize: '12px', marginBottom: '4px' }}>
                <span>{l.name}</span>
                <span style={{ color: '#71717A' }}>{l.level}</span>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  )
}
