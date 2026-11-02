import React, { useEffect, useRef, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { HelpCircle, User, ArrowLeft, Menu, X, LayoutGrid, PencilLine, FileText, BriefcaseBusiness } from 'lucide-react'
import { useCVStore } from './store'
import './mobile-navigation.css'

import Templates from './pages/Templates'
import Editor from './pages/Editor'
import Export from './pages/Export'
import CoverLetter from './pages/CoverLetter'
import Login from './pages/Login'
import Applications from './pages/Applications'

const Navigation = () => {
  const location = useLocation()
  const selectedTemplate = useCVStore((state) => state.selectedTemplate)
  const isActive = (path) => location.pathname === path

  return (
    <nav className="header-nav">
      {/* 1. Bouton Retour à la Page d'accueil HTML/CSS/JS */}
      <a 
        href="/page_accueil/index.html"
          className="header-nav-link header-home-link"
        style={{ 
          color: 'var(--color-text-main)', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '5px',
          fontWeight: '600'
        }}
        title="Retourner à la page d'accueil"
      >
        <ArrowLeft size={14} color="var(--color-coral)" />
        <span>Accueil</span>
      </a>

      {/* 2. Modèles */}
      <Link 
        to="/modeles"
        className={`header-nav-link${(isActive('/') || isActive('/modeles') || isActive('/templates')) ? ' is-active' : ''}`}
        aria-current={(isActive('/') || isActive('/modeles') || isActive('/templates')) ? 'page' : undefined}
      >
        Modèles
      </Link>
      <Link
        to="/candidatures"
        className={`header-nav-link${isActive('/candidatures') ? ' is-active' : ''}`}
        aria-current={isActive('/candidatures') ? 'page' : undefined}
      >
        Mes candidatures
      </Link>

      {/* 3. Éditeur (appears when a template is selected) */}
      {selectedTemplate && (
        <>
          <Link 
            to="/editeur" 
            className={`header-nav-link${isActive('/editeur') ? ' is-active' : ''}`}
            aria-current={isActive('/editeur') ? 'page' : undefined}
          >
            Éditeur
          </Link>
          <Link 
            to="/lettre-motivation" 
            className={`header-nav-link${isActive('/lettre-motivation') ? ' is-active' : ''}`}
            aria-current={isActive('/lettre-motivation') ? 'page' : undefined}
          >
            Lettre
          </Link>
        </>
      )}
    </nav>
  )
}

const Header = () => {
  const guestUser = useCVStore((state) => state.guestUser)
  const userName = guestUser?.name || 'Invité'
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const headerRef = useRef(null)
  const mobileMenuToggleRef = useRef(null)
  const mobileMenuPanelRef = useRef(null)
  const isActive = (path) => location.pathname === path

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined
    mobileMenuPanelRef.current?.querySelector('a')?.focus()

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
        mobileMenuToggleRef.current?.focus()
      }
    }
    const closeOnOutsideClick = (event) => {
      if (!headerRef.current?.contains(event.target)) setIsMobileMenuOpen(false)
    }

    document.addEventListener('keydown', closeOnEscape)
    document.addEventListener('pointerdown', closeOnOutsideClick)
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.removeEventListener('pointerdown', closeOnOutsideClick)
    }
  }, [isMobileMenuOpen])

  return (
    <header className="app-header" ref={headerRef}>
      <div className="header-left">
        {/* Logo links back to HTML/CSS/JS Landing page */}
        <a href="/page_accueil/index.html" className="header-logo" title="Retourner à l'accueil">
          <img src="/douzcv-logo.svg" alt="douzCv, accueil" />
        </a>
        <Navigation />
        <button
          type="button"
          ref={mobileMenuToggleRef}
          className="mobile-nav-toggle"
          aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-app-menu"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {isMobileMenuOpen && (
        <nav className="mobile-app-menu" id="mobile-app-menu" ref={mobileMenuPanelRef} aria-label="Navigation principale mobile">
          <Link to="/modeles" onClick={() => setIsMobileMenuOpen(false)} className={isActive('/modeles') || isActive('/templates') ? 'is-active' : ''}>
            <LayoutGrid size={18} aria-hidden="true" />
            <span>Modèles</span>
          </Link>
          <Link to="/candidatures" onClick={() => setIsMobileMenuOpen(false)} className={isActive('/candidatures') ? 'is-active' : ''}>
            <BriefcaseBusiness size={18} aria-hidden="true" />
            <span>Mes candidatures</span>
          </Link>
          <Link to="/editeur" onClick={() => setIsMobileMenuOpen(false)} className={isActive('/editeur') ? 'is-active' : ''}>
            <PencilLine size={18} aria-hidden="true" />
            <span>Éditeur</span>
          </Link>
          <Link to="/lettre-motivation" onClick={() => setIsMobileMenuOpen(false)} className={isActive('/lettre-motivation') ? 'is-active' : ''}>
            <FileText size={18} aria-hidden="true" />
            <span>Lettre de motivation</span>
          </Link>
        </nav>
      )}
      <div className="flex items-center gap-2 sm:gap-3">
        <button 
          title="Aide"
          style={{ color: 'var(--color-text-main)', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center' }}
        >
          <HelpCircle size={20} />
        </button>

        {/* User Guest Account Badge with Name */}
        <Link 
          to="/connexion"
          className="user-account-badge"
          title="Gérer mon profil / Session Invité"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 12px 4px 5px',
            borderRadius: '999px',
            background: 'rgba(27, 48, 65, 0.05)',
            border: '1px solid rgba(27, 48, 65, 0.12)',
            color: 'var(--color-text-main)',
            fontSize: '13px',
            fontWeight: '700',
            textDecoration: 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            background: 'var(--color-coral)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            {guestUser?.avatar ? (
              <img src={guestUser.avatar} alt={userName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <User size={15} />
            )}
          </div>
          <span style={{ maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {userName}
          </span>
        </Link>
      </div>
    </header>
  )
}

const HomeRedirect = () => {
  React.useEffect(() => {
    window.location.replace('/page_accueil/index.html')
  }, [])
  return null
}

const AppContent = () => {
  const location = useLocation()
  const isAuthPage = ['/connexion', '/login'].includes(location.pathname)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {!isAuthPage && <Header />}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/accueil" element={<HomeRedirect />} />
          <Route path="/modeles" element={<Templates />} />
          <Route path="/candidatures" element={<Applications />} />
          <Route path="/candidatures" element={<Applications />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/editeur" element={<Editor />} />
          <Route path="/exporter" element={<Export />} />
          <Route path="/lettre-motivation" element={<CoverLetter />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}
