/**
 * Service client pour la recherche d'offres et les exports/imports du tableur
 */

export async function fetchJobOffers({ query = '', city = '', days = 30, source = 'all', signal } = {}) {
  const params = new URLSearchParams()
  if (query) params.set('query', query.trim())
  if (city && city !== 'all' && city !== 'toutes') params.set('city', city.trim())
  if (days && days !== 'all') params.set('days', String(days))
  if (source && source !== 'all') params.set('source', source)

  const url = `/api/jobs?${params.toString()}`

  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
    signal
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `Erreur lors de la recherche (${response.status})`)
  }

  const data = await response.json()
  return data.jobs || []
}

/**
 * Exporte une liste d'offres en fichier CSV compatible Excel (avec BOM UTF-8 et séparateur point-virgule)
 */
export function exportJobsToCSV(jobs = [], filename = 'candidatures_offres_30j.csv') {
  if (!jobs || !jobs.length) {
    throw new Error('Aucune offre à exporter.')
  }

  const headers = ['Date', 'Intitule du poste', 'Entreprise', 'Ville', 'Contrat', 'Source', 'Lien', 'Description']

  const escapeCSV = (value) => {
    if (value == null) return '""'
    const str = String(value).replace(/"/g, '""').replace(/\r?\n/g, ' ')
    return `"${str}"`
  }

  const rows = jobs.map((job) => [
    escapeCSV(job.publishedAt || ''),
    escapeCSV(job.title || ''),
    escapeCSV(job.company || ''),
    escapeCSV(job.city || ''),
    escapeCSV(job.contractType || 'CDI'),
    escapeCSV(job.source || 'Portail'),
    escapeCSV(job.url || ''),
    escapeCSV(job.description || '')
  ].join(';'))

  // \uFEFF garantit le bon encodage des accents dans Microsoft Excel
  const csvContent = '\uFEFF' + [headers.map(escapeCSV).join(';'), ...rows].join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Analyse un texte CSV ou JSON téléversé par l'utilisateur
 */
export function parseJobsFromFileContent(content = '', fileType = 'csv') {
  if (!content.trim()) return []

  if (fileType === 'json' || content.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(content)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      throw new Error('Format JSON invalide.')
    }
  }

  // Parse CSV
  const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0)
  if (lines.length < 2) return []

  const separator = lines[0].includes(';') ? ';' : ','
  const cleanField = (f) => f.replace(/^["']|["']$/g, '').replace(/""/g, '"').trim()

  const jobs = []
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(separator).map(cleanField)
    if (parts.length >= 2 && parts[1]) {
      jobs.push({
        id: `import_${Date.now()}_${i}`,
        publishedAt: parts[0] || new Date().toISOString().slice(0, 10),
        title: parts[1] || 'Offre importée',
        company: parts[2] || 'Entreprise',
        city: parts[3] || 'Cameroun',
        contractType: parts[4] || 'CDI',
        source: parts[5] || 'Fichier importé',
        url: parts[6] || '',
        description: parts[7] || '',
        daysAgo: 0
      })
    }
  }

  return jobs
}
