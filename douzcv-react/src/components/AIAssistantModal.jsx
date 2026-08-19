import React, { useState, useEffect } from 'react'
import { Sparkles, X, Key, Check, Copy, Wand2, RefreshCw, PenTool, Target, Cpu, CheckCircle2, SpellCheck, FileText, ArrowRight } from 'lucide-react'
import { generateWithGemini } from '../services/geminiService'
import GeminiApiKeyModal from './GeminiApiKeyModal'

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
  const [apiKey, setApiKey] = useState(localStorage.getItem('douzcv_gemini_api_key') || '')
  const [guideModalOpen, setGuideModalOpen] = useState(false)
  const [showKeyInput, setShowKeyInput] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [generatedText, setGeneratedText] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  // Sync state whenever modal opens or props change
  useEffect(() => {
    if (isOpen) {
      setError('')
      setGeneratedText('')
      setCopied(false)
      setApiKey(localStorage.getItem('douzcv_gemini_api_key') || '')

      if (initialPrompt) {
        setPrompt(initialPrompt)
      } else if (currentText) {
        if (sectionType === 'summary') {
          setPrompt(`Améliore et sublime ce résumé professionnel pour un profil de ${userRole || 'professionnel'} :\n"${currentText}"`)
        } else if (sectionType === 'experience') {
          setPrompt(`Transforme ces missions en 3 à 4 puces d'accomplissements percutants et chiffrés pour le poste de ${userRole || 'professionnel'} :\n"${currentText}"`)
        } else {
          setPrompt(`Corrige et optimise ce texte pour un rendu exécutif haut de gamme :\n"${currentText}"`)
        }
      } else {
        if (sectionType === 'summary') {
          setPrompt(`Rédige un résumé professionnel percutant et captivant de 3-4 lignes pour un ${userRole || 'Consultant Senior'}`)
        } else if (sectionType === 'experience') {
          setPrompt(`Rédige 4 puces de missions et réalisations chiffrées avec verbes d'action pour le poste de ${userRole || 'Consultant Senior'}`)
        } else {
          setPrompt(`Rédige du contenu de CV professionnel à fort impact pour un ${userRole || 'professionnel'}`)
        }
      }
    }
  }, [isOpen, initialPrompt, currentText, userRole, sectionType])

  if (!isOpen) return null

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('douzcv_gemini_api_key', apiKey.trim())
    } else {
      localStorage.removeItem('douzcv_gemini_api_key')
    }
    setShowKeyInput(false)
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

  // Dynamic context-aware quick suggestions
  const getQuickActions = () => {
    const role = userRole || 'professionnel'
    const hasText = !!currentText?.trim()

    if (sectionType === 'experience') {
      return [
        {
          label: "4 puces orientées impact & chiffres",
          icon: Target,
          prompt: hasText 
            ? `Transforme ce descriptif de poste en 4 puces commençant par des verbes d'action forts et intégrant des résultats chiffrés pour un ${role} :\n"${currentText}"`
            : `Rédige 4 puces de réalisations percutantes avec verbes d'action et métriques concrètes pour le poste de ${role}.`
        },
        {
          label: "Sublimer la formulation actuelle",
          icon: PenTool,
          prompt: hasText
            ? `Sublime et professionnalise la syntaxe et le vocabulaire de cette expérience de ${role} pour un impact maximal :\n"${currentText}"`
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
            ? `Corrige toute faute et perfectionne le style de ce texte pour un CV professionnel :\n"${currentText}"`
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
          ? `Perfectionne ce résumé professionnel pour un ${role} en le rendant ultra-percutant, fluide et orienté résultats :\n"${currentText}"`
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
          ? `Corrige et rehausse le niveau de langue de ce texte pour un CV exécutif :\n"${currentText}"`
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
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
        {/* Header */}
        <div className="flex justify-between items-center" style={{ marginBottom: '16px' }}>
          <div className="flex items-center gap-2">
            <div style={{ backgroundColor: 'rgba(255, 97, 84, 0.12)', padding: '8px', borderRadius: '50%', color: 'var(--color-coral)' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-primary)' }}>{title}</h3>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                {userRole ? `Ciblé pour : ${userRole}` : 'Optimisé par Google Gemini'}
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            style={{ color: 'var(--color-text-muted)', padding: '6px', borderRadius: '50%', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* API Key Toggle Banner */}
        <div style={{ backgroundColor: 'var(--color-background)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div className="flex items-center gap-2">
            {apiKey ? <CheckCircle2 size={15} color="#059669" /> : <Key size={15} color="var(--color-text-muted)" />}
            <span style={{ color: apiKey ? '#059669' : 'var(--color-text-main)', fontWeight: apiKey ? '600' : 'normal' }}>
              {apiKey ? 'Clé Gemini connectée' : 'Assistant Intelligent standard'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              type="button" 
              onClick={() => setGuideModalOpen(true)}
              className="flex items-center gap-1"
              style={{ color: 'var(--color-coral)', fontWeight: '700', fontSize: '12px', cursor: 'pointer', background: 'none', border: 'none', textDecoration: 'underline' }}
            >
              <Sparkles size={13} />
              <span>Guide Google AI Studio (3 étapes)</span>
            </button>
            <span style={{ color: 'var(--color-border)' }}>|</span>
            <button 
              type="button" 
              onClick={() => setShowKeyInput(!showKeyInput)}
              style={{ color: 'var(--color-text-muted)', fontWeight: '600', fontSize: '12px', cursor: 'pointer', background: 'none', border: 'none' }}
            >
              {showKeyInput ? 'Masquer' : 'Saisie directe'}
            </button>
          </div>
        </div>

        {/* API Key Input */}
        {showKeyInput && (
          <div style={{ marginBottom: '16px', padding: '12px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)' }}>
            <label className="label">Votre clé Google Gemini API</label>
            <div className="flex gap-2">
              <input 
                type="password" 
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)} 
                placeholder="AQ.Ab8RN..." 
                className="input-field" 
              />
              <button 
                type="button" 
                onClick={handleSaveApiKey} 
                className="btn-primary" 
                style={{ padding: '0 16px', fontSize: '13px' }}
              >
                Enregistrer
              </button>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              Obtenez une clé gratuite sur <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" style={{ color: 'var(--color-coral)', textDecoration: 'underline' }}>Google AI Studio</a>.
            </p>
          </div>
        )}

        {/* Context badge if text is being edited */}
        {currentText && (
          <div style={{ backgroundColor: 'rgba(27, 48, 65, 0.04)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', marginBottom: '14px', borderLeft: '3px solid var(--color-coral)' }}>
            <div style={{ fontSize: '11.5px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: '2px' }}>
              Texte actuel pris en compte :
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', lineHeight: '1.4', margin: 0, fontStyle: 'italic' }}>
              "{currentText.length > 120 ? currentText.substring(0, 120) + '...' : currentText}"
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div style={{ marginBottom: '16px' }}>
          <label className="label" style={{ marginBottom: '8px' }}>Suggestions rapides :</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
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
                  className="flex items-center gap-2"
                  style={{
                    textAlign: 'left',
                    padding: '9px 11px',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '12px',
                    fontWeight: '500',
                    color: 'var(--color-primary)',
                    transition: 'all 0.2s',
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
                  <ActionIcon size={14} color="var(--color-coral)" style={{ flexShrink: 0 }} />
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
            style={{ minHeight: '85px', resize: 'vertical', fontSize: '13px', lineHeight: '1.45' }}
          />
        </div>

        {/* Action Button */}
        <button 
          type="button"
          onClick={() => handleGenerate()} 
          disabled={isLoading || !prompt.trim()}
          className="btn-primary" 
          style={{ width: '100%', padding: '12px', marginBottom: '16px', opacity: (isLoading || !prompt.trim()) ? 0.6 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          {isLoading ? (
            <>
              <RefreshCw size={16} className="spin" />
              Génération en direct avec Gemini 3.7 / 3.6...
            </>
          ) : (
            <>
              <Wand2 size={16} />
              Générer le contenu
            </>
          )}
        </button>

        {error && (
          <div style={{ color: '#DC2626', fontSize: '13px', marginBottom: '12px', padding: '10px 12px', backgroundColor: '#FEE2E2', borderRadius: 'var(--radius-sm)' }}>
            {error}
          </div>
        )}

        {/* Result Area */}
        {generatedText && (
          <div style={{ backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '16px', marginBottom: '8px' }}>
            <div className="flex justify-between items-center" style={{ marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-primary)' }}>
                Résultat généré :
              </span>
              <button 
                type="button" 
                onClick={handleCopy} 
                className="flex items-center gap-1" 
                style={{ fontSize: '12px', color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {copied ? <Check size={14} color="var(--color-coral)" /> : <Copy size={14} />}
                {copied ? 'Copié !' : 'Copier'}
              </button>
            </div>
            
            <div style={{ fontSize: '13.5px', lineHeight: '1.6', whiteSpace: 'pre-line', color: 'var(--color-text-main)', padding: '12px', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
              {generatedText}
            </div>

            {onApplyText && (
              <button 
                type="button" 
                onClick={handleApply} 
                className="btn-primary flex items-center justify-center gap-2" 
                style={{ marginTop: '14px', width: '100%', padding: '12px', fontSize: '13.5px' }}
              >
                <Check size={16} />
                Insérer directement dans mon CV
              </button>
            )}
          </div>
        )}
      </div>

      {/* Embedded 3-Step Gemini API Guide Modal */}
      <GeminiApiKeyModal 
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
        onKeySaved={(newKey) => {
          setApiKey(newKey)
          setGuideModalOpen(false)
        }}
      />
    </div>
  )
}
