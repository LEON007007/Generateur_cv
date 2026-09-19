import express from 'express';
import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), 'douzcv-react', '.env') });

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(express.json({ limit: '2mb' }));

const DEFAULT_SYSTEM_INSTRUCTION = `Tu es un expert mondial en recrutement et optimisation de CV.
Réponds directement avec le texte final prêt à être inséré dans le CV, sans introduction ni conclusion.
Utilise un français professionnel, précis et orienté résultats.`;

app.post('/api/gemini', async (req, res) => {
  try {
    const { prompt, systemInstruction } = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Le prompt Gemini est obligatoire.' });
    }

    if (!apiKey) {
      return res.status(503).json({ error: 'La variable GEMINI_API_KEY est absente. Configure-la dans le backend local ou Vercel.' });
    }

    const modelListResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const modelList = await modelListResponse.json().catch(() => ({}));

    const availableModels = (modelList.models || [])
      .filter((model) => model.supportedGenerationMethods?.includes('generateContent'))
      .map((model) => model.name.replace(/^models\//, ''))
      .filter((name) => name.includes('flash') && !/(tts|audio|voice|image)/i.test(name));

    const preferred = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-flash-latest', 'gemini-flash-lite-latest', 'gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite'];
    const models = [...preferred.filter((m) => availableModels.includes(m)), ...availableModels.filter((m) => !preferred.includes(m))];

    if (!models.length) {
      return res.status(502).json({ error: 'Aucun modèle Gemini Flash compatible disponible pour cette clé.' });
    }

    let lastError = 'Aucun modèle compatible n’a réussi.';

    for (const model of models) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: prompt }] }],
              systemInstruction: { parts: [{ text: systemInstruction || DEFAULT_SYSTEM_INSTRUCTION }] },
              generationConfig: { temperature: 0.6, maxOutputTokens: 800 }
            })
          }
        );

        const data = await response.json().catch(() => ({}));

        if (response.ok) {
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return res.status(200).json({ text: text.trim(), model });
          }
        }

        lastError = data?.error?.message || `HTTP ${response.status}`;

        if ([400, 401, 403].includes(response.status)) {
          break;
        }
      } catch (error) {
        lastError = error.message || lastError;
      }
    }

    return res.status(502).json({ error: lastError });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Erreur interne du backend Gemini.' });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'douzcv-gemini-proxy' });
});

app.listen(port, () => {
  console.log(`Gemini proxy listening on http://localhost:${port}`);
});
