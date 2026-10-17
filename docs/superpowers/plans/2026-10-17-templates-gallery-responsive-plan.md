# Plan d'implémentation — Galerie de modèles responsive

**Date :** 2026-10-17  
**Conception de référence :** direction validée dans la conversation du 2026-10-17 : catalogue de modèles professionnel, comparer facilement les aperçus, adapter la navigation à l'écran, sans remplacer la grille par une vitrine à modèle unique.  
**Compétences de conception :** `brainstorming`, `writing-plans`, `frontend-art-director` et `.agents/skills/mobile-first-all-screens/SKILL.md`.  
**Périmètre :** route `/modeles`, composants et styles de la galerie, avec adaptation minimale de l'en-tête partagé aux petits écrans.

## Objectif

Rendre les 12 modèles faciles à parcourir, comparer et sélectionner sur ordinateur, tablette et téléphone. Préserver les filtres, l'aperçu correspondant à chaque vrai modèle, la sélection persistée dans Zustand et la navigation vers `/editeur`.

## Hors périmètre

- Ne pas modifier le contenu ou le fonctionnement des modèles eux-mêmes, l'éditeur CV, l'export ou la génération IA.
- Ne pas ajouter de dépendance, de filtres métier, de modèles, de badges ou de statistiques fictifs.
- Ne pas changer le flux de sélection (`setSelectedTemplate`, `setAccentColor`, navigation vers `/editeur`).
- Ne pas refactoriser globalement l'en-tête ou les règles responsive des pages Lettre et Export; les ajustements partagés doivent être confinés à ses classes existantes et aux breakpoints nécessaires.
- Ne pas écraser les modifications utilisateur déjà présentes dans `Templates.jsx` et `index.css`. En particulier, préserver le retrait local des compteurs de catégories et des imports Lucide inutilisés.

## Hypothèses et dépendances

- `Templates.jsx` est le propriétaire de la route `/modeles`; `TemplateCard` rend les aperçus et déclenche la sélection.
- Les 12 images `/templates/cv_*.jpg` existent déjà. Le composant dispose d'un aperçu de secours `TemplateThumbnail` en cas d'échec d'image.
- Le store Zustand reste l'unique source de vérité pour `selectedTemplate` et `accentColor`.
- Les styles applicatifs partagés sont dans `douzcv-react/src/index.css`; ce fichier contient déjà plusieurs centaines de lignes de modifications locales, dont des règles mobiles de galerie en `!important` ajoutées tard dans le fichier. L'implémentation devra consolider uniquement les règles `.templates-*` pertinentes, sans nettoyer le reste.
- Composition visée : 4 colonnes sur grand écran, 3 colonnes sur ordinateur/tablette large, 2 colonnes sur tablette compacte; une liste de cartes compactes sur téléphone pour conserver une taille d'aperçu lisible sans imposer douze cartes pleine hauteur.
- Les aperçus doivent préserver la page entière (proportion A4, `object-fit: contain`) plutôt que zoomer/couper le CV.
- Les filtres de catégorie restent les quatre catégories présentes et « Tous les modèles ». Sur mobile, ils deviennent une rangée horizontale à défilement tactile plutôt qu'un menu différent.

## Stratégie de vérification

- `npm --prefix douzcv-react run build`
- `npm --prefix douzcv-react run lint`
- Vérification navigateur à 320 × 640, 375 × 812, 640 × 900, 900 × 900, 1024 × 768 et 1360 × 900; redimensionnement entre ces tailles pour repérer les ruptures.
- Parcours fonctionnel : chaque filtre réduit la liste correctement; sélectionner un modèle actualise l'état visuel et ouvre `/editeur`; revenir à `/modeles` conserve l'état attendu du store.
- Vérifier navigation au clavier, focus visible, activation des cartes par Entrée/Espace, cibles tactiles d'au moins 44 px, texte long, aperçu image complet, fallback d'image, absence de débordement horizontal et en-tête sans commande essentielle masquée.
- Aucune suite de tests dédiée à la galerie n'est définie dans `package.json`; la validation visuelle et le build/lint constituent les contrôles disponibles.

## Tâches

### 1. Rendre les cartes de modèle sémantiques et comparables

**Fichier :** `douzcv-react/src/pages/Templates.jsx`  
**Symboles :** `TemplateCard`, `TemplateThumbnail`, `templatesList`, `handleSelectTemplate`  
**Dépendances :** aucune

- Remplacer le conteneur cliquable `div.card` par un contrôle clavier natif adapté à l'action de sélection, avec nom accessible et état sélectionné exposé (`aria-pressed` ou équivalent).
- Conserver exactement l'identifiant du modèle, la sélection persistée, la couleur d'accent et la navigation vers `/editeur`.
- Centraliser le chemin d'aperçu image par modèle dans une table de correspondance lisible; garder `TemplateThumbnail` comme fallback et conserver un texte alternatif utile.
- Rendre les données déjà disponibles et utiles à la comparaison : catégorie, titre, description et badge déjà défini dans les objets modèles. Ne pas inventer de contenu.
- Retirer les hauteurs fixes et styles de structure inline des cartes au profit de classes CSS; garder les styles inline uniquement pour la couleur d'accent dynamique si nécessaire.
- Ajouter `loading="lazy"` et `decoding="async"` aux aperçus qui ne sont pas dans le premier écran.

