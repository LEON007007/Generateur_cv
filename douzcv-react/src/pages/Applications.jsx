import React, { useMemo, useState } from 'react'
import { useCVStore } from '../store'
import { analyzeJobMatch, buildCandidateProfile } from '../services/applicationService'
import { ArrowDownRight, ArrowUpRight, BriefcaseBusiness, ExternalLink, FilePlus2, MapPin, Plus, Search, Sparkles, X } from 'lucide-react'

const STATUSES = [
  { id: 'interested', label: 'À suivre', accent: '#34495c' },
  { id: 'applied', label: 'Candidature envoyée', accent: '#0e8fb3' },
  { id: 'interview', label: 'Entretien', accent: '#087da8' },
  { id: 'offer', label: 'Offre reçue', accent: '#0755a4' },
  { id: 'rejected', label: 'Sans suite', accent: '#8b5963' }
]

const CAMEROON_JOB_SOURCES = [
  { name: 'Emploi.cm', url: 'https://www.emploi.cm/' },
  { name: 'JobInfoCamer', url: 'https://www.jobinfocamer.com/' },
  { name: 'Njorku', url: 'https://www.njorku.com/' },
  { name: 'Careerjet Cameroun', url: 'https://www.careerjet.cm/' },
  { name: 'LinkedIn Cameroun', url: 'https://www.linkedin.com/jobs/search/?location=Cameroon' },
  { name: 'Africawork', url: 'https://www.africawork.com/' },
  { name: 'Optioncarriere', url: 'https://www.optioncarriere.cm/' },
  { name: 'Google Jobs', url: 'https://www.google.com/search?q=emploi+Cameroun' }
]

const daysAgo = (date) => Math.floor((Date.now() - new Date(date).getTime()) / 86400000)

function ApplicationCard({ application, onMove, onAnalyze, onReview, onRemove, analyzing }) {
  const currentIndex = STATUSES.findIndex((status) => status.id === application.status)
  const nextStatus = STATUSES[currentIndex + 1]
  const previousStatus = STATUSES[currentIndex - 1]
  const match = application.analysis?.score

  return (
    <article className="application-card">
      <div className="application-card-main">
        <div className="application-card-title-row">
          <span className="application-company-mark" aria-hidden="true">{(application.company || application.title || 'O').slice(0, 1).toUpperCase()}</span>
          <div className="application-card-heading">
            <h3>{application.title}</h3>
            <p>{application.company || 'Entreprise à préciser'}</p>
          </div>
        </div>
        <div className="application-card-meta">
          {application.city && <span><MapPin size={13} aria-hidden="true" />{application.city}</span>}
          {application.publishedAt && <span>Publiée le {new Date(application.publishedAt).toLocaleDateString('fr-FR')}</span>}
        </div>
        {match != null && (
          <div className={`application-match application-match-${match >= 70 ? 'high' : match >= 45 ? 'medium' : 'low'}`}>
            <span>{match}/100</span><span>{application.analysis.summary}</span>
            <button type="button" className="application-review-link" onClick={() => onReview(application.id)}>Voir l’analyse</button>
          </div>
        )}
      </div>
      <div className="application-card-actions">
        {application.url && <a className="application-source-link" href={application.url} target="_blank" rel="noreferrer"><ExternalLink size={13} />Offre</a>}
        <button type="button" className="application-analyze-button" disabled={analyzing} onClick={() => onAnalyze(application)}>
          <Sparkles size={14} />{analyzing ? 'Analyse…' : match == null ? 'Comparer au CV' : 'Relancer l’analyse'}
        </button>
        <div className="application-move-actions">
          {previousStatus && <button type="button" aria-label={`Déplacer vers ${previousStatus.label}`} title={`Déplacer vers ${previousStatus.label}`} onClick={() => onMove(application.id, previousStatus.id)}><ArrowUpRight size={14} /></button>}
          {nextStatus && <button type="button" className="application-next-button" onClick={() => onMove(application.id, nextStatus.id)}>{nextStatus.label} <ArrowDownRight size={14} /></button>}
          <button type="button" className="application-delete-button" onClick={() => onRemove(application.id)}>Retirer</button>
        </div>
      </div>
    </article>
  )
}

