/**
 * Service d'agrégation et scraping d'offres d'emploi
 * Compatible 100% Node.js natif et Vercel Serverless
 */

const CACHE_TTL_MS = 10 * 60 * 1000 // 10 minutes
const cache = new Map()

const DEFAULT_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8'
}

function cleanText(text = '') {
  return text
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&eacute;/gi, 'é')
    .replace(/&egrave;/gi, 'è')
    .replace(/&agrave;/gi, 'à')
    .replace(/&ocirc;/gi, 'ô')
    .replace(/&ecirc;/gi, 'ê')
    .replace(/&ccedil;/gi, 'ç')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Calcule l'écart en jours entre une date ISO et aujourd'hui
 */
function calculateDaysAgo(dateString) {
  if (!dateString) return 0
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return 0
  const diffTime = Math.abs(Date.now() - date.getTime())
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Scrape les offres camerounaises sur JobInfoCamer
 */
async function scrapeJobInfoCamer(query = '', maxDays = 30) {
  const jobs = []
  try {
    const encodedQuery = encodeURIComponent(query.trim())
    const url = encodedQuery
      ? `https://www.jobinfocamer.com/search/?job-search=${encodedQuery}`
      : 'https://www.jobinfocamer.com/'

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 7500)

    const response = await fetch(url, {
      headers: DEFAULT_HEADERS,
      signal: controller.signal
    })
    clearTimeout(timeout)

    if (!response.ok) return []

    const html = await response.text()

    // Analyse des lignes <tr> du tableau d'offres
    const rowRegex = /<tr>([\s\S]*?)<\/tr>/gi
    let rowMatch

    // Date de référence pour les offres récentes (ordre décroissant)
    let daysOffset = 1

    while ((rowMatch = rowRegex.exec(html)) !== null) {
      const rowContent = rowMatch[1]
      const linkMatch = rowContent.match(/<a[^>]+href="(\/job\/\d+\/[^"]+)"[^>]*>(.*?)<\/a>/i)
      if (!linkMatch) continue

      const relativeUrl = linkMatch[1]
      const rawTitle = linkMatch[2]
      const title = cleanText(rawTitle)
      if (!title || title.length < 3) continue

      const fullUrl = `https://www.jobinfocamer.com${relativeUrl}`

      // Extraction de l'entreprise et de la ville dans <p>
      let company = 'Entreprise au Cameroun'
      let city = 'Cameroun'

      const pMatch = rowContent.match(/<p>([\s\S]*?)<\/p>/i)
      if (pMatch) {
        const pClean = cleanText(pMatch[1])
        // Le format est généralement "NOM_ENTREPRISE Ville" ou avec séparateur
        const parts = pClean.split(/\s{2,}|[-–|]/).map((s) => s.trim()).filter(Boolean)
        if (parts.length >= 2) {
          company = parts[0]
          city = parts.slice(1).join(', ')
        } else if (parts.length === 1) {
          // Tentative d'extraction de villes connues
          const text = parts[0]
          const knownCities = ['Douala', 'Yaoundé', 'Yaounde', 'Bafoussam', 'Garoua', 'Maroua', 'Bamenda', 'Kribi', 'Limbé', 'Limbe', 'Buea', 'Ngaoundéré']
          const foundCity = knownCities.find((c) => new RegExp(`\\b${c}\\b`, 'i').test(text))
          if (foundCity) {
            city = foundCity
            company = text.replace(new RegExp(`\\b${foundCity}\\b`, 'i'), '').trim() || 'Entreprise camerounaise'
          } else {
            company = text
          }
        }
      }

      // Extraction du type de contrat (ex: <span class="label label-warning rounded">CDI</span>)
      let contractType = 'CDI'
      const contractMatch = rowContent.match(/<span[^>]*class="[^"]*label[^"]*"[^>]*>(.*?)<\/span>/i)
      if (contractMatch) {
        contractType = cleanText(contractMatch[1]).toUpperCase()
      }

      // Attribution de la date relative (les offres sont triées de la plus récente à la plus ancienne)
      const daysAgo = Math.min(daysOffset, 29)
      const pubDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
      const publishedAt = pubDate.toISOString().slice(0, 10)
      daysOffset += 1

      if (daysAgo <= maxDays) {
        jobs.push({
          id: `jic_${relativeUrl.replace(/[^a-zA-Z0-9]/g, '_')}`,
          title,
          company,
          city: city || 'Douala / Yaoundé',
          country: 'Cameroun',
          contractType,
          publishedAt,
          daysAgo,
          url: fullUrl,
          description: `Poste de ${title} chez ${company} (${city}). Type de contrat: ${contractType}. Consultez l'annonce complète et postulez directement sur la source.`,
          source: 'JobInfoCamer'
        })
      }
    }
  } catch (err) {
    console.warn('[jobScraperService] Erreur lors du scraping JobInfoCamer:', err.message)
  }

  return jobs
}

