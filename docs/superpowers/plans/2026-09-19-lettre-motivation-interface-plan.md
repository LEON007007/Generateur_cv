# Plan d'implémentation — Interface Lettre de motivation

**Date :** 2026-09-19  
**Périmètre :** uniquement la fonctionnalité `/lettre-motivation`  
**Design approuvé :** refonte ciblée de l'interface Lettre de motivation validée dans la conversation

## Objectif

Transformer la page Lettre de motivation en un flux lisible et guidé : saisie des informations de candidature dans le panneau gauche, génération et réécriture IA dans une section distincte, aperçu A4 principalement visuel à droite, puis export PDF fiable.

## Hors périmètre

- Ne pas modifier les modèles CV, l'éditeur CV ou la galerie.
- Ne pas modifier la route Gemini globale ni les autres assistants IA.
- Ne pas introduire une nouvelle dépendance UI ou PDF.
- Ne pas remplacer Zustand, `html2pdf.js` ou le proxy Gemini existant.

## Fichiers concernés

- `douzcv-react/src/pages/CoverLetter.jsx`
- `douzcv-react/src/components/CoverLetterPreview.jsx`
- `douzcv-react/src/components/CoverLetterEditable.jsx`
- `douzcv-react/src/components/SignaturePad.jsx`
- `douzcv-react/src/services/coverLetterService.js`
- `douzcv-react/src/services/pdfExportService.js`
- `douzcv-react/src/index.css`

## Dépendances et décisions

- L'état reste dans `coverLetter` du store Zustand et reste persisté par le middleware existant.
- Les appels IA passent exclusivement par `generateWithGemini` et `/api/gemini`.
- Le modèle de lettre continue d'utiliser `COVER_LETTER_TEMPLATES` pour la typographie, l'accent et le layout A4.
- Les valeurs utilisées pour l'aperçu et le PDF restent les mêmes données contrôlées par React.
- La signature est dessinée uniquement sur un canvas ; l'import d'image n'est pas prévu.
- La donnée persistée est une image PNG compacte dans `coverLetter.signatureImage`.

## Tâches

### 1. Restructurer le panneau gauche de `CoverLetter.jsx`

**Fichier :** `douzcv-react/src/pages/CoverLetter.jsx`  
**Dépendances :** aucune

- Regrouper les champs `jobTitle`, `companyName`, `jobReference` et `jobDescription` dans un bloc « Informations de candidature » visible avant les actions IA.
- Ajouter dans ce même panneau un champ calendrier `input type="date"` pour `letterDate`, avec une valeur persistée au format ISO `YYYY-MM-DD` et un libellé clair « Date de la lettre ».
- Ajouter des champs contrôlés qui utilisent `mergeCoverLetter` ou `updateCoverLetter` sans créer un second état local.
- Conserver la sélection du modèle de lettre, mais la présenter comme un réglage de style séparé.
- Organiser les actions dans l'ordre : générer le corps, réécrire avec IA, afficher l'erreur, télécharger le PDF.
- Conserver les états `isGenerating`, `isExporting`, `error` et `downloadSuccess`.
- Ajouter des labels et attributs accessibles (`htmlFor`, `id`) aux champs ajoutés.

**Vérification :** ouvrir `/lettre-motivation`, modifier chaque champ, sélectionner une date dans le calendrier, recharger la page et confirmer que toutes les valeurs persistées réapparaissent.

### 2. Simplifier les contrôles de l'aperçu A4

**Fichier :** `douzcv-react/src/components/CoverLetterPreview.jsx`  
**Dépendance :** tâche 1

- Garder dans l'aperçu uniquement les retouches indispensables à la lettre : destinataire, adresse, objet, salutation, corps, formule de politesse et signature.
- Déplacer le contexte de l'annonce hors de la page A4 vers le panneau gauche ; il doit rester exclu du PDF.
- Retirer l'édition directe de la date dans l'aperçu : la date affichée sur la lettre doit provenir du calendrier du panneau gauche.
- Afficher la date choisie au format français lisible (`19 septembre 2026`) dans l'aperçu, tout en conservant la valeur ISO dans le store.
- Éviter la duplication entre nom du destinataire et entreprise.
- Afficher `letter.subject` comme objet éditable sans réintroduire automatiquement le préfixe dans le composant.
- Conserver le lien « Modifier mes coordonnées » comme contrôle non imprimé.
- Préserver `data-template`, `.cover-letter-preview-container` et les classes nécessaires à l'export.

