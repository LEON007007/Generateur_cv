import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCVStore } from '../store'
import { ChevronLeft, ChevronRight, ChevronDown, ArrowRight } from 'lucide-react'

// Social SVG Icons matching the mockup
const FacebookIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const TwitterIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z"/>
  </svg>
)

const LinkedinIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.778-.773 1.778-1.729V1.73C24 .774 23.205 0 22.225 0z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

export default function Login() {
  const navigate = useNavigate()
  const guestUser = useCVStore((state) => state.guestUser)
  const setGuestUser = useCVStore((state) => state.setGuestUser)

  const [name, setName] = useState(guestUser?.name || '')
  const [lang, setLang] = useState('FR')

  const handleSubmit = (e) => {
    e.preventDefault()
    const activeName = name.trim() || 'Leon Atangana'

    setGuestUser({
      name: activeName,
      title: 'Web Designer',
      email: '',
      avatar: '/images/avatar-user.jpg'
    })

    // Persist in localStorage
    localStorage.setItem('douzcv_guest_name', activeName)
    localStorage.setItem('douzcv_guest_title', 'Web Designer')

    // Redirect to templates gallery
    navigate('/modeles')
  }

  return (
    <div className="login-standalone-page">
      {/* Outer ambient glow */}
      <div className="login-ambient-glow"></div>

      {/* Main Dual-Panel Card */}
      <div className="login-card-container">
        
        {/* ── LEFT PANEL: ARTWORK SHOWCASE ──────────────────────────────── */}
        <div className="login-left-panel">
          <img 
            src="/images/login-artwork.jpg" 
            alt="Showcase CV Comparatif" 
            className="login-bg-img"
          />
          <div className="login-art-overlay"></div>

          {/* Top Bar on Artwork */}
          <div className="login-art-top">
            <span className="selected-works-tag">Selected Works</span>
            <div className="art-top-actions">
              <a href="/page_accueil/index.html" className="art-link-btn">
                Accueil
              </a>
              <button 
                type="button" 
                className="art-pill-btn"
                onClick={() => setName('Leon Atangana')}
              >
                Join Us
              </button>
            </div>
          </div>

          {/* Bottom Bar on Artwork: Fixed Avatar + Leon Atangana + Web Designer */}
          <div className="login-art-bottom">
            <div className="art-user-pill">
              <img 
                src="/images/avatar-user.jpg" 
                alt="Leon Atangana" 
                className="art-user-avatar"
              />
              <div className="art-user-info">
                <span className="art-user-name">Leon Atangana</span>
                <span className="art-user-role">Web Designer</span>
              </div>
            </div>

            <div className="art-carousel-controls">
              <button 
                type="button" 
                className="art-arrow-btn" 
                aria-label="Previous"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                type="button" 
                className="art-arrow-btn" 
                aria-label="Next"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL: GUEST NAME LOGIN FORM ─────────────────────────── */}
        <div className="login-right-panel">
          
          {/* Header with DouzCv Logo and Language Selector */}
          <div className="login-right-header">
            <Link to="/page_accueil/index.html" className="login-brand-logo">
              douz<span style={{ color: 'var(--color-coral)' }}>Cv</span>
            </Link>
            <div className="login-lang-selector" onClick={() => setLang(lang === 'FR' ? 'EN' : 'FR')}>
              <span>{lang === 'FR' ? '🇫🇷 FR' : '🇬🇧 EN'}</span>
              <ChevronDown size={14} />
            </div>
          </div>

          {/* Main Form Center Content */}
          <div className="login-form-center">
            <h1 className="login-main-title">
              Salut !
            </h1>
            <p className="login-main-subtitle">
              C'est une version Beta, renseignez juste votre nom.
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
                style={{ marginTop: '12px' }}
              >
                <span>Créer mon CV</span>
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="login-beta-note">
              <span>🔒 Session 100% Locale • Vos données restent sur votre appareil</span>
            </div>
          </div>

          {/* Social Icons at the Bottom */}
          <div className="login-social-footer">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook"><FacebookIcon /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Twitter"><TwitterIcon /></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn"><LinkedinIcon /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram"><InstagramIcon /></a>
          </div>

        </div>

      </div>
    </div>
  )
}
