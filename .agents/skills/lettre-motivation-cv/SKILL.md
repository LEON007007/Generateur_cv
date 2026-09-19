---
name: lettre-motivation-cv
description: >-
  Génère des lettres de motivation à partir des données CV et du modèle sélectionné
  dans douzCv, via le proxy Gemini existant, avec prévisualisation A4 et export PDF.
  Utiliser lorsque l'utilisateur demande une lettre de motivation, cover letter,
  candidature, ou l'extension du générateur CV vers la lettre + téléchargement PDF.
---

# Lettre de motivation (douzCv)

Compétence projet pour **implémenter ou faire évoluer** le flux « lettre de motivation » dans `douzcv-react`, en réutilisant le store CV, l’IA Gemini backend et le pipeline PDF déjà présents.

## Quand appliquer cette compétence

- Nouvelle page ou section « Lettre de motivation »
- Génération / réécriture IA alignée sur le CV actif
- Cohérence visuelle avec le **modèle CV** choisi (`selectedTemplate`)
- Export **PDF A4** (même fiabilité que la page Export)

Compléter avec `.agents/skills/gemini-api-integration` (env `GEMINI_API_KEY`) et, pour l’UI, `mobile-first-all-screens` / `ultra-design`.

---

## Architecture cible (conventions du repo)

| Élément | Emplacement recommandé |
|--------|-------------------------|
| Page principale | `douzcv-react/src/pages/CoverLetter.jsx` (ou `LettreMotivation.jsx`) |
| Aperçu imprimable | `douzcv-react/src/components/CoverLetterPreview.jsx` |
| Service IA + sérialisation CV | `douzcv-react/src/services/coverLetterService.js` |
| Export PDF partagé | Extraire la logique clone A4 de `Export.jsx` vers `douzcv-react/src/services/pdfExportService.js` **uniquement si** duplication évidente ; sinon réutiliser le même pattern inline |
| État lettre | Extension `store.js` **ou** clé persistée dédiée (`coverLetter` dans le même persist Zustand) |
| Route | `/lettre-motivation` dans `App.jsx` + lien nav (Header ou Export) |

**Ne pas** appeler Google Gemini depuis le navigateur. Toujours `generateWithGemini` depuis `douzcv-react/src/services/geminiService.js` (`POST /api/gemini`).

---

## Données à injecter dans le prompt

Construire un bloc texte structuré depuis `useCVStore` :

- `personalInfo` : prénom, nom, titre, email, téléphone, ville, résumé
- `experiences[]` : poste, entreprise, dates, description (texte plat, sans HTML)
- `education[]`, `skills[]`, `languages[]`
- `selectedTemplate` : pour le **ton** (voir [reference.md](reference.md))
- Champs **spécifiques lettre** (UI) : entreprise cible, intitulé du poste, référence offre, texte de l’annonce (optionnel), ton souhaité (formel / dynamique)

Fonction utilitaire suggérée : `buildCvContextSnapshot(state)` dans `coverLetterService.js`.

---

## Flux utilisateur

```
1. Saisie offre (poste, entreprise, annonce collée)
2. [Générer avec l'IA] → generateWithGemini({ prompt, systemInstruction })
3. Édition manuelle (textarea ou RichTextEditor léger — éviter Quill si inutile)
4. Prévisualisation A4 (.cover-letter-preview-container)
5. Télécharger PDF (html2pdf.js + file-saver, pattern Export.jsx)
6. (Optionnel) Regénérer un paragraphe via InlineAIAssistant avec contextType dédié
```

États UI : loading, erreur Gemini (message `error` du proxy), succès téléchargement.

---

## Instructions système Gemini (lettre)

Utiliser une consigne dédiée, plus stricte que le CV :

- Format lettre française professionnelle : en-tête coordonnées, lieu + date, objet, formule d’appel, 3–4 paragraphes, formule de politesse, signature (nom)
- **Interdit** : markdown, titres `#`, listes sauf si l’utilisateur le demande, meta-commentaires (« Voici votre lettre… »)
- Ancrer chaque paragraphe sur des **faits du CV** ; ne pas inventer de diplômes ou postes absents du snapshot
- Longueur cible : **250–400 mots** (une page A4 max)

Modèle de prompt utilisateur : voir [reference.md](reference.md).

---

## Cohérence avec les modèles CV

Les 12 modèles (`Templates.jsx`) définissent le **registre** de la lettre, pas le layout PDF (la lettre reste typographie A4 classique, couleur d’accent `accentColor` + `fontFamily` du store).

Exemples :

- `Le Minimaliste (ATS)` → phrases courtes, mots-clés métier
- `Le Créatif` / `Le Portfolio Visuel` → ton plus personnel, ouverture mémorable (sans familiarité excessive)
- `L'Académique & Recherche` → rigueur, projets, publications si présents
- `Le Polyvalent Pro-Afrique` → contexte local, impact terrain, bilingualité si `languages` le justifie

Table complète : [reference.md](reference.md).

---

## Export PDF

Réutiliser le pattern éprouvé de `douzcv-react/src/pages/Export.jsx` :

1. `await document.fonts.ready`
2. Clone off-screen 794×1123 px, `transform: none`
3. `html2pdf` : `scale: 2`, `format: [794, 1123]`, `hotfixes: ["px_scaling"]`
4. `saveAs(blob, filename)` — nom : `Lettre_${lastName}_${firstName}.pdf` (même logique de fallback que `getExportFilename`)

Classe conteneur stable : `.cover-letter-preview-container` (ne pas réutiliser `.cv-preview-container` pour éviter les effets de bord).

---

## Checklist d’implémentation

```
- [ ] Route + navigation depuis Éditeur ou Export
- [ ] Champs offre + état lettre dans store (persist)
- [ ] coverLetterService : snapshot CV + prompts
- [ ] Appels generateWithGemini uniquement
- [ ] Preview A4 + export PDF testé (Chrome/Edge)
- [ ] Messages d’erreur si GEMINI_API_KEY absente (503)
- [ ] Responsive mobile-first (formulaire empilé, preview scrollable)
- [ ] Pas de clé API en localStorage pour la génération
```

---

## Anti-patterns

- Dupliquer toute la logique modèles CV (`CreativeTemplate`, etc.) pour la lettre
- Nouvelle dépendance PDF si `html2pdf.js` suffit
- Générer une lettre générique sans `selectedTemplate` ni snapshot CV
- Stocker l’annonce ou la lettre côté serveur (reste local / Zustand + IndexedDB comme le CV)

---

## Ressources

- Prompts et tons par modèle : [reference.md](reference.md)
- IA CV existante : `geminiService.js`, `InlineAIAssistant.jsx`
- Modèles CV : `douzcv-react/src/pages/Templates.jsx`, `CVPreview.jsx`
