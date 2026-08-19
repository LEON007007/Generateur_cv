import React, { useState, useEffect } from 'react'
import { 
  X, 
  Key, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck, 
  Copy, 
  Check, 
  Trash2, 
  HelpCircle,
  Cpu,
  ArrowRight
} from 'lucide-react'

export default function GeminiApiKeyModal({ isOpen, onClose, onKeySaved }) {
  const [apiKey, setApiKey] = useState('')
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState(null) // { success: boolean, message: string }
  const [copiedLink, setCopiedLink] = useState(false)
  const [activeStep, setActiveStep] = useState(1)

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('douzcv_gemini_api_key') || ''
      setApiKey(stored)
      setTestResult(stored ? { success: true, message: 'Clé active enregistrée dans votre navigateur' } : null)
      setIsTesting(false)
      setActiveStep(stored ? 3 : 1)
    }
  }, [isOpen])

  if (!isOpen) return null

  // Test API Key against Google Gemini Endpoint
  const handleTestAndSave = async () => {
    const keyToTest = apiKey.trim()
    if (!keyToTest) {
      setTestResult({ success: false, message: 'Veuillez saisir votre clé API Google Gemini.' })
      return
    }

    setIsTesting(true)
    setTestResult(null)

    try {
      // Direct validation call to Gemini 2.5 Flash Lite or Flash Latest
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${keyToTest}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Reponds "OK"' }] }]
          })
        }
      )

      const data = await response.json()

      if (!response.ok || data.error) {
        throw new Error(data.error?.message || 'Clé API invalide ou non autorisée par Google.')
      }

      // Key is valid! Save to localStorage
      localStorage.setItem('douzcv_gemini_api_key', keyToTest)
      setTestResult({
        success: true,
        message: 'Félicitations ! Votre clé API Google Gemini est 100% opérationnelle.'
      })
      if (onKeySaved) onKeySaved(keyToTest)
    } catch (err) {
      setTestResult({
        success: false,
        message: `Échec de validation : ${err.message || 'Vérifiez la clé saisie et votre connexion internet.'}`
      })
    } finally {
      setIsTesting(false)
    }
  }

  const handleRemoveKey = () => {
    localStorage.removeItem('douzcv_gemini_api_key')
    setApiKey('')
    setTestResult({ success: false, message: 'Clé supprimée. Le mode assistant intelligent par défaut est actif.' })
    if (onKeySaved) onKeySaved('')
  }

  const copyStudioUrl = () => {
    navigator.clipboard.writeText('https://aistudio.google.com/app/apikey')
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2500)
  }

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          maxWidth: '560px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Google Coral/Indigo Gradient Accent */}
        <div 
          style={{
            padding: '24px 24px 20px',
            borderBottom: '1px solid var(--color-border)',
            background: 'linear-gradient(135deg, #1B3041 0%, #0F172A 100%)',
            color: '#FFFFFF',
            position: 'relative'
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 97, 84, 0.18)',
                  border: '1px solid rgba(255, 97, 84, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-coral)'
                }}
              >
                <Sparkles size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#FFFFFF' }}>
                  Guide d'activation Clé Gemini IA
                </h2>
                <p style={{ fontSize: '12.5px', color: '#94A3B8', margin: '3px 0 0 0' }}>
                  Obtenez votre clé API officielle en 3 étapes (100% Gratuit)
                </p>
              </div>
            </div>
            <button 
              type="button" 
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.15s'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: '22px 24px', overflowY: 'auto' }}>
          
          {/* 3 Step Interactive Workflow Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '22px' }}>
            
            {/* ÉTAPE 1 */}
            <div 
              style={{
                padding: '16px',
                borderRadius: '14px',
                backgroundColor: activeStep === 1 ? 'rgba(255, 97, 84, 0.04)' : '#F8FAFC',
                border: activeStep === 1 ? '1.5px solid var(--color-coral)' : '1px solid var(--color-border)',
                transition: 'all 0.2s ease'
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span 
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      backgroundColor: activeStep === 1 ? 'var(--color-coral)' : '#64748B',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    1
                  </span>
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-primary)', margin: '0 0 4px 0' }}>
                      Accédez à Google AI Studio
                    </h3>
                    <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', margin: 0, lineHeight: '1.45' }}>
                      Connectez-vous avec votre compte Google standard sur la plateforme développeur.
                    </p>
                  </div>
                </div>

                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-primary"
                  style={{
                    padding: '7px 12px',
                    fontSize: '12px',
                    fontWeight: '700',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    whiteSpace: 'nowrap',
                    textDecoration: 'none',
                    flexShrink: 0
                  }}
                  onClick={() => setActiveStep(2)}
                >
                  <span>Ouvrir Google AI Studio</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>

            {/* ÉTAPE 2 */}
            <div 
              style={{
                padding: '16px',
                borderRadius: '14px',
                backgroundColor: activeStep === 2 ? 'rgba(255, 97, 84, 0.04)' : '#F8FAFC',
                border: activeStep === 2 ? '1.5px solid var(--color-coral)' : '1px solid var(--color-border)',
                transition: 'all 0.2s ease'
              }}
            >
              <div className="flex items-start gap-3">
                <span 
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: activeStep === 2 ? 'var(--color-coral)' : '#64748B',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  2
                </span>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-primary)', margin: '0 0 4px 0' }}>
                    Créez votre clé en 1 clic
                  </h3>
                  <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', margin: 0, lineHeight: '1.45' }}>
                    Sur la page qui s'ouvre, cliquez sur le bouton bleu <strong>"Create API key"</strong>, puis sélectionnez <em>"Create key in new project"</em>. Copiez ensuite la clé générée (commence par <code>AIzaSy...</code>).
                  </p>
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span 
                      style={{ 
                        fontSize: '11px', 
                        fontWeight: '700', 
                        padding: '2px 8px', 
                        borderRadius: '6px', 
                        backgroundColor: '#DCFCE7', 
                        color: '#15803D' 
                      }}
                    >
                      ✓ 100% Gratuit
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>Aucune carte bancaire requise</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ÉTAPE 3 */}
            <div 
              style={{
                padding: '16px',
                borderRadius: '14px',
                backgroundColor: activeStep === 3 ? 'rgba(255, 97, 84, 0.04)' : '#F8FAFC',
                border: activeStep === 3 ? '1.5px solid var(--color-coral)' : '1px solid var(--color-border)',
                transition: 'all 0.2s ease'
              }}
            >
              <div className="flex items-start gap-3">
                <span 
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: activeStep === 3 ? 'var(--color-coral)' : '#64748B',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  3
                </span>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-primary)', margin: '0 0 8px 0' }}>
                    Collez et activez votre clé ci-dessous
                  </h3>
                  
                  {/* Key input group */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                      <input 
                        type="password"
                        value={apiKey}
                        onChange={(e) => {
                          setApiKey(e.target.value)
                          setActiveStep(3)
                        }}
                        placeholder="Collez votre clé API (ex: AIzaSy...)"
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          fontSize: '13px',
                          borderRadius: 'var(--radius-sm)',
                          border: '1.5px solid var(--color-border)',
                          outline: 'none',
                          backgroundColor: '#FFFFFF',
                          fontFamily: 'monospace',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleTestAndSave}
                      disabled={isTesting || !apiKey.trim()}
                      className="btn-primary"
                      style={{
                        padding: '10px 18px',
                        fontSize: '13px',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        opacity: (isTesting || !apiKey.trim()) ? 0.6 : 1,
                        cursor: (isTesting || !apiKey.trim()) ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {isTesting ? (
                        <>
                          <div style={{ width: '14px', height: '14px', border: '2px solid #FFF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }}></div>
                          <span>Test en cours...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={16} />
                          <span>Tester & Activer</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Test Result Message */}
                  {testResult && (
                    <div 
                      style={{
                        marginTop: '10px',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        backgroundColor: testResult.success ? '#F0FDF4' : '#FEF2F2',
                        border: `1px solid ${testResult.success ? '#86EFAC' : '#FCA5A5'}`,
                        color: testResult.success ? '#166534' : '#991B1B',
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      {testResult.success ? <CheckCircle2 size={16} color="#16A34A" /> : <AlertCircle size={16} color="#DC2626" />}
                      <span>{testResult.message}</span>
                    </div>
                  )}

                  {/* Remove key option if exists */}
                  {localStorage.getItem('douzcv_gemini_api_key') && (
                    <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={handleRemoveKey}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#DC2626',
                          fontSize: '11.5px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        <Trash2 size={13} />
                        <span>Supprimer la clé enregistrée</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Guarantee / Security Notice */}
          <div 
            style={{ 
              backgroundColor: '#F8FAFC', 
              padding: '12px 14px', 
              borderRadius: '10px', 
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <ShieldCheck size={18} color="#059669" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '11.5px', color: '#475569', lineHeight: '1.4' }}>
              <strong>Confidentialité garantie :</strong> Votre clé API reste 100% privée et stockée uniquement dans votre navigateur local. Aucune donnée n'est envoyée à des serveurs tiers.
            </span>
          </div>
        </div>

        {/* Footer Buttons */}
        <div 
          style={{ 
            padding: '14px 24px', 
            backgroundColor: '#F8FAFC', 
            borderTop: '1px solid var(--color-border)', 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <button
            type="button"
            onClick={copyStudioUrl}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-coral)',
              fontSize: '12px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            {copiedLink ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedLink ? 'Lien copié !' : 'Copier lien Google AI Studio'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="btn-primary"
            style={{ padding: '8px 20px', fontSize: '13px' }}
          >
            Terminer
          </button>
        </div>
      </div>
    </div>
  )
}
