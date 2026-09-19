import { generateWithGemini } from './geminiService'

export const COVER_LETTER_SYSTEM_INSTRUCTION = `Tu rédiges le CORPS d'une lettre de motivation professionnelle en français pour douzCv.
Règles :
- Sortie = uniquement 3 à 4 paragraphes du corps (pas d'en-tête, pas de date, pas d'objet, pas de formule de politesse, pas de signature).
- Pas de markdown, pas de titres, pas de meta-commentaires.
- Appuie-toi uniquement sur le profil CV fourni ; n'invente pas de faits.
- Adapte le registre selon la consigne de ton.
- 250 à 350 mots maximum.`

const TONE_BY_TEMPLATE = {
  "L'Exécutif": 'Leadership, résultats chiffrés, vision stratégique, registre formel.',
  'Le Minimaliste (ATS)': 'Phrases courtes, mots-clés de l\'offre, ton direct.',
  "L'Académique & Recherche": 'Rigueur, méthode, projets et publications mentionnés dans le CV.',
  'Le Tech Lead': 'Impact technique, delivery, équipe, technologies citées dans le CV.',
  'Le Silicon Valley': 'Impact produit, growth mindset, concision.',
  "L'Ingénieur & Industriel": 'Sécurité, process, terrain, conformité.',
  'Le Créatif': 'Voix distinctive, accroche soignée, rester professionnel.',
  "L'Élégant Prestige": 'Élégance, discrétion, excellence de service.',
  'Le Portfolio Visuel': 'Réalisations concrètes, sens esthétique lié au métier.',
  'Le Condensé 1-Page': 'Ultra-synthétique, une idée forte par paragraphe.',
  "L'International / Expat": 'Mobilité, langues du CV, adaptabilité culturelle.',
  'Le Polyvalent Pro-Afrique': 'Impact local, polyvalence, contexte africain si pertinent.'
}

export function stripHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim()
}

export function getToneGuidance(selectedTemplate) {
  return TONE_BY_TEMPLATE[selectedTemplate] || 'Professionnel, clair, orienté résultats, registre formel.'
}

