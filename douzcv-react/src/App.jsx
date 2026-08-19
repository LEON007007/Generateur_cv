import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { HelpCircle, User, ArrowLeft } from 'lucide-react'
import { useCVStore } from './store'

import Templates from './pages/Templates'
import Editor from './pages/Editor'
import Export from './pages/Export'
import Login from './pages/Login'

const Navigation = () => {
  const location = useLocation()
  const selectedTemplate = useCVStore((state) => state.selectedTemplate)
  const isActive = (path) => location.pathname === path

  return (
    <nav className="header-nav">
      {/* 1. Bouton Retour à la Page d'accueil HTML/CSS/JS */}
      <a 
        href="/page_accueil/index.html"
        className="header-nav-link"
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
        to="/"
        className="header-nav-link"
        style={{ 
          color: (isActive('/') || isActive('/modeles') || isActive('/templates')) ? 'var(--color-coral)' : 'var(--color-text-main)',
          borderBottom: (isActive('/') || isActive('/modeles') || isActive('/templates')) ? '2px solid var(--color-coral)' : '2px solid transparent'
        }}
      >
        Modèles
      </Link>

      {/* 3. Éditeur (appears when a template is selected) */}
      {selectedTemplate && (
        <Link 
          to="/editeur" 
          className="header-nav-link"
          style={{ 
            color: isActive('/editeur') ? 'var(--color-coral)' : 'var(--color-text-main)',
            borderBottom: isActive('/editeur') ? '2px solid var(--color-coral)' : '2px solid transparent'
          }}
        >
          Éditeur
        </Link>
      )}
    </nav>
  )
}

const Header = () => {
  const guestUser = useCVStore((state) => state.guestUser)
  const userName = guestUser?.name || 'Invité'

  return (
    <header className="app-header">
      <div className="header-left">
        {/* Logo links back to HTML/CSS/JS Landing page */}
        <a href="/page_accueil/index.html" className="header-logo" title="Retourner à l'accueil">
          douz<span style={{ color: 'var(--color-coral)' }}>Cv</span>
        </a>
        <Navigation />
      </div>
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
          <Route path="/templates" element={<Templates />} />
          <Route path="/editeur" element={<Editor />} />
          <Route path="/exporter" element={<Export />} />
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
