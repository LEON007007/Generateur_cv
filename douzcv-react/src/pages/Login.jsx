import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCVStore } from '../store'
import { ArrowRight } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const guestUser = useCVStore((state) => state.guestUser)
  const setGuestUser = useCVStore((state) => state.setGuestUser)

  const [name, setName] = useState(guestUser?.name || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    const activeName = name.trim()

    setGuestUser({
      name: activeName,
      title: '',
      email: '',
      avatar: ''
    })

    // Persist in localStorage
    localStorage.setItem('douzcv_guest_name', activeName)
    localStorage.setItem('douzcv_guest_title', '')

    // Redirect to templates gallery
    navigate('/modeles')
  }

  return (
    <div className="login-standalone-page">
      {/* Main Dual-Panel Card */}
      <div className="login-card-container">
        
        {/* ── LEFT PANEL: GRADIENT MESH & QUOTE ──────────────────────────────── */}
        <div className="login-left-panel">
          <div className="login-mesh-bg"></div>
          <div className="login-art-overlay"></div>

          <div className="login-quote-container">
            <h2 className="login-quote-text">
              Votre parcours mérite un CV à la hauteur.
            </h2>
          </div>
        </div>

        {/* ── RIGHT PANEL: GUEST NAME LOGIN FORM ─────────────────────────── */}
        <div className="login-right-panel">
          
          {/* Header with DouzCv Logo */}
          <div className="login-right-header">
            <Link to="/page_accueil/index.html" className="login-brand-logo">
              douz<span style={{ color: 'var(--color-coral)' }}>Cv</span>
            </Link>
          </div>

          {/* Main Form Center Content */}
          <div className="login-form-center">
            <h1 className="login-main-title">
              Bienvenue.
            </h1>
            <p className="login-main-subtitle">
              Renseignez votre nom pour commencer.
            </p>

            <form onSubmit={handleSubmit} className="login-form-fields">
              <div className="input-group">
                <label htmlFor="user-name-input" className="login-input-label">
                  Votre nom complet
                </label>
                <input
                  id="user-name-input"
                  type="text"
                  placeholder="Ex: Leon Atangana"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="login-input"
                  autoFocus
                  required
                />
              </div>

              <button 
                type="submit" 
                className="login-submit-btn"
              >
                <span>Commencer</span>
                <div className="login-submit-icon">
                  <ArrowRight size={16} />
                </div>
              </button>
              
              <p className="login-security-note">
                Données 100% locales, rien n'est envoyé.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