export default function Applications() {
  const { applications, addApplication, updateApplication, removeApplication, personalInfo, experiences, education, skills, languages, applyJobSuggestions } = useCVStore()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSourcesOpen, setIsSourcesOpen] = useState(false)
  const [rangeDays, setRangeDays] = useState(30)
  const [search, setSearch] = useState('')
  const [analyzingId, setAnalyzingId] = useState('')
  const [error, setError] = useState('')
  const [reviewingApplicationId, setReviewingApplicationId] = useState('')
  const [form, setForm] = useState({ title: '', company: '', city: '', url: '', publishedAt: new Date().toISOString().slice(0, 10), description: '' })

  const filteredApplications = useMemo(() => applications.filter((application) => {
    const withinRange = rangeDays === 'all' || !application.publishedAt || daysAgo(application.publishedAt) <= Number(rangeDays)
    const query = search.trim().toLocaleLowerCase('fr')
    const matchesSearch = !query || `${application.title} ${application.company} ${application.city}`.toLocaleLowerCase('fr').includes(query)
    return withinRange && matchesSearch
  }), [applications, rangeDays, search])

  const handleCreate = (event) => {
    event.preventDefault()
    setError('')
    if (!form.title.trim() || !form.description.trim()) {
      setError('Renseignez au minimum le titre et le texte de l’offre.')
      return
    }
    if (form.url && !/^https?:\/\//i.test(form.url)) {
      setError('Le lien doit commencer par http:// ou https://.')
      return
    }
    addApplication({ ...form, title: form.title.trim(), company: form.company.trim(), city: form.city.trim() || 'Cameroun' })
    setForm({ title: '', company: '', city: '', url: '', publishedAt: new Date().toISOString().slice(0, 10), description: '' })
    setIsFormOpen(false)
  }

  const handleAnalyze = async (application) => {
    setAnalyzingId(application.id)
    setError('')
    try {
      const analysis = await analyzeJobMatch({ application, profile: buildCandidateProfile({ personalInfo, experiences, education, skills, languages }) })
      updateApplication(application.id, { analysis })
    } catch (analysisError) {
      setError(analysisError.message || 'Analyse indisponible. Réessayez plus tard.')
    } finally {
      setAnalyzingId('')
    }
  }

  const handleApplySuggestion = (application) => {
    if (!application.analysis) return
    applyJobSuggestions(application.analysis)
    updateApplication(application.id, { appliedToCVAt: new Date().toISOString() })
    setReviewingApplicationId('')
  }

  return (
    <main className="applications-page" aria-labelledby="applications-title">
      <header className="applications-header">
        <div>
          <p className="applications-eyebrow"><BriefcaseBusiness size={15} />Candidatures · Cameroun</p>
          <h1 id="applications-title">Mes candidatures</h1>
          <p className="applications-intro">Suivez vos démarches et préparez chaque candidature à partir de votre CV.</p>
        </div>
        <button type="button" className="applications-primary-button" onClick={() => setIsFormOpen((open) => !open)}><Plus size={17} />Ajouter une offre</button>
      </header>

      <section className="applications-toolbar" aria-label="Recherche et filtres des candidatures">
        <label className="application-search"><Search size={17} aria-hidden="true" /><span className="sr-only">Rechercher une candidature</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Entreprise, poste, ville" /></label>
        <label className="application-range-label">Publiées dans les
          <select value={rangeDays} onChange={(event) => setRangeDays(event.target.value === 'all' ? 'all' : Number(event.target.value))}>
            <option value={7}>7 derniers jours</option><option value={14}>14 derniers jours</option><option value={30}>30 derniers jours</option><option value="all">Toutes les dates</option>
          </select>
        </label>
        <button type="button" className="applications-sources-toggle" aria-expanded={isSourcesOpen} onClick={() => setIsSourcesOpen((open) => !open)}>Sources camerounaises</button>
      </section>

      {isSourcesOpen && (
        <section className="application-sources" aria-label="Sites d’emploi à consulter au Cameroun">
          <div><h2>Sources d’offres au Cameroun</h2><p>Ouvrez un site, choisissez une offre, puis ajoutez son lien et son texte ici.</p></div>
          <div className="application-source-list">{CAMEROON_JOB_SOURCES.map((source) => <a key={source.name} href={source.url} target="_blank" rel="noreferrer">{source.name}<ExternalLink size={13} /></a>)}</div>
        </section>
      )}

      {isFormOpen && (
        <form className="application-form" onSubmit={handleCreate}>
          <div className="application-form-heading"><div><p className="applications-eyebrow">Nouvelle opportunité</p><h2>Ajouter une offre</h2></div><button type="button" className="application-close-button" aria-label="Fermer le formulaire" onClick={() => setIsFormOpen(false)}><X size={19} /></button></div>
          <div className="application-form-grid">
            <label>Intitulé du poste<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Ex. Responsable commercial" /></label>
            <label>Entreprise<input value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} placeholder="Nom de l’entreprise" /></label>
            <label>Ville<input value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} placeholder="Douala, Yaoundé…" /></label>
            <label>Date de publication<input type="date" value={form.publishedAt} onChange={(event) => setForm({ ...form, publishedAt: event.target.value })} /></label>
            <label className="application-form-wide">Lien de l’offre<input type="url" value={form.url} onChange={(event) => setForm({ ...form, url: event.target.value })} placeholder="https://…" /></label>
            <label className="application-form-wide">Texte de l’offre<textarea required rows="6" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Collez ici les missions et les critères de l’annonce" /></label>
          </div>
          {error && <p role="alert" className="application-error">{error}</p>}
          <div className="application-form-footer"><p>Les offres sont enregistrées dans ce navigateur.</p><button className="applications-primary-button" type="submit"><Plus size={16} />Enregistrer l’offre</button></div>
        </form>
      )}

      {!isFormOpen && error && <p role="alert" className="application-error">{error}</p>}

      <section className="application-board" aria-label="Tableau de suivi des candidatures">
        {STATUSES.map((status) => {
          const items = filteredApplications.filter((application) => application.status === status.id)
          return (
            <section key={status.id} className="application-column" style={{ '--column-accent': status.accent }} aria-labelledby={`status-${status.id}`}>
              <header className="application-column-header"><h2 id={`status-${status.id}`}>{status.label}</h2><span>{items.length}</span></header>
              <div className="application-column-list">
                {items.map((application) => <ApplicationCard key={application.id} application={application} onMove={(id, next) => updateApplication(id, { status: next })} onAnalyze={handleAnalyze} onReview={setReviewingApplicationId} onRemove={removeApplication} analyzing={analyzingId === application.id} />)}
                {items.length === 0 && <p className="application-column-empty">Aucune candidature</p>}
              </div>
            </section>
          )
        })}
      </section>

      {reviewingApplicationId && (() => {
        const application = applications.find((item) => item.id === reviewingApplicationId)
        if (!application?.analysis) return null
        const analysis = application.analysis
        return (
          <div className="application-dialog-backdrop" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) setReviewingApplicationId('') }}>
            <section className="application-dialog" role="dialog" aria-modal="true" aria-labelledby="application-analysis-title">
              <button type="button" className="application-close-button" aria-label="Fermer l’analyse" onClick={() => setReviewingApplicationId('')}><X size={19} /></button>
              <p className="applications-eyebrow">Analyse CV · Offre</p>
              <h2 id="application-analysis-title">Compatibilité : {analysis.score}/100</h2>
              <p className="application-analysis-summary">{analysis.summary}</p>
              <div className="application-analysis-columns">
                <div><h3>Points correspondants</h3>{analysis.strengths.length ? <ul>{analysis.strengths.map((item, index) => <li key={`strength-${index}`}>{item}</li>)}</ul> : <p>Aucun point listé.</p>}</div>
                <div><h3>À renforcer</h3>{analysis.gaps.length ? <ul>{analysis.gaps.map((item, index) => <li key={`gap-${index}`}>{item}</li>)}</ul> : <p>Aucun écart majeur relevé.</p>}</div>
              </div>
              <h3>Propositions pour le CV</h3>
              <dl className="application-suggestions">
                {analysis.suggestedTitle && <><dt>Titre professionnel</dt><dd>{analysis.suggestedTitle}</dd></>}
                {analysis.suggestedSummary && <><dt>Résumé</dt><dd>{analysis.suggestedSummary}</dd></>}
                {analysis.suggestedSkills?.length > 0 && <><dt>Compétences à mettre en avant</dt><dd>{analysis.suggestedSkills.join(' · ')}</dd></>}
                {analysis.experienceRewrites?.map((rewrite, index) => <React.Fragment key={`rewrite-${index}`}><dt>Expérience {rewrite.index + 1}</dt><dd>{rewrite.text}</dd></React.Fragment>)}
                {!analysis.suggestedTitle && !analysis.suggestedSummary && !analysis.suggestedSkills?.length && !analysis.experienceRewrites?.length && <dd>Aucune reformulation proposée.</dd>}
              </dl>
              <p className="application-disclaimer">Vérifiez les propositions. Votre CV ne sera modifié qu’après confirmation.</p>
              <div className="application-dialog-actions"><button type="button" className="applications-secondary-button" onClick={() => setReviewingApplicationId('')}>Annuler</button><button type="button" className="applications-primary-button" onClick={() => handleApplySuggestion(application)}>Appliquer au CV</button></div>
            </section>
          </div>
        )
      })()}

      {!applications.length && (
        <section className="applications-empty"><span><BriefcaseBusiness size={20} /></span><h2>Votre suivi commence ici</h2><p>Ajoutez une offre trouvée au Cameroun, puis comparez-la avec votre CV.</p><button type="button" className="applications-secondary-button" onClick={() => setIsFormOpen(true)}><FilePlus2 size={16} />Ajouter ma première offre</button></section>
      )}
    </main>
  )
}
