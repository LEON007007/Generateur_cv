import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCVStore } from '../store'
import { Check } from 'lucide-react'

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

const templatePreviewPaths = {
  "L'Exécutif": '/templates/cv_executive.jpg',
  'Le Minimaliste (ATS)': '/templates/cv_minimalist.jpg',
  "L'Académique & Recherche": '/templates/cv_academic.jpg',
  'Le Tech Lead': '/templates/cv_techlead.jpg',
  'Le Silicon Valley': '/templates/cv_silicon.jpg',
  "L'Ingénieur & Industriel": '/templates/cv_engineer.jpg',
  'Le Créatif': '/templates/cv_creative.jpg',
  "L'Élégant Prestige": '/templates/cv_prestige.jpg',
  'Le Portfolio Visuel': '/templates/cv_portfolio.jpg',
  'Le Condensé 1-Page': '/templates/cv_compact.jpg',
  "L'International / Expat": '/templates/cv_international.jpg',
  'Le Polyvalent Pro-Afrique': '/templates/cv_proafrique.jpg'
}

const TemplateCard = ({ id, title, category, description, badge, accentColor = '#1B3041', onClick, isSelected }) => {
  const previewPath = templatePreviewPaths[id] || templatePreviewPaths['Le Polyvalent Pro-Afrique']

  return (
    <button
      type="button"
      className={`template-card${isSelected ? ' is-selected' : ''}`}
      style={{ '--template-accent': accentColor }}
      onClick={onClick}
      aria-pressed={isSelected}
      aria-label={`${title}, ${category}${isSelected ? ', modèle sélectionné' : ''}`}
    >
      <span className="template-card-preview" aria-hidden="true">
        <img
          className="template-card-image"
          src={previewPath}
          alt=""
          loading="lazy"
          decoding="async"
          onError={(event) => {
            event.currentTarget.hidden = true
            event.currentTarget.nextElementSibling.hidden = false
          }}
        />
        <span className="template-card-fallback" hidden>
          <TemplateThumbnail id={id} accentColor={accentColor} />
        </span>
        {isSelected && (
          <span className="template-card-check" aria-hidden="true">
            <Check size={16} strokeWidth={3} />
          </span>
        )}
      </span>
      <span className="template-card-info">
        <span className="template-card-category">{category}</span>
        <span className="template-card-title">{title}</span>
        <span className="template-card-description">{description}</span>
        <span className="template-card-footer">
          {badge && <span className="template-card-badge">{badge}</span>}
          <span className="template-card-action">Utiliser ce modèle</span>
        </span>
      </span>
    </button>
  )
}

export default function Templates() {
  const navigate = useNavigate()
  const { selectedTemplate, setSelectedTemplate, setAccentColor } = useCVStore()
  const [filterCategory, setFilterCategory] = useState('Tous')

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
    <section className="templates-page" aria-labelledby="templates-heading">
      <header className="templates-heading">
        <div>
          <p className="templates-eyebrow">Votre prochain CV</p>
          <h1 id="templates-heading">Choisissez votre modèle</h1>
          <p className="templates-intro">Comparez les mises en page et sélectionnez celle qui correspond à votre parcours.</p>
        </div>
        <p className="templates-result-count" aria-live="polite">
          <strong>{filteredTemplates.length}</strong> modèles
        </p>
      </header>

      <section className="templates-catalog" aria-label="Catalogue de modèles">
        <p className="templates-filter-label" id="templates-filter-label">Filtrer par catégorie</p>
        <div className="templates-filter" role="group" aria-labelledby="templates-filter-label">
          {categories.map(cat => (
            <button
              key={cat.value}
              type="button"
              className={`templates-filter-button${filterCategory === cat.value ? ' is-active' : ''}`}
              onClick={() => setFilterCategory(cat.value)}
              aria-pressed={filterCategory === cat.value}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {filteredTemplates.length > 0 ? (
          <div className="templates-grid" aria-live="polite">
        {filteredTemplates.map(template => (
          <TemplateCard
            key={template.id}
            id={template.id}
            title={template.title}
            category={template.category}
            description={template.description}
            badge={template.badge}
            accentColor={template.accentColor}
            isSelected={selectedTemplate === template.id}
            onClick={() => handleSelectTemplate(template)}
          />
        ))}
          </div>
        ) : (
          <p className="templates-empty-state" role="status">Aucun modèle ne correspond à cette catégorie.</p>
        )}
      </section>
    </section>
  )
}
