import React, { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Sparkles, Download, Loader2, CheckCircle2, AlertCircle, ChevronDown, Edit3, Eye } from 'lucide-react'
import { useCVStore } from '../store'
import CoverLetterPreview from '../components/CoverLetterPreview'
import SignaturePad from '../components/SignaturePad'
import InlineAIAssistant from '../components/InlineAIAssistant'
import {
  generateCoverLetterFromCv,
  COVER_LETTER_SYSTEM_INSTRUCTION,
  ensureLetterStructure,
  extractBodyFromAiResponse,
  formatLetterDateDisplay
} from '../services/coverLetterService'
import { exportPreviewToPdf } from '../services/pdfExportService'
import { COVER_LETTER_TEMPLATES, getCoverLetterTemplate } from '../data/coverLetterTemplates'

function getLetterFilename(personalInfo, guestUser) {
  const names = [personalInfo?.lastName, personalInfo?.firstName]
    .filter(Boolean)
    .map((s) => s.trim().replace(/[^a-zA-ZÀ-ÿ0-9_-]/g, '_'))
  if (names.length > 0) return `Lettre_${names.join('_')}.pdf`
  if (guestUser?.name?.trim()) {
    return `Lettre_${guestUser.name.trim().replace(/[^a-zA-ZÀ-ÿ0-9_-]/g, '_')}.pdf`
  }
  return 'Lettre_Motivation.pdf'
}

const defaultMeta = {
  letterTemplateId: '',
  jobTitle: '',
  companyName: '',
  jobReference: '',
  jobDescription: '',
  place: '',
  letterDate: '',
  recipientName: '',
  recipientAddress: '',
  subject: '',
  salutation: 'Madame, Monsieur,',
  body: '',
  closing: "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.",
  signatureName: ''
}

