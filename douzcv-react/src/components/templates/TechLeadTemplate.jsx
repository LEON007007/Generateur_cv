import React from 'react'
import { Terminal, Code, Mail, Phone, MapPin, ExternalLink } from 'lucide-react'

export default function TechLeadTemplate({ personalInfo, experiences, education, skills, languages, accentColor }) {
  return (
    <div style={{ color: '#0F172A', fontSize: '13px', boxSizing: 'border-box' }}>
      {/* Dark Tech Header */}
      <div style={{ backgroundColor: '#0F172A', color: '#FFFFFF', padding: '28px 32px', borderBottom: `4px solid ${accentColor}` }}>
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div className="flex gap-4">
            {personalInfo.avatar && (
              <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: `2px solid ${accentColor}` }}>
                <img src={personalInfo.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2" style={{ color: accentColor, fontSize: '12px', fontWeight: '700', fontFamily: 'monospace', marginBottom: '4px' }}>
                <Terminal size={14} />
                <span>~/developer-profile</span>
              </div>
            <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-0.02em', margin: 0 }}>
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <h2 style={{ fontSize: '16px', fontWeight: '500', color: '#94A3B8', marginTop: '4px' }}>
              {personalInfo.title}
            </h2>
          </div>
          </div>

          <div className="flex-col gap-1" style={{ fontSize: '12px', color: '#CBD5E1', textAlign: 'right' }}>
            {personalInfo.email && <div className="flex items-center justify-end gap-2"><Mail size={13} color={accentColor} /><span>{personalInfo.email}</span></div>}
            {personalInfo.phone && <div className="flex items-center justify-end gap-2"><Phone size={13} color={accentColor} /><span>{personalInfo.phone}</span></div>}
            {personalInfo.location && <div className="flex items-center justify-end gap-2"><MapPin size={13} color={accentColor} /><span>{personalInfo.location}</span></div>}
          </div>
        </div>

        {/* Tech Skills Badges in Header */}
        <div className="flex flex-wrap gap-1" style={{ marginTop: '16px' }}>
          {skills.map((s, i) => (
            <span key={i} style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#F1F5F9', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontFamily: 'monospace' }}>
              #{s}
            </span>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '28px 32px', backgroundColor: '#FFFFFF' }}>
        {/* Profile */}
        {personalInfo.summary && (
          <section style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: accentColor, marginBottom: '8px' }}>
              // Résumé Professionnel
            </h3>
            <p style={{ color: '#334155', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* 2-Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '28px' }}>
          {/* Left: Experience */}
          <section>
            <h3 style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: accentColor, marginBottom: '14px' }}>
              // Expériences & Projets
            </h3>
            <div className="flex-col gap-4">
              {experiences.map(exp => (
                <div key={exp.id} style={{ marginBottom: '16px', borderLeft: `2px solid ${accentColor}`, paddingLeft: '12px' }}>
                  <div className="flex justify-between items-baseline flex-wrap gap-1">
                    <strong style={{ fontSize: '14px', color: '#0F172A' }}>{exp.title}</strong>
                    <span style={{ fontSize: '11.5px', color: '#64748B', fontFamily: 'monospace' }}>{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div style={{ fontSize: '12.5px', color: accentColor, fontWeight: '600', marginBottom: '4px' }}>{exp.company}</div>
                  <p style={{ color: '#475569', lineHeight: '1.5', whiteSpace: 'pre-line' }}>{exp.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Right: Education & Languages */}
          <div className="flex-col gap-5">
            <section>
              <h3 style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: accentColor, marginBottom: '10px' }}>
                // Formation
              </h3>
              {education.map(edu => (
                <div key={edu.id} style={{ marginBottom: '10px' }}>
                  <div style={{ fontWeight: '700', fontSize: '13px', color: '#0F172A' }}>{edu.degree}</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>{edu.school}</div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace' }}>{edu.startDate} - {edu.endDate}</div>
                </div>
              ))}
            </section>

            <section>
              <h3 style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: accentColor, marginBottom: '8px' }}>
                // Langues
              </h3>
              {languages.map(l => (
                <div key={l.id} className="flex justify-between items-center" style={{ fontSize: '12px', marginBottom: '4px' }}>
                  <span>{l.name}</span>
                  <span style={{ color: '#64748B', fontFamily: 'monospace' }}>{l.level}</span>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
