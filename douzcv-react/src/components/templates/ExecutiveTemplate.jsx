import React from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function ExecutiveTemplate({ personalInfo, experiences, education, skills, languages, accentColor }) {
  return (
    <div style={{ color: '#1B3041' }}>
      {/* Header Info */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '24px' }}>
        {personalInfo.avatar && (
          <div style={{ flexShrink: 0, width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', border: `3px solid ${accentColor}` }}>
            <img src={personalInfo.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <div style={{ flex: 1 }}>
          <h1 style={{ 
            fontSize: '34px', 
            fontWeight: '800', 
            marginBottom: '6px', 
            letterSpacing: '-0.02em',
            color: accentColor
          }}>
            {personalInfo.firstName || 'Prénom'} {personalInfo.lastName || 'Nom'}
          </h1>
        <h2 style={{ 
          fontSize: '18px', 
          fontWeight: '500', 
          color: '#4B5563', 
          marginBottom: '16px' 
        }}>
          {personalInfo.title || 'Titre professionnel'}
        </h2>
        
        <div className="flex flex-wrap items-center gap-4" style={{ fontSize: '13px', color: '#4B5563' }}>
          {personalInfo.email && (
            <div className="flex items-center gap-2">
              <Mail size={14} color={accentColor} style={{ flexShrink: 0 }} />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2">
              <Phone size={14} color={accentColor} style={{ flexShrink: 0 }} />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-2">
              <MapPin size={14} color={accentColor} style={{ flexShrink: 0 }} />
              <span>{personalInfo.location}</span>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Main Divider in Accent Color */}
      <div style={{ width: '100%', height: '3px', backgroundColor: accentColor, marginBottom: '24px', borderRadius: '2px' }}></div>

      {/* Two Columns Grid */}
      <div className="cv-preview-grid">
        {/* Left Column */}
        <div>
          {/* Profile */}
          {personalInfo.summary && (
            <section style={{ marginBottom: '28px' }}>
              <h3 style={{ 
                fontSize: '13px', 
                fontWeight: '700', 
                letterSpacing: '0.1em', 
                marginBottom: '10px', 
                textTransform: 'uppercase',
                color: accentColor,
                borderBottom: '1px solid #E5E7EB',
                paddingBottom: '4px'
              }}>
                Profil
              </h3>
              <div style={{ fontSize: '13.5px', lineHeight: '1.6', color: '#374151', }} className="rich-text-content" dangerouslySetInnerHTML={{ __html: personalInfo.summary }} />
            </section>
          )}

          {/* Experience */}
          <section>
            <h3 style={{ 
              fontSize: '13px', 
              fontWeight: '700', 
              letterSpacing: '0.1em', 
              marginBottom: '16px', 
              textTransform: 'uppercase',
              color: accentColor,
              borderBottom: '1px solid #E5E7EB',
              paddingBottom: '4px'
            }}>
              Expérience Professionnelle
            </h3>
            <div className="flex-col gap-5">
              {experiences.map(exp => (
                <div key={exp.id} style={{ marginBottom: '18px' }}>
                  <div className="flex justify-between items-baseline flex-wrap gap-1" style={{ marginBottom: '2px' }}>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#111827' }}>{exp.title}</div>
                    <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: '500' }}>{exp.startDate} - {exp.endDate}</div>
                  </div>
                  <div style={{ fontSize: '13px', fontStyle: 'italic', marginBottom: '6px', color: accentColor }}>
                    {exp.company}
                  </div>
                  <div style={{ fontSize: '13px', lineHeight: '1.55', color: '#374151', }} className="rich-text-content" dangerouslySetInnerHTML={{ __html: exp.description }} />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div>
          {/* Skills */}
          <section style={{ marginBottom: '28px' }}>
            <h3 style={{ 
              fontSize: '13px', 
              fontWeight: '700', 
              letterSpacing: '0.1em', 
              marginBottom: '12px', 
              textTransform: 'uppercase',
              color: accentColor,
              borderBottom: '1px solid #E5E7EB',
              paddingBottom: '4px'
            }}>
              Compétences
            </h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span 
                  key={index} 
                  style={{ 
                    backgroundColor: '#F3F4F6', 
                    padding: '5px 10px', 
                    borderRadius: '6px', 
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#1F2937',
                    border: '1px solid #E5E7EB'
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Education */}
          <section style={{ marginBottom: '28px' }}>
            <h3 style={{ 
              fontSize: '13px', 
              fontWeight: '700', 
              letterSpacing: '0.1em', 
              marginBottom: '12px', 
              textTransform: 'uppercase',
              color: accentColor,
              borderBottom: '1px solid #E5E7EB',
              paddingBottom: '4px'
            }}>
              Formation
            </h3>
            <div className="flex-col gap-3">
              {education.map(edu => (
                <div key={edu.id} style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#111827' }}>{edu.degree}</div>
                  <div style={{ fontSize: '13px', color: '#4B5563' }}>{edu.school}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>{edu.startDate} - {edu.endDate}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Languages */}
          <section>
            <h3 style={{ 
              fontSize: '13px', 
              fontWeight: '700', 
              letterSpacing: '0.1em', 
              marginBottom: '12px', 
              textTransform: 'uppercase',
              color: accentColor,
              borderBottom: '1px solid #E5E7EB',
              paddingBottom: '4px'
            }}>
              Langues
            </h3>
            <div className="flex-col gap-2">
              {languages.map(lang => (
                <div key={lang.id} className="flex justify-between items-center" style={{ marginBottom: '6px' }}>
                  <span style={{ fontSize: '13px', color: '#1F2937', fontWeight: '500' }}>{lang.name}</span>
                  <span style={{ fontSize: '12px', color: '#6B7280' }}>{lang.level}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