export default function CoverLetter() {
  const {
    personalInfo,
    guestUser,
    selectedTemplate,
    coverLetter,
    updateCoverLetter,
    mergeCoverLetter,
    setCoverLetterBody
  } = useCVStore()

  const meta = useMemo(() => ({ ...defaultMeta, ...coverLetter }), [coverLetter])
  const letterTemplateId = meta.letterTemplateId || selectedTemplate || "L'Exécutif"
  const activeTemplate = getCoverLetterTemplate(letterTemplateId)

  const [isGenerating, setIsGenerating] = React.useState(false)
  const [isExporting, setIsExporting] = React.useState(false)
  const [error, setError] = React.useState('')
  const [downloadSuccess, setDownloadSuccess] = React.useState(false)
  const [mobileTab, setMobileTab] = React.useState('edit')

  useEffect(() => {
    if (!coverLetter?.letterTemplateId && selectedTemplate) {
      updateCoverLetter('letterTemplateId', selectedTemplate)
    }
  }, [coverLetter?.letterTemplateId, selectedTemplate, updateCoverLetter])

  const structuredLetter = useMemo(
    () => ensureLetterStructure(meta, personalInfo),
    [meta, personalInfo]
  )

  const handlePreviewUpdate = (field, value) => {
    const patch = { [field]: value }

    if (field === 'jobTitle') {
      patch.subject = value.trim() ? `Candidature au poste de ${value.trim()}` : ''
    }
    mergeCoverLetter(patch)
  }

  const handleApplicationChange = (field, value) => {
    const patch = { [field]: value }
    if (field === 'jobTitle' && (!meta.subject || meta.subject.startsWith('Candidature au poste de '))) {
      patch.subject = value.trim() ? `Candidature au poste de ${value.trim()}` : ''
    }
    mergeCoverLetter(patch)
  }

  const handleGenerate = async () => {
    const job = meta.jobTitle?.trim() || structuredLetter.jobTitle?.trim()
    const company = meta.companyName?.trim() || structuredLetter.companyName?.trim()
    if (!job && !company) {
      setError('Renseignez le poste ou l\'entreprise directement sur la lettre (objet / destinataire).')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      const state = useCVStore.getState()
      const enrichedMeta = ensureLetterStructure(
        { ...state.coverLetter, letterTemplateId },
        state.personalInfo
      )
      mergeCoverLetter(enrichedMeta)
      const raw = await generateCoverLetterFromCv(state, enrichedMeta)
      const body = extractBodyFromAiResponse(raw)
      setCoverLetterBody(body.trim())
    } catch (err) {
      setError(err.message || 'Erreur lors de la génération.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleExportPdf = async () => {
    if (!structuredLetter.body?.trim()) {
      setError('Rédigez ou générez le corps de la lettre avant l\'export PDF.')
      return
    }

    setIsExporting(true)
    setError('')

    try {
      const el = document.querySelector('.cover-letter-preview-container')
      await exportPreviewToPdf(el, getLetterFilename(personalInfo, guestUser))
      setDownloadSuccess(true)
      setTimeout(() => setDownloadSuccess(false), 3500)
    } catch (err) {
      setError(err.message || 'Échec de l\'export PDF.')
    } finally {
      setIsExporting(false)
    }
  }

  const extraContext = [structuredLetter.companyName, structuredLetter.jobTitle].filter(Boolean).join(' — ')

  return (
    <div className={`editor-workspace cover-letter-workspace tab-${mobileTab}`}>
      <div className="mobile-view-tabs cover-letter-mobile-tabs">
        <button
          type="button"
          onClick={() => setMobileTab('edit')}
          className={`mobile-tab-btn ${mobileTab === 'edit' ? 'active' : ''}`}
        >
          <Edit3 size={16} />
          Modifier
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`mobile-tab-btn ${mobileTab === 'preview' ? 'active' : ''}`}
        >
          <Eye size={16} />
          Aperçu
        </button>
      </div>

      <aside className="editor-left-panel cover-letter-tools">
        <Link to="/editeur" className="cover-letter-back">
          <ArrowLeft size={16} />
          Éditeur CV
        </Link>

        <h1 className="cover-letter-page-title">Lettre de motivation</h1>
        <p className="cover-letter-page-sub">
          CV : <strong>{selectedTemplate}</strong><br />
          Vous pouvez aussi éditer directement la lettre sur la page de modification.
        </p>

        <section className="cover-letter-form-section" aria-labelledby="cover-letter-sender-title">
          <div className="cover-letter-section-heading">
            <span className="cover-letter-section-kicker">Étape 1</span>
            <h2 id="cover-letter-sender-title">Vos coordonnées</h2>
          </div>
          <div className="cover-letter-sender-summary">
            <strong>{[personalInfo.firstName, personalInfo.lastName].filter(Boolean).join(' ') || 'Votre nom'}</strong>
            <span>{personalInfo.title || 'Votre titre professionnel'}</span>
            <span>{[personalInfo.email, personalInfo.phone, personalInfo.location].filter(Boolean).join(' · ') || 'Coordonnées à compléter dans l’éditeur CV'}</span>
          </div>
          <Link to="/editeur" className="cover-letter-panel-link">Modifier dans l’éditeur CV</Link>
        </section>

        <section className="cover-letter-form-section" aria-labelledby="cover-letter-recipient-title">
          <div className="cover-letter-section-heading">
            <span className="cover-letter-section-kicker">Étape 2</span>
            <h2 id="cover-letter-recipient-title">Destinataire</h2>
          </div>

          <label className="cover-letter-field-label" htmlFor="cover-letter-recipient">Nom du destinataire</label>
          <input
            id="cover-letter-recipient"
            className="input-field cover-letter-panel-input"
            value={meta.recipientName}
            onChange={(e) => handleApplicationChange('recipientName', e.target.value)}
            placeholder="Madame, Monsieur,"
          />

          <label className="cover-letter-field-label" htmlFor="cover-letter-company">Entreprise</label>
          <input
            id="cover-letter-company"
            className="input-field cover-letter-panel-input"
            value={meta.companyName}
            onChange={(e) => handleApplicationChange('companyName', e.target.value)}
            placeholder="Nom de l'entreprise"
          />

          <label className="cover-letter-field-label" htmlFor="cover-letter-recipient-address">Adresse du destinataire</label>
          <textarea
            id="cover-letter-recipient-address"
            className="input-field cover-letter-panel-input cover-letter-panel-textarea cover-letter-panel-textarea-small"
            value={meta.recipientAddress}
            onChange={(e) => handleApplicationChange('recipientAddress', e.target.value)}
            placeholder="Adresse, ville (optionnel)"
            rows={2}
          />
        </section>

        <section className="cover-letter-form-section" aria-labelledby="cover-letter-heading-title">
          <div className="cover-letter-section-heading">
            <span className="cover-letter-section-kicker">Étape 3</span>
            <h2 id="cover-letter-heading-title">En-tête de la lettre</h2>
          </div>

          <label className="cover-letter-field-label" htmlFor="cover-letter-job-title">Poste visé</label>
          <input
            id="cover-letter-job-title"
            className="input-field cover-letter-panel-input"
            value={meta.jobTitle}
            onChange={(e) => handleApplicationChange('jobTitle', e.target.value)}
            placeholder="Intitulé du poste"
          />

          <label className="cover-letter-field-label" htmlFor="cover-letter-place">Ville</label>
          <input
            id="cover-letter-place"
            className="input-field cover-letter-panel-input"
            value={meta.place}
            onChange={(e) => handleApplicationChange('place', e.target.value)}
            placeholder="Ville"
          />

          <div className="cover-letter-panel-grid">
            <div>
              <label className="cover-letter-field-label" htmlFor="cover-letter-date">Date de la lettre</label>
              <input
                id="cover-letter-date"
                type="date"
                className="input-field cover-letter-panel-input"
                value={/^\d{4}-\d{2}-\d{2}$/.test(meta.letterDate) ? meta.letterDate : ''}
                onChange={(e) => handleApplicationChange('letterDate', e.target.value)}
              />
            </div>
            <div>
              <label className="cover-letter-field-label" htmlFor="cover-letter-salutation">Formule d’appel</label>
              <input
                id="cover-letter-salutation"
                className="input-field cover-letter-panel-input"
                value={meta.salutation}
                onChange={(e) => handleApplicationChange('salutation', e.target.value)}
                placeholder="Madame, Monsieur,"
              />
            </div>
          </div>

          <label className="cover-letter-field-label" htmlFor="cover-letter-subject">Objet</label>
          <input
            id="cover-letter-subject"
            className="input-field cover-letter-panel-input"
            value={meta.subject}
            onChange={(e) => handleApplicationChange('subject', e.target.value)}
            placeholder="Candidature au poste de..."
          />
          <label className="cover-letter-field-label" htmlFor="cover-letter-closing">Formule de politesse</label>
          <textarea
            id="cover-letter-closing"
            className="input-field cover-letter-panel-input cover-letter-panel-textarea cover-letter-panel-textarea-small"
            value={meta.closing}
            onChange={(e) => handleApplicationChange('closing', e.target.value)}
            rows={2}
          />
        </section>

        <section className="cover-letter-form-section" aria-labelledby="cover-letter-offer-title">
          <div className="cover-letter-section-heading">
            <span className="cover-letter-section-kicker">Étape 4</span>
            <h2 id="cover-letter-offer-title">Offre et contexte IA</h2>
          </div>

          <label className="cover-letter-field-label" htmlFor="cover-letter-description">Annonce ou missions clés</label>
          <textarea
            id="cover-letter-description"
            className="input-field cover-letter-panel-input cover-letter-panel-textarea"
            value={meta.jobDescription}
            onChange={(e) => handleApplicationChange('jobDescription', e.target.value)}
            placeholder="Collez ici les éléments importants de l'offre..."
            rows={4}
          />
        </section>

        <div className="cover-letter-tool-block">
          <label className="label">Style de lettre</label>
          <div style={{ position: 'relative' }}>
            <select
              value={letterTemplateId}
              onChange={(e) => updateCoverLetter('letterTemplateId', e.target.value)}
              className="input-field"
              style={{ appearance: 'none', paddingRight: '32px', cursor: 'pointer', fontWeight: 600 }}
            >
              {COVER_LETTER_TEMPLATES.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  {tpl.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              color="var(--color-text-muted)"
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            />
          </div>
          <p className="cover-letter-style-note">
            Typo : {activeTemplate.fontFamily.split(',')[0]} · accent {activeTemplate.accentColor}
          </p>
        </div>

        <button type="button" className="btn-primary cover-letter-btn-ai" onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? <Loader2 size={18} className="spin-animate" /> : <Sparkles size={18} />}
          {isGenerating ? 'Génération…' : 'Générer le corps (IA)'}
        </button>

        <InlineAIAssistant
          currentText={structuredLetter.body}
          onApply={setCoverLetterBody}
          userRole={personalInfo?.title || 'Professionnel'}
          contextType="coverLetter"
          extraContext={extraContext}
          systemInstruction={COVER_LETTER_SYSTEM_INSTRUCTION}
          placeholder="Consigne de réécriture…"
        />

        <SignaturePad
          value={structuredLetter.signatureImage}
          onChange={(signatureImage) => mergeCoverLetter({ signatureImage })}
        />

        {error && (
          <div className="cover-letter-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <button
          type="button"
          className="btn-secondary cover-letter-btn-pdf"
          onClick={handleExportPdf}
          disabled={isExporting || !structuredLetter.body?.trim()}
        >
          {isExporting ? (
            <Loader2 size={18} className="spin-animate" />
          ) : downloadSuccess ? (
            <CheckCircle2 size={18} />
          ) : (
            <Download size={18} />
          )}
          {downloadSuccess ? 'PDF enregistré' : 'Télécharger PDF'}
        </button>
      </aside>

      <div className="editor-right-panel cover-letter-doc-panel">
        <CoverLetterPreview
          letter={structuredLetter}
          personalInfo={personalInfo}
          letterTemplateId={letterTemplateId}
          onUpdateField={handlePreviewUpdate}
        />
      </div>
    </div>
  )
}
