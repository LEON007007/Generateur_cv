import React from 'react'
import { Globe, Mail, Phone, MapPin, CheckCircle } from 'lucide-react'

export default function InternationalTemplate({ personalInfo, experiences, education, skills, languages, accentColor }) {
  return (
    <div style={{ color: '#0F172A', fontSize: '13px' }}>
      {/* International Header */}
      <div style={{ backgroundColor: `${accentColor}10`, borderLeft: `6px solid ${accentColor}`, padding: '24px 28px', borderRadius: '4px', marginBottom: '24px' }}>
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div className="flex gap-4 items-center">
            {personalInfo.avatar && (
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', overflow: 'hidden', border: `2px solid ${accentColor}`, flexShrink: 0 }}>
                <img src={personalInfo.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5" style={{ color: accentColor, fontSize: '12px', fontWeight: '700', marginBottom: '4px' }}>
                <Globe size={14} />
                <span>PROFIL INTERNATIONAL & MOBILITÉ</span>
              </div>
              <h1 style={{ fontSize: '30px', fontWeight: '800', color: '#0F172A', margin: 0 }}>
                {personalInfo.firstName} {personalInfo.lastName}
              </h1>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#475569', marginTop: '2px' }}>
                {personalInfo.title}
              </div>
            </div>
          </div>

          <div className="flex-col gap-1.5" style={{ fontSize: '12px', color: '#334155' }}>
            {personalInfo.email && <div className="flex items-center gap-2"><Mail size={13} color={accentColor} /><span>{personalInfo.email}</span></div>}
            {personalInfo.phone && <div className="flex items-center gap-2"><Phone size={13} color={accentColor} /><span>{personalInfo.phone}</span></div>}
            {personalInfo.location && <div className="flex items-center gap-2"><MapPin size={13} color={accentColor} /><span>{personalInfo.location}</span></div>}
          </div>
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <section style={{ marginBottom: '22px' }}>
          <h3 style={{ fontSize: '12.5px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: accentColor, marginBottom: '6px' }}>
            Executive Summary
          </h3>
          <p style={{ color: '#334155', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
            {personalInfo.summary}
          </p>
        </section>
      )}

      {/* Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '28px' }}>
        {/* Experience */}
        <section>
          <h3 style={{ fontSize: '12.5px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: accentColor, borderBottom: '1px solid #E2E8F0', paddingBottom: '4px', marginBottom: '14px' }}>
            International Career & Achievements
          </h3>
          {experiences.map(exp => (
            <div key={exp.id} style={{ marginBottom: '18px' }}>
              <div className="flex justify-between items-baseline flex-wrap">
                <strong style={{ fontSize: '14.5px', color: '#0F172A' }}>{exp.title}</strong>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>{exp.startDate} – {exp.endDate}</span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: accentColor, marginBottom: '4px' }}>{exp.company}</div>
              <p style={{ color: '#475569', lineHeight: '1.5', whiteSpace: 'pre-line' }}>{exp.description}</p>
            </div>
          ))}
        </section>

        {/* Right Sidebar: Languages, Skills, Education */}
        <div className="flex-col gap-5">
          <section style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: accentColor, marginBottom: '10px' }}>
              Languages Matrix
            </h3>
            {languages.map(l => (
              <div key={l.id} className="flex justify-between items-center" style={{ fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ fontWeight: '600' }}>{l.name}</span>
                <span style={{ backgroundColor: `${accentColor}15`, color: accentColor, padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: '700' }}>{l.level}</span>
              </div>
            ))}
          </section>

          <section>
            <h3 style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: accentColor, borderBottom: '1px solid #E2E8F0', paddingBottom: '4px', marginBottom: '10px' }}>
              Core Competencies
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s, i) => (
                <span key={i} style={{ backgroundColor: '#F1F5F9', padding: '4px 8px', borderRadius: '4px', fontSize: '11.5px', color: '#1E293B', fontWeight: '500' }}>
                  {s}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h3 style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: accentColor, borderBottom: '1px solid #E2E8F0', paddingBottom: '4px', marginBottom: '10px' }}>
              Education & Degrees
            </h3>
            {education.map(edu => (
              <div key={edu.id} style={{ marginBottom: '10px' }}>
                <div style={{ fontWeight: '700', fontSize: '12.5px' }}>{edu.degree}</div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>{edu.school}</div>
                <div style={{ fontSize: '11px', color: '#94A3B8' }}>{edu.startDate} – {edu.endDate}</div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  )
}
