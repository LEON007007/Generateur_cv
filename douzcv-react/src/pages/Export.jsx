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
import html2pdf from 'html2pdf.js'
import { saveAs } from 'file-saver'

export default function Export() {
  const { 
    personalInfo, 
    guestUser,
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

  // Helper for reliable browser downloads using FileSaver.js (fixes Chrome UUID blob bug)
  const triggerDownload = (blob, filename) => {
    saveAs(blob, filename)
  }

  // Dynamic document name based on entered names or login name (no hardcoded fallback)
  const getExportFilename = (ext) => {
    const names = [personalInfo.lastName, personalInfo.firstName].filter(Boolean).map(s => s.trim().replace(/[^a-zA-ZÀ-ÿ0-9_-]/g, '_'))
    let base = ''
    if (names.length > 0) {
      base = `CV_${names.join('_')}`
    } else if (guestUser?.name?.trim()) {
      base = `CV_${guestUser.name.trim().replace(/[^a-zA-ZÀ-ÿ0-9_-]/g, '_')}`
    } else {
      const localName = typeof window !== 'undefined' ? localStorage.getItem('douzcv_guest_name') : ''
      if (localName?.trim()) {
        base = `CV_${localName.trim().replace(/[^a-zA-ZÀ-ÿ0-9_-]/g, '_')}`
      } else {
        base = 'CV_MonCV'
      }
    }
    return `${base}.${ext}`
  }

  // 1. Direct PDF Download — Universal A4 Rendering (screen-independent)
  const handleExportPDF = async () => {
    setIsExporting(true)

    const filename = getExportFilename('pdf')
    
    const sourceElement = document.querySelector('.cv-preview-container')
    
    if (!sourceElement) {
      setIsExporting(false)
      return
    }

    // Wait for all web fonts to be fully loaded
    try { await document.fonts.ready } catch (e) { /* fallback */ }

    // === UNIVERSAL RENDERING TECHNIQUE ===
    // Create a full-size off-screen clone mounted directly in document.body
    // This bypasses any parent constraints, scaling transforms, or viewport-dependent styles
    const offScreenContainer = document.createElement('div')
    offScreenContainer.style.cssText = `
      position: fixed;
      left: -9999px;
      top: 0;
      width: 794px;
      height: auto;
      overflow: visible;
      z-index: -1;
      background: white;
    `
    
    // Deep clone the CV preview
    const clone = sourceElement.cloneNode(true)
    
    // Force universal A4 styles on the clone
    clone.style.cssText = `
      width: 794px !important;
      min-width: 794px !important;
      max-width: 794px !important;
      min-height: 1123px !important;
      padding: 40px !important;
      margin: 0 !important;
      transform: none !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      overflow: visible !important;
      position: relative !important;
      background: white !important;
      font-family: ${sourceElement.style.fontFamily || "'Inter', sans-serif"} !important;
    `
    
    // Remove UI elements that shouldn't appear in the PDF
    clone.querySelectorAll('.word-page-break-divider, .floating-zoom-controls').forEach(el => el.remove())
    
    offScreenContainer.appendChild(clone)
    document.body.appendChild(offScreenContainer)

    // Small delay to let the browser paint the off-screen clone with correct fonts
    await new Promise(r => setTimeout(r, 200))

    const opt = {
      margin: 0,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        width: 794,
        windowWidth: 794,
      },
      jsPDF: { unit: 'px', format: [794, 1123], orientation: 'portrait', hotfixes: ["px_scaling"] }
    }

    try {
      const pdf = await html2pdf().set(opt).from(clone).toPdf().get('pdf')
      const pdfBlob = pdf.output('blob')
      saveAs(pdfBlob, filename)

      setDownloadSuccess(true)
      setTimeout(() => setDownloadSuccess(false), 3500)
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error)
    } finally {
      // Clean up the off-screen clone
      document.body.removeChild(offScreenContainer)
      setIsExporting(false)
    }
  }

  // 2. Native Microsoft Word (.docx) Export using OpenXML Packer
  const handleExportWordDocx = async () => {
    setIsExporting(true)
    const filename = getExportFilename('docx')

    try {
      const blob = await generateNativeDocx({
        personalInfo,
        experiences,
        education,
        skills,
        languages,
        accentColor,
        selectedTemplate
      })

      triggerDownload(blob, filename)

      setDownloadSuccess(true)
      setTimeout(() => setDownloadSuccess(false), 3500)
    } catch (err) {
      console.error('Word export error:', err)
      handleFallbackWordDoc(filename)
    } finally {
      setIsExporting(false)
    }
  }

  // Fallback Word format (.doc)
  const handleFallbackWordDoc = (customFilename) => {
    const filename = customFilename || getExportFilename('doc')
    const displayName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ').trim() || guestUser?.name || 'Mon CV'
    
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>CV - ${displayName}</title>
        <style>
          body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; color: #1E293B; line-height: 1.4; }
          h1 { font-size: 22pt; color: ${accentColor || '#1B3041'}; text-transform: uppercase; margin-bottom: 2pt; }
          .subtitle { font-size: 12pt; color: #64748B; font-weight: bold; margin-bottom: 8pt; }
          .section { font-size: 12pt; font-weight: bold; color: ${accentColor || '#1B3041'}; border-bottom: 1pt solid #CBD5E1; margin-top: 14pt; margin-bottom: 6pt; }
        </style>
      </head>
      <body>
        <h1>${displayName}</h1>
        <div class="subtitle">${personalInfo.title || ''}</div>
        <p>${[personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join(' | ')}</p>
        ${personalInfo.summary ? `<div class="section">PROFIL</div><p>${personalInfo.summary}</p>` : ''}
        ${experiences?.length ? `<div class="section">EXPÉRIENCES</div>${experiences.map(e => `<p><strong>${e.title}</strong> - ${e.company} (${e.startDate}-${e.endDate})<br>${e.description}</p>`).join('')}` : ''}
        ${education?.length ? `<div class="section">FORMATION</div>${education.map(ed => `<p><strong>${ed.degree}</strong> - ${ed.school} (${ed.startDate}-${ed.endDate})</p>`).join('')}` : ''}
      </body>
      </html>
    `
    const blob = new Blob(['\ufeff', content], { type: 'application/msword;charset=utf-8' })
    saveAs(blob, filename)
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

    const jsonBlob = new Blob([JSON.stringify(resumeData, null, 2)], { type: 'application/json;charset=utf-8' })
    saveAs(jsonBlob, getExportFilename('json'))

    setDownloadSuccess(true)
    setTimeout(() => setDownloadSuccess(false), 3500)
  }

  // 4. Plain Text / ATS Export
  const handleExportText = () => {
    const displayName = [personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ').trim() || guestUser?.name || 'Mon CV'
    let content = `=====================================================\n`
    content += `${displayName}\n`
    if (personalInfo.title) content += `${personalInfo.title}\n`
    content += `${[personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join(' | ')}\n`
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
    saveAs(blob, getExportFilename('txt'))

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
                  <strong style={{ color: 'var(--color-primary)' }}>Téléchargement PDF Direct :</strong><br />
                  Le fichier PDF généré sera téléchargé directement sur votre appareil, prêt à être envoyé aux recruteurs.
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
                <span>Génération en cours...</span>
              </>
            ) : selectedFormat === 'PDF' ? (
              <>
                <Download size={18} />
                <span>Télécharger le PDF (A4)</span>
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
              <span>Votre fichier a bien été téléchargé avec succès</span>
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
