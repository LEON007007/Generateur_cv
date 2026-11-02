import { generateWithGemini } from './geminiService'

const stripHtml = (value = '') => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

export function buildCandidateProfile(state) {
  const personalInfo = state.personalInfo || {}
  return {
    title: personalInfo.title || '',
    summary: stripHtml(personalInfo.summary || ''),
    experiences: (state.experiences || []).map((item) => ({
      title: item.title || '',
      company: item.company || '',
      description: stripHtml(item.description || ''),
      startDate: item.startDate || '',
      endDate: item.endDate || ''
    })),
    education: (state.education || []).map((item) => ({
      degree: item.degree || '',
      school: item.school || '',
      description: stripHtml(item.description || '')
    })),
    skills: state.skills || [],
    languages: (state.languages || []).map((item) => ({ name: item.name, level: item.level }))
  }
}

export async function analyzeJobMatch({ application, profile }) {
  if (!application.description?.trim()) {
    throw new Error('Ajoutez le texte de l’offre avant de lancer l’analyse.')
  }

  const prompt = `Compare ce CV avec cette offre. N'invente aucune expérience, compétence ni qualification. Réponds uniquement en JSON valide, sans bloc Markdown, avec exactement ces clés : {"score": nombre de 0 à 100, "summary": texte court en français, "strengths": tableau de 3 à 5 correspondances, "gaps": tableau de compétences ou critères absents du CV, "suggestedTitle": titre professionnel conseillé, "suggestedSummary": résumé professionnel reformulé sans faits nouveaux, "suggestedSkills": tableau de compétences à mettre en avant, limitées strictement aux compétences déjà présentes dans le CV, "experienceRewrites": tableau d'objets {"index": nombre, "text": texte} qui reformulent uniquement les expériences fournies sans ajouter de fait. Si une valeur manque, renvoie une chaîne ou un tableau vide.\n\nPROFIL CV:\n${JSON.stringify(profile)}\n\nOFFRE:\nTitre: ${application.title || ''}\nEntreprise: ${application.company || ''}\nLocalisation: ${application.city || 'Cameroun'}\nDescription:\n${application.description}`

  const response = await generateWithGemini({
    prompt,
    systemInstruction: 'Tu es un conseiller carrière précis et honnête. Évalue uniquement les éléments présents dans le CV fourni. Toute reformulation doit préserver strictement les faits et les chiffres. Réponds seulement avec un objet JSON valide en français.'
  })

  const jsonText = response.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  const result = JSON.parse(jsonText)
  const score = Number(result.score)
  if (!Number.isFinite(score) || score < 0 || score > 100) {
    throw new Error('L’analyse a renvoyé un résultat invalide. Réessayez.')
  }

  return {
    score: Math.round(score),
    summary: String(result.summary || ''),
    strengths: Array.isArray(result.strengths) ? result.strengths.map(String) : [],
    gaps: Array.isArray(result.gaps) ? result.gaps.map(String) : [],
    suggestedTitle: String(result.suggestedTitle || ''),
    suggestedSummary: String(result.suggestedSummary || ''),
    suggestedSkills: Array.isArray(result.suggestedSkills)
      ? result.suggestedSkills.map(String).filter((skill) => profile.skills.some((existing) => existing.toLocaleLowerCase('fr') === skill.toLocaleLowerCase('fr')))
      : [],
    experienceRewrites: Array.isArray(result.experienceRewrites)
      ? result.experienceRewrites.filter((item) => Number.isInteger(item.index) && item.index >= 0 && item.index < profile.experiences.length && typeof item.text === 'string').map((item) => ({ index: item.index, text: item.text }))
      : [],
    analyzedAt: new Date().toISOString()
  }
}
