import React from 'react'
import { Mail, Phone, MapPin, Award, CheckSquare } from 'lucide-react'

export default function ProAfriqueTemplate({ personalInfo, experiences, education, skills, languages, accentColor }) {
  return (
    <div style={{ color: '#1B3041', fontSize: '13px' }}>
      {/* Header Band */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: `3px solid ${accentColor}`, paddingBottom: '18px', marginBottom: '22px' }}>
        <div className="flex gap-4 items-center">
          {personalInfo.avatar && (
            <div style={{ width: '70px', height: '70px', borderRadius: '4px', overflow: 'hidden', border: `2px solid ${accentColor}` }}>
              <img src={personalInfo.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: '30px', fontWeight: '800', color: accentColor, margin: 0 }}>
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#2C4A63', marginTop: '2px' }}>
              {personalInfo.title}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '12.5px', color: '#4B5563' }}>
          {personalInfo.email && <div className="flex items-center gap-1.5"><Mail size={13} color={accentColor} /><span>{personalInfo.email}</span></div>}
          {personalInfo.phone && <div className="flex items-center gap-1.5"><Phone size={13} color={accentColor} /><span>{personalInfo.phone}</span></div>}
          {personalInfo.location && <div className="flex items-center gap-1.5"><MapPin size={13} color={accentColor} /><span>{personalInfo.location}</span></div>}
        </div>
      </div>

      {/* Profile */}
      {personalInfo.summary && (
        <section style={{ marginBottom: '22px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: accentColor, borderBottom: '1px solid #E5E7EB', paddingBottom: '3px', marginBottom: '8px' }}>
            Résumé Exécutif
          </h3>
          <div style={{ color: '#374151', lineHeight: '1.6', }} className="rich-text-content" dangerouslySetInnerHTML={{ __html: personalInfo.summary }} />
        </section>
      )}

      {/* Grid: 2 Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 250px', gap: '30px' }}>
        {/* Left: Experiences */}
        <section>
          <h3 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: accentColor, borderBottom: '1px solid #E5E7EB', paddingBottom: '3px', marginBottom: '14px' }}>
            Expériences Professionnelles
          </h3>
          {experiences.map(exp => (
            <div key={exp.id} style={{ marginBottom: '18px' }}>
              <div className="flex justify-between items-baseline flex-wrap">
                <strong style={{ fontSize: '14.5px', color: '#1B3041' }}>{exp.title}</strong>
                <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: '600' }}>{exp.startDate} – {exp.endDate}</span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: accentColor, marginBottom: '4px' }}>{exp.company}</div>
              <div style={{ color: '#4B5563', lineHeight: '1.55', }} className="rich-text-content" dangerouslySetInnerHTML={{ __html: exp.description }} />
            </div>
          ))}
        </section>

        {/* Right: Formation & Compétences */}
        <div className="flex-col gap-5">
          <section>
            <h3 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: accentColor, borderBottom: '1px solid #E5E7EB', paddingBottom: '3px', marginBottom: '10px' }}>
              Diplômes & Études
            </h3>
            {education.map(edu => (
              <div key={edu.id} style={{ marginBottom: '10px' }}>
                <div style={{ fontWeight: '700', fontSize: '13px' }}>{edu.degree}</div>
                <div style={{ fontSize: '12px', color: '#4B5563' }}>{edu.school}</div>
                <div style={{ fontSize: '11px', color: '#6B7280' }}>{edu.startDate} – {edu.endDate}</div>
              </div>
            ))}
          </section>

          <section>
            <h3 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: accentColor, borderBottom: '1px solid #E5E7EB', paddingBottom: '3px', marginBottom: '10px' }}>
              Compétences Clés
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s, i) => (
                <span key={i} style={{ backgroundColor: '#F3F4F6', padding: '4px 8px', borderRadius: '4px', fontSize: '11.5px', color: '#1B3041', fontWeight: '500', border: '1px solid #E5E7EB' }}>
                  {s}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h3 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: accentColor, borderBottom: '1px solid #E5E7EB', paddingBottom: '3px', marginBottom: '8px' }}>
              Langues & Mobilité
            </h3>
            {languages.map(l => (
              <div key={l.id} className="flex justify-between items-center" style={{ fontSize: '12px', marginBottom: '4px' }}>
                <span>{l.name}</span>
                <span style={{ color: '#6B7280', fontWeight: '600' }}>{l.level}</span>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  )
}