**Vérification :** saisir une entreprise, un destinataire, une date, un objet et un corps ; confirmer que la date affichée correspond au calendrier, qu'aucune valeur n'est répétée et que l'aperçu reste dans une page A4.

### 3. Stabiliser les champs éditables de lettre

**Fichier :** `douzcv-react/src/components/CoverLetterEditable.jsx`  
**Dépendance :** tâche 2

- Conserver une API unique pour les champs simples et multilignes.
- Ajouter les propriétés d'accessibilité nécessaires sans casser les appels actuels (`value`, `onChange`, `placeholder`, `rows`, `className`, `style`).
- Prévoir un comportement cohérent pour les champs inline sur petit écran : retour à la ligne acceptable et largeur minimale stable.
- Ne pas transformer le calendrier en champ inline dans l'aperçu ; l'édition de la date reste centralisée dans le panneau de formulaire.
- Ne pas introduire d'éditeur riche ou de nouvelle dépendance.

**Vérification :** tester saisie clavier, collage, navigation clavier, champ multiline et affichage mobile.

### 4. Ajuster la normalisation et le prompt de lettre

**Fichier :** `douzcv-react/src/services/coverLetterService.js`  
**Dépendance :** tâche 1

- Conserver `ensureLetterStructure` comme point unique de valeurs par défaut.
- Ajouter une normalisation de date : accepter l'ancien format textuel éventuellement présent dans le localStorage, mais produire une valeur ISO exploitable par `input type="date"` ; formater uniquement au moment de l'affichage.
- Garantir que l'objet dérivé du poste ne remplace pas un objet modifié manuellement.
- Limiter la taille de `jobDescription` avant construction du prompt afin d'éviter une annonce démesurée ; choisir une limite explicite et la documenter dans le code si nécessaire.
- Conserver le snapshot CV en texte plat et l'utilisation du ton lié au modèle sélectionné.
- Vérifier que la consigne IA demande uniquement le corps de la lettre, puisque l'interface fournit déjà l'en-tête et la formule de politesse.

**Vérification :** tester le prompt avec champs vides, date choisie, annonce longue, objet personnalisé et modèles de lettre différents ; vérifier que la date n'est pas envoyée comme donnée ambiguë au prompt si elle ne sert qu'à l'en-tête.

### 5. Fiabiliser l'export PDF après la nouvelle structure

**Fichier :** `douzcv-react/src/services/pdfExportService.js`  
**Dépendance :** tâche 2

- Conserver le clone A4 de 794 × 1123 px et le nettoyage des éléments `.cover-letter-no-print`.
- Vérifier que les valeurs des `input`, `textarea` et `select` présents dans l'aperçu sont recopiées dans le clone avant `html2pdf`.
- Vérifier que le panneau de formulaire, l'assistant IA et le contexte d'annonce ne sont pas exportés.
- Préserver le nom de fichier et le téléchargement via `file-saver`.

**Vérification :** remplir une lettre complète, exporter, puis ouvrir le PDF et confirmer la présence du destinataire, objet, corps, formule et signature.

### 6. Recomposer les styles de la page lettre

**Fichier :** `douzcv-react/src/index.css`  
**Dépendances :** tâches 1 à 3

- Transformer le panneau gauche en sections visuellement hiérarchisées, sans cartes imbriquées excessives.
- Donner au panneau droit un fond de travail neutre et centrer l'A4 avec une largeur stable.
- Améliorer la lisibilité des champs de candidature, des actions IA et du bouton PDF.
- Styliser le champ calendrier comme un contrôle de formulaire cohérent avec les autres champs, avec état focus, date lisible et largeur stable.
- Réduire la densité des contrôles présents dans l'aperçu imprimable.
- Pour `max-width: 900px`, empiler le formulaire et l'aperçu ; garder l'A4 lisible avec défilement horizontal ou conteneur adapté, sans débordement de la page entière.
- Ajouter les états focus, disabled, erreur et chargement sans modifier les styles des autres pages.

