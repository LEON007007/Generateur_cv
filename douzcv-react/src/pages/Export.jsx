import React, { useState, useRef } from 'react'
import { 
  Download, 
  FileText, 
  CheckSquare, 
  ArrowLeft, 
  Printer, 
  FileCode, 
  Upload, 
  CheckCircle2, 
  Info, 
  Save, 
  Sparkles,
  FileCheck,
  Check
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCVStore } from '../store'
import CVPreview from '../components/CVPreview'
import { generateNativeDocx } from '../services/docxExportService'

export default function Export() {
  const { 
    personalInfo, 
    experiences, 
    education, 
    skills, 
    languages, 
    selectedTemplate, 
    accentColor, 
    fontFamily,
    updatePersonalInfo 
  } = useCVStore()

  const [selectedFormat, setSelectedFormat] = useState('PDF')
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [importStatus, setImportStatus] = useState('')
  const fileInputRef = useRef(null)

  // 1. Vector-crisp Print / PDF Export
  const handleExportPDF = () => {
    const originalTitle = document.title
    const filename = `CV_${personalInfo.lastName || 'Atangana'}_${personalInfo.firstName || 'Leon'}`
    document.title = filename

    window.print()

    document.title = originalTitle
    setDownloadSuccess(true)
    setTimeout(() => setDownloadSuccess(false), 3500)
  }

  // 2. Native Microsoft Word (.docx) Export using OpenXML Packer
  const handleExportWordDocx = async () => {
    setIsExporting(true)
    try {
      const filename = `CV_${personalInfo.lastName || 'Atangana'}_${personalInfo.firstName || 'Leon'}.docx`
      
      const blob = await generateNativeDocx({
        personalInfo,
        experiences,
        education,
        skills,
        languages,
        accentColor,
        selectedTemplate
      })

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setDownloadSuccess(true)
      setTimeout(() => setDownloadSuccess(false), 3500)
    } catch (err) {
      console.error('Word export error:', err)
      handleFallbackWordDoc()
    } finally {
      setIsExporting(false)
    }
  }

  // Fallback Word format
  const handleFallbackWordDoc = () => {
    const filename = `CV_${personalInfo.lastName || 'Atangana'}_${personalInfo.firstName || 'Leon'}.doc`
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>CV - ${personalInfo.firstName} ${personalInfo.lastName}</title>
        <style>
          body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; color: #1E293B; line-height: 1.4; }
          h1 { font-size: 22pt; color: ${accentColor || '#1B3041'}; text-transform: uppercase; margin-bottom: 2pt; }
          .subtitle { font-size: 12pt; color: #64748B; font-weight: bold; margin-bottom: 8pt; }
          .section { font-size: 12pt; font-weight: bold; color: ${accentColor || '#1B3041'}; border-bottom: 1pt solid #CBD5E1; margin-top: 14pt; margin-bottom: 6pt; }
        </style>
      </head>
      <body>
        <h1>${personalInfo.firstName || 'Leon'} ${personalInfo.lastName || 'Atangana'}</h1>
        <div class="subtitle">${personalInfo.title || 'Consultant en Stratégie'}</div>
        <p>${[personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join(' | ')}</p>
        ${personalInfo.summary ? `<div class="section">PROFIL</div><p>${personalInfo.summary}</p>` : ''}
        ${experiences?.length ? `<div class="section">EXPÉRIENCES</div>${experiences.map(e => `<p><strong>${e.title}</strong> - ${e.company} (${e.startDate}-${e.endDate})<br>${e.description}</p>`).join('')}` : ''}
        ${education?.length ? `<div class="section">FORMATION</div>${education.map(ed => `<p><strong>${ed.degree}</strong> - ${ed.school} (${ed.startDate}-${ed.endDate})</p>`).join('')}` : ''}
      </body>
      </html>
    `
    const blob = new Blob(['\ufeff', content], { type: 'application/msword;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    setDownloadSuccess(true)
    setTimeout(() => setDownloadSuccess(false), 3500)
  }

  // 3. JSON Resume Export
  const handleExportJSON = () => {
    const resumeData = {
      meta: {
        version: "1.0.0",
        template: selectedTemplate,
        accentColor,
        fontFamily,
        exportedAt: new Date().toISOString()
      },
      personalInfo,
      experiences,
      education,
      skills,
      languages
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resumeData, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute("href", dataStr)
    downloadAnchor.setAttribute("download", `CV_${personalInfo.lastName || 'Atangana'}_backup.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()

    setDownloadSuccess(true)
    setTimeout(() => setDownloadSuccess(false), 3500)
  }

  // 4. Plain Text / ATS Export
  const handleExportText = () => {
    let content = `=====================================================\n`
    content += `${personalInfo.firstName} ${personalInfo.lastName}\n`
    content += `${personalInfo.title}\n`
    content += `${personalInfo.email} | ${personalInfo.phone} | ${personalInfo.location}\n`
    content += `=====================================================\n\n`
    
    if (personalInfo.summary) {
      content += `RÉSUMÉ PROFESSIONNEL\n--------------------\n${personalInfo.summary}\n\n`
    }

    content += `EXPÉRIENCES PROFESSIONNELLES\n----------------------------\n`
    experiences.forEach(exp => {
      content += `• ${exp.title} - ${exp.company} (${exp.startDate} - ${exp.endDate})\n`
      content += `  ${exp.description}\n\n`
    })

    content += `FORMATION\n---------\n`
    education.forEach(edu => {
      content += `• ${edu.degree} - ${edu.school} (${edu.startDate} - ${edu.endDate})\n`
    })

    content += `\nCOMPÉTENCES\n-----------\n`
    content += skills.join(', ') + `\n\n`

    content += `LANGUES\n-------\n`
    languages.forEach(l => {
      content += `• ${l.name} (${l.level})\n`
    })

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `CV_${personalInfo.lastName || 'Atangana'}.txt`
    link.click()
    document.body.appendChild(link)
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setDownloadSuccess(true)
    setTimeout(() => setDownloadSuccess(false), 3500)
  }

  // Import JSON Resume
  const handleImportJSON = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result)
        if (json.personalInfo) {
          Object.keys(json.personalInfo).forEach(k => {
            updatePersonalInfo(k, json.personalInfo[k])
          })
          setImportStatus('CV importé avec succès !')
          setTimeout(() => setImportStatus(''), 3000)
        }
      } catch (err) {
        setImportStatus('Erreur: fichier JSON non valide.')
        setTimeout(() => setImportStatus(''), 4000)
      }
    }
    reader.readAsText(file)
  }

  const handleDownload = () => {
    if (selectedFormat === 'PDF') {
      handleExportPDF()
    } else if (selectedFormat === 'WORD') {
      handleExportWordDocx()
    } else if (selectedFormat === 'JSON') {
      handleExportJSON()
    } else {
      handleExportText()
    }
  }

  const formatOptions = [
    {
      id: 'PDF',
      title: 'PDF Haute Définition',
      ext: '.PDF',
      subtitle: 'Format Vectoriel A4 pour recruteurs',
      icon: Printer,
      iconBg: 'rgba(255, 97, 84, 0.12)',
      iconColor: 'var(--color-coral)',
      badge: 'Recommandé'
    },
    {
      id: 'WORD',
      title: 'Microsoft Word',
      ext: '.DOCX',
      subtitle: 'Document OpenXML natif modifiable',
      icon: FileText,
      iconBg: 'rgba(37, 99, 235, 0.12)',
      iconColor: '#2563EB',
      badge: 'Natif'
    },
    {
      id: 'JSON',
      title: 'Sauvegarde douzCv',
      ext: '.JSON',
      subtitle: 'Sauvegarde brute & réimportation',
      icon: FileCode,
      iconBg: 'rgba(5, 150, 105, 0.12)',
      iconColor: '#059669',
      badge: 'Backup'
    },
    {
      id: 'TXT',
      title: 'Texte Brut ATS',
      ext: '.TXT',
      subtitle: 'Copier-coller formulaires RH',
      icon: FileCheck,
      iconBg: 'rgba(100, 116, 139, 0.12)',
      iconColor: '#475569',
      badge: 'Robot ATS'
    }
  ]

  return (
    <div className="export-workspace">
      {/* Left Panel */}
      <div className="export-left-panel">
        <div style={{ marginBottom: '22px' }}>
          <Link to="/editeur" className="flex items-center gap-2" style={{ color: 'var(--color-text-muted)', fontSize: '13.5px', fontWeight: '600', marginBottom: '14px', textDecoration: 'none' }}>
            <ArrowLeft size={16} />
            <span>Retour à l'éditeur</span>
          </Link>
          <h1 style={{ fontSize: 'clamp(22px, 3.5vw, 28px)', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '6px' }}>
            Exporter & Imprimer
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', lineHeight: '1.45', margin: 0 }}>
            Sélectionnez votre format de téléchargement haute fidélité.
          </p>
        </div>

        <div className="card" style={{ padding: 'clamp(18px, 3vw, 26px)', borderRadius: '18px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-level-1)' }}>
          
          {/* Format selection header */}
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '13.5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
              Choisir le format d'export
            </h3>
            
            {/* 2x2 Sleek Format Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
              {formatOptions.map((opt) => {
                const isSelected = selectedFormat === opt.id
                const IconComponent = opt.icon

                return (
                  <button 
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedFormat(opt.id)}
                    style={{ 
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '14px 12px',
                      borderRadius: '14px',
                      backgroundColor: isSelected ? 'rgba(255, 97, 84, 0.04)' : 'var(--color-surface)',
                      border: isSelected ? '2px solid var(--color-coral)' : '1.5px solid var(--color-border)',
                      boxShadow: isSelected ? '0 6px 20px rgba(255, 97, 84, 0.16)' : 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Icon container */}
                    <div 
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: opt.iconBg,
                        color: opt.iconColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <IconComponent size={18} strokeWidth={2.4} />
                    </div>

                    {/* Texts */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="flex items-center justify-between gap-1" style={{ marginBottom: '2px' }}>
                        <strong style={{ fontSize: '13px', color: isSelected ? 'var(--color-primary)' : 'var(--color-text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {opt.title}
                        </strong>
                        <span 
                          style={{ 
                            fontSize: '9.5px', 
                            fontWeight: '800', 
                            padding: '2px 5px', 
                            borderRadius: '4px',
                            backgroundColor: isSelected ? 'var(--color-coral)' : '#F1F5F9',
                            color: isSelected ? '#FFFFFF' : '#64748B'
                          }}
                        >
                          {opt.ext}
                        </span>
                      </div>
                      <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: 0, lineHeight: '1.3' }}>
                        {opt.subtitle}
                      </p>
                    </div>

                    {/* Active Selected Check */}
                    {isSelected && (
                      <div 
                        style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--color-coral)',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Check size={9} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Format Info / Advice Box */}
          <div style={{ backgroundColor: 'var(--color-background)', padding: '14px 16px', borderRadius: '12px', marginBottom: '22px', border: '1px solid #E2E8F0', fontSize: '12.5px', lineHeight: '1.5' }}>
            {selectedFormat === 'PDF' && (
              <div className="flex items-start gap-2.5">
                <Info size={16} color="var(--color-coral)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--color-primary)' }}>Exportation PDF Vectorielle A4 :</strong><br />
                  Dans la fenêtre d'impression, choisissez <em>"Enregistrer au format PDF"</em> et activez <em>"Graphiques d'arrière-plan"</em> pour un rendu de studio.
                </div>
              </div>
            )}
            {selectedFormat === 'WORD' && (
              <div className="flex items-start gap-2.5">
                <FileText size={16} color="#2563EB" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#1E3A8A' }}>Fichier Microsoft Word (.docx) natif :</strong><br />
                  Document OpenXML 100% éditable généré avec tous vos textes, couleurs d'accent, puces et typographies (compatible Microsoft Word, Office 365, LibreOffice et Google Docs).
                </div>
              </div>
            )}
            {selectedFormat === 'JSON' && (
              <div className="flex items-start gap-2.5">
                <Save size={16} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#065F46' }}>Sauvegarde Complète JSON douzCv :</strong><br />
                  Fichier léger contenant l'intégralité de vos informations et choix de style, réutilisable pour recharger votre CV sur n'importe quel ordinateur en un clic.
                </div>
              </div>
            )}
            {selectedFormat === 'TXT' && (
              <div className="flex items-start gap-2.5">
                <FileCheck size={16} color="#475569" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#334155' }}>Format Texte Brut pour filtres ATS :</strong><br />
                  Texte structuré optimisé pour copier-coller vos compétences et missions dans les formulaires de candidature en ligne sans perte de données.
                </div>
              </div>
            )}
          </div>

          {/* Primary Download CTA Button */}
          <button 
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="btn-primary flex items-center justify-center gap-2.5" 
            style={{ 
              width: '100%', 
              padding: '14px 20px', 
              fontSize: '14.5px', 
              fontWeight: '700',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '16px',
              cursor: isExporting ? 'not-allowed' : 'pointer',
              opacity: isExporting ? 0.7 : 1,
              boxShadow: '0 8px 24px rgba(255, 97, 84, 0.28)'
            }}
          >
            {isExporting ? (
              <>
                <div style={{ width: '16px', height: '16px', border: '2px solid #FFF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }}></div>
                <span>Génération du document Word...</span>
              </>
            ) : selectedFormat === 'PDF' ? (
              <>
                <Printer size={18} />
                <span>Imprimer & Enregistrer en PDF (A4)</span>
              </>
            ) : selectedFormat === 'WORD' ? (
              <>
                <Download size={18} />
                <span>Télécharger le document Word (.docx)</span>
              </>
            ) : selectedFormat === 'JSON' ? (
              <>
                <Download size={18} />
                <span>Télécharger la sauvegarde (.json)</span>
              </>
            ) : (
              <>
                <Download size={18} />
                <span>Télécharger le fichier texte (.txt)</span>
              </>
            )}
          </button>

          {/* Success Download Toast */}
          {downloadSuccess && (
            <div 
              className="flex items-center justify-center gap-2" 
              style={{ 
                padding: '11px 14px', 
                backgroundColor: '#F0FDF4', 
                color: '#15803D', 
                border: '1px solid #86EFAC', 
                borderRadius: 'var(--radius-sm)', 
                fontSize: '13px', 
                fontWeight: '700',
                marginBottom: '16px',
                animation: 'fadeIn 0.2s ease-out'
              }}
            >
              <CheckCircle2 size={17} color="#16A34A" />
              <span>Votre fichier a été généré et téléchargé avec succès !</span>
            </div>
          )}

          {/* Secondary Action: Import existing JSON */}
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '20px', marginTop: '10px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '8px' }}>
              Importer un CV existant (JSON)
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '12px', lineHeight: '1.4' }}>
              Restaurez toutes vos informations instantanément à partir d'un fichier <code>.json</code> préalablement sauvegardé.
            </p>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImportJSON} 
              accept=".json" 
              style={{ display: 'none' }} 
            />
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="btn-outline flex items-center justify-center gap-2"
              style={{ width: '100%', padding: '10px 14px', fontSize: '13px', fontWeight: '600' }}
            >
              <Upload size={16} />
              <span>Charger un fichier .json</span>
            </button>
            {importStatus && (
              <p style={{ fontSize: '12px', fontWeight: '600', color: importStatus.includes('succès') ? '#059669' : '#DC2626', marginTop: '8px', textAlign: 'center' }}>
                {importStatus}
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Right Panel: Live CV Preview */}
      <div className="export-right-panel">
        <CVPreview isActiveTab={true} />
      </div>
    </div>
  )
}
