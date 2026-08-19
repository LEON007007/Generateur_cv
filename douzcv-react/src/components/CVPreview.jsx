import React, { useState, useEffect, useRef } from 'react'
import { ZoomIn, ZoomOut, RotateCcw, FileText, Scissors } from 'lucide-react'
import { useCVStore } from '../store'
import ExecutiveTemplate from './templates/ExecutiveTemplate'
import CreativeTemplate from './templates/CreativeTemplate'
import MinimalistTemplate from './templates/MinimalistTemplate'
import AcademicTemplate from './templates/AcademicTemplate'
import TechLeadTemplate from './templates/TechLeadTemplate'
import SiliconTemplate from './templates/SiliconTemplate'
import EngineerTemplate from './templates/EngineerTemplate'
import PrestigeTemplate from './templates/PrestigeTemplate'
import PortfolioTemplate from './templates/PortfolioTemplate'
import CompactOnePageTemplate from './templates/CompactOnePageTemplate'
import InternationalTemplate from './templates/InternationalTemplate'
import ProAfriqueTemplate from './templates/ProAfriqueTemplate'

export default function CVPreview({ isActiveTab = true }) {
  const { 
    personalInfo, 
    experiences, 
    education, 
    skills, 
    languages, 
    selectedTemplate, 
    accentColor, 
    fontFamily,
    zoomLevel,
    setZoomLevel,
    spacing,
    setSpacing,
    showPageBreaks
  } = useCVStore()

  const containerRef = useRef(null)
  const outerWrapperRef = useRef(null)
  const [pageCount, setPageCount] = useState(1)
  const [pageBreakPositions, setPageBreakPositions] = useState([])
  const [fitScale, setFitScale] = useState(1)
  const [contentHeight, setContentHeight] = useState(1123)

  // Compute Auto-Fit Scale (FlowCV Mobile & Desktop System)
  useEffect(() => {
    const updateScale = () => {
      if (!outerWrapperRef.current) return
      const wrapperWidth = outerWrapperRef.current.clientWidth || window.innerWidth
      const padding = window.innerWidth <= 600 ? 16 : 32
      const availableWidth = Math.max(280, wrapperWidth - padding)
      const standardA4Width = 794 // Standard A4 width in px at 96 DPI (210mm)

      if (availableWidth < standardA4Width) {
        const calculatedScale = availableWidth / standardA4Width
        setFitScale(calculatedScale)
      } else {
        setFitScale(1)
      }

      if (containerRef.current) {
        setContentHeight(containerRef.current.scrollHeight || 1123)
      }
    }

    updateScale()
    const rAF = requestAnimationFrame(updateScale)
    const timer1 = setTimeout(updateScale, 60)
    const timer2 = setTimeout(updateScale, 200)

    window.addEventListener('resize', updateScale)
    return () => {
      cancelAnimationFrame(rAF)
      clearTimeout(timer1)
      clearTimeout(timer2)
      window.removeEventListener('resize', updateScale)
    }
  }, [
    isActiveTab,
    personalInfo, 
    experiences, 
    education, 
    skills, 
    languages, 
    selectedTemplate, 
    fontFamily, 
    spacing
  ])

  // Calculate A4 Pages and Break Positions dynamically
  useEffect(() => {
    const calculatePages = () => {
      if (!containerRef.current) return
      const element = containerRef.current
      const width = 794
      // A4 aspect ratio height: 297mm / 210mm = 1.4142 (1123px)
      const a4PageHeight = Math.round(width * 1.4142)
      const contentH = element.scrollHeight || 1123
      setContentHeight(contentH)

      const calculatedPages = Math.max(1, Math.ceil(contentH / a4PageHeight))
      setPageCount(calculatedPages)

      const breaks = []
      for (let i = 1; i < calculatedPages; i++) {
        breaks.push({
          pageNumber: i,
          topPosition: i * a4PageHeight
        })
      }
      setPageBreakPositions(breaks)
    }

    calculatePages()
    const resizeObserver = new ResizeObserver(calculatePages)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => resizeObserver.disconnect()
  }, [
    personalInfo, 
    experiences, 
    education, 
    skills, 
    languages, 
    selectedTemplate, 
    fontFamily, 
    spacing
  ])

  // Font family mapping
  const getFontFamilyCSS = () => {
    switch (fontFamily) {
      case 'Plus Jakarta Sans':
        return "'Plus Jakarta Sans', sans-serif"
      case 'Playfair Display':
        return "'Playfair Display', serif"
      case 'DM Sans':
        return "'DM Sans', sans-serif"
      case 'Merriweather':
        return "'Merriweather', serif"
      case 'Inter':
      default:
        return "'Inter', sans-serif"
    }
  }

const samplePersonalInfo = {
  firstName: 'Leon',
  lastName: 'Atangana',
  title: 'Consultant Senior en Stratégie',
  email: 'leon.atangana@email.com',
  phone: '+33 6 12 34 56 78',
  location: 'Paris, France',
  avatar: '',
  summary: "Consultant expérimenté avec 8 ans de pratique dans l'accompagnement de transformations digitales complexes. Passionné par l'optimisation des processus et la création de valeur pour les entreprises dans des environnements exigeants."
}

const sampleExperiences = [
  {
    id: 1,
    title: 'Consultant Senior',
    company: 'Cabinet de Conseil Paris',
    startDate: '2019',
    endDate: 'Présent',
    description: "• Pilotage de projets de transformation digitale pour des clients CAC40\n• Management d'une équipe de 5 consultants juniors\n• Augmentation de la rentabilité de 15% sur les projets gérés"
  },
  {
    id: 2,
    title: 'Consultant Junior',
    company: 'Autre Cabinet Conseil',
    startDate: '2015',
    endDate: '2019',
    description: "• Analyse de données et benchmark concurrentiel\n• Rédaction de livrables stratégiques"
  }
]

const sampleEducation = [
  {
    id: 1,
    degree: 'Master en Management',
    school: 'Grande École de Commerce',
    startDate: '2013',
    endDate: '2015'
  }
]

const sampleSkills = ['Gestion de projet Agile', 'Stratégie Digitale', 'Management', 'Analyse de données', 'Transformation IT']

const sampleLanguages = [
  { id: 1, name: 'Français', level: 'Natif' },
  { id: 2, name: 'Anglais', level: 'Courant (C1)' },
  { id: 3, name: 'Espagnol', level: 'Intermédiaire (B2)' }
]

  // Template renderer for all 12 templates
  const renderTemplateContent = () => {
    const effectivePersonalInfo = {
      firstName: personalInfo.firstName || samplePersonalInfo.firstName,
      lastName: personalInfo.lastName || samplePersonalInfo.lastName,
      title: personalInfo.title || samplePersonalInfo.title,
      email: personalInfo.email || samplePersonalInfo.email,
      phone: personalInfo.phone || samplePersonalInfo.phone,
      location: personalInfo.location || samplePersonalInfo.location,
      avatar: personalInfo.avatar || '',
      summary: personalInfo.summary || samplePersonalInfo.summary
    }

    const effectiveExperiences = (experiences && experiences.length > 0) ? experiences : sampleExperiences
    const effectiveEducation = (education && education.length > 0) ? education : sampleEducation
    const effectiveSkills = (skills && skills.length > 0) ? skills : sampleSkills
    const effectiveLanguages = (languages && languages.length > 0) ? languages : sampleLanguages

    const props = { 
      personalInfo: effectivePersonalInfo, 
      experiences: effectiveExperiences, 
      education: effectiveEducation, 
      skills: effectiveSkills, 
      languages: effectiveLanguages, 
      accentColor 
    }
    
    switch (selectedTemplate) {
      case 'Le Créatif':
      case 'Le Créatif Studio':
        return <CreativeTemplate {...props} />
      case 'Le Minimaliste (ATS)':
      case 'Le Minimaliste Pur':
        return <MinimalistTemplate {...props} />
      case "L'Académique & Recherche":
      case "L'Académique":
        return <AcademicTemplate {...props} />
      case 'Le Tech Lead':
      case 'Le Tech Lead / Dev':
        return <TechLeadTemplate {...props} />
      case 'Le Silicon Valley':
      case 'Le Silicon':
        return <SiliconTemplate {...props} />
      case "L'Ingénieur & Industriel":
      case "L'Ingénieur":
        return <EngineerTemplate {...props} />
      case "L'Élégant Prestige":
      case 'Le Prestige':
        return <PrestigeTemplate {...props} />
      case 'Le Portfolio Visuel':
      case 'Le Portfolio':
        return <PortfolioTemplate {...props} />
      case 'Le Condensé 1-Page':
      case 'Le Condensé':
        return <CompactOnePageTemplate {...props} />
      case "L'International / Expat":
      case "L'International":
        return <InternationalTemplate {...props} />
      case 'Le Polyvalent Pro-Afrique':
      case 'Pro-Afrique':
        return <ProAfriqueTemplate {...props} />
      case "L'Exécutif":
      case "L'Exécutif Standard":
      default:
        return <ExecutiveTemplate {...props} />
    }
  }

  const finalScale = fitScale * (zoomLevel || 1)

  return (
    <div 
      ref={outerWrapperRef}
      style={{ 
        position: 'relative', 
        width: '100%', 
        maxWidth: '100%',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        paddingBottom: '80px',
        overflowX: 'hidden'
      }}
    >
      {/* Floating Toolbar: Zoom & Multi-page controls */}
      <div 
        className="floating-zoom-controls"
        style={{ 
          position: 'fixed', 
          bottom: '20px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          zIndex: 40,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderRadius: 'var(--radius-full)',
          boxShadow: '0 6px 24px rgba(27, 48, 65, 0.18)',
          border: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          padding: '4px 10px',
          gap: '8px',
          maxWidth: '92vw'
        }}
      >
        {/* Page Counter Badge */}
        <div 
          className="flex items-center gap-1.5"
          style={{ 
            padding: '4px 10px', 
            backgroundColor: pageCount > 1 ? 'rgba(255, 97, 84, 0.12)' : '#F1F5F9',
            color: pageCount > 1 ? 'var(--color-coral)' : '#475569',
            borderRadius: 'var(--radius-full)',
            fontSize: '12px',
            fontWeight: '700'
          }}
          title={pageCount > 1 ? `Votre CV s'étend sur ${pageCount} pages A4` : "Votre CV tient sur 1 seule page A4"}
        >
          <FileText size={13} />
          <span>{pageCount} {pageCount > 1 ? 'Pages (A4)' : 'Page (A4)'}</span>
        </div>

        {/* 1-Click Compact Spacing if multiple pages */}
        {pageCount > 1 && spacing !== 'compact' && (
          <button
            type="button"
            onClick={() => setSpacing('compact')}
            title="Ajuster l'espacement pour tenter de tenir sur 1 seule page"
            style={{ 
              padding: '4px 10px', 
              borderRadius: 'var(--radius-full)', 
              backgroundColor: '#EFF6FF',
              color: '#2563EB',
              border: '1px solid #BFDBFE',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Compacter (1 page)
          </button>
        )}

        <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--color-border)' }}></div>

        {/* Zoom Controls */}
        <button 
          type="button"
          onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}
          title="Zoom arrière"
          style={{ padding: '6px', borderRadius: '50%', color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', cursor: 'pointer', background: 'none', border: 'none' }}
        >
          <ZoomOut size={16} />
        </button>
        <span style={{ fontSize: '12px', fontWeight: '600', minWidth: '36px', textAlign: 'center' }}>
          {Math.round(zoomLevel * 100)}%
        </span>
        <button 
          type="button"
          onClick={() => setZoomLevel(Math.min(1.4, zoomLevel + 0.1))}
          title="Zoom avant"
          style={{ padding: '6px', borderRadius: '50%', color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', cursor: 'pointer', background: 'none', border: 'none' }}
        >
          <ZoomIn size={16} />
        </button>
        <button 
          type="button"
          onClick={() => setZoomLevel(1)}
          title="Réinitialiser le zoom (100%)"
          style={{ padding: '6px', borderRadius: '50%', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', cursor: 'pointer', background: 'none', border: 'none' }}
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Responsive Scaling Container */}
      <div
        style={{
          width: '100%',
          height: `${Math.ceil((contentHeight || 1123) * finalScale + 24)}px`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          transition: 'height 0.2s ease',
          overflow: 'visible'
        }}
      >
        {/* Clean, Full-fidelity Standard A4 Document Container */}
        <div 
          ref={containerRef}
          className={`cv-preview-container cv-spacing-${spacing || 'normal'}`}
          style={{
            width: '794px',
            minWidth: '794px',
            maxWidth: '794px',
            minHeight: '1123px',
            fontFamily: getFontFamilyCSS(),
            transform: `scale(${finalScale})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
            position: 'relative',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
          }}
        >
          {/* Render Selected Template */}
          {renderTemplateContent()}

          {/* Visual A4 Page Separation Guides (shown only if content spans beyond page 1) */}
          {showPageBreaks && pageBreakPositions.map((p) => (
            <div 
              key={p.pageNumber} 
              className="word-page-break-divider"
              style={{ top: `${p.topPosition}px` }}
            >
              <span className="word-page-break-tag">
                <FileText size={12} />
                Page {p.pageNumber}
              </span>

              <div className="word-page-break-line"></div>

              <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', display: 'flex', alignItems: 'center', gap: '5px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <Scissors size={13} color="var(--color-coral)" />
                Saut de page A4
              </span>

              <div className="word-page-break-line"></div>

              <span className="word-page-break-tag next-page">
                <FileText size={12} />
                Page {p.pageNumber + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
