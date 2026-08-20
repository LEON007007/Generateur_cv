import React, { useState, useEffect } from 'react'
import { Sparkles, X, Key, Check, Copy, Wand2, RefreshCw, PenTool, Target, Cpu, CheckCircle2, SpellCheck, AlertCircle } from 'lucide-react'
import { generateWithGemini } from '../services/geminiService'

// Helper to strip HTML tags and decode entities for clean display and prompts
const stripHtml = (html) => {
  if (!html) return ''
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
}

export default function AIAssistantModal({ 
  isOpen, 
  onClose, 
  onApplyText, 
  initialPrompt = '', 
  currentText = '', 
  userRole = '', 
  sectionType = 'summary',
  title = 'Assistant IA Gemini' 
}) {
  const [prompt, setPrompt] = useState('')
  const [apiKey, setApiKey] = useState(localStorage.getItem('douzcv_gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || '')
  const [showKeyInput, setShowKeyInput] = useState(false)
  const [keySaveMessage, setKeySaveMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [generatedText, setGeneratedText] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const cleanText = stripHtml(currentText)

  // Sync state whenever modal opens or props change
  useEffect(() => {
    if (isOpen) {
      setError('')
      setGeneratedText('')
      setCopied(false)
      setShowKeyInput(false)
      setKeySaveMessage('')
      
      const storedKey = localStorage.getItem('douzcv_gemini_api_key') || import.meta.env.VITE_GEMINI_API_KEY || ''
      setApiKey(storedKey)

      const textForPrompt = stripHtml(currentText)

      if (initialPrompt) {
        setPrompt(stripHtml(initialPrompt))
      } else if (textForPrompt) {
        if (sectionType === 'summary') {
          setPrompt(`Améliore et sublime ce résumé professionnel pour un profil de ${userRole || 'professionnel'} :\n"${textForPrompt}"`)
        } else if (sectionType === 'experience') {
          setPrompt(`Transforme ces missions en 3 à 4 réalisations majeures et chiffrées avec verbes d'action pour le poste de ${userRole || 'professionnel'} :\n"${textForPrompt}"`)
        } else if (sectionType === 'education') {
          setPrompt(`Améliore cette description de formation pour un profil de ${userRole || 'diplômé'} :\n"${textForPrompt}"`)
        } else {
          setPrompt(`Corrige et optimise ce texte pour un rendu exécutif haut de gamme :\n"${textForPrompt}"`)
        }
      } else {
        if (sectionType === 'summary') {
          setPrompt(`Rédige un résumé professionnel percutant et captivant de 3-4 lignes pour un ${userRole || 'Consultant Senior'}`)
        } else if (sectionType === 'experience') {
          setPrompt(`Rédige 4 réalisations majeures et chiffrées avec verbes d'action pour le poste de ${userRole || 'Collaborateur'}`)
        } else if (sectionType === 'education') {
          setPrompt(`Rédige une description valorisante des compétences et projets majeurs acquis lors de cette formation`)
        } else {
          setPrompt(`Rédige du contenu de CV professionnel à fort impact pour un ${userRole || 'professionnel'}`)
        }
      }
    }
  }, [isOpen, initialPrompt, currentText, userRole, sectionType])

  if (!isOpen) return null

  const isKeyConnected = !!apiKey.trim()

  const handleSaveApiKey = () => {
    const trimmed = apiKey.trim()
    if (trimmed) {
      localStorage.setItem('douzcv_gemini_api_key', trimmed)
      setKeySaveMessage('Clé API Gemini enregistrée avec succès')
    } else {
      localStorage.removeItem('douzcv_gemini_api_key')
      setKeySaveMessage('Clé supprimée')
    }
    setTimeout(() => {
      setKeySaveMessage('')
      setShowKeyInput(false)
    }, 1200)
  }

  const handleGenerate = async (customPrompt) => {
    const textToRun = customPrompt || prompt
    if (!textToRun.trim()) return

    setIsLoading(true)
    setError('')
    try {
      const result = await generateWithGemini({
        prompt: textToRun,
        apiKey: apiKey.trim() || undefined
      })
      setGeneratedText(result)
    } catch (err) {
      setError(err.message || 'Erreur lors de la génération avec Gemini')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    if (!generatedText) return
    navigator.clipboard.writeText(generatedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleApply = () => {
    if (onApplyText && generatedText) {
      onApplyText(generatedText)
      onClose()
    }
  }

  // Dynamic context-aware quick suggestions (SVG icons only, no emojis)
  const getQuickActions = () => {
    const role = userRole || 'professionnel'
    const hasText = !!cleanText

    if (sectionType === 'experience') {
      return [
        {
          label: "4 puces orientées impact & chiffres",
          icon: Target,
          prompt: hasText 
            ? `Transforme ce descriptif de poste en 4 puces commençant par des verbes d'action forts et intégrant des résultats chiffrés pour un ${role} :\n"${cleanText}"`
            : `Rédige 4 puces de réalisations percutantes avec verbes d'action et métriques concrètes pour le poste de ${role}.`
        },
        {
          label: "Sublimer la formulation actuelle",
          icon: PenTool,
          prompt: hasText
            ? `Sublime et professionnalise la syntaxe et le vocabulaire de cette expérience de ${role} pour un impact maximal :\n"${cleanText}"`
            : `Rédige 3 accomplissements majeurs démontrant le leadership et la rigueur d'un ${role}.`
        },
        {
          label: "Suggérer compétences techniques",
          icon: Cpu,
          prompt: `Génère une liste de 6 compétences clés et outils incontournables pour un ${role}.`
        },
        {
          label: "Corriger l'orthographe & le style",
          icon: SpellCheck,
          prompt: hasText
            ? `Corrige toute faute et perfectionne le style de ce texte pour un CV professionnel :\n"${cleanText}"`
            : `Rédige une description d'expérience percutante pour un ${role} de haut niveau.`
        }
      ]
    }

    if (sectionType === 'skills') {
      return [
        {
          label: "Top 8 compétences les plus recherchées",
          icon: Cpu,
          prompt: `Génère les 8 compétences clés techniques et stratégiques les plus valorisées pour un ${role} en 2026.`
        },
        {
          label: "Compétences managériales & Leadership",
          icon: Target,
          prompt: `Génère 6 compétences comportementales et de leadership essentielles pour un ${role}.`
        },
        {
          label: "Outils & Méthodologies agiles",
          icon: PenTool,
          prompt: `Génère une sélection de 6 méthodologies et outils modernes indispensables pour un ${role}.`
        },
        {
          label: "Compétences transverses & stratégie",
          icon: SpellCheck,
          prompt: `Propose 6 compétences analytiques et stratégiques à forte valeur ajoutée pour un ${role}.`
        }
      ]
    }

    // Default: Summary (Résumé professionnel)
    return [
      {
        label: hasText ? "Sublimer mon résumé actuel" : "Rédiger un résumé captivant",
        icon: PenTool,
        prompt: hasText 
          ? `Perfectionne ce résumé professionnel pour un ${role} en le rendant ultra-percutant, fluide et orienté résultats :\n"${cleanText}"`
          : `Rédige un résumé professionnel captivant et structuré de 3-4 lignes pour un ${role}, mettant en avant l'expérience, les forces stratégiques et la création de valeur.`
      },
      {
        label: "Accroche orientée performance & leadership",
        icon: Target,
        prompt: `Rédige un profil professionnel percutant de 3 lignes axé sur le leadership, l'atteinte d'objectifs ambitieux et l'excellence opérationnelle pour un ${role}.`
      },
      {
        label: "Suggérer compétences clés",
        icon: Cpu,
        prompt: `Liste les 6 compétences fondamentales et stratégiques pour un ${role}.`
      },
      {
        label: "Corriger la syntaxe & le vocabulaire",
        icon: SpellCheck,
        prompt: hasText
          ? `Corrige et rehausse le niveau de langue de ce texte pour un CV exécutif :\n"${cleanText}"`
          : `Rédige une présentation de profil professionnel haut de gamme pour un ${role}.`
      }
    ]
  }

  const quickActions = getQuickActions()

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(27, 48, 65, 0.6)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: '640px',
        maxHeight: '92vh',
        overflowY: 'auto',
        padding: '24px',
        position: 'relative',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        borderRadius: '16px'
      }}>
        {/* Header */}
        <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
          <div className="flex items-center gap-2.5">
            <div style={{ backgroundColor: 'rgba(255, 97, 84, 0.12)', padding: '8px', borderRadius: '50%', color: 'var(--color-coral)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-primary)' }}>{title}</h3>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: 0 }}>
                {userRole ? `Ciblé pour : ${userRole}` : 'Optimisé par Google Gemini'}
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            style={{ color: 'var(--color-text-muted)', padding: '6px', borderRadius: '50%', cursor: 'pointer', background: 'none', border: 'none' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Gemini API Status & Connection Bar */}
        <div style={{ 
          backgroundColor: isKeyConnected ? '#F0FDF4' : '#FEF3C7', 
          border: isKeyConnected ? '1px solid #BBF7D0' : '1px solid #FDE68A',
          padding: '10px 14px', 
          borderRadius: '10px', 
          marginBottom: '16px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '8px' 
        }}>
          <div className="flex items-center gap-2">
            {isKeyConnected ? (
              <CheckCircle2 size={16} color="#16A34A" />
            ) : (
              <AlertCircle size={16} color="#D97706" />
            )}
            <span style={{ 
              fontSize: '13px', 
              fontWeight: '700', 
              color: isKeyConnected ? '#15803D' : '#B45309' 
            }}>
              {isKeyConnected ? 'Clé API Gemini connectée' : 'Clé API non connectée'}
            </span>
          </div>

          <button 
            type="button" 
            onClick={() => setShowKeyInput(!showKeyInput)}
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 11px',
              borderRadius: '6px',
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-main)', 
              fontWeight: '600', 
              fontSize: '12px', 
              cursor: 'pointer' 
            }}
          >
            <Key size={13} color="var(--color-coral)" />
            <span>{showKeyInput ? 'Masquer' : (isKeyConnected ? 'Modifier la clé' : 'Renseigner la clé API')}</span>
          </button>
        </div>

        {/* API Key Input Form */}
        {showKeyInput && (
          <div style={{ 
            marginBottom: '16px', 
            padding: '14px 16px', 
            backgroundColor: '#F8FAFC', 
            border: '1px solid var(--color-border)', 
            borderRadius: '10px' 
          }}>
            <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Key size={14} color="var(--color-coral)" />
              <span>Clé API Google Gemini</span>
            </label>
            <div className="flex gap-2">
              <input 
                type="password" 
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)} 
                placeholder="Collez votre clé API Gemini (Google AI Studio)" 
                className="input-field" 
                style={{ fontSize: '13px' }}
              />
              <button 
                type="button" 
                onClick={handleSaveApiKey} 
                className="btn-primary" 
                style={{ padding: '0 16px', fontSize: '13px', whiteSpace: 'nowrap' }}
              >
                Enregistrer
              </button>
            </div>
            {keySaveMessage && (
              <p style={{ fontSize: '12px', fontWeight: '600', color: '#16A34A', marginTop: '6px', margin: 0 }}>
                {keySaveMessage}
              </p>
            )}
          </div>
        )}

        {/* Clean Context badge if text is being edited */}
        {cleanText && (
          <div style={{ backgroundColor: 'rgba(27, 48, 65, 0.04)', padding: '10px 14px', borderRadius: '10px', marginBottom: '14px', borderLeft: '3px solid var(--color-coral)' }}>
            <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: '3px', letterSpacing: '0.04em' }}>
              Texte actuel pris en compte :
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', lineHeight: '1.45', margin: 0, fontStyle: 'italic' }}>
              "{cleanText.length > 140 ? cleanText.substring(0, 140) + '...' : cleanText}"
            </p>
          </div>
        )}

        {/* Quick Actions (SVG icons only, no emojis) */}
        <div style={{ marginBottom: '16px' }}>
          <label className="label" style={{ marginBottom: '8px' }}>Suggestions rapides :</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '8px' }}>
            {quickActions.map((action, i) => {
              const ActionIcon = action.icon
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setPrompt(action.prompt)
                    handleGenerate(action.prompt)
                  }}
                  className="flex items-center gap-2.5"
                  style={{
                    textAlign: 'left',
                    padding: '9px 12px',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    fontWeight: '500',
                    color: 'var(--color-primary)',
                    transition: 'all 0.15s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-coral)'
                    e.currentTarget.style.backgroundColor = 'rgba(255, 97, 84, 0.04)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)'
                    e.currentTarget.style.backgroundColor = 'var(--color-surface)'
                  }}
                >
                  <ActionIcon size={15} color="var(--color-coral)" style={{ flexShrink: 0 }} />
                  <span>{action.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Input prompt */}
        <div style={{ marginBottom: '16px' }}>
          <label className="label">Consigne envoyée à Gemini IA</label>
          <textarea 
            value={prompt} 
            onChange={(e) => setPrompt(e.target.value)} 
            placeholder="Décrivez ce que vous souhaitez que l'IA génère ou améliore..."
            className="input-field" 
            style={{ minHeight: '80px', resize: 'vertical', fontSize: '13px', lineHeight: '1.45' }}
          />
        </div>

        {/* Action Button */}
        <button 
          type="button"
          onClick={() => handleGenerate()} 
          disabled={isLoading || !prompt.trim()}
          className="btn-primary" 
          style={{ width: '100%', padding: '12px', marginBottom: '16px', opacity: (isLoading || !prompt.trim()) ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderRadius: '10px' }}
        >
          {isLoading ? (
            <>
              <RefreshCw size={16} className="spin" />
              <span>Génération en cours avec Gemini...</span>
            </>
          ) : (
            <>
              <Wand2 size={16} />
              <span>Générer le contenu</span>
            </>
          )}
        </button>

        {error && (
          <div style={{ color: '#DC2626', fontSize: '13px', marginBottom: '12px', padding: '10px 12px', backgroundColor: '#FEE2E2', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} color="#DC2626" style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Result Area */}
        {generatedText && (
          <div style={{ backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '16px', marginBottom: '8px' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary)' }}>
                Résultat généré :
              </span>
              <button 
                type="button" 
                onClick={handleCopy} 
                className="flex items-center gap-1.5" 
                style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {copied ? <Check size={14} color="var(--color-coral)" /> : <Copy size={14} />}
                <span>{copied ? 'Copié !' : 'Copier'}</span>
              </button>
            </div>
            
            <div style={{ fontSize: '13.5px', lineHeight: '1.6', whiteSpace: 'pre-line', color: 'var(--color-text-main)', padding: '12px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
              {generatedText}
            </div>

            {onApplyText && (
              <button 
                type="button" 
                onClick={handleApply} 
                className="btn-primary flex items-center justify-center gap-2" 
                style={{ marginTop: '14px', width: '100%', padding: '12px', fontSize: '13.5px', borderRadius: '8px' }}
              >
                <Check size={16} />
                <span>Insérer directement dans mon CV</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

