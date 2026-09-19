/**
 * Gemini AI Service for douzCv
 * Calls Google Gemini REST API with public Flash models.
 */

const CANDIDATE_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash'
]

const DEFAULT_SYSTEM_INSTRUCTION = `Tu es un expert mondial en recrutement de cadres et optimisation de CV de haut niveau.
RÈGLES STRICTES ET NON-NÉGOCIABLES :
1. Réponds DIRECTEMENT ET UNIQUEMENT avec le texte final prêt à être inséré dans le CV (soit un paragraphe fluide, soit des puces commençant par des puces •).
2. Ne mets JAMAIS d'introduction, de politesse, de conclusion ni de bavardage (PAS de "Voici...", PAS de "Bien sûr...", PAS de "Voici une proposition...").
3. Ne pose JAMAIS de questions et ne demande JAMAIS d'informations supplémentaires. Si la consigne est brève ou générale, produis immédiatement le meilleur texte professionnel complet et percutant possible.
4. Utilise un français irréprochable, soutenu, axé sur les résultats, l'impact, le leadership et l'efficacité opérationnelle.`

export async function generateWithGemini({ prompt, systemInstruction, apiKey }) {
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem('douzcv_gemini_api_key') : ''
  const rawKey = apiKey || storedKey || import.meta.env.VITE_GEMINI_API_KEY
  const key = rawKey ? rawKey.trim() : ''

  if (!key) {
    throw new Error('Aucune clé API Gemini configurée. Ajoutez votre clé dans le bouton de connexion Gemini.')
  }

  let lastError = null

  for (const model of CANDIDATE_MODELS) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          systemInstruction: {
            parts: [{ text: systemInstruction || DEFAULT_SYSTEM_INSTRUCTION }]
          },
          generationConfig: {
            temperature: 0.6,
            maxOutputTokens: 800
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
        if (text) {
          let cleanText = text.trim()
          cleanText = cleanText.replace(/^(Voici une proposition de résumé|Voici votre texte corrigé|Voici quelques puces|Bien sûr, voici|Voici une version améliorée)\s*:\s*\n*/i, '')
          return cleanText
        }
      }

      const errorData = await response.json().catch(() => ({}))
      const errorMessage = errorData?.error?.message || `HTTP ${response.status}`
      lastError = new Error(errorMessage)

      if (response.status === 400 || response.status === 401 || response.status === 403) {
        throw new Error(`La clé API Gemini a été refusée : ${errorMessage}`)
      }
    } catch (err) {
      lastError = err
      if (err.message?.includes('clé API Gemini')) throw err
      console.warn(`Échec avec ${model}, tentative du modèle suivant...`, err.message)
    }
  }

  throw new Error(`Gemini n'a pas pu générer de réponse : ${lastError?.message || 'service indisponible'}`)
}
