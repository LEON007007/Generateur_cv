import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ChevronDown, 
  ChevronUp, 
  User, 
  Briefcase, 
  GraduationCap, 
  PenTool, 
  Sparkles, 
  Eye, 
  Edit3, 
  Plus, 
  Trash2, 
  Globe, 
  X,
  Palette,
  Camera
} from 'lucide-react'
import { useCVStore } from '../store'
import CVPreview from '../components/CVPreview'
import AIAssistantModal from '../components/AIAssistantModal'
import GeminiApiKeyModal from '../components/GeminiApiKeyModal'
import RichTextEditor from '../components/RichTextEditor'

const Accordion = ({ title, icon: Icon, badgeCount, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  return (
    <div className="card" style={{ marginBottom: '14px', overflow: 'hidden' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between"
        style={{ width: '100%', padding: '14px 18px', backgroundColor: 'var(--color-surface)', textAlign: 'left' }}
      >
        <div className="flex items-center gap-3">
          <Icon size={18} color="var(--color-primary)" />
          <span style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-primary)' }}>{title}</span>
          {badgeCount !== undefined && badgeCount > 0 && (
            <span style={{ 
              backgroundColor: 'var(--color-background)', 
              color: 'var(--color-text-muted)', 
              fontSize: '12px', 
              fontWeight: '600', 
              padding: '2px 8px', 
              borderRadius: 'var(--radius-full)' 
            }}>
              {badgeCount}
            </span>
          )}
        </div>
        {isOpen ? <ChevronUp size={18} color="var(--color-text-muted)" /> : <ChevronDown size={18} color="var(--color-text-muted)" />}
      </button>
      {isOpen && (
        <div style={{ padding: '0 18px 18px 18px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
          {children}
        </div>
      )}
    </div>
  )
}

export default function Editor() {
  const navigate = useNavigate()
  const { 
    personalInfo, 
    updatePersonalInfo, 
    experiences, 
    addExperience, 
    updateExperience, 
    removeExperience,
    education,
    addEducation,
    updateEducation,
    removeEducation,
    skills,
    addSkill,
    removeSkill,
    languages,
    addLanguage,
    updateLanguage,
    removeLanguage,
    selectedTemplate, 
    setSelectedTemplate,
    accentColor,
    setAccentColor,
    fontFamily,
    setFontFamily,
    spacing,
    setSpacing,
    guestUser
  } = useCVStore()

  // Dynamic document name based on entered names or login name (no hardcoded fallback)
  const getDocumentDisplayName = () => {
    const names = [personalInfo.lastName, personalInfo.firstName].filter(Boolean).map(s => s.trim())
    if (names.length > 0) {
      return `CV_${names.join('_')}`
    }
    if (guestUser?.name?.trim()) {
      return `CV_${guestUser.name.trim().replace(/\s+/g, '_')}`
    }
    const localName = typeof window !== 'undefined' ? localStorage.getItem('douzcv_guest_name') : ''
    if (localName?.trim()) {
      return `CV_${localName.trim().replace(/\s+/g, '_')}`
    }
    return 'CV_MonCV'
  }

  const [mobileTab, setMobileTab] = useState('edit') // 'edit' | 'preview'
  const [newSkillInput, setNewSkillInput] = useState('')
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [aiModalOpen, setAiModalOpen] = useState(false)
  const [aiTargetSection, setAiTargetSection] = useState('summary') // 'summary' | 'experience' | 'skills'
  const [aiTargetExpId, setAiTargetExpId] = useState(null)
  const [aiInitialPrompt, setAiInitialPrompt] = useState('')
  const [aiCurrentText, setAiCurrentText] = useState('')
  const [aiUserRole, setAiUserRole] = useState('')
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false)

  const colorPalette = [
    { name: 'Bleu Nuit', value: '#1B3041' },
    { name: 'Corail Douz', value: '#FF6154' },
    { name: 'Émeraude', value: '#0F766E' },
    { name: 'Indigo Royal', value: '#4338CA' },
    { name: 'Bordeaux', value: '#881337' },
    { name: 'Charbon', value: '#1F2937' }
  ]

  // Ensure selectedTemplate has a default if directly visited
  useEffect(() => {
    if (!selectedTemplate) {
      setSelectedTemplate("L'Exécutif")
    }
  }, [selectedTemplate, setSelectedTemplate])

  const handlePersonalChange = (e) => {
    const { name, value } = e.target
    updatePersonalInfo(name, value)
  }

  // Helper to convert plain text / markdown from AI output into clean HTML for RichTextEditor
  const formatPlainTextToHtml = (text) => {
    if (!text) return ''
    if (text.includes('<p>') || text.includes('<ul>')) return text // already HTML
    
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
    const hasBullets = lines.some(l => l.startsWith('•') || l.startsWith('-') || l.startsWith('*'))
    
    if (hasBullets) {
      const listItems = lines.map(line => {
        const clean = line.replace(/^[•\-\*]\s*/, '').trim()
        return `<li>${clean}</li>`
      }).join('')
      return `<ul>${listItems}</ul>`
    }
    
    return lines.map(l => `<p>${l}</p>`).join('')
  }

  // Dynamic AI Modal Handlers with integrated Gemini AI
  const openAiModalForSection = (section, id = null) => {
    setAiTargetSection(section)
    setAiTargetExpId(id)
    setAiUserRole(personalInfo.title || 'Professionnel')

    if (section === 'summary') {
      setAiCurrentText(personalInfo.summary || '')
      setAiInitialPrompt(personalInfo.summary
        ? `Perfectionne et sublime ce résumé professionnel pour un profil de ${personalInfo.title || 'Professionnel'} :\n"${personalInfo.summary.replace(/<[^>]*>/g, '')}"`
        : `Rédige un résumé professionnel percutant et captivant de 3-4 lignes pour un ${personalInfo.title || 'Consultant Senior'}`)
    } else if (section === 'experience' && id) {
      const exp = experiences.find(e => e.id === id)
      setAiCurrentText(exp?.description || '')
      setAiInitialPrompt(exp?.description
        ? `Transforme et sublime ces missions en 3-4 puces de réalisations majeures et chiffrées avec verbes d'action pour le poste de ${exp.title || 'Collaborateur'} chez ${exp.company || 'l\'entreprise'} :\n"${exp.description.replace(/<[^>]*>/g, '')}"`
        : `Rédige 4 réalisations majeures et chiffrées avec verbes d'action pour le poste de ${exp?.title || 'Collaborateur'} chez ${exp?.company || 'l\'entreprise'}`)
    } else if (section === 'education' && id) {
      const edu = education.find(e => e.id === id)
      setAiCurrentText(edu?.description || '')
      setAiInitialPrompt(edu?.description
        ? `Améliore cette description de formation pour ${edu.degree || 'mon diplôme'} chez ${edu.school || 'mon établissement'} :\n"${edu.description.replace(/<[^>]*>/g, '')}"`
        : `Rédige une description concise et valorisante des compétences et projets majeurs acquis lors de la formation ${edu?.degree || 'Diplôme'} chez ${edu?.school || 'Établissement'}`)
    } else if (section === 'skills') {
      setAiCurrentText(skills.join(', '))
      setAiInitialPrompt(`Génère une sélection des 6 à 8 compétences techniques et stratégiques incontournables pour un ${personalInfo.title || 'Professionnel'}.`)
    }

    setAiModalOpen(true)
  }

  const handleAddSkill = (e) => {
    e?.preventDefault()
    if (newSkillInput.trim()) {
      addSkill(newSkillInput.trim())
      setNewSkillInput('')
    }
  }

  const handleApplyAIText = (generatedText) => {
    const formattedHtml = formatPlainTextToHtml(generatedText)
    if (aiTargetSection === 'summary') {
      updatePersonalInfo('summary', formattedHtml)
    } else if (aiTargetSection === 'experience' && aiTargetExpId) {
      updateExperience(aiTargetExpId, 'description', formattedHtml)
    } else if (aiTargetSection === 'education' && aiTargetExpId) {
      updateEducation(aiTargetExpId, 'description', formattedHtml)
    } else if (aiTargetSection === 'skills') {
      const items = generatedText
        .split(/[\n,•]/)
        .map(s => s.replace(/^\d+[\.\)]\s*/, '').trim())
        .filter(s => s.length > 1 && s.length < 40)
      items.forEach(skill => addSkill(skill))
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Sub Header & Customization Bar */}
      <div className="editor-subheader">
        <div className="editor-subheader-doc">
          Document : <strong style={{ color: 'var(--color-primary)' }}>{getDocumentDisplayName()}</strong>
        </div>

        {/* Customization Toolbar */}
        <div className="editor-subheader-actions">
          {/* Color Palette Dots */}
          <div className="color-palette-dots flex items-center gap-1.5" title="Couleur d'accent du CV">
            {colorPalette.map((c) => (
              <button
                key={c.value}
                type="button"
                className="color-dot-btn"
                onClick={() => setAccentColor(c.value)}
                style={{
                  backgroundColor: c.value,
                  border: accentColor === c.value ? '2.5px solid #FFFFFF' : '1px solid rgba(0,0,0,0.12)',
                  boxShadow: accentColor === c.value ? `0 0 0 2px ${c.value}` : 'none'
                }}
                title={c.name}
              />
            ))}
          </div>

          {/* Selects moved to Personnalisation Accordion */}

          <button 
            type="button"
            onClick={() => openAiModalForSection('summary')}
            className="btn-subheader-action flex items-center gap-1.5"
            style={{
              padding: '6px 12px',
              fontSize: '12.5px',
              fontWeight: '600',
              backgroundColor: 'rgba(255, 97, 84, 0.1)',
              color: 'var(--color-coral)',
              border: '1px solid rgba(255, 97, 84, 0.3)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer'
            }}
          >
            <Sparkles size={14} />
            <span>Assistant IA</span>
          </button>

          <button 
            onClick={() => navigate('/exporter')} 
            className="btn-subheader-action btn-primary" 
            style={{ padding: '6px 14px', fontSize: '13px' }}
          >
            Exporter
          </button>
        </div>
      </div>

      {/* Mobile Tab Toggle */}
      <div className="mobile-view-tabs">
        <button 
          onClick={() => setMobileTab('edit')} 
          className={`mobile-tab-btn ${mobileTab === 'edit' ? 'active' : ''}`}
        >
          <Edit3 size={15} />
          Formulaire
        </button>
        <button 
          onClick={() => setMobileTab('preview')} 
          className={`mobile-tab-btn ${mobileTab === 'preview' ? 'active' : ''}`}
        >
          <Eye size={15} />
          Aperçu CV
        </button>
      </div>

      {/* Main Workspace */}
      <div className={`editor-workspace tab-${mobileTab}`}>
        {/* Left Panel: Full Form Editor */}
        <div className="editor-left-panel">
          <h1 style={{ fontSize: 'clamp(20px, 3vw, 26px)', marginBottom: '20px' }}>
            Édition du contenu
          </h1>
          
          {/* SECTION 0: Personnalisation */}
          <Accordion title="Personnalisation visuelle" icon={Palette} defaultOpen={false}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div>
                <label className="label">Modèle de CV</label>
                <div style={{ position: 'relative' }}>
                  <select 
                    value={selectedTemplate || "L'Exécutif"} 
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="input-field"
                    style={{ appearance: 'none', paddingRight: '32px', cursor: 'pointer', fontWeight: '600' }}
                  >
                    <optgroup label="ATS & Classique">
                      <option value="L'Exécutif">1. L'Exécutif Standard</option>
                      <option value="Le Minimaliste (ATS)">2. Le Minimaliste Pur</option>
                      <option value="L'Académique & Recherche">3. L'Académique</option>
                    </optgroup>
                    <optgroup label="Tech & Moderne">
                      <option value="Le Tech Lead">4. Le Tech Lead</option>
                      <option value="Le Silicon Valley">5. Le Silicon Valley</option>
                      <option value="L'Ingénieur & Industriel">6. L'Ingénieur</option>
                    </optgroup>
                    <optgroup label="Créatif & Design">
                      <option value="Le Créatif">7. Le Créatif Studio</option>
                      <option value="L'Élégant Prestige">8. L'Élégant Prestige</option>
                      <option value="Le Portfolio Visuel">9. Le Portfolio Visuel</option>
                    </optgroup>
                    <optgroup label="Compact & Spécialisé">
                      <option value="Le Condensé 1-Page">10. Le Condensé 1-Page</option>
                      <option value="L'International / Expat">11. L'International</option>
                      <option value="Le Polyvalent Pro-Afrique">12. Pro-Afrique</option>
                    </optgroup>
                  </select>
                  <ChevronDown size={16} color="var(--color-text-muted)" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
              </div>

              <div>
                <label className="label">Typographie</label>
                <div style={{ position: 'relative' }}>
                  <select 
                    value={fontFamily} 
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="input-field"
                    style={{ appearance: 'none', paddingRight: '32px', cursor: 'pointer' }}
                  >
                    <option value="Inter">Inter (Moderne)</option>
                    <option value="Plus Jakarta Sans">Plus Jakarta (Tech)</option>
                    <option value="DM Sans">DM Sans (Géométrique)</option>
                    <option value="Playfair Display">Playfair (Élégant)</option>
                    <option value="Merriweather">Merriweather (Sérif)</option>
                  </select>
                  <ChevronDown size={16} color="var(--color-text-muted)" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
              </div>

              <div>
                <label className="label">Densité (Espacement)</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  <button 
                    onClick={() => setSpacing('compact')}
                    style={{
                      padding: '8px',
                      borderRadius: 'var(--radius-sm)',
                      border: spacing === 'compact' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      backgroundColor: spacing === 'compact' ? 'rgba(27, 48, 65, 0.05)' : 'var(--color-surface)',
                      color: spacing === 'compact' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                      fontSize: '12px',
                      fontWeight: '600',
                      transition: 'all var(--duration-fast) var(--ease-premium)'
                    }}
                  >
                    Compact
                  </button>
                  <button 
                    onClick={() => setSpacing('normal')}
                    style={{
                      padding: '8px',
                      borderRadius: 'var(--radius-sm)',
                      border: spacing === 'normal' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      backgroundColor: spacing === 'normal' ? 'rgba(27, 48, 65, 0.05)' : 'var(--color-surface)',
                      color: spacing === 'normal' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                      fontSize: '12px',
                      fontWeight: '600',
                      transition: 'all var(--duration-fast) var(--ease-premium)'
                    }}
                  >
                    Standard
                  </button>
                  <button 
                    onClick={() => setSpacing('spacious')}
                    style={{
                      padding: '8px',
                      borderRadius: 'var(--radius-sm)',
                      border: spacing === 'spacious' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      backgroundColor: spacing === 'spacious' ? 'rgba(27, 48, 65, 0.05)' : 'var(--color-surface)',
                      color: spacing === 'spacious' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                      fontSize: '12px',
                      fontWeight: '600',
                      transition: 'all var(--duration-fast) var(--ease-premium)'
                    }}
                  >
                    Spacieux
                  </button>
                </div>
              </div>
              
            </div>
          </Accordion>

          {/* SECTION 1: Personal Information */}
          <Accordion title="Informations personnelles" icon={User} defaultOpen={true}>
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div 
                style={{ 
                  width: '70px', 
                  height: '70px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--color-surface)', 
                  border: '1px dashed var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}
              >
                {personalInfo.avatar ? (
                  <img src={personalInfo.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Camera size={24} color="var(--color-text-muted)" />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <label className="label">Photo de profil (Optionnelle)</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <label className="btn-outline-dashed" style={{ padding: '6px 12px', cursor: 'pointer', fontSize: '12px', flex: 1, display: 'block', textAlign: 'center', margin: 0 }}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            updatePersonalInfo('avatar', reader.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    Ajouter / Modifier
                  </label>
                  {personalInfo.avatar && (
                    <button 
                      type="button"
                      className="btn-delete"
                      onClick={() => updatePersonalInfo('avatar', '')}
                      style={{ padding: '6px 12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'transparent' }}
                      title="Supprimer la photo"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '12px' }}>
              <div>
                <label className="label">Prénom</label>
                <input 
                  type="text" 
                  name="firstName" 
                  value={personalInfo.firstName} 
                  onChange={handlePersonalChange} 
                  className="input-field" 
                  placeholder="ex: Leon" 
                />
              </div>
              <div>
                <label className="label">Nom</label>
                <input 
                  type="text" 
                  name="lastName" 
                  value={personalInfo.lastName} 
                  onChange={handlePersonalChange} 
                  className="input-field" 
                  placeholder="ex: Atangana" 
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '12px' }}>
              <label className="label">Titre professionnel</label>
              <input 
                type="text" 
                name="title" 
                value={personalInfo.title} 
                onChange={handlePersonalChange} 
                className="input-field" 
                placeholder="ex: Consultant Senior en Stratégie" 
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '12px' }}>
              <div>
                <label className="label">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={personalInfo.email} 
                  onChange={handlePersonalChange} 
                  className="input-field" 
                  placeholder="leon.atangana@email.com" 
                />
              </div>
              <div>
                <label className="label">Téléphone</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={personalInfo.phone} 
                  onChange={handlePersonalChange} 
                  className="input-field" 
                  placeholder="+33 6 12 34 56 78" 
                />
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label className="label">Localisation / Ville</label>
              <input 
                type="text" 
                name="location" 
                value={personalInfo.location} 
                onChange={handlePersonalChange} 
                className="input-field" 
                placeholder="ex: Paris, France" 
              />
            </div>

            <div>
              <div className="flex justify-between items-center" style={{ marginBottom: '6px' }}>
                <label className="label" style={{ marginBottom: 0 }}>Résumé professionnel</label>
              </div>
              <div style={{ marginTop: '8px' }}>
                <RichTextEditor 
                  value={personalInfo.summary} 
                  onChange={(html) => updatePersonalInfo('summary', html)} 
                  placeholder="Présentez brièvement vos compétences clés et votre parcours..."
                />
                <button 
                  type="button" 
                  onClick={() => openAiModalForSection('summary')} 
                  className="btn-ai-assist-box flex items-center gap-2"
                  style={{
                    marginTop: '10px',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 97, 84, 0.08)',
                    color: 'var(--color-coral)',
                    border: '1px solid rgba(255, 97, 84, 0.3)',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(255, 97, 84, 0.08)'
                  }}
                >
                  <Sparkles size={14} color="var(--color-coral)" />
                  <span>Rédiger & Optimiser avec l'IA Gemini</span>
                </button>
              </div>
            </div>
          </Accordion>

          {/* SECTION 2: Professional Experiences */}
          <Accordion title="Expériences professionnelles" icon={Briefcase} badgeCount={experiences.length} defaultOpen={false}>
            {experiences.map((exp, index) => (
              <div key={exp.id} className="form-item-box">
                <div className="flex justify-between items-center" style={{ marginBottom: '10px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-primary)' }}>
                    Expérience #{index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <button 
                      type="button" 
                      onClick={() => removeExperience(exp.id)} 
                      className="btn-delete"
                      title="Supprimer cette expérience"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label className="label">Poste occupé</label>
                    <input 
                      type="text" 
                      value={exp.title} 
                      onChange={(e) => updateExperience(exp.id, 'title', e.target.value)} 
                      className="input-field" 
                      placeholder="ex: Consultant Senior" 
                    />
                  </div>
                  <div>
                    <label className="label">Entreprise</label>
                    <input 
                      type="text" 
                      value={exp.company} 
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} 
                      className="input-field" 
                      placeholder="ex: Cabinet de Conseil" 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label className="label">Début</label>
                    <input 
                      type="text" 
                      value={exp.startDate} 
                      onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} 
                      className="input-field" 
                      placeholder="ex: 2019" 
                    />
                  </div>
                  <div>
                    <label className="label">Fin</label>
                    <input 
                      type="text" 
                      value={exp.endDate} 
                      onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} 
                      className="input-field" 
                      placeholder="ex: Présent" 
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center" style={{ marginBottom: '6px' }}>
                    <label className="label" style={{ marginBottom: 0 }}>Missions & Réalisations</label>
                  </div>
                  <div style={{ marginTop: '4px' }}>
                    <RichTextEditor 
                      value={exp.description} 
                      onChange={(html) => updateExperience(exp.id, 'description', html)} 
                      placeholder="Détaillez vos réalisations principales (utilisez les puces)..."
                    />
                    <button 
                      type="button" 
                      onClick={() => openAiModalForSection('experience', exp.id)} 
                      className="btn-ai-assist-box flex items-center gap-2"
                      style={{
                        marginTop: '10px',
                        padding: '8px 14px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(255, 97, 84, 0.08)',
                        color: 'var(--color-coral)',
                        border: '1px solid rgba(255, 97, 84, 0.3)',
                        fontSize: '12.5px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 8px rgba(255, 97, 84, 0.08)'
                      }}
                    >
                      <Sparkles size={14} color="var(--color-coral)" />
                      <span>Générer des réalisations percutantes avec l'IA</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button 
              type="button" 
              onClick={addExperience} 
              className="btn-secondary"
              style={{ width: '100%' }}
            >
              <Plus size={16} />
              Ajouter une expérience
            </button>
          </Accordion>

          {/* SECTION 3: Education / Formation */}
          <Accordion title="Formation" icon={GraduationCap} badgeCount={education.length} defaultOpen={false}>
            {education.map((edu, index) => (
              <div key={edu.id} className="form-item-box">
                <div className="flex justify-between items-center" style={{ marginBottom: '10px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-primary)' }}>
                    Formation #{index + 1}
                  </span>
                  <button 
                    type="button" 
                    onClick={() => removeEducation(edu.id)} 
                    className="btn-delete"
                    title="Supprimer cette formation"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <label className="label">Diplôme / Intitulé</label>
                  <input 
                    type="text" 
                    value={edu.degree} 
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} 
                    className="input-field" 
                    placeholder="ex: Master en Management" 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                  <div>
                    <label className="label">École / Université</label>
                    <input 
                      type="text" 
                      value={edu.school} 
                      onChange={(e) => updateEducation(edu.id, 'school', e.target.value)} 
                      className="input-field" 
                      placeholder="ex: Grande École de Commerce" 
                    />
                  </div>
                  <div>
                    <label className="label">Période</label>
                    <input 
                      type="text" 
                      value={`${edu.startDate} - ${edu.endDate}`} 
                      onChange={(e) => {
                        const parts = e.target.value.split('-')
                        updateEducation(edu.id, 'startDate', parts[0]?.trim() || '')
                        updateEducation(edu.id, 'endDate', parts[1]?.trim() || '')
                      }} 
                      className="input-field" 
                      placeholder="ex: 2013 - 2015" 
                    />
                  </div>
                </div>

                <div style={{ marginTop: '10px' }}>
                  <div className="flex justify-between items-center" style={{ marginBottom: '6px' }}>
                    <label className="label" style={{ marginBottom: 0 }}>Description (Optionnel)</label>
                  </div>
                  <div style={{ marginTop: '4px' }}>
                    <RichTextEditor 
                      value={edu.description || ''} 
                      onChange={(html) => updateEducation(edu.id, 'description', html)} 
                      placeholder="Ajoutez une description de votre formation..."
                    />
                    <button 
                      type="button" 
                      onClick={() => openAiModalForSection('education', edu.id)} 
                      className="btn-ai-assist-box flex items-center gap-2"
                      style={{
                        marginTop: '10px',
                        padding: '8px 14px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(255, 97, 84, 0.08)',
                        color: 'var(--color-coral)',
                        border: '1px solid rgba(255, 97, 84, 0.3)',
                        fontSize: '12.5px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 8px rgba(255, 97, 84, 0.08)'
                      }}
                    >
                      <Sparkles size={14} color="var(--color-coral)" />
                      <span>Enrichir la description avec l'IA Gemini</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button 
              type="button" 
              onClick={addEducation} 
              className="btn-secondary"
              style={{ width: '100%' }}
            >
              <Plus size={16} />
              Ajouter une formation
            </button>
          </Accordion>

          {/* SECTION 4: Compétences (Skills) */}
          <Accordion title="Compétences" icon={PenTool} badgeCount={skills.length} defaultOpen={false}>
            <div className="flex justify-between items-center" style={{ marginBottom: '12px' }}>
              <label className="label" style={{ marginBottom: 0 }}>Ajouter une compétence</label>
              <button 
                type="button" 
                onClick={() => openAiModalForSection('skills')} 
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-coral)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Sparkles size={14} />
                <span>Suggérer avec l'IA</span>
              </button>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <form onSubmit={handleAddSkill} className="flex gap-2">
                <input 
                  type="text" 
                  value={newSkillInput} 
                  onChange={(e) => setNewSkillInput(e.target.value)} 
                  className="input-field" 
                  placeholder="ex: React.js, Négociation, Python..." 
                />
                <button type="submit" className="btn-primary" style={{ padding: '0 16px' }}>
                  <Plus size={16} />
                </button>
              </form>
            </div>

            <div className="flex flex-wrap gap-2" style={{ marginBottom: '8px' }}>
              {skills.map((skill) => (
                <span 
                  key={skill} 
                  style={{ 
                    backgroundColor: 'var(--color-surface)', 
                    border: '1px solid var(--color-border)', 
                    padding: '5px 10px', 
                    borderRadius: 'var(--radius-full)', 
                    fontSize: '13px',
                    color: 'var(--color-primary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {skill}
                  <button 
                    type="button" 
                    onClick={() => removeSkill(skill)}
                    style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}
                    title="Supprimer cette compétence"
                  >
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>
          </Accordion>

          {/* SECTION 5: Langues (Languages) */}
          <Accordion title="Langues" icon={Globe} badgeCount={languages.length} defaultOpen={false}>
            {languages.map((lang) => (
              <div key={lang.id} className="form-item-box" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '8px', alignItems: 'center' }}>
                <input 
                  type="text" 
                  value={lang.name} 
                  onChange={(e) => updateLanguage(lang.id, 'name', e.target.value)} 
                  className="input-field" 
                  placeholder="ex: Français" 
                />
                <input 
                  type="text" 
                  value={lang.level} 
                  onChange={(e) => updateLanguage(lang.id, 'level', e.target.value)} 
                  className="input-field" 
                  placeholder="ex: Courant (C1)" 
                />
                <button 
                  type="button" 
                  onClick={() => removeLanguage(lang.id)} 
                  className="btn-delete"
                  title="Supprimer cette langue"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}

            <button 
              type="button" 
              onClick={addLanguage} 
              className="btn-secondary"
              style={{ width: '100%' }}
            >
              <Plus size={16} />
              Ajouter une langue
            </button>
          </Accordion>
        </div>

        {/* Right Panel: Live CV Preview */}
        <div className="editor-right-panel">
          <CVPreview isActiveTab={mobileTab === 'preview'} />
        </div>
      </div>

      {/* Gemini AI Assistant Modal */}
      <AIAssistantModal 
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        initialPrompt={aiInitialPrompt}
        currentText={aiCurrentText}
        userRole={aiUserRole}
        sectionType={aiTargetSection}
        onApplyText={handleApplyAIText}
        title={
          aiTargetSection === 'summary' 
            ? 'Assistant IA : Résumé Professionnel' 
            : aiTargetSection === 'skills'
            ? 'Assistant IA : Compétences Clés'
            : 'Assistant IA : Rédaction d\'Expérience'
        }
      />

      {/* Standalone Gemini 3-Step Guide Modal */}
      <GeminiApiKeyModal 
        isOpen={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
      />
    </div>
  )
}