**Vérification :** tester au minimum une largeur desktop, tablette et mobile ; vérifier qu'aucun texte, bouton ou champ ne se chevauche.

### 7. Validation ciblée de la fonctionnalité

**Fichiers :** fichiers modifiés ci-dessus  
**Dépendances :** tâches 1 à 6

- Exécuter `npm --prefix douzcv-react run lint`.
- Exécuter `npm run build`.
- Vérifier les diagnostics VS Code sur les fichiers de la lettre.
- Tester manuellement le parcours : ouvrir la route, saisir les informations, générer ou réécrire, modifier le texte, recharger, puis exporter PDF.
- Tester le calendrier : choisir une date, vérifier l'affichage français dans l'aperçu, recharger, changer la date, puis exporter un PDF contenant la nouvelle date.
- Tester l'état sans clé backend Gemini : afficher un message d'erreur compréhensible sans casser l'édition manuelle ni l'export d'une lettre déjà rédigée.
- Tester une lettre vide : le bouton PDF doit rester désactivé ou afficher l'erreur prévue.

### 8. Ajouter la signature numérique dessinée

**Fichiers :** `douzcv-react/src/components/SignaturePad.jsx`, `douzcv-react/src/pages/CoverLetter.jsx`, `douzcv-react/src/components/CoverLetterPreview.jsx`, `douzcv-react/src/store.js`, `douzcv-react/src/index.css`  
**Dépendances :** tâches 1 à 6

- Ajouter `signatureImage: ''` dans `defaultState.coverLetter` et préserver les anciennes lettres qui ne possèdent pas encore ce champ.
- Créer `SignaturePad` avec un `<canvas>` de dimensions stables et les Pointer Events pour souris, tactile et stylet.
- Dessiner avec une échelle adaptée au `devicePixelRatio`, convertir le canvas en PNG Data URL et l'enregistrer via `mergeCoverLetter` ou une action dédiée.
- Afficher le bloc « Signature numérique » en bas du panneau gauche, avec un bouton accessible au clavier pour effacer et recommencer.
- Afficher immédiatement `signatureImage` dans l'aperçu A4.
- Marquer le canvas, son libellé et ses boutons avec `.cover-letter-no-print`; seule l'image finale doit apparaître dans le PDF.
- Prévoir l'état vide, l'état dessiné, le nettoyage, l'annulation Pointer Event et une limite de taille du Data URL pour éviter de surcharger le localStorage.

**Vérification :** dessiner à la souris, au tactile et avec un stylet ; effacer puis redessiner ; vérifier l'apparition immédiate dans l'aperçu, la persistance après rechargement et la présence de l'image sans les contrôles dans le PDF.

## Critères d'acceptation

- Les informations de candidature sont saisies dans le panneau gauche et persistent après rechargement.
- La date de la lettre est choisie dans un calendrier du panneau gauche, persistée au format ISO et affichée en français dans l'aperçu et le PDF.
- L'aperçu A4 est lisible, sans répétition du destinataire ou de l'entreprise.
- L'objet affiché correspond à `letter.subject` et peut être modifié.
- Le contexte de l'offre n'apparaît jamais dans le PDF.
- La génération IA utilise le CV actif et le modèle sélectionné via le proxy existant.
- Le PDF reprend les valeurs visibles dans l'aperçu.
- La signature est dessinée uniquement dans le panneau gauche, apparaît immédiatement dans la lettre en cours de modification et est incluse dans le PDF.
- Aucun canvas ni contrôle de dessin n'apparaît dans le PDF.
- L'interface reste utilisable sur desktop et mobile.
- Les validations de build et lint passent, hors avertissements préexistants non liés à cette fonctionnalité.
