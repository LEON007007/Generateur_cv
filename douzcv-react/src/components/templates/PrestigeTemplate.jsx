import React from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function PrestigeTemplate({ personalInfo, experiences, education, skills, languages, accentColor }) {
  return (
    <div style={{ color: '#18181B', fontSize: '13px', fontFamily: "'Playfair Display', serif" }}>
      {/* Luxury Border Frame */}
      <div style={{ border: `1px solid ${accentColor}40`, padding: '32px 28px', position: 'relative' }}>
        
        {/* Prestige Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          {personalInfo.avatar && (
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 16px auto', overflow: 'hidden', border: `1px solid ${accentColor}80`, padding: '4px' }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden' }}>
                <img src={personalInfo.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>
          )}
          <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '0.04em', color: accentColor, textTransform: 'uppercase', marginBottom: '4px' }}>
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <div style={{ fontSize: '15px', fontStyle: 'italic', color: '#52525B', fontFamily: "'Inter', sans-serif", letterSpacing: '0.02em', marginBottom: '12px' }}>
            {personalInfo.title}
          </div>
          <div className="flex justify-center flex-wrap gap-4" style={{ fontSize: '12px', color: '#71717A', fontFamily: "'Inter', sans-serif" }}>
            {personalInfo.email && <div className="flex items-center gap-1"><Mail size={12} color={accentColor} /><span>{personalInfo.email}</span></div>}
            {personalInfo.phone && <div className="flex items-center gap-1"><Phone size={12} color={accentColor} /><span>{personalInfo.phone}</span></div>}
            {personalInfo.location && <div className="flex items-center gap-1"><MapPin size={12} color={accentColor} /><span>{personalInfo.location}</span></div>}
          </div>
          <div style={{ width: '60px', height: '2px', backgroundColor: accentColor, margin: '14px auto 0 auto' }}></div>
        </div>

        {/* Profile */}
        {personalInfo.summary && (
          <section style={{ marginBottom: '24px', textAlign: 'center', padding: '0 20px', fontFamily: "'Inter', sans-serif" }}>
            <p style={{ fontStyle: 'italic', fontSize: '13.5px', lineHeight: '1.65', color: '#3F3F46', whiteSpace: 'pre-line' }}>
              « {personalInfo.summary} »
            </p>
          </section>
        )}

        {/* Two Columns with delicate divider */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: '32px', fontFamily: "'Inter', sans-serif" }}>
          {/* Left Column: Experience */}
          <section>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: accentColor, borderBottom: `1px solid ${accentColor}30`, paddingBottom: '4px', marginBottom: '16px' }}>
              Expériences Notables
            </h2>
            {experiences.map(exp => (
              <div key={exp.id} style={{ marginBottom: '18px' }}>
                <div className="flex justify-between items-baseline flex-wrap">
                  <strong style={{ fontSize: '14.5px', color: '#09090B' }}>{exp.title}</strong>
                  <span style={{ fontSize: '12px', color: '#71717A' }}>{exp.startDate} - {exp.endDate}</span>
                </div>
                <div style={{ fontSize: '13px', color: accentColor, fontWeight: '500', fontStyle: 'italic', marginBottom: '6px' }}>{exp.company}</div>
                <div style={{ color: '#52525B', fontSize: '13px', lineHeight: '1.55', }} className="rich-text-content" dangerouslySetInnerHTML={{ __html: exp.description }} />
              </div>
            ))}
          </section>

          {/* Right Column: Education & Skills */}
          <div className="flex-col gap-5">
            <section>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: accentColor, borderBottom: `1px solid ${accentColor}30`, paddingBottom: '4px', marginBottom: '14px' }}>
                Formation & Titres
              </h2>
              {education.map(edu => (
                <div key={edu.id} style={{ marginBottom: '12px' }}>
                  <div style={{ fontWeight: '700', fontSize: '13px', color: '#09090B' }}>{edu.degree}</div>
                  <div style={{ fontSize: '12px', color: '#52525B' }}>{edu.school}</div>
                  <div style={{ fontSize: '11px', color: '#A1A1AA' }}>{edu.startDate} - {edu.endDate}</div>
                </div>
              ))}
            </section>

            <section>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: accentColor, borderBottom: `1px solid ${accentColor}30`, paddingBottom: '4px', marginBottom: '12px' }}>
                Expertises
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s, i) => (
                  <span key={i} style={{ border: `1px solid ${accentColor}40`, padding: '4px 8px', borderRadius: '2px', fontSize: '11.5px', color: '#27272A' }}>
                    {s}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '15px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: accentColor, borderBottom: `1px solid ${accentColor}30`, paddingBottom: '4px', marginBottom: '10px' }}>
                Langues
              </h2>
              {languages.map(l => (
                <div key={l.id} className="flex justify-between items-center" style={{ fontSize: '12px', marginBottom: '4px' }}>
                  <span>{l.name}</span>
                  <span style={{ color: '#71717A', fontStyle: 'italic' }}>{l.level}</span>
                </div>
              ))}
            </section>
          </div>
        </div>

      </div>
    </div>
  )
}
