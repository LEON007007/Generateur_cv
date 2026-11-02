import { searchJobOffers } from './services/jobScraperService.js'

export default async function handler(request, response) {
  // En-têtes CORS pour requêtes distantes
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (request.method === 'OPTIONS') {
    return response.status(200).end()
  }

  try {
    const params = request.method === 'POST' ? (request.body || {}) : (request.query || {})
    const { query = '', city = '', days = 30, source = 'all' } = params

    const maxDays = Number(days) > 0 ? Number(days) : 30
    const jobs = await searchJobOffers({
      query: String(query || ''),
      city: String(city || ''),
      days: maxDays,
      source: String(source || 'all')
    })

    return response.status(200).json({
      success: true,
      count: jobs.length,
      query: String(query || ''),
      city: String(city || ''),
      days: maxDays,
      jobs
    })
  } catch (error) {
    console.error('[API /api/jobs] Erreur:', error)
    return response.status(500).json({
      success: false,
      error: error.message || 'Impossible de récupérer les offres d’emploi pour le moment.',
      jobs: []
    })
  }
}
