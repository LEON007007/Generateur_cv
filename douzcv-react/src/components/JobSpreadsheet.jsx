import React, { useState, useEffect, useMemo, useRef } from 'react'
import {
  Search,
  Download,
  Upload,
  Plus,
  Check,
  Sparkles,
  ExternalLink,
  MapPin,
  Calendar,
  Building,
  RotateCcw,
  FileSpreadsheet,
  AlertCircle,
  Loader2,
  ChevronUp,
  ChevronDown,
  Info
} from 'lucide-react'
import { fetchJobOffers, exportJobsToCSV, parseJobsFromFileContent } from '../services/jobSearchService'

const CAMEROON_CITIES = [
  { id: 'all', label: 'Toutes les localisations' },
  { id: 'Douala', label: 'Douala' },
  { id: 'Yaoundé', label: 'Yaoundé' },
  { id: 'Bafoussam', label: 'Bafoussam' },
  { id: 'Garoua', label: 'Garoua' },
  { id: 'Kribi', label: 'Kribi' },
  { id: 'Limbe', label: 'Limbé / Buea' },
  { id: 'Remote', label: 'Télétravail / Remote' }
]

export default function JobSpreadsheet({
  onAddApplication,
  onAnalyzeOffer,
  existingApplications = [],
  analyzingId = ''
}) {
  const [query, setQuery] = useState('')
  const [city, setCity] = useState('all')
  const [days, setDays] = useState(30)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [sortField, setSortField] = useState('publishedAt')
  const [sortAsc, setSortAsc] = useState(false)
  const [localSearch, setLocalSearch] = useState('')
  const fileInputRef = useRef(null)

  // IDs déjà présents dans les candidatures suivies
  const trackedUrls = useMemo(() => {
    return new Set(existingApplications.map((app) => app.url).filter(Boolean))
  }, [existingApplications])

  const trackedTitles = useMemo(() => {
    return new Set(existingApplications.map((app) => (app.title || '').trim().toLowerCase()))
  }, [existingApplications])

  const handleSearch = async (overrideParams = {}) => {
    setLoading(true)
    setError('')
    try {
      const q = overrideParams.query !== undefined ? overrideParams.query : query
      const c = overrideParams.city !== undefined ? overrideParams.city : city
      const d = overrideParams.days !== undefined ? overrideParams.days : days

      const data = await fetchJobOffers({
        query: q,
        city: c,
        days: d
      })
      setJobs(data)
      setSelectedIds(new Set())
    } catch (err) {
      console.error(err)
      setError(err.message || 'Impossible de charger les offres. Vérifiez votre connexion.')
    } finally {
      setLoading(false)
    }
  }

  // Lancement de la recherche initiale par défaut
  useEffect(() => {
    handleSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Tri et filtrage local
  const processedJobs = useMemo(() => {
    let list = [...jobs]

    if (localSearch.trim()) {
      const term = localSearch.trim().toLowerCase()
      list = list.filter((job) =>
        (job.title || '').toLowerCase().includes(term) ||
        (job.company || '').toLowerCase().includes(term) ||
        (job.city || '').toLowerCase().includes(term) ||
        (job.description || '').toLowerCase().includes(term)
      )
    }

    list.sort((a, b) => {
      let aVal = a[sortField] || ''
      let bVal = b[sortField] || ''
      if (sortField === 'publishedAt') {
        aVal = new Date(aVal).getTime() || 0
        bVal = new Date(bVal).getTime() || 0
      } else {
        aVal = String(aVal).toLowerCase()
        bVal = String(bVal).toLowerCase()
      }

      if (aVal < bVal) return sortAsc ? -1 : 1
      if (aVal > bVal) return sortAsc ? 1 : -1
      return 0
    })

    return list
  }, [jobs, localSearch, sortField, sortAsc])

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(false)
    }
  }

  const toggleSelect = (id) => {
    const updated = new Set(selectedIds)
    if (updated.has(id)) {
      updated.delete(id)
    } else {
      updated.add(id)
    }
    setSelectedIds(updated)
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === processedJobs.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(processedJobs.map((j) => j.id)))
    }
  }

  const handleAddSingle = (job) => {
    onAddApplication({
      title: job.title,
      company: job.company,
      city: job.city,
      url: job.url,
      publishedAt: job.publishedAt,
      description: job.description
    })
  }

  const handleAddBatch = () => {
    const toAdd = processedJobs.filter((j) => selectedIds.has(j.id))
    for (const job of toAdd) {
      onAddApplication({
        title: job.title,
        company: job.company,
        city: job.city,
        url: job.url,
        publishedAt: job.publishedAt,
        description: job.description
      })
    }
    setSelectedIds(new Set())
  }

  const handleExportCSV = () => {
    const toExport = selectedIds.size > 0
      ? processedJobs.filter((j) => selectedIds.has(j.id))
      : processedJobs
    exportJobsToCSV(toExport, `offres_cameroun_${days}j.csv`)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target?.result
        if (typeof text === 'string') {
          const imported = parseJobsFromFileContent(text, file.name.endsWith('.json') ? 'json' : 'csv')
          if (imported.length > 0) {
            setJobs((prev) => [...imported, ...prev])
            setHasSearched(true)
          } else {
            setError('Aucune offre exploitable trouvée dans le fichier.')
          }
        }
      } catch (err) {
        setError(err.message || 'Erreur lors du traitement du fichier.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const isTracked = (job) => {
    if (job.url && trackedUrls.has(job.url)) return true
    if (job.title && trackedTitles.has(job.title.trim().toLowerCase())) return true
    return false
  }

  return (
    <section className="job-spreadsheet-container" aria-label="Tableur des offres d'emploi">
      {/* 1. Barre de Recherche et Filtres Globaux */}
      <div className="job-search-panel">
        <div className="job-search-form">
          <div className="job-search-input-wrap">
            <Search className="job-search-icon" size={17} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Poste, compétence (ex: Commercial, Comptable, Développeur...)"
              className="job-search-input"
            />
          </div>

          <div className="job-search-select-group">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="job-search-select"
              aria-label="Filtrer par ville"
            >
              {CAMEROON_CITIES.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>

            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="job-search-select"
              aria-label="Filtrer par période"
            >
              <option value={7}>7 derniers jours</option>
              <option value={14}>14 derniers jours</option>
              <option value={30}>30 derniers jours</option>
            </select>

            <button
              type="button"
              onClick={() => handleSearch()}
              disabled={loading}
              className="job-search-submit-btn"
            >
              {loading ? <Loader2 size={16} className="spin-animate" /> : <Search size={16} />}
              <span>{loading ? 'Recherche…' : 'Rechercher'}</span>
            </button>
          </div>
        </div>

        {/* 2. Actions secondaires du Tableur (Export CSV, Import) */}
        <div className="job-spreadsheet-actions-bar">
          <div className="job-spreadsheet-stats">
            <FileSpreadsheet size={16} className="text-coral" />
            <span>
              <strong>{processedJobs.length}</strong> offre{processedJobs.length > 1 ? 's' : ''} répertoriée{processedJobs.length > 1 ? 's' : ''} (des {days} derniers jours)
            </span>
          </div>

          <div className="job-spreadsheet-btns">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv,.json"
              style={{ display: 'none' }}
            />
            <button
              type="button"
              className="job-action-btn secondary"
              onClick={() => fileInputRef.current?.click()}
              title="Importer un fichier CSV ou JSON généré par un script Python ou externe"
            >
              <Upload size={14} />
              <span>Importer CSV</span>
            </button>

            <button
              type="button"
              className="job-action-btn primary"
              onClick={handleExportCSV}
              disabled={processedJobs.length === 0}
              title="Télécharger les offres sous forme de tableur Excel/CSV"
            >
              <Download size={14} />
              <span>Exporter CSV ({selectedIds.size > 0 ? selectedIds.size : 'Tout'})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Message d'erreur s'il y a lieu */}
      {error && (
        <div className="job-spreadsheet-alert" role="alert">
          <AlertCircle size={16} />
          <span>{error}</span>
          <button type="button" onClick={() => handleSearch()} className="job-alert-retry">
            <RotateCcw size={13} /> Réessayer
          </button>
        </div>
      )}

      {/* 3. Barre de sélection multiple & filtre rapide local */}
      {processedJobs.length > 0 && (
        <div className="job-table-toolbar">
          <div className="job-table-selection-info">
            <input
              type="checkbox"
              id="select-all-jobs"
              checked={selectedIds.size === processedJobs.length && processedJobs.length > 0}
              onChange={toggleSelectAll}
              className="job-checkbox"
            />
            <label htmlFor="select-all-jobs">
              {selectedIds.size > 0
                ? `${selectedIds.size} sélectionnée(s)`
                : 'Sélectionner tout le tableur'}
            </label>

            {selectedIds.size > 0 && (
              <button
                type="button"
                onClick={handleAddBatch}
                className="job-batch-add-btn"
              >
                <Plus size={14} />
                Ajouter la sélection à mon suivi Kanban
              </button>
            )}
          </div>

          <div className="job-table-quick-filter">
            <input
              type="text"
              placeholder="Filtrer dans ce tableau…"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="job-quick-filter-input"
            />
          </div>
        </div>
      )}

      {/* 4. Le Tableur (Data Grid interactif) */}
      <div className="job-spreadsheet-wrapper">
        <table className="job-spreadsheet-table">
          <thead>
            <tr>
              <th className="th-select" style={{ width: '40px' }}>
                <span className="sr-only">Sélection</span>
              </th>
              <th className="th-sortable" onClick={() => handleSort('publishedAt')} style={{ width: '115px' }}>
                <div className="th-inner">
                  <Calendar size={13} />
                  <span>Date</span>
                  {sortField === 'publishedAt' && (sortAsc ? <ChevronUp size={13} /> : <ChevronDown size={13} />)}
                </div>
              </th>
              <th className="th-sortable" onClick={() => handleSort('title')}>
                <div className="th-inner">
                  <span>Intitulé du poste</span>
                  {sortField === 'title' && (sortAsc ? <ChevronUp size={13} /> : <ChevronDown size={13} />)}
                </div>
              </th>
              <th className="th-sortable" onClick={() => handleSort('company')}>
                <div className="th-inner">
                  <Building size={13} />
                  <span>Entreprise</span>
                  {sortField === 'company' && (sortAsc ? <ChevronUp size={13} /> : <ChevronDown size={13} />)}
                </div>
              </th>
              <th className="th-sortable" onClick={() => handleSort('city')} style={{ width: '130px' }}>
                <div className="th-inner">
                  <MapPin size={13} />
                  <span>Ville</span>
                  {sortField === 'city' && (sortAsc ? <ChevronUp size={13} /> : <ChevronDown size={13} />)}
                </div>
              </th>
              <th style={{ width: '90px' }}>Contrat</th>
              <th style={{ width: '120px' }}>Source</th>
              <th className="th-actions" style={{ width: '220px' }}>Actions rapides</th>
            </tr>
          </thead>
          <tbody>
            {loading && jobs.length === 0 ? (
              <tr>
                <td colSpan={8} className="job-table-loading-cell">
                  <div className="job-table-loading-wrap">
                    <Loader2 size={24} className="spin-animate text-coral" />
                    <p>Scraping et agrégation des offres des 30 derniers jours…</p>
                  </div>
                </td>
              </tr>
            ) : processedJobs.length === 0 ? (
              <tr>
                <td colSpan={8} className="job-table-empty-cell">
                  <Info size={28} className="text-muted" />
                  <h3>Aucune offre ne correspond à ces critères</h3>
                  <p>Essayez avec d'autres mots-clés ou sélectionnez « Toutes les localisations ».</p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('')
                      setCity('all')
                      setDays(30)
                      handleSearch({ query: '', city: 'all', days: 30 })
                    }}
                    className="job-reset-btn"
                  >
                    Réinitialiser la recherche
                  </button>
                </td>
              </tr>
            ) : (
              processedJobs.map((job) => {
                const isSelected = selectedIds.has(job.id)
                const tracked = isTracked(job)
                const isBeingAnalyzed = analyzingId === job.id

                return (
                  <tr
                    key={job.id}
                    className={`job-table-row${isSelected ? ' is-selected' : ''}${tracked ? ' is-tracked' : ''}`}
                  >
                    {/* Checkbox */}
                    <td className="td-checkbox">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(job.id)}
                        className="job-checkbox"
                        aria-label={`Sélectionner ${job.title}`}
                      />
                    </td>

                    {/* Date */}
                    <td className="td-date">
                      <div className="job-date-pill">
                        <span className="job-date-main">
                          {new Date(job.publishedAt).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: 'short'
                          })}
                        </span>
                        {job.daysAgo != null && (
                          <span className="job-days-ago">
                            {job.daysAgo === 0 ? "Aujourd'hui" : `Il y a ${job.daysAgo}j`}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Titre */}
                    <td className="td-title">
                      <div className="job-title-cell">
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noreferrer"
                          className="job-title-link"
                          title="Ouvrir l'offre source"
                        >
                          <strong>{job.title}</strong>
                          <ExternalLink size={12} className="job-link-icon" />
                        </a>
                        {job.description && (
                          <p className="job-desc-snippet" title={job.description}>
                            {job.description.slice(0, 110)}...
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Entreprise */}
                    <td className="td-company">
                      <span className="job-company-badge">
                        {job.company || 'Entreprise'}
                      </span>
                    </td>

                    {/* Ville */}
                    <td className="td-city">
                      <span className="job-city-tag">
                        <MapPin size={11} />
                        {job.city || 'Cameroun'}
                      </span>
                    </td>

                    {/* Contrat */}
                    <td className="td-contract">
                      <span className={`contract-badge ${job.contractType?.toLowerCase() || 'cdi'}`}>
                        {job.contractType || 'CDI'}
                      </span>
                    </td>

                    {/* Source */}
                    <td className="td-source">
                      <span className="job-source-tag">
                        {job.source || 'Portail'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="td-actions">
                      <div className="job-row-actions">
                        {tracked ? (
                          <span className="job-tracked-indicator" title="Déjà présente dans vos candidatures">
                            <Check size={13} /> Suivie
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAddSingle(job)}
                            className="job-row-add-btn"
                            title="Ajouter au tableau Kanban de suivi"
                          >
                            <Plus size={13} />
                            <span>Suivre</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => onAnalyzeOffer(job)}
                          disabled={isBeingAnalyzed}
                          className="job-row-ai-btn"
                          title="Lancer l'analyse de compatibilité IA avec votre CV actuel"
                        >
                          <Sparkles size={13} />
                          <span>{isBeingAnalyzed ? 'Calcul…' : 'Évaluer IA'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