**Vérification :** confirmer que les 12 cartes rendent une source d'image correcte ou le fallback, que l'état choisi est annoncé et visible, et que clic, Entrée et Espace sélectionnent le modèle puis ouvrent `/editeur`.

### 2. Unifier le filtre et la hiérarchie de la page

**Fichier :** `douzcv-react/src/pages/Templates.jsx`  
**Symboles :** `Templates`, `categories`, `filteredTemplates`, `isDropdownOpen`  
**Dépendances :** tâche 1

- N'avoir qu'une seule barre de filtres, réutilisant la liste `categories` et `filterCategory` déjà contrôlée par React.
- Présenter les filtres en boutons de taille tactile, avec état actif explicite et attribut accessible (`aria-pressed`); autoriser le défilement horizontal sur téléphone sans provoquer de défilement horizontal de toute la page.
- Supprimer l'interface dropdown et `isDropdownOpen` si elle n'est plus utilisée; ne pas ajouter de compteur de catégorie, puisque les modifications locales actuelles les ont retirés.
- Hiérarchiser le titre « Modèles », sa phrase d'introduction et la grille; afficher le nombre de résultats uniquement s'il est calculé directement depuis `filteredTemplates.length` et ne pas en faire une promesse marketing.
- Prévoir un état vide accessible même si les catégories présentes contiennent actuellement des modèles.

**Vérification :** changer les cinq filtres à la souris et au clavier; confirmer la bonne liste, l'état actif, l'état vide de secours et l'absence de menu résiduel.

### 3. Recomposer grille, aperçus et en-tête selon la largeur

**Fichier :** `douzcv-react/src/index.css`  
**Sélecteurs :** `.templates-page`, `.templates-filter-*`, `.templates-grid`, `.templates-grid .card`, styles d'aperçu et classes existantes de `.app-header`, `.header-left`, `.header-nav`, `.user-account-badge`  
**Dépendances :** tâches 1 et 2

- Donner à la page un conteneur centré, une largeur de lecture stable et une hiérarchie typographique cohérente avec le thème bleu nuit/corail du produit.
- Consolider toutes les règles `.templates-*` existantes, notamment les blocs tardifs `@media` en `!important`, dans une seule séquence claire; ne pas supprimer les autres modifications CSS du fichier.
- Grille fluide : 4 colonnes sur grand écran, 3 sur largeur intermédiaire, 2 sur tablette compacte. Sur téléphone, passer à une liste de cartes horizontales compactes avec aperçu proportionnel à gauche et catégorie/titre/description/état de sélection à droite.
- Définir une proportion d'aperçu A4 stable et afficher la page entière avec `object-fit: contain`; réserver la hauteur à l'image et laisser le texte et l'état sélectionné déterminer la hauteur de carte, sans découpe du contenu.
- Utiliser une surface de carte claire, bordure fine, rayon sobre, ombre légère; hover uniquement comme amélioration desktop. Le choix et son indication doivent rester visibles au tactile et au clavier.
- Garder une seule navigation globale lisible sur petit écran, avec zones tactiles adéquates et possibilité de faire défiler la barre nav sans cacher l'accès au compte; limiter les changements aux classes de l'en-tête partagé existantes.
- Ajouter des états `:focus-visible`, sélection, chargement d'image/fallback et `prefers-reduced-motion`; ne pas dépendre du survol pour révéler une action nécessaire.

**Vérification :** examiner les six tailles prévues; confirmer la transition 4 → 3 → 2 colonnes → lignes compactes, la visibilité entière des aperçus, l'en-tête utilisable, le focus, les cibles tactiles et l'absence de débordement.

### 4. Valider la galerie et ses pages adjacentes

**Fichiers :** `douzcv-react/src/pages/Templates.jsx`, `douzcv-react/src/index.css`  
**Dépendances :** tâches 1 à 3

- Exécuter build et lint avec les scripts existants.
- Tester le filtre, la sélection des 12 modèles, la navigation vers l'éditeur et la persistance de la sélection.
- Vérifier que les règles de l'en-tête restent utilisables sur `/editeur` et `/lettre-motivation`, sans modifier leurs flux.
- Comparer `git status` avant/après et confirmer que seuls les changements approuvés ont été ajoutés; ne pas réinitialiser les modifications locales présentes.

**Vérification :** build réussi; lint sans nouvelle erreur, les avertissements préexistants étant consignés; résultats visuels et fonctionnels confirmés sur téléphone, tablette et desktop.

**Dépendances :** tâches 1, 2 et 3.