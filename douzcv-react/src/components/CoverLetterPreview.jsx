import React from 'react'
import { Link } from 'react-router-dom'
import { getCoverLetterTemplate } from '../data/coverLetterTemplates'
import { CoverLetterEditable } from './CoverLetterEditable'
import { formatLetterDateDisplay } from '../services/coverLetterService'

function SenderFromCv({ personalInfo, accentColor, layout }) {
  const name = [personalInfo?.firstName, personalInfo?.lastName].filter(Boolean).join(' ') || 'Votre nom'
  const align = layout === 'prestige' ? 'center' : 'left'

  return (
    <header className="letter-sender-block" style={{ textAlign: align, marginBottom: '32px' }}>
      <div className="letter-sender-name" style={{ color: accentColor }}>
        {name}
      </div>
      {personalInfo?.title && <div className="letter-sender-meta">{personalInfo.title}</div>}
      {[personalInfo?.email, personalInfo?.phone, personalInfo?.location].filter(Boolean).length > 0 && (
        <div className="letter-sender-meta">
          {[personalInfo?.email, personalInfo?.phone, personalInfo?.location].filter(Boolean).join(' · ')}
        </div>
      )}
      <Link to="/editeur" className="letter-cv-sync-link cover-letter-no-print">
        Modifier mes coordonnées dans l&apos;éditeur CV
      </Link>
    </header>
  )
}

function LetterBody({
  layout,
  accentColor,
  letter,
  onUpdate
}) {
  return (
    <>
      <div className="letter-main-content">
        <div className="letter-date-row">
          <CoverLetterEditable
            value={letter.place}
            onChange={(v) => onUpdate('place', v)}
            placeholder="Ville"
            inline
            style={{ width: 'auto', minWidth: '72px', textAlign: 'right' }}
          />
          <span>, le </span>
          <span>{formatLetterDateDisplay(letter.letterDate) || '19 septembre 2026'}</span>
        </div>

        <div className="letter-recipient-block">
          <CoverLetterEditable
            value={letter.recipientName}
            onChange={(v) => onUpdate('recipientName', v)}
            placeholder="Madame, Monsieur,"
          />
          <CoverLetterEditable
            value={letter.companyName}
            onChange={(v) => onUpdate('companyName', v)}
            placeholder="Nom de l'entreprise"
            style={{ fontWeight: 600 }}
          />
          <CoverLetterEditable
            value={letter.recipientAddress}
            onChange={(v) => onUpdate('recipientAddress', v)}
            placeholder="Adresse (optionnel)"
            multiline
            rows={2}
            style={{ fontSize: '10pt', color: '#64748B' }}
          />
        </div>

        <div className="letter-subject-block">
          <span className="letter-subject-label">Objet : </span>
          <CoverLetterEditable
            value={letter.subject}
            onChange={(v) => onUpdate('subject', v)}
            placeholder="Candidature au poste de..."
            inline
            style={{ display: 'inline', width: 'auto', minWidth: '220px', fontWeight: 600 }}
          />
        </div>

        <div className="letter-body-editor">
          <CoverLetterEditable
            value={letter.salutation}
            onChange={(v) => onUpdate('salutation', v)}
            placeholder="Madame, Monsieur,"
            className="letter-salutation"
          />

          <CoverLetterEditable
            value={letter.body}
            onChange={(v) => onUpdate('body', v)}
            multiline
            rows={18}
            placeholder="Rédigez ici le corps complet de votre lettre, ou utilisez « Générer avec l'IA » dans le panneau d'outils."
            className="letter-body-field"
          />
        </div>

        <div className="letter-closing-block">
          <CoverLetterEditable
            value={letter.closing}
            onChange={(v) => onUpdate('closing', v)}
            multiline
            rows={2}
            className="letter-closing"
          />
        </div>

        <div className="letter-signature-block">
          <CoverLetterEditable
            value={letter.signatureName}
            onChange={(v) => onUpdate('signatureName', v)}
            placeholder="Signature"
            className="letter-signature"
          />

          {letter.signatureImage && (
            <img
              src={letter.signatureImage}
              alt="Signature dessinée"
              className="letter-signature-image"
            />
          )}
        </div>
      </div>

    </>
  )
}

export default function CoverLetterPreview({
  letter,
  personalInfo,
  letterTemplateId,
  onUpdateField
}) {
  const template = getCoverLetterTemplate(letterTemplateId)
  const { accentColor, fontFamily, layout } = template

  return (
    <article
      className={`cover-letter-preview-container cv-preview-container letter-doc letter-layout-${layout}`}
      style={{
        fontFamily,
        '--letter-accent': accentColor
      }}
      data-template={letterTemplateId}
    >
      {layout === 'sidebar' && (
        <div className="letter-sidebar-accent" style={{ background: accentColor }} aria-hidden />
      )}
      <div className="letter-doc-inner">
        <SenderFromCv personalInfo={personalInfo} accentColor={accentColor} layout={layout} />
        <LetterBody layout={layout} accentColor={accentColor} letter={letter} onUpdate={onUpdateField} />
      </div>
    </article>
  )
}