export function formatLetterDateFr(date = new Date()) {
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function formatLetterDateDisplay(value) {
  if (!value) return ''
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value

  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export function ensureLetterStructure(meta, personalInfo) {
  const first = personalInfo?.firstName || ''
  const last = personalInfo?.lastName || ''
  const fullName = [first, last].filter(Boolean).join(' ')
  const city = personalInfo?.location?.split(',')[0]?.trim() || personalInfo?.location?.trim() || ''

  return {
    ...meta,
    jobTitle: meta.jobTitle?.trim() ? meta.jobTitle : '',
    companyName: meta.companyName?.trim() ? meta.companyName : '',
    place: meta.place?.trim() ? meta.place : city,
    letterDate: meta.letterDate?.trim() ? meta.letterDate : formatLetterDateFr(),
    recipientName: meta.recipientName?.trim()
      ? meta.recipientName
      : 'Madame, Monsieur,',
    subject: meta.subject?.trim()
      ? meta.subject
      : meta.jobTitle?.trim()
        ? `Candidature au poste de ${meta.jobTitle.trim()}`
        : '',
    salutation: meta.salutation?.trim() ? meta.salutation : 'Madame, Monsieur,',
    closing: meta.closing?.trim()
      ? meta.closing
      : "Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.",
    signatureName: meta.signatureName?.trim() ? meta.signatureName : fullName
  }
}

/** Si l'IA renvoie une lettre complète, tente d'en extraire le corps */
export function extractBodyFromAiResponse(text) {
  if (!text?.trim()) return ''
  const raw = text.trim()
  const salutationMatch = raw.match(/Madame, Monsieur[,]?/i)
  const closingMatch = raw.match(
    /(Je vous prie d[\u2019']agréer|Veuillez agréer|Cordialement|Salutations distinguées)/i
  )

  if (salutationMatch && closingMatch) {
    const start = salutationMatch.index + salutationMatch[0].length
    const end = closingMatch.index
    if (end > start) {
      return raw.slice(start, end).trim()
    }
  }

  if (raw.includes('Objet :')) {
    const afterObjet = raw.split(/Objet\s*:/i)[1]
    if (afterObjet) {
      const bodyPart = afterObjet.replace(/^[^\n]*\n/, '').trim()
      if (bodyPart.length > 80) return bodyPart
    }
  }

  return raw
}

export function buildCvContextSnapshot(state) {
  const { personalInfo, experiences, education, skills, languages, selectedTemplate } = state
  const summaryPlain = stripHtml(personalInfo?.summary || '')

  const expLines = (experiences || []).map((exp) => {
    const desc = stripHtml(exp.description || '')
    return `- ${exp.title || 'Poste'} @ ${exp.company || 'Entreprise'} (${exp.startDate || '?'}–${exp.endDate || '?'})${desc ? ` : ${desc}` : ''}`
  })

  const eduLines = (education || []).map((edu) =>
    `- ${edu.degree || 'Diplôme'} — ${edu.school || 'Établissement'}`
  )

  const skillsJoined = (skills || []).join(', ') || 'Non renseigné'
  const languagesJoined = (languages || [])
    .map((l) => `${l.name || 'Langue'} (${l.level || ''})`)
    .join(', ') || 'Non renseigné'

  return [
    `Modèle CV douzCv : ${selectedTemplate || "L'Exécutif"}`,
    `Nom : ${[personalInfo?.firstName, personalInfo?.lastName].filter(Boolean).join(' ') || 'Non renseigné'}`,
    `Titre : ${personalInfo?.title || 'Non renseigné'}`,
    `Contact : ${[personalInfo?.email, personalInfo?.phone, personalInfo?.location].filter(Boolean).join(' · ') || 'Non renseigné'}`,
    `Résumé : ${summaryPlain || 'Non renseigné'}`,
    'Expériences :',
    expLines.length ? expLines.join('\n') : '- Aucune expérience renseignée',
    'Formation :',
    eduLines.length ? eduLines.join('\n') : '- Aucune formation renseignée',
    `Compétences : ${skillsJoined}`,
    `Langues : ${languagesJoined}`
  ].join('\n')
}

export function buildCoverLetterUserPrompt(state, coverLetterMeta) {
  const {
    jobTitle = '',
    companyName = '',
    jobReference = '',
    jobDescription = ''
  } = coverLetterMeta || {}

  const cvSnapshot = buildCvContextSnapshot(state)
  const templateId = coverLetterMeta?.letterTemplateId || state.selectedTemplate
  const toneGuidance = getToneGuidance(templateId)

  const parts = [
    'Rédige une lettre de motivation en français pour le poste suivant.',
    '',
    `POSTE : ${jobTitle || 'Poste à pourvoir'}`,
    `ENTREPRISE : ${companyName || 'Entreprise cible'}`,
  ]

  if (jobReference?.trim()) {
    parts.push(`RÉFÉRENCE OFFRE : ${jobReference.trim()}`)
  }

  if (jobDescription?.trim()) {
    parts.push('', 'DESCRIPTION DE L\'OFFRE (extraits) :', jobDescription.trim())
  }

  parts.push(
    '',
    `PROFIL DU CANDIDAT (extrait du CV douzCv, modèle lettre « ${templateId || "L'Exécutif"} ») :`,
    cvSnapshot,
    '',
    `CONSIGNES DE TON : ${toneGuidance}`,
    '',
    'Produis uniquement les paragraphes du corps de la lettre (sans en-tête ni formule de politesse).'
  )

  return parts.join('\n')
}

export async function generateCoverLetterFromCv(state, coverLetterMeta) {
  const prompt = buildCoverLetterUserPrompt(state, coverLetterMeta)
  return generateWithGemini({
    prompt,
    systemInstruction: COVER_LETTER_SYSTEM_INSTRUCTION
  })
}
