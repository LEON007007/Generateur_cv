import React from 'react'
import { Mail, Phone, MapPin, Sparkles } from 'lucide-react'

export default function SiliconTemplate({ personalInfo, experiences, education, skills, languages, accentColor }) {
  return (
    <div style={{ color: '#0F172A', fontSize: '13px' }}>
      {/* Modern Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #E2E8F0' }}>
        <div className="flex gap-4 items-center">
          {personalInfo.avatar && (
            <div style={{ width: '80px', height: '80px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
              <img src={personalInfo.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.03em', color: '#0F172A', margin: 0 }}>
              {personalInfo.firstName} <span style={{ color: accentColor }}>{personalInfo.lastName}</span>
            </h1>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#64748B', marginTop: '4px' }}>
              {personalInfo.title}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3" style={{ fontSize: '12.5px', color: '#475569' }}>
          {personalInfo.email && <div className="flex items-center gap-1.5"><Mail size={13} color={accentColor} /><span>{personalInfo.email}</span></div>}
          {personalInfo.phone && <div className="flex items-center gap-1.5"><Phone size={13} color={accentColor} /><span>{personalInfo.phone}</span></div>}
          {personalInfo.location && <div className="flex items-center gap-1.5"><MapPin size={13} color={accentColor} /><span>{personalInfo.location}</span></div>}
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '32px' }}>
        {/* Left Column: Summary + Experience */}
        <div>
          {personalInfo.summary && (
            <section style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: accentColor, marginBottom: '8px' }}>
                À propos
              </h3>
              <div style={{ color: '#334155', lineHeight: '1.6', }} className="rich-text-content" dangerouslySetInnerHTML={{ __html: personalInfo.summary }} />
            </section>
          )}

          <section>
            <h3 style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: accentColor, marginBottom: '16px' }}>
              Parcours Professionnel
            </h3>
            <div className="flex-col gap-5">
              {experiences.map(exp => (
                <div key={exp.id} style={{ marginBottom: '18px' }}>
                  <div className="flex justify-between items-baseline flex-wrap gap-1">
                    <strong style={{ fontSize: '14.5px', color: '#0F172A' }}>{exp.title}</strong>
                    <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: accentColor, marginBottom: '6px' }}>
                    {exp.company}
                  </div>
                  <div style={{ color: '#475569', lineHeight: '1.55', }} className="rich-text-content" dangerouslySetInnerHTML={{ __html: exp.description }} />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Skills, Education, Languages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Skills with modern Silicon Cards */}
          <section>
            <h3 style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: accentColor, marginBottom: '12px' }}>
              Stack & Compétences
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s, i) => (
                <span key={i} style={{ backgroundColor: '#F1F5F9', color: '#1E293B', padding: '5px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '500', border: '1px solid #E2E8F0' }}>
                  {s}
                </span>
              ))}
            </div>
          </section>

          {/* Education */}
          <section>
            <h3 style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: accentColor, marginBottom: '12px' }}>
              Formation
            </h3>
            {education.map(edu => (
              <div key={edu.id} style={{ marginBottom: '12px' }}>
                <div style={{ fontWeight: '700', fontSize: '13px', color: '#0F172A' }}>{edu.degree}</div>
                <div style={{ fontSize: '12.5px', color: '#475569' }}>{edu.school}</div>
                <div style={{ fontSize: '11.5px', color: '#94A3B8' }}>{edu.startDate} – {edu.endDate}</div>
              </div>
            ))}
          </section>

          {/* Languages */}
          <section>
            <h3 style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', color: accentColor, marginBottom: '12px' }}>
              Langues
            </h3>
            {languages.map(l => (
              <div key={l.id} className="flex justify-between items-center" style={{ fontSize: '12.5px', marginBottom: '6px' }}>
                <span style={{ fontWeight: '500', color: '#1E293B' }}>{l.name}</span>
                <span style={{ fontSize: '11.5px', color: '#64748B' }}>{l.level}</span>
              </div>
            ))}
          </section>
        </div>
      </div>
    </div>
  )
}
