# Recherche, Scraping & Vue Tableur des Candidatures Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Intégrer un système complet d'agrégation/scraping d'offres d'emploi des 30 derniers jours (100% compatible Node.js local et Vercel Serverless) avec une vue tableur interactive ("Spreadsheet") dans la section Mes Candidatures permettant le tri, la recherche, l'export CSV et l'import/évaluation en 1 clic dans le suivi de candidature et le comparateur IA.

**Architecture:** 
- Backend : Un module d'extraction/agrégation résilient (`jobScraperService.js`) interrogeant les portails d'emploi camerounais (notamment JobInfoCamer avec recherche en direct) et flux d'offres compatibles, avec normalisation des dates sur les 30 derniers jours. Exposé via Express local (`server.js`) et Vercel Serverless Function (`api/jobs.js`).
- Frontend : Un service client (`jobSearchService.js`) avec export CSV/Excel et import, et un composant React Tableur moderne (`JobSpreadsheet.jsx`) intégré dans `Applications.jsx` avec bascule fluide Vue Kanban / Vue Tableur.
- Complément Python : Un script CLI Python d'appoint (`scripts/scrape_jobs.py`) permettant à l'utilisateur d'exécuter un scraping local autonome et de réimporter le CSV/JSON dans le tableur.

**Tech Stack:** Node.js (fetch natif, regex & DOM parsing résilient), Express 5, React 19, Zustand, Lucide Icons, CSS Vanilla, Vercel Serverless, Python 3.14 (CLI helper).

**Spec:** Option 2 validée par l'utilisateur — Solution 100% Node / Serverless compatible Vercel avec vue tableur des offres des 30 derniers jours.

## Global Constraints

- Compatibilité totale Vercel Serverless (pas de dépendances natives C++ ni de navigateurs headless lourds comme Puppeteer/Playwright dans la fonction serverless).
- Préservation de la sécurité et de la résilience : timeouts maîtrisés (8s max par source), fallback gracieux avec messages clairs en cas d'indisponibilité d'une source.
- Mobile-first : Le tableur doit être parfaitement utilisable sur smartphone (défilement horizontal fluide ou cartes adaptatives) et sur grand écran (grille dense, header sticky).
- Synchronisation Zustand : L'action d'ajout depuis le tableur doit alimenter directement le store local `useCVStore` existant sans rechargement.

---

### Task 1: Création du service d'agrégation et de scraping d'offres côté serveur

**Files:**
- Create: `api/services/jobScraperService.js`
- Test: `scratch/test_job_scraper.js`

**Interfaces:**
- Produces: `searchJobOffers({ query, city, days, source })` -> `Promise<Array<JobOffer>>`
- Type `JobOffer`: `{ id, title, company, city, country, contractType, publishedAt, daysAgo, url, description, source }`

