/**
 * Gemini AI Service for douzCv
 * Uses the secure backend route only. No browser-side Gemini key is used anymore.
 */

const DEFAULT_SYSTEM_INSTRUCTION = `Tu es un expert mondial en recrutement de cadres et optimisation de CV de haut niveau.
RÈGLES STRICTES ET NON-NÉGOCIABLES :
1. Réponds DIRECTEMENT ET UNIQUEMENT avec le texte final prêt à être inséré dans le CV (soit un paragraphe fluide, soit des puces commençant par des puces •).
2. Ne mets JAMAIS d'introduction, de politesse, de conclusion ni de bavardage (PAS de "Voici...", PAS de "Bien sûr...", PAS de "Voici une proposition...").
3. Ne pose JAMAIS de questions et ne demande JAMAIS d'informations supplémentaires. Si la consigne est brève ou générale, produis immédiatement le meilleur texte professionnel complet et percutant possible.
4. Utilise un français irréprochable, soutenu, axé sur les résultats, l'impact, le leadership et l'efficacité opérationnelle.`

export async function generateWithGemini({ prompt, systemInstruction }) {
  const clearStoredGeminiKey = () => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('douzcv_gemini_api_key')
      }
    } catch (error) {
      console.warn('Impossible de nettoyer la clé Gemini stockée.', error)
    }
  }

  try {
    const proxyResponse = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, systemInstruction: systemInstruction || DEFAULT_SYSTEM_INSTRUCTION })
    })

    const proxyData = await proxyResponse.json().catch(() => ({}))

    if (proxyResponse.ok && proxyData.text) {
      return proxyData.text.trim()
    }

    if (proxyResponse.status === 503 || proxyResponse.status === 502 || proxyResponse.status === 400) {
      const detailedError = proxyData.error || 'Le service Gemini n’est pas correctement configuré.'
      throw new Error(detailedError)
    }

    if (proxyResponse.status === 404) {
      throw new Error('Le backend Gemini n’est pas disponible dans cette instance. Vérifiez le déploiement Vercel ou la configuration serveur.')
    }

    throw new Error(proxyData.error || 'Le service Gemini est indisponible.')
  } catch (error) {
    const message = error?.message || 'Erreur inconnue du service Gemini.'

    if (typeof window !== 'undefined') {
      const storedKey = localStorage.getItem('douzcv_gemini_api_key')
      if (storedKey) {
        clearStoredGeminiKey()
      }
    }

    throw new Error(message)
  }
}
