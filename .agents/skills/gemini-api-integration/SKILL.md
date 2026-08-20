---
name: gemini-api-integration
description: "Expert en intégration de l'API Google Gemini (Free Tier). Guide sur la récupération et l'utilisation de la clé API Gemini via Google AI Studio."
---

# Intégration de l'API Google Gemini

Cette compétence définit les bonnes pratiques pour intégrer l'API Google Gemini dans une application, en expliquant la récupération de la clé via le palier gratuit et son utilisation sécurisée.

## 1. Récupération de la clé API (Free Tier)
Google AI Studio fournit un accès gratuit et généreux à l'API Gemini pour les développeurs. Il ne consomme pas de tokens payants (sauf si un compte de facturation cloud est explicitement lié).
- **Lien officiel pour générer la clé** : [Google AI Studio - API Keys](https://aistudio.google.com/app/apikey)
- **Modèles recommandés** : Gemini 1.5 Flash (pour la rapidité et le coût zéro).
- **Limites du Free Tier (Flash)** : 15 requêtes/minute, 1 500 requêtes/jour.

## 2. Intégration côté Client (Frontend React / Vue)
Dans une application purement frontend (sans serveur Node.js/Python intermédiaire), il est crucial de ne pas exposer de clé :
- Ne **jamais** écrire la clé API en dur dans les fichiers du code (`const key = 'AIza...'`).
- Proposer une interface (modale) demandant à l'utilisateur de renseigner sa propre clé API.
- Sauvegarder cette clé dans le `localStorage` de l'utilisateur pour ne pas la redemander à chaque visite.

## 3. Exemple d'implémentation (Fetch API)
Voici comment appeler l'API Gemini 1.5 Flash en JavaScript natif :

```javascript
async function generateGeminiContent(prompt, apiKey) {
  try {
    const response = await fetch(
      \`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=\${apiKey}\`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || "Erreur API");
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}
```

## 4. Rôle de l'IA lors du développement
En tant qu'assistant de code, lorsque l'utilisateur demande de l'aide sur l'API Gemini :
1. Rappelez toujours que la clé s'obtient gratuitement sur Google AI Studio.
2. Expliquez clairement que l'assistant (Antigravity) ne peut pas générer ou fournir de clés API Google en direct.
3. Aidez à implémenter la logique de stockage local et de requêtes HTTP sécurisées.
