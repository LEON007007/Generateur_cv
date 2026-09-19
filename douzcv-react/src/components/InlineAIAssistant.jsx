import React, { useState } from 'react'
import { Loader2, RotateCcw, Check, ChevronDown, ChevronUp, Wand2, AlertCircle } from 'lucide-react'
import { generateWithGemini } from '../services/geminiService'

export function formatPlainTextToHtml(text) {
  if (!text) return ''
  if (text.includes('<p>') || text.includes('<ul>')) return text

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

function stripHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim()
}

export default function InlineAIAssistant({
  currentText = '',
  onApply,
  userRole = 'Professionnel',
  contextType = 'summary',
  extraContext = '',
  placeholder = 'Ex: accentuer l\'impact managérial et les chiffres clés...',
  onRequestApiKey
}) {
  const [customPrompt, setCustomPrompt] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [previousText, setPreviousText] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')

  const cleanCurrent = stripHtml(currentText)
  const hasContent = cleanCurrent.length > 0

  // ── Presets ──────────────────────────────────────────────────────────────
  const getPresets = () => {
    if (contextType === 'summary') {
      return [
        {
          id: 'enhance',
          icon: 'fa-solid fa-wand-magic-sparkles',
          label: hasContent ? 'Sublimer le résumé' : 'Rédiger un résumé percutant',
          prompt: hasContent
            ? `Perfectionne et sublime ce résumé professionnel pour un profil de ${userRole} :\n"${cleanCurrent}"`
            : `Rédige un résumé professionnel percutant, valorisant et structuré de 3 à 4 phrases percutantes pour un ${userRole}.`
        },
        {
          id: 'leadership',
          icon: 'fa-solid fa-bullseye',
          label: 'Accroche Leadership & Impact',
          prompt: `Rédige une accroche professionnelle axée sur le leadership stratégique, la prise de décision et l'impact opérationnel mesurable pour un profil de ${userRole}.` + (hasContent ? ` En t'inspirant de : "${cleanCurrent}"` : '')
        },
        {
          id: 'polish',
          icon: 'fa-solid fa-spell-check',
          label: 'Corriger la syntaxe & le style',
          prompt: hasContent
            ? `Corrige et élève le niveau de style de ce texte pour un rendu exécutif haut de gamme, sans changer le fond :\n"${cleanCurrent}"`
            : `Rédige 3 points forts clés pour un ${userRole}.`
        }
      ]
    }

    if (contextType === 'experience') {
      return [
        {
          id: 'star',
          icon: 'fa-solid fa-chart-line',
          label: hasContent ? 'Transformer en réalisations STAR' : 'Générer 3-4 réalisations chiffrées',
          prompt: hasContent
            ? `Transforme et sublime ces missions en 3 à 4 puces de réalisations majeures et chiffrées avec verbes d'action pour le poste de ${userRole} ${extraContext ? 'chez ' + extraContext : ''} :\n"${cleanCurrent}"`
            : `Rédige 4 réalisations professionnelles majeures et chiffrées avec des verbes d'action forts pour le poste de ${userRole} ${extraContext ? 'chez ' + extraContext : ''}. Formate sous forme de puces •.`
        },
        {
          id: 'action_verbs',
          icon: 'fa-solid fa-bolt',
          label: 'Enrichir avec verbes d\'action',
          prompt: `Reformule ce descriptif d'expérience avec des verbes d'action puissants au passé ou au présent, axé sur les résultats et l'efficacité pour un ${userRole} :\n"${cleanCurrent || userRole}"`
        },
        {
          id: 'bullet_format',
          icon: 'fa-solid fa-list-check',
          label: 'Structurer en puces d\'impact',
          prompt: `Synthétise et structure ce texte en puces concises et dynamiques prêtes à l'emploi :\n"${cleanCurrent || userRole}"`
        }
      ]
    }

    // education
    return [
      {
        id: 'edu_enhance',
        icon: 'fa-solid fa-graduation-cap',
        label: 'Valoriser les acquis & projets',
        prompt: hasContent
          ? `Améliore cette description de formation en mettant en avant les compétences clés et les projets majeurs acquis pour ${extraContext || 'la formation'} :\n"${cleanCurrent}"`
          : `Rédige une description concise et valorisante des compétences et projets majeurs acquis lors de la formation ${extraContext || 'ce diplôme'}.`
      },
      {
        id: 'edu_bullets',
        icon: 'fa-solid fa-list-ul',
        label: 'Synthétiser en compétences clés',
        prompt: `Mets en valeur les acquis majeurs de cette formation sous forme de 2 à 3 points clés percutants :\n"${cleanCurrent || extraContext || 'Formation'}"`
      }
    ]
  }

  // ── Execute ───────────────────────────────────────────────────────────────
  const handleExecutePrompt = async (promptText) => {
    if (!promptText || !promptText.trim()) return

    setIsLoading(true)
    setError('')
    setSuccessMessage('')
    setPreviousText(currentText)

    try {
      const result = await generateWithGemini({ prompt: promptText.trim() })

      if (result) {
        const formatted = formatPlainTextToHtml(result)
        onApply(formatted)
        setSuccessMessage('Texte inséré avec succès !')
        setCustomPrompt('')
        setIsExpanded(false)
        setTimeout(() => setSuccessMessage(''), 4000)
      } else {
        throw new Error('Aucun texte renvoyé par Gemini.')
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de la génération.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUndo = () => {
    if (previousText !== null) {
      onApply(previousText)
      setPreviousText(null)
      setSuccessMessage('Texte initial restauré')
      setTimeout(() => setSuccessMessage(''), 2500)
    }
  }

  const presets = getPresets()

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        marginTop: '10px',
        borderRadius: '10px',
        border: isLoading
          ? '1px solid var(--color-coral)'
          : '1px solid rgba(226, 232, 240, 0.9)',
        boxShadow: isLoading
          ? '0 0 0 3px rgba(255, 97, 84, 0.10)'
          : '0 1px 3px rgba(0,0,0,0.03)',
        overflow: 'hidden',
        transition: 'all 0.22s ease'
      }}
    >
      {/* ── Header bar ──────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '9px 12px',
          backgroundColor: '#F8FAFC',
          borderBottom: isExpanded ? '1px solid rgba(226, 232, 240, 0.8)' : 'none',
          gap: '8px',
          flexWrap: 'wrap'
        }}
      >
        {/* Left: title + status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              backgroundColor: 'rgba(255,97,84,0.12)',
              color: 'var(--color-coral)',
              flexShrink: 0
            }}
          >
            {isLoading
              ? <Loader2 size={13} className="spin-animate" />
              : <i className="fa-solid fa-robot" style={{ fontSize: '12px' }} />}
          </div>

          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-primary)' }}>
            Rédiger avec IA
          </span>

          {isLoading && (
            <span style={{ fontSize: '11.5px', color: 'var(--color-coral)', fontWeight: '600' }}>
              Rédaction en cours...
            </span>
          )}
        </div>

        {/* Right: success / undo / consigne libre */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap' }}>
          {successMessage && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11.5px',
                fontWeight: '600',
                color: '#059669',
                backgroundColor: '#ECFDF5',
                padding: '2px 8px',
                borderRadius: '6px'
              }}
            >
              <Check size={12} />
              {successMessage}
            </span>
          )}

          {previousText !== null && !isLoading && (
            <button
              type="button"
              onClick={handleUndo}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 9px',
                borderRadius: '6px',
                fontSize: '11.5px',
                fontWeight: '600',
                color: '#64748B',
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                cursor: 'pointer'
              }}
              title="Revenir au texte d'avant"
            >
              <RotateCcw size={11} />
              <span>Annuler</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              fontSize: '11.5px',
              fontWeight: '600',
              cursor: 'pointer',
              padding: '2px 4px'
            }}
          >
            <i className="fa-solid fa-pen-to-square" style={{ fontSize: '11px' }} />
            <span>{isExpanded ? 'Masquer' : 'Consigne libre'}</span>
            {isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </button>
        </div>
      </div>

      {/* ── Quick preset chips ───────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          padding: '10px 12px',
          backgroundColor: '#FFFFFF'
        }}
      >
        {presets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            disabled={isLoading}
            onClick={() => handleExecutePrompt(preset.prompt)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: '#F8FAFC',
              border: '1px solid rgba(203,213,225,0.9)',
              color: 'var(--color-text-main)',
              fontSize: '12px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              opacity: isLoading ? 0.6 : 1,
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.borderColor = 'var(--color-coral)'
                e.currentTarget.style.color = 'var(--color-coral)'
                e.currentTarget.style.backgroundColor = 'rgba(255,97,84,0.05)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.borderColor = 'rgba(203,213,225,0.9)'
                e.currentTarget.style.color = 'var(--color-text-main)'
                e.currentTarget.style.backgroundColor = '#F8FAFC'
              }
            }}
          >
            <i className={preset.icon} style={{ fontSize: '11px', color: 'var(--color-coral)', flexShrink: 0 }} />
            <span>{preset.label}</span>
          </button>
        ))}
      </div>

      {/* ── Expandable free-text instruction ────────────────────────── */}
      {isExpanded && (
        <div
          style={{
            padding: '0 12px 12px 12px',
            backgroundColor: '#FFFFFF',
            borderTop: '1px dashed #E2E8F0'
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleExecutePrompt(
                cleanCurrent
                  ? `${customPrompt} en modifiant ce texte existant :\n"${cleanCurrent}"`
                  : customPrompt
              )
            }}
            style={{ display: 'flex', gap: '6px', paddingTop: '10px' }}
          >
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder={placeholder}
              disabled={isLoading}
              className="input-field"
              style={{ fontSize: '12px', padding: '7px 11px', borderRadius: '8px' }}
            />
            <button
              type="submit"
              disabled={isLoading || !customPrompt.trim()}
              className="btn-primary"
              style={{
                padding: '0 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                opacity: (isLoading || !customPrompt.trim()) ? 0.6 : 1,
                cursor: (isLoading || !customPrompt.trim()) ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading
                ? <Loader2 size={13} className="spin-animate" />
                : <i className="fa-solid fa-paper-plane" style={{ fontSize: '12px' }} />}
              <span>Générer</span>
            </button>
          </form>
        </div>
      )}

      {/* ── Error ───────────────────────────────────────────────────── */}
      {error && (
        <div
          style={{
            margin: '0 12px 10px 12px',
            padding: '7px 10px',
            borderRadius: '6px',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#B91C1C',
            fontSize: '11.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <AlertCircle size={13} />
          <span>{error}</span>
          {onRequestApiKey && (
            <button
              type="button"
              onClick={onRequestApiKey}
              style={{ marginLeft: 'auto', color: '#991B1B', fontWeight: '700', textDecoration: 'underline' }}
            >
              Configurer la clé Gemini
            </button>
          )}
        </div>
      )}
    </div>
  )
}
