import React from 'react'
import { Mail, Phone, MapPin, CheckCircle2 } from 'lucide-react'

export default function EngineerTemplate({ personalInfo, experiences, education, skills, languages, accentColor }) {
  return (
    <div style={{ color: '#1E293B', fontSize: '13px', borderTop: `6px solid ${accentColor}`, paddingTop: '18px' }}>
      {/* Engineering Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px', borderBottom: '2px solid #CBD5E1', paddingBottom: '16px' }}>
        <div className="flex gap-4 items-center">
          {personalInfo.avatar && (
            <div style={{ width: '70px', height: '70px', backgroundColor: '#F1F5F9', border: `2px solid ${accentColor}`, overflow: 'hidden' }}>
              <img src={personalInfo.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '-0.01em', color: '#0F172A', margin: 0 }}>
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <div style={{ fontSize: '15px', fontWeight: '700', color: accentColor, marginTop: '2px' }}>
              {personalInfo.title}
            </div>
          </div>
        </div>

        <div style={{ fontSize: '12px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {personalInfo.email && <div className="flex items-center gap-1.5"><Mail size={13} color={accentColor} /><span>{personalInfo.email}</span></div>}
          {personalInfo.phone && <div className="flex items-center gap-1.5"><Phone size={13} color={accentColor} /><span>{personalInfo.phone}</span></div>}
          {personalInfo.location && <div className="flex items-center gap-1.5"><MapPin size={13} color={accentColor} /><span>{personalInfo.location}</span></div>}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div style={{ backgroundColor: '#F8FAFC', borderLeft: `3px solid ${accentColor}`, padding: '10px 14px', marginBottom: '20px' }}>
          <div style={{ color: '#334155', lineHeight: '1.55', fontSize: '13px' }} className="rich-text-content" dangerouslySetInnerHTML={{ __html: personalInfo.summary }} />
        </div>
      )}

      {/* Experience Section */}
      <section style={{ marginBottom: '22px' }}>
        <h2 style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: accentColor, borderBottom: '1px solid #E2E8F0', paddingBottom: '4px', marginBottom: '12px' }}>
          Expériences Techniques & Projets
        </h2>
        {experiences.map(exp => (
          <div key={exp.id} style={{ marginBottom: '14px' }}>
            <div className="flex justify-between items-baseline flex-wrap">
              <span style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>{exp.title}</span>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748B' }}>{exp.startDate} - {exp.endDate}</span>
            </div>
            <div style={{ fontSize: '12.5px', fontWeight: '600', color: accentColor, marginBottom: '4px' }}>{exp.company}</div>
            <div style={{ color: '#475569', lineHeight: '1.5', }} className="rich-text-content" dangerouslySetInnerHTML={{ __html: exp.description }} />
          </div>
        ))}
      </section>

      {/* Two Column Footer: Education & Skills */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <section>
          <h2 style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: accentColor, borderBottom: '1px solid #E2E8F0', paddingBottom: '4px', marginBottom: '10px' }}>
            Diplômes & Certifications
          </h2>
          {education.map(edu => (
            <div key={edu.id} style={{ marginBottom: '8px' }}>
              <div style={{ fontWeight: '700', fontSize: '13px' }}>{edu.degree}</div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>{edu.school} ({edu.startDate} - {edu.endDate})</div>
            </div>
          ))}
        </section>

        <section>
          <h2 style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', color: accentColor, borderBottom: '1px solid #E2E8F0', paddingBottom: '4px', marginBottom: '10px' }}>
            Compétences & Langues
          </h2>
          <div className="flex flex-wrap gap-1.5" style={{ marginBottom: '8px' }}>
            {skills.map((s, i) => (
              <span key={i} style={{ backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', padding: '3px 8px', borderRadius: '3px', fontSize: '11.5px', fontWeight: '600' }}>
                {s}
              </span>
            ))}
          </div>
          <div style={{ fontSize: '12px', color: '#475569', marginTop: '6px' }}>
            <strong>Langues:</strong> {languages.map(l => `${l.name} (${l.level})`).join(', ')}
          </div>
        </section>
      </div>
    </div>
  )
}
