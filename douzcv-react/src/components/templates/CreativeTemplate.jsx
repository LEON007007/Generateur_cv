import React from 'react'
import { Mail, Phone, MapPin, Briefcase, GraduationCap, User } from 'lucide-react'

export default function CreativeTemplate({ personalInfo, experiences, education, skills, languages, accentColor }) {
  // Initials for avatar
  const initials = `${(personalInfo.firstName || 'L')[0] || ''}${(personalInfo.lastName || 'A')[0] || ''}`.toUpperCase()

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 240px) 1fr', borderRadius: 'var(--radius-sm)', minHeight: '100%', boxSizing: 'border-box' }}>
      {/* Sidebar with Accent Color */}
      <div style={{ backgroundColor: accentColor, color: '#FFFFFF', padding: '32px 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Avatar Circle */}
        <div style={{ textAlign: 'center', marginBottom: '8px' }}>
          <div style={{ 
            width: '72px', 
            height: '72px', 
            borderRadius: '50%', 
            backgroundColor: 'rgba(255,255,255,0.15)', 
            border: '2px solid rgba(255,255,255,0.4)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 12px auto',
            fontSize: '24px',
            fontWeight: '800',
            letterSpacing: '1px',
            overflow: 'hidden'
          }}>
            {personalInfo.avatar ? (
              <img src={personalInfo.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              initials
            )}
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>
            {personalInfo.firstName} {personalInfo.lastName}
          </h2>
          <p style={{ fontSize: '12px', opacity: 0.85, marginTop: '4px' }}>
            {personalInfo.title}
          </p>
        </div>

        {/* Contact info */}
        <div>
          <h4 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', opacity: 0.7, marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '4px' }}>
            Contact
          </h4>
          <div className="flex-col gap-2" style={{ fontSize: '12px', wordBreak: 'break-word' }}>
            {personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail size={13} style={{ flexShrink: 0, opacity: 0.8 }} />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone size={13} style={{ flexShrink: 0, opacity: 0.8 }} />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-2">
                <MapPin size={13} style={{ flexShrink: 0, opacity: 0.8 }} />
                <span>{personalInfo.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        <div>
          <h4 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', opacity: 0.7, marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '4px' }}>
            Compétences
          </h4>
          <div className="flex flex-wrap gap-1">
            {skills.map((skill, index) => (
              <span 
                key={index} 
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.15)', 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  fontSize: '11px',
                  color: '#FFFFFF'
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div>
          <h4 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', opacity: 0.7, marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '4px' }}>
            Langues
          </h4>
          <div className="flex-col gap-2">
            {languages.map(lang => (
              <div key={lang.id} className="flex justify-between items-center" style={{ fontSize: '12px' }}>
                <span>{lang.name}</span>
                <span style={{ opacity: 0.75, fontSize: '11px' }}>{lang.level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Right Content */}
      <div style={{ padding: '32px 28px', backgroundColor: '#FFFFFF' }}>
        {/* Profile */}
        {personalInfo.summary && (
          <section style={{ marginBottom: '28px' }}>
            <div className="flex items-center gap-2" style={{ marginBottom: '10px' }}>
              <User size={16} color={accentColor} />
              <h3 style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: accentColor, margin: 0 }}>
                À Propos de moi
              </h3>
            </div>
            <p style={{ fontSize: '13.5px', lineHeight: '1.6', color: '#374151', whiteSpace: 'pre-line' }}>
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        <section style={{ marginBottom: '28px' }}>
          <div className="flex items-center gap-2" style={{ marginBottom: '14px' }}>
            <Briefcase size={16} color={accentColor} />
            <h3 style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: accentColor, margin: 0 }}>
              Expériences Professionnelles
            </h3>
          </div>
          <div style={{ borderLeft: `2px solid ${accentColor}25`, paddingLeft: '16px', marginLeft: '6px' }}>
            {experiences.map(exp => (
              <div key={exp.id} style={{ marginBottom: '20px', position: 'relative' }}>
                <div style={{ 
                  position: 'absolute', 
                  left: '-22px', 
                  top: '4px', 
                  width: '10px', 
                  height: '10px', 
                  borderRadius: '50%', 
                  backgroundColor: accentColor,
                  border: '2px solid #FFFFFF'
                }}></div>
                <div className="flex justify-between items-baseline flex-wrap gap-1" style={{ marginBottom: '2px' }}>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#111827' }}>{exp.title}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: '500' }}>{exp.startDate} - {exp.endDate}</div>
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: accentColor, marginBottom: '6px' }}>
                  {exp.company}
                </div>
                <div style={{ fontSize: '13px', lineHeight: '1.55', color: '#4B5563', whiteSpace: 'pre-line' }}>
                  {exp.description}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <div className="flex items-center gap-2" style={{ marginBottom: '14px' }}>
            <GraduationCap size={16} color={accentColor} />
            <h3 style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: accentColor, margin: 0 }}>
              Formation Académique
            </h3>
          </div>
          <div style={{ borderLeft: `2px solid ${accentColor}25`, paddingLeft: '16px', marginLeft: '6px' }}>
            {education.map(edu => (
              <div key={edu.id} style={{ marginBottom: '12px', position: 'relative' }}>
                <div style={{ 
                  position: 'absolute', 
                  left: '-22px', 
                  top: '4px', 
                  width: '10px', 
                  height: '10px', 
                  borderRadius: '50%', 
                  backgroundColor: accentColor,
                  border: '2px solid #FFFFFF'
                }}></div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#111827' }}>{edu.degree}</div>
                <div style={{ fontSize: '13px', color: '#4B5563' }}>{edu.school}</div>
                <div style={{ fontSize: '12px', color: '#6B7280' }}>{edu.startDate} - {edu.endDate}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