/**
 * Récupère des opportunités en télétravail / remote via Remotive (API publique gratuite)
 */
async function fetchRemotiveJobs(query = '', maxDays = 30) {
  const jobs = []
  try {
    const encodedQuery = encodeURIComponent(query.trim())
    const url = `https://remotive.com/api/remote-jobs?search=${encodedQuery}&limit=15`

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 6500)

    const response = await fetch(url, { signal: controller.signal })
    clearTimeout(timeout)

    if (!response.ok) return []

    const data = await response.json().catch(() => ({}))
    const items = data.jobs || []

    for (const item of items) {
      const pubDate = item.publication_date ? new Date(item.publication_date) : new Date()
      const publishedAt = pubDate.toISOString().slice(0, 10)
      const daysAgo = calculateDaysAgo(publishedAt)

      if (daysAgo <= maxDays) {
        jobs.push({
          id: `remotive_${item.id}`,
          title: cleanText(item.title),
          company: cleanText(item.company_name || 'Entreprise Internationale'),
          city: item.candidate_required_location || 'Télétravail / Remote',
          country: 'International',
          contractType: item.job_type ? item.job_type.toUpperCase() : 'CDI',
          publishedAt,
          daysAgo,
          url: item.url,
          description: cleanText(item.description || '').slice(0, 600) + '...',
          source: 'Remotive (Télétravail)'
        })
      }
    }
  } catch (err) {
    console.warn('[jobScraperService] Erreur Remotive API:', err.message)
  }

  return jobs
}

/**
 * Fonction principale d'agrégation et de recherche des offres d'emploi
 * @param {Object} params
 * @param {string} [params.query=''] - Mots-clés de recherche
 * @param {string} [params.city=''] - Filtrer par ville
 * @param {number} [params.days=30] - Période max en jours (ex: 30)
 * @param {string} [params.source='all'] - Source spécifique ou 'all'
 */
export async function searchJobOffers({ query = '', city = '', days = 30, source = 'all' } = {}) {
  const maxDays = Number(days) > 0 ? Number(days) : 30
  const normalizedQuery = (query || '').trim()
  const normalizedCity = (city || '').trim().toLowerCase()

  // Clé de cache
  const cacheKey = `${normalizedQuery.toLowerCase()}_${normalizedCity}_${maxDays}_${source}`
  const cached = cache.get(cacheKey)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data
  }

  const tasks = []

  if (source === 'all' || source === 'jobinfocamer') {
    tasks.push(scrapeJobInfoCamer(normalizedQuery, maxDays))
  }

  if (source === 'all' || source === 'remotive') {
    // Si la ville n'est pas spécifiée ou s'il s'agit de télétravail, on inclut Remotive
    if (!normalizedCity || normalizedCity.includes('remote') || normalizedCity.includes('télé') || normalizedCity.includes('tele')) {
      tasks.push(fetchRemotiveJobs(normalizedQuery, maxDays))
    }
  }

  const results = await Promise.allSettled(tasks)
  let allJobs = []

  for (const res of results) {
    if (res.status === 'fulfilled' && Array.isArray(res.value)) {
      allJobs.push(...res.value)
    }
  }

  // Fonction de normalisation pour comparaison sans accents
  const stripAccents = (str = '') =>
    str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

  const normalizedCityClean = stripAccents(normalizedCity)

  // Filtrage par ville si demandée
  if (normalizedCityClean && normalizedCityClean !== 'toutes' && normalizedCityClean !== 'tous' && normalizedCityClean !== 'all') {
    allJobs = allJobs.filter((job) => {
      const jobCityClean = stripAccents(job.city || '')
      const jobDescClean = stripAccents(job.description || '')
      return (
        jobCityClean.includes(normalizedCityClean) ||
        (normalizedCityClean === 'yaounde' && (jobCityClean.includes('yaound') || jobCityClean.includes('cameroun') || jobCityClean.includes('douala / yaounde'))) ||
        (normalizedCityClean === 'douala' && (jobCityClean.includes('douala') || jobCityClean.includes('cameroun'))) ||
        (normalizedCityClean === 'cameroun' && job.country === 'Cameroun') ||
        jobDescClean.includes(normalizedCityClean)
      )
    })
  }

  // Tri par date de publication (plus récente d'abord)
  allJobs.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  // Déduplication par URL / Titre
  const seenUrls = new Set()
  const deduplicatedJobs = []
  for (const job of allJobs) {
    if (!seenUrls.has(job.url)) {
      seenUrls.add(job.url)
      deduplicatedJobs.push(job)
    }
  }

  // Sauvegarde dans le cache
  cache.set(cacheKey, { timestamp: Date.now(), data: deduplicatedJobs })

  return deduplicatedJobs
}
