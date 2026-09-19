import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), 'douzcv-react', '.env') });

const PREFERRED_MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash']

const DEFAULT_SYSTEM_INSTRUCTION = `Tu es un expert mondial en recrutement et optimisation de CV.
Réponds directement avec le texte final prêt à être inséré dans le CV, sans introduction ni conclusion.
Utilise un français professionnel, précis et orienté résultats.`

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Méthode non autorisée' })
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY
  const { prompt, systemInstruction } = request.body || {}

  if (!apiKey) {
    return response.status(503).json({
      error: 'La variable GEMINI_API_KEY est absente dans Vercel. Ajoutez-la puis redéployez.'
    })
  }

  if (!prompt || typeof prompt !== 'string') {
    return response.status(400).json({ error: 'Le prompt Gemini est obligatoire.' })
  }

  let lastMessage = 'Aucun modèle Gemini compatible n’est disponible pour cette clé.'

  try {
    const modelsResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    )
    const modelsData = await modelsResponse.json().catch(() => ({}))
    const availableModels = (modelsData.models || [])
      .filter((model) => model.supportedGenerationMethods?.includes('generateContent'))
      .map((model) => model.name.replace(/^models\//, ''))
      .filter((name) => name.includes('flash') && !/(tts|audio|voice|image)/i.test(name))

    const models = [
      ...PREFERRED_MODELS.filter((model) => availableModels.includes(model)),
      ...availableModels.filter((model) => !PREFERRED_MODELS.includes(model))
    ]

    if (models.length === 0) {
      return response.status(502).json({
        error: 'La clé Gemini ne donne accès à aucun modèle Flash compatible avec generateContent.'
      })
    }

    for (const model of models) {
    try {
      const geminiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            systemInstruction: {
              parts: [{ text: systemInstruction || DEFAULT_SYSTEM_INSTRUCTION }]
            },
            generationConfig: { temperature: 0.6, maxOutputTokens: 800 }
          })
        }
      )

      const data = await geminiResponse.json().catch(() => ({}))
      if (geminiResponse.ok) {
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
        if (text) return response.status(200).json({ text: text.trim(), model })
      }

      lastMessage = data?.error?.message || `Erreur Gemini HTTP ${geminiResponse.status}`
      if ([400, 401, 403].includes(geminiResponse.status)) break
    } catch (error) {
      lastMessage = error.message || lastMessage
    }
    }
  } catch (error) {
    lastMessage = error.message || lastMessage
  }

  return response.status(502).json({ error: lastMessage })
}