- [ ] **Step 1: Créer le module scraper unifié avec parsing robuste**
  Implémenter `jobScraperService.js` avec :
  - Support de recherche live JobInfoCamer (`/search/?job-search=...`) avec extraction du titre, entreprise, ville, type de contrat, lien direct et calcul de date relative/ISO.
  - Support des offres complémentaires (flux d'opportunités remote / francophones).
  - Filtrage temporel strict (par défaut `<= 30 jours`, configurable).
  - Cache en mémoire simple (TTL 10 min) pour minimiser les requêtes répétitives.

- [ ] **Step 2: Créer le test scratch et vérifier l'extraction**
  Exécuter un test Node pour vérifier que `searchJobOffers({ query: 'commercial', days: 30 })` retourne des offres formatées avec dates valides.

---

### Task 2: Exposition de l'API locale Express & Vercel Serverless

**Files:**
- Create: `api/jobs.js` (pour Vercel)
- Modify: `server.js` (pour le serveur Express local)
- Modify: `vercel.json` (pour garantir le routage de `/api/*`)

**Interfaces:**
- Consumes: `searchJobOffers` de `jobScraperService.js`
- Produces: Routes `GET /api/jobs` et `POST /api/jobs` retournant `{ success: true, count: number, query: string, days: number, jobs: Array<JobOffer> }`

- [ ] **Step 1: Créer la fonction serverless Vercel `api/jobs.js`**
  Prend en charge `request.query` (GET) et `request.body` (POST) avec paramètres `query`, `city`, `days`, `source`.

- [ ] **Step 2: Mettre à jour `server.js` pour le mode local**
  Ajouter les routes `app.get('/api/jobs', ...)` et `app.post('/api/jobs', ...)` branchées sur le scraper.

- [ ] **Step 3: Mettre à jour `vercel.json`**
  Ajouter la règle explicite `{ "source": "/api/(.*)", "destination": "/api/$1" }` avant le wildcard `/(.*)`.

- [ ] **Step 4: Valider les endpoints avec un appel curl/fetch local**
  Tester l'endpoint `http://localhost:3001/api/jobs?query=commercial` et valider la structure JSON.

---

### Task 3: Service client React & Utilitaires d'Export/Import Tableur

**Files:**
- Create: `douzcv-react/src/services/jobSearchService.js`

**Interfaces:**
- Produces:
  - `fetchJobOffers({ query, city, days, source, signal })`
  - `exportJobsToCSV(jobs, filename)`
  - `parseJobsFromCSV(csvText)`

- [ ] **Step 1: Créer `jobSearchService.js`**
  - Fonction d'appel à `/api/jobs` avec timeout et `AbortController`.
  - Fonction d'export CSV universel (avec UTF-8 BOM `\uFEFF`, délimiteur point-virgule, protection des sauts de ligne pour Excel).
  - Fonction d'import/parsing de fichier CSV pour charger des offres externes.

---

### Task 4: Composant React Tableur Interactif (`JobSpreadsheet.jsx`)

**Files:**
- Create: `douzcv-react/src/components/JobSpreadsheet.jsx`
- Modify: `douzcv-react/src/pages/Applications.jsx`
- Modify: `douzcv-react/src/index.css`

**Interfaces:**
- Consumes: `useCVStore` (pour `addApplication`, `applications`), `fetchJobOffers`, `exportJobsToCSV`
- Produces: Vue tableur dynamique avec tri par colonne, recherche textuelle instantanée, sélection multiple, boutons d'ajout direct au suivi et évaluation IA.

- [ ] **Step 1: Développer le composant `JobSpreadsheet.jsx`**
  - Barre de contrôle supérieure : Recherche de mot-clé, filtre de ville, filtre de période (7j, 14j, 30j, tout), bouton "Rechercher", bouton "Exporter CSV", bouton "Importer fichier".
  - Grille tableur : En-têtes cliquables pour le tri (Date, Titre, Entreprise, Localisation, Type, Source).
  - Lignes de tableau : Checkbox de sélection, badges colorés, bouton `+ Ajouter au suivi`, bouton `Évaluer avec l'IA`, lien externe vers l'annonce.
  - État vide, état de chargement avec squelettes/spinner, et gestion des erreurs avec réessai.

- [ ] **Step 2: Intégrer le commutateur de vue dans `Applications.jsx`**
  - Boutons de bascule d'affichage : `[ Tableau Kanban ]` / `[ Tableur du marché (30j) ]`.
  - Synchronisation bidirectionnelle : une offre ajoutée depuis le tableur apparaît immédiatement dans le Kanban comme `interested`.
  - Possibilité de lancer l'analyse IA Gemini directement depuis une ligne du tableur.

- [ ] **Step 3: Ajouter les styles CSS haute finition dans `index.css`**
  - Styles tableur : conteneur avec scroll horizontal fluide sur mobile, sticky header, hover states, transitions douces, boutons tactiles 44px min.

---

### Task 5: Script Python autonome d'appoint (`scripts/scrape_jobs.py`)

**Files:**
- Create: `scripts/scrape_jobs.py`
- Create: `scripts/README.md`

- [ ] **Step 1: Écrire le script Python CLI `scripts/scrape_jobs.py`**
  - Script utilisant les modules natifs (`urllib.request`, `json`, `csv`, `argparse`, `html`) ou `requests`/`bs4` si disponibles.
  - Arguments : `--query`, `--city`, `--days` (défaut 30), `--output` (défaut `candidatures_30j.csv`).
  - Permet à l'utilisateur d'exécuter `py scripts/scrape_jobs.py --query "comptable" --days 30` et d'obtenir un fichier CSV directement importable dans le Tableur de l'application.

---

### Task 6: Tests, validation responsive et vérification finale

- [ ] **Step 1: Tester le build Vite et le linter**
  Vérifier `npm run build` dans `douzcv-react` sans erreur.

- [ ] **Step 2: Tester le flux complet utilisateur**
  - Lancer une recherche dans le tableur.
  - Filtrer les 30 derniers jours.
  - Ajouter une offre au suivi Kanban en 1 clic.
  - Vérifier l'analyse IA sur l'offre ajoutée.
  - Télécharger l'export CSV et vérifier le fichier.
