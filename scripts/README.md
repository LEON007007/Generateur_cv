# Scraper d'offres d'emploi (30 derniers jours) — douzCv

Ce script Python autonome permet d'extraire les offres d'emploi récentes (des 30 derniers jours) pour le Cameroun et de les exporter au format **CSV** ou **JSON**.

Le fichier généré peut être ouvert directement dans **Microsoft Excel**, **Google Sheets**, ou importé en 1 clic dans le **Tableur de l'application douzCv** (section *Mes candidatures*).

## Prérequis
- Python 3 (aucun paquet externe requis, utilise la bibliothèque standard Python).

## Utilisation

### 1. Recherche générale (30 derniers jours)
```bash
py scripts/scrape_jobs.py --query "commercial" --days 30
```
Génère le fichier `candidatures_30j.csv`.

### 2. Filtrer par ville (ex: Douala ou Yaoundé)
```bash
py scripts/scrape_jobs.py --query "comptable" --city "Douala" --days 30
```

### 3. Exporter au format JSON
```bash
py scripts/scrape_jobs.py --query "responsable" --format json --output offres.json
```

### 4. Paramètres disponibles
| Argument | Description | Exemple |
| :--- | :--- | :--- |
| `--query`, `-q` | Mot-clé ou intitulé du poste | `--query "ressources humaines"` |
| `--city`, `-c` | Ville spécifique | `--city "Douala"` |
| `--days`, `-d` | Nombre max de jours (défaut : 30) | `--days 14` |
| `--output`, `-o` | Nom du fichier de sortie | `--output mes_offres.csv` |
| `--format`, `-f` | Format de sortie : `csv` ou `json` | `--format csv` |
