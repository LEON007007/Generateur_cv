# Référence — prompts et tons (lettre de motivation douzCv)

## Prompt utilisateur (template)

Remplacer les placeholders ; ne pas envoyer de HTML.

```
Rédige une lettre de motivation en français pour le poste suivant.

POSTE : {{jobTitle}}
ENTREPRISE : {{companyName}}
{{#if jobReference}}RÉFÉRENCE OFFRE : {{jobReference}}{{/if}}
{{#if jobDescription}}
DESCRIPTION DE L'OFFRE (extraits) :
{{jobDescription}}
{{/if}}

PROFIL DU CANDIDAT (extrait du CV douzCv, modèle « {{selectedTemplate}} ») :
{{cvSnapshot}}

CONSIGNES DE TON : {{toneGuidance}}

Produis uniquement le corps complet de la lettre (coordonnées en en-tête si présentes dans le CV), prête à imprimer.
```

## Consigne système (à passer à `generateWithGemini`)

```
Tu rédiges des lettres de motivation professionnelles en français pour la plateforme douzCv.
Règles :
- Sortie = texte final de la lettre uniquement, sans préambule ni commentaire.
- Structure : en-tête (nom, contact si fournis), lieu et date, objet, « Madame, Monsieur, », corps en paragraphes, formule de politesse, signature (prénom nom).
- Appuie-toi uniquement sur le profil CV fourni ; n'invente pas d'expérience, diplôme ou certification.
- Adapte le registre selon la consigne de ton liée au modèle CV.
- 250 à 400 mots maximum.
```

## Ton par modèle CV (`selectedTemplate`)

| Modèle | `toneGuidance` |
|--------|----------------|
| L'Exécutif | Leadership, résultats chiffrés, vision stratégique, formel |
| Le Minimaliste (ATS) | Phrases courtes, mots-clés de l'offre, direct |
| L'Académique & Recherche | Rigueur, méthode, publications/projets du CV |
| Le Tech Lead | Impact technique, delivery, équipe, stack si mentionnée |
| Le Silicon Valley | Impact produit, growth mindset, concision |
| L'Ingénieur & Industriel | Sécurité, process, terrain, conformité |
| Le Créatif | Voix distinctive, accroche soignée, rester professionnel |
| L'Élégant Prestige | Élégance, discrétion, excellence de service |
| Le Portfolio Visuel | Réalisations concrètes, sens esthétique lié au métier |
| Le Condensé 1-Page | Ultra-synthétique, une idée forte par paragraphe |
| L'International / Expat | Mobilité, langues du CV, adaptabilité culturelle |
| Le Polyvalent Pro-Afrique | Impact local, polyvalence, contexte africain si pertinent |

## Snapshot CV (exemple de structure texte)

```
Nom : {{firstName}} {{lastName}}
Titre : {{title}}
Résumé : {{summaryPlain}}
Expériences :
- {{exp.title}} @ {{exp.company}} ({{exp.startDate}}–{{exp.endDate}}) : {{exp.descriptionPlain}}
Formation :
- {{edu.degree}} — {{edu.school}}
Compétences : {{skillsJoined}}
Langues : {{languagesJoined}}
```

## Presets UI (boutons rapides)

| Label | Prompt additionnel |
|-------|-------------------|
| Aligner sur l'offre | Réutilise le vocabulaire de la description d'offre sans copier mot pour mot. |
| Plus concis | Réduis à 200 mots max en gardant l'essentiel. |
| Plus formel | Registre soutenu, vouvoiement strict. |
| Relancer après refus | Ton respectueux pour candidature spontanée de suivi (sans mentionner un refus fictif). |

## Intégration `InlineAIAssistant`

Ajouter `contextType: 'coverLetter'` avec presets ci-dessus ; `userRole` = `personalInfo.title` ; `extraContext` = entreprise + poste.
