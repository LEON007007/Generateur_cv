# ⚡ douzCv • Le Générateur de CV d'Élite Propulsé par l'IA

<div align="center">
  <img src="douzcv-react/public/images/logo-icon.svg" alt="douzCv Logo" width="100" height="100" />
  <h3>Ingénierie de Candidatures & Optimisation ATS 100% Locale</h3>
  <p>Concevez des CVs stratégiques de niveau mondial conçus pour dominer les filtres recruteurs et décrocher des entretiens.</p>
</div>

---

## ✨ Fonctionnalités Principales

- 🚀 **Scrollytelling Cinématique 240 Images** : Expérience d'accueil fluide synchronisée avec la progression du défilement (60/120 fps LERP).
- 🎯 **Simulateur de Score ATS en Temps Réel** : Diagnostic instantané de la lisibilité de votre CV par les robots recruteurs.
- 🧠 **Assistant Rédactionnel IA Gemini** : Formulation automatique des compétences et expériences selon la méthodologie STAR et des verbes d'action.
- 📄 **12 Modèles Stratégiques Rigides A4** : Structure de grille chirurgicale sans rupture ni coupure de page intempestive lors de l'export PDF.
- 🔒 **Confidentialité Totale (100% Client-Side)** : Vos données restent exclusivement sur votre appareil grâce à LocalStorage et IndexedDB.
- 📱 **Interface Responsive & Bento Grid 2.0** : Conçue pour une fluidité absolue sur mobile, tablette et écran desktop.

---

## 🛠️ Stack Technique

- **Frontend & Framework** : React 18, Vite, Vanilla HTML5 & CSS3
- **Gestion d'État & Persistance** : Zustand, LocalStorage, IndexedDB
- **Intelligence Artificielle** : Google Gemini 2.5 Flash API
- **Animations & Graphisme** : HTML5 Canvas (Scrollytelling LERP), Lucide Icons, SVG Vectoriel pur
- **Export Documentaire** : Moteur d'impression rigide et export vectoriel PDF A4

---

## 🚀 Démarrage Rapide

### Prérequis
- [Node.js](https://nodejs.org/) (version 18 ou supérieure recommandée)
- npm ou pnpm / yarn

### Installation et Lancement

1. **Cloner le dépôt :**
   ```bash
   git clone https://github.com/votre-pseudo/douzcv.git
   cd douzcv/douzcv-react
   ```

2. **Installer les dépendances :**
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement :**
   ```bash
   npm run dev
   ```

4. **Accéder à l'application :**
   Ouvrez votre navigateur sur [http://localhost:5173](http://localhost:5173).

---

## 📁 Structure du Projet

```text
generateur_cv/
├── douzcv-react/              # Application React principale
│   ├── public/                # Assets statiques, images et favicon
│   │   ├── images/            # Logos, mascottes et captures
│   │   └── page_accueil/      # Landing page avec scrollytelling
│   └── src/
│       ├── components/        # Composants React réutilisables (Header, Form, AI...)
│       ├── pages/             # Pages (Templates, Editor, Login, Export)
│       └── store.js           # Store global Zustand
├── .agents/skills/            # Compétences IA de design et identité
└── README.md                  # Documentation du projet
```

---

## 📄 Licence & Droits

Projet développé avec passion par **Leon Atangana**. Tous droits réservés.
