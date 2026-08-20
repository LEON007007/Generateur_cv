import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCVStore } from '../store'
import { Check, Sparkles, Layout, Cpu, Award, Zap, Globe, FileText, Palette, Layers } from 'lucide-react'

const TemplateThumbnail = ({ id, accentColor }) => {
  // Determine layout based on template ID
  if (id.includes("Exécutif") || id.includes("Académique")) {
    return (
      <div style={{ width: '100%', height: '100%', backgroundColor: '#FFFFFF', borderRadius: '4px', padding: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ borderBottom: `2px solid ${accentColor}`, paddingBottom: '6px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '4px' }}>
          <div style={{ width: '60%', height: '8px', backgroundColor: accentColor, borderRadius: '2px' }}></div>
          <div style={{ width: '40%', height: '4px', backgroundColor: '#94A3B8', borderRadius: '2px' }}></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px', flex: 1, marginTop: '4px' }}>
          <div className="flex-col gap-2">
            <div style={{ width: '35%', height: '5px', backgroundColor: accentColor, borderRadius: '2px' }}></div>
            <div style={{ width: '100%', height: '4px', backgroundColor: '#E2E8F0', borderRadius: '2px' }}></div>
            <div style={{ width: '85%', height: '4px', backgroundColor: '#E2E8F0', borderRadius: '2px' }}></div>
            <div style={{ width: '35%', height: '5px', backgroundColor: accentColor, borderRadius: '2px', marginTop: '4px' }}></div>
            <div style={{ width: '100%', height: '4px', backgroundColor: '#E2E8F0', borderRadius: '2px' }}></div>
          </div>
          <div className="flex-col gap-2">
            <div style={{ width: '50%', height: '5px', backgroundColor: accentColor, borderRadius: '2px' }}></div>
            <div style={{ width: '80%', height: '4px', backgroundColor: '#E2E8F0', borderRadius: '2px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (id.includes("Minimaliste")) {
    return (
      <div style={{ width: '100%', height: '100%', backgroundColor: '#FFFFFF', borderRadius: '4px', padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ width: '40%', height: '6px', backgroundColor: '#334155', borderRadius: '2px' }}></div>
        <div style={{ width: '30%', height: '4px', backgroundColor: '#64748B', borderRadius: '2px' }}></div>
        <div style={{ width: '100%', height: '1px', backgroundColor: '#E2E8F0', margin: '4px 0' }}></div>
        <div style={{ width: '25%', height: '5px', backgroundColor: '#334155', borderRadius: '2px' }}></div>
        <div style={{ width: '100%', height: '3px', backgroundColor: '#F1F5F9', borderRadius: '2px' }}></div>
        <div style={{ width: '90%', height: '3px', backgroundColor: '#F1F5F9', borderRadius: '2px' }}></div>
        <div style={{ width: '25%', height: '5px', backgroundColor: '#334155', borderRadius: '2px', marginTop: '4px' }}></div>
        <div style={{ width: '100%', height: '3px', backgroundColor: '#F1F5F9', borderRadius: '2px' }}></div>
        <div style={{ width: '90%', height: '3px', backgroundColor: '#F1F5F9', borderRadius: '2px' }}></div>
      </div>
    );
  }

  if (id.includes("Tech") || id.includes("Ingénieur") || id.includes("Silicon")) {
    return (
      <div style={{ width: '100%', height: '100%', backgroundColor: '#FFFFFF', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ backgroundColor: '#1E293B', padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ width: '50%', height: '6px', backgroundColor: accentColor, borderRadius: '2px' }}></div>
          <div style={{ width: '30%', height: '4px', backgroundColor: '#94A3B8', borderRadius: '2px' }}></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px', padding: '12px', flex: 1 }}>
          <div className="flex-col gap-2">
            <div style={{ width: '60%', height: '5px', backgroundColor: accentColor, borderRadius: '2px' }}></div>
            <div style={{ width: '100%', height: '4px', backgroundColor: '#E2E8F0', borderRadius: '2px' }}></div>
            <div style={{ width: '100%', height: '4px', backgroundColor: '#E2E8F0', borderRadius: '2px' }}></div>
            <div style={{ width: '60%', height: '5px', backgroundColor: accentColor, borderRadius: '2px', marginTop: '6px' }}></div>
            <div style={{ width: '100%', height: '4px', backgroundColor: '#E2E8F0', borderRadius: '2px' }}></div>
          </div>
          <div className="flex-col gap-2">
            <div style={{ width: '40%', height: '5px', backgroundColor: accentColor, borderRadius: '2px' }}></div>
            <div style={{ width: '100%', height: '4px', backgroundColor: '#E2E8F0', borderRadius: '2px' }}></div>
            <div style={{ width: '100%', height: '4px', backgroundColor: '#E2E8F0', borderRadius: '2px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (id.includes("Créatif") || id.includes("Portfolio")) {
    return (
      <div style={{ width: '100%', height: '100%', backgroundColor: '#FFFFFF', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', display: 'grid', gridTemplateColumns: '1fr 2fr', overflow: 'hidden' }}>
        <div style={{ backgroundColor: accentColor, padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.25)', margin: '0 auto 4px auto' }}></div>
          <div style={{ width: '80%', height: '4px', backgroundColor: '#FFFFFF', borderRadius: '2px' }}></div>
          <div style={{ width: '60%', height: '3px', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '2px' }}></div>
          <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(255,255,255,0.2)', margin: '4px 0' }}></div>
          <div style={{ width: '70%', height: '3px', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '2px' }}></div>
          <div style={{ width: '50%', height: '3px', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: '2px' }}></div>
        </div>
        <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ width: '50%', height: '6px', backgroundColor: accentColor, borderRadius: '2px' }}></div>
          <div style={{ width: '100%', height: '3px', backgroundColor: '#E2E8F0', borderRadius: '2px' }}></div>
          <div style={{ width: '90%', height: '3px', backgroundColor: '#E2E8F0', borderRadius: '2px' }}></div>
          <div style={{ width: '40%', height: '5px', backgroundColor: accentColor, borderRadius: '2px', marginTop: '4px' }}></div>
          <div style={{ width: '100%', height: '3px', backgroundColor: '#E2E8F0', borderRadius: '2px' }}></div>
        </div>
      </div>
    );
  }

  // Default compact layout
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#FFFFFF', borderRadius: '4px', padding: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '4px', backgroundColor: accentColor }}></div>
        <div className="flex-col gap-1 flex-1">
          <div style={{ width: '50%', height: '5px', backgroundColor: accentColor, borderRadius: '2px' }}></div>
          <div style={{ width: '30%', height: '3px', backgroundColor: '#94A3B8', borderRadius: '2px' }}></div>
          <div style={{ width: '80%', height: '3px', backgroundColor: '#CBD5E1', borderRadius: '2px' }}></div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', flex: 1 }}>
        <div className="flex-col gap-2">
          <div style={{ width: '40%', height: '4px', backgroundColor: accentColor, borderRadius: '2px' }}></div>
          <div style={{ width: '100%', height: '3px', backgroundColor: '#E2E8F0', borderRadius: '2px' }}></div>
          <div style={{ width: '100%', height: '3px', backgroundColor: '#E2E8F0', borderRadius: '2px' }}></div>
          <div style={{ width: '40%', height: '4px', backgroundColor: accentColor, borderRadius: '2px' }}></div>
          <div style={{ width: '100%', height: '3px', backgroundColor: '#E2E8F0', borderRadius: '2px' }}></div>
        </div>
        <div className="flex-col gap-2">
          <div style={{ width: '40%', height: '4px', backgroundColor: accentColor, borderRadius: '2px' }}></div>
          <div style={{ width: '100%', height: '3px', backgroundColor: '#E2E8F0', borderRadius: '2px' }}></div>
          <div style={{ width: '40%', height: '4px', backgroundColor: accentColor, borderRadius: '2px' }}></div>
          <div style={{ width: '100%', height: '3px', backgroundColor: '#E2E8F0', borderRadius: '2px' }}></div>
        </div>
      </div>
    </div>
  );
};

const TemplateCard = ({ id, title, category, accentColor = '#1B3041', onClick, isSelected }) => (
  <div 
    className="card" 
    style={{ 
      overflow: 'hidden', 
      display: 'flex', 
      flexDirection: 'column', 
      height: '380px', 
      cursor: 'pointer', 
      transition: 'all var(--duration-normal) var(--ease-premium)',
      border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
      position: 'relative'
    }}
    onClick={onClick}
    onMouseEnter={(e) => { 
      e.currentTarget.style.transform = 'translateY(-6px)'
      e.currentTarget.style.boxShadow = 'var(--shadow-level-2)' 
      e.currentTarget.style.borderColor = 'var(--color-primary)'
    }}
    onMouseLeave={(e) => { 
      e.currentTarget.style.transform = 'none'
      e.currentTarget.style.boxShadow = 'var(--shadow-level-1)'
      e.currentTarget.style.borderColor = isSelected ? 'var(--color-primary)' : 'var(--color-border)'
    }}
  >
    {/* Real Template Visual Preview */}
    <div style={{
      flex: 1,
      backgroundColor: '#F8FAFC',
      borderBottom: '1px solid var(--color-border)',
      padding: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Template Image with dynamic mapping */}
      <img 
        src={
          id === "L'Exécutif" ? "/templates/cv_executive.jpg" :
          id === "Le Minimaliste (ATS)" ? "/templates/cv_minimalist.jpg" :
          id === "L'Académique & Recherche" ? "/templates/cv_academic.jpg" :
          id === "Le Tech Lead" ? "/templates/cv_techlead.jpg" :
          id === "Le Silicon Valley" ? "/templates/cv_silicon.jpg" :
          id === "L'Ingénieur & Industriel" ? "/templates/cv_engineer.jpg" :
          id === "Le Créatif" ? "/templates/cv_creative.jpg" :
          id === "L'Élégant Prestige" ? "/templates/cv_prestige.jpg" :
          id === "Le Portfolio Visuel" ? "/templates/cv_portfolio.jpg" :
          id === "Le Condensé 1-Page" ? "/templates/cv_compact.jpg" :
          id === "L'International / Expat" ? "/templates/cv_international.jpg" :
          "/templates/cv_proafrique.jpg"
        }
        alt={title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'top',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          transition: 'transform var(--duration-slow) var(--ease-premium)'
        }}
        onError={(e) => {
          e.target.style.display = 'none';
          if (e.target.nextSibling) {
            e.target.nextSibling.style.display = 'flex';
          }
        }}
      />
      <div style={{ display: 'none', width: '100%', height: '100%' }}>
        <TemplateThumbnail id={id} accentColor={accentColor} />
      </div>
      
      {/* Check overlay for active state */}
      {isSelected && (
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          width: '28px',
          height: '28px',
          backgroundColor: 'var(--color-primary)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <Check size={16} strokeWidth={3} />
        </div>
      )}
    </div>

    {/* Content Info (Minimalist) */}
    <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: '700', letterSpacing: '0.06em', marginBottom: '6px' }}>
        {category}
      </div>
      <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--color-primary)', margin: 0, letterSpacing: '-0.01em' }}>
        {title}
      </h3>
    </div>
  </div>
)

export default function Templates() {
  const navigate = useNavigate()
  const { selectedTemplate, setSelectedTemplate, setAccentColor } = useCVStore()
  const [filterCategory, setFilterCategory] = useState('Tous')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const templatesList = [
    // 1. ATS & Classique
    {
      id: "L'Exécutif",
      title: "L'Exécutif Standard",
      category: "ATS & Classique",
      categoryKey: "ats",
      description: "Classique et rigoureux, parfait pour cadres supérieurs, banques, conseil et postes de direction.",
      badge: "Populaire",
      accentColor: "#1B3041"
    },
    {
      id: "Le Minimaliste (ATS)",
      title: "Le Minimaliste Pur",
      category: "ATS & Classique",
      categoryKey: "ats",
      description: "Structure 100% linéaire et épurée. Taux de lecture et de succès maximal auprès des robots ATS.",
      badge: "100% ATS",
      accentColor: "#334155"
    },
    {
      id: "L'Académique & Recherche",
      title: "L'Académique & Recherche",
      category: "ATS & Classique",
      categoryKey: "ats",
      description: "Mise en avant du cursus universitaire, des publications et des travaux d'enseignement.",
      badge: "Académique",
      accentColor: "#0F766E"
    },

    // 2. Tech & Moderne
    {
      id: "Le Tech Lead",
      title: "Le Tech Lead / Développeur",
      category: "Tech & Moderne",
      categoryKey: "tech",
      description: "En-tête tech sombre avec badges de technologies, idéal pour développeurs, CTO et profils IT.",
      badge: "Tech Star",
      accentColor: "#2563EB"
    },
    {
      id: "Le Silicon Valley",
      title: "Le Silicon Valley",
      category: "Tech & Moderne",
      categoryKey: "tech",
      description: "Style startup moderne avec encadrés visuels et hiérarchie par compétences clés.",
      badge: "Tendance",
      accentColor: "#4338CA"
    },
    {
      id: "L'Ingénieur & Industriel",
      title: "L'Ingénieur & Industriel",
      category: "Tech & Moderne",
      categoryKey: "tech",
      description: "Mise en page rigoureuse orientée métriques, livrables chiffrés et gestion de projets.",
      badge: "Ingénierie",
      accentColor: "#0369A1"
    },

    // 3. Créatif & Design
    {
      id: "Le Créatif",
      title: "Le Créatif Studio",
      category: "Créatif & Design",
      categoryKey: "creative",
      description: "Barre latérale colorée percutante, idéal pour designers, marketing, communication et freelances.",
      badge: "Design Pro",
      accentColor: "#BE185D"
    },
    {
      id: "L'Élégant Prestige",
      title: "L'Élégant Prestige",
      category: "Créatif & Design",
      categoryKey: "creative",
      description: "Typographie de prestige avec séparateurs dorés/bordeaux, adapté aux profils luxe et droit.",
      badge: "Élégance",
      accentColor: "#881337"
    },
    {
      id: "Le Portfolio Visuel",
      title: "Le Portfolio Visuel",
      category: "Créatif & Design",
      categoryKey: "creative",
      description: "Grille moderne mettant en avant vos projets et réalisations clés avec impact visuel.",
      badge: "Portfolio",
      accentColor: "#4F46E5"
    },

    // 4. Compact & Spécialisé
    {
      id: "Le Condensé 1-Page",
      title: "Le Condensé 1-Page",
      category: "Compact & Spécialisé",
      categoryKey: "compact",
      description: "Haute densité d'information. Idéal pour faire tenir 15 ans d'expérience sans dépasser 1 page.",
      badge: "Compact",
      accentColor: "#1E293B"
    },
    {
      id: "L'International / Expat",
      title: "L'International / Expat",
      category: "Compact & Spécialisé",
      categoryKey: "compact",
      description: "Matrice de langues mise en avant, fuseaux horaires et mobilité internationale.",
      badge: "Global",
      accentColor: "#0D9488"
    },
    {
      id: "Le Polyvalent Pro-Afrique",
      title: "Le Polyvalent Pro-Afrique",
      category: "Compact & Spécialisé",
      categoryKey: "compact",
      description: "Standards francophones et internationaux avec références et compétences institutionnelles.",
      badge: "Polyvalent",
      accentColor: "#1B3041"
    }
  ]

  const categories = [
    { label: 'Tous les modèles', value: 'Tous' },
    { label: 'ATS & Classique', value: 'ATS & Classique' },
    { label: 'Tech & Moderne', value: 'Tech & Moderne' },
    { label: 'Créatif & Design', value: 'Créatif & Design' },
    { label: 'Compact & Spécialisé', value: 'Compact & Spécialisé' }
  ]

  const filteredTemplates = filterCategory === 'Tous'
    ? templatesList
    : templatesList.filter(t => t.category === filterCategory)

  const handleSelectTemplate = (tpl) => {
    setSelectedTemplate(tpl.id)
    if (tpl.accentColor) {
      setAccentColor(tpl.accentColor)
    }
    navigate('/editeur')
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px 64px 24px' }}>
      
      {/* Title & Introduction */}
      <div style={{ textAlign: 'left', marginBottom: '40px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: '800', color: 'var(--color-primary)', letterSpacing: '-0.03em', marginBottom: '8px' }}>
          Modèles
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '16px', maxWidth: '650px' }}>
          Choisissez votre modèle de CV.
        </p>
      </div>

      {/* Mobile Filter: Custom Dropdown Menu (Contained strictly within mobile width) */}
      <div className="templates-filter-mobile" style={{ position: 'relative', width: '100%', maxWidth: '280px', margin: '0 auto 28px' }}>
        <label 
          style={{ 
            display: 'block', 
            fontSize: '11px', 
            fontWeight: '700', 
            textTransform: 'uppercase', 
            letterSpacing: '0.06em', 
            color: 'var(--color-text-muted)', 
            marginBottom: '8px',
            textAlign: 'center'
          }}
        >
          Filtrer par catégorie
        </label>
        
        {/* Dropdown Toggle Button */}
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '11px 16px',
            fontSize: '13.5px',
            fontWeight: '700',
            color: 'var(--color-primary)',
            backgroundColor: 'var(--color-surface)',
            border: isDropdownOpen ? '2px solid var(--color-coral)' : '1.5px solid var(--color-coral)',
            borderRadius: 'var(--radius-full)',
            outline: 'none',
            boxShadow: isDropdownOpen ? '0 4px 16px rgba(255, 97, 84, 0.25)' : '0 2px 10px rgba(255, 97, 84, 0.12)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {categories.find(c => c.value === filterCategory)?.label || 'Tous les modèles'}
          </span>
          <svg 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="var(--color-coral)" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{
              flexShrink: 0,
              marginLeft: '8px',
              transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        {/* Dropdown Options Popup (Guaranteed 100% inside container bounds) */}
        {isDropdownOpen && (
          <>
            {/* Click-outside dismissal backdrop */}
            <div 
              onClick={() => setIsDropdownOpen(false)} 
              style={{ position: 'fixed', inset: 0, zIndex: 40 }}
            />
            
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                right: 0,
                width: '100%',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                boxShadow: '0 12px 32px rgba(27, 48, 65, 0.18)',
                overflow: 'hidden',
                zIndex: 50
              }}
            >
              {categories.map((cat, idx) => {
                const count = cat.value === 'Tous' 
                  ? templatesList.length 
                  : templatesList.filter(t => t.category === cat.value).length
                const isSelected = filterCategory === cat.value

                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => {
                      setFilterCategory(cat.value)
                      setIsDropdownOpen(false)
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '11px 16px',
                      fontSize: '13px',
                      fontWeight: isSelected ? '700' : '500',
                      color: isSelected ? 'var(--color-coral)' : 'var(--color-text-main)',
                      backgroundColor: isSelected ? 'rgba(255, 97, 84, 0.08)' : 'transparent',
                      border: 'none',
                      borderBottom: idx < categories.length - 1 ? '1px solid var(--color-border)' : 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = '#F8FAFC'
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <span>{cat.label}</span>
                    {isSelected && (
                      <span style={{ color: 'var(--color-coral)', display: 'flex', alignItems: 'center' }}>
                        <Check size={16} strokeWidth={2.5} />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Desktop Filter: Pill Tabs */}
      <div className="templates-filter-desktop">
        {categories.map(cat => {
          const count = cat.value === 'Tous' 
            ? templatesList.length 
            : templatesList.filter(t => t.category === cat.value).length

          return (
            <button
              key={cat.value}
              onClick={() => setFilterCategory(cat.value)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-full)',
                fontSize: '13.5px',
                fontWeight: '600',
                border: filterCategory === cat.value ? '1px solid var(--color-coral)' : '1px solid var(--color-border)',
                backgroundColor: filterCategory === cat.value ? 'var(--color-coral)' : 'var(--color-surface)',
                color: filterCategory === cat.value ? '#FFFFFF' : 'var(--color-text-main)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: filterCategory === cat.value ? '0 2px 8px rgba(255, 97, 84, 0.25)' : 'none'
              }}
            >
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Grid of 12 Templates */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
        gap: '20px' 
      }}>
        {filteredTemplates.map(template => (
          <TemplateCard
            key={template.id}
            id={template.id}
            title={template.title}
            category={template.category}
            accentColor={template.accentColor}
            isSelected={selectedTemplate === template.id}
            onClick={() => handleSelectTemplate(template)}
          />
        ))}
      </div>
    </div>
  )
}
