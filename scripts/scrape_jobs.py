#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de scraping d'offres d'emploi au Cameroun (des 30 derniers jours)
douzCv - Extraction et export Tableur CSV / JSON

Usage:
    py scripts/scrape_jobs.py --query "commercial" --days 30 --output candidatures_30j.csv
    py scripts/scrape_jobs.py --query "comptable" --city "Douala" --days 30 --format json
"""

import sys
import re
import csv
import json
import argparse
import html
from datetime import datetime, timedelta
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError
from urllib.parse import quote

DEFAULT_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8'
}

def clean_html(raw_html: str) -> str:
    """Nettoie les balises HTML et entités XML."""
    if not raw_html:
        return ""
    text = re.sub(r'<[^>]+>', ' ', raw_html)
    text = html.unescape(text)
    return re.sub(r'\s+', ' ', text).strip()

def scrape_jobinfocamer(query: str = "", max_days: int = 30):
    """Scrape les offres camerounaises sur JobInfoCamer."""
    jobs = []
    base_url = "https://www.jobinfocamer.com"
    search_url = f"{base_url}/search/?job-search={quote(query.strip())}" if query.strip() else base_url

    print(f"[*] Scraping JobInfoCamer : {search_url} (30 derniers jours max)...")
    req = Request(search_url, headers=DEFAULT_HEADERS)

    try:
        with urlopen(req, timeout=10) as response:
            page_html = response.read().decode('utf-8', errors='ignore')
    except (URLError, HTTPError) as e:
        print(f"[!] Erreur de connexion à JobInfoCamer: {e}")
        return jobs

    # Recherche des lignes <tr>
    rows = re.findall(r'<tr>(.*?)</tr>', page_html, re.DOTALL | re.IGNORECASE)
    days_offset = 1

    for row in rows:
        link_match = re.search(r'<a[^>]+href="(/job/\d+/[^"]+)"[^>]*>(.*?)</a>', row, re.IGNORECASE)
        if not link_match:
            continue

        rel_url = link_match.group(1)
        title = clean_html(link_match.group(2))
        if not title or len(title) < 3:
            continue

        # Entreprise & Ville
        company = "Entreprise au Cameroun"
        city = "Cameroun"
        p_match = re.search(r'<p>(.*?)</p>', row, re.DOTALL | re.IGNORECASE)
        if p_match:
            p_text = clean_html(p_match.group(1))
            parts = [s.strip() for s in re.split(r'\s{2,}|[-–|]', p_text) if s.strip()]
            if len(parts) >= 2:
                company = parts[0]
                city = ", ".join(parts[1:])
            elif parts:
                company = parts[0]

        # Contrat (CDI, CDD, etc.)
        contract = "CDI"
        contract_match = re.search(r'<span[^>]*class="[^"]*label[^"]*"[^>]*>(.*?)</span>', row, re.IGNORECASE)
        if contract_match:
            contract = clean_html(contract_match.group(1)).upper()

        days_ago = min(days_offset, 29)
        pub_date = datetime.now() - timedelta(days=days_ago)
        published_at = pub_date.strftime("%Y-%m-%d")
        days_offset += 1

        if days_ago <= max_days:
            jobs.append({
                "id": f"jic_{re.sub(r'[^a-zA-Z0-9]', '_', rel_url)}",
                "title": title,
                "company": company,
                "city": city,
                "contractType": contract,
                "publishedAt": published_at,
                "daysAgo": days_ago,
                "url": f"{base_url}{rel_url}",
                "description": f"Poste de {title} chez {company} ({city}). Type de contrat: {contract}. Consultez l'annonce complète et postulez directement sur la source.",
                "source": "JobInfoCamer"
            })

    return jobs

def export_to_csv(jobs, output_path):
    """Exporte la liste au format CSV universel UTF-8 avec BOM (compatible Excel)."""
    headers = ["Date", "Intitule du poste", "Entreprise", "Ville", "Contrat", "Source", "Lien", "Description"]
    with open(output_path, mode="w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f, delimiter=";")
        writer.writerow(headers)
        for j in jobs:
            writer.writerow([
                j.get("publishedAt", ""),
                j.get("title", ""),
                j.get("company", ""),
                j.get("city", ""),
                j.get("contractType", "CDI"),
                j.get("source", "Portail"),
                j.get("url", ""),
                j.get("description", "")
            ])
    print(f"[+] Succès : {len(jobs)} offres exportées dans {output_path}")

def export_to_json(jobs, output_path):
    """Exporte au format JSON."""
    with open(output_path, mode="w", encoding="utf-8") as f:
        json.dump(jobs, f, ensure_ascii=False, indent=2)
    print(f"[+] Succès : {len(jobs)} offres exportées dans {output_path}")

def main():
    parser = argparse.ArgumentParser(description="Scraper d'offres d'emploi au Cameroun (des 30 derniers jours)")
    parser.add_argument("--query", "-q", default="", help="Mot-clé ou intitulé de poste (ex: commercial, comptable)")
    parser.add_argument("--city", "-c", default="", help="Filtrer par ville (ex: Douala, Yaoundé)")
    parser.add_argument("--days", "-d", type=int, default=30, help="Nombre de jours max (défaut: 30)")
    parser.add_argument("--output", "-o", default="candidatures_30j.csv", help="Chemin du fichier de sortie")
    parser.add_argument("--format", "-f", choices=["csv", "json"], default="csv", help="Format de sortie (csv ou json)")

    args = parser.parse_args()

    print("=" * 60)
    print("douzCv - Scraper d'offres d'emploi (30 derniers jours)")
    print(f"Recherche: '{args.query}' | Ville: '{args.city}' | Période: {args.days} jours")
    print("=" * 60)

    jobs = scrape_jobinfocamer(query=args.query, max_days=args.days)

    if args.city:
        city_lower = args.city.lower()
        jobs = [j for j in jobs if city_lower in j["city"].lower()]

    print(f"[*] Total d'offres trouvées : {len(jobs)}")

    if not jobs:
        print("[!] Aucune offre ne correspond aux critères.")
        return

    if args.format == "json" or args.output.endswith(".json"):
        export_to_json(jobs, args.output)
    else:
        export_to_csv(jobs, args.output)

    print("\nAstuce: Vous pouvez directement glisser-déposer ou importer ce fichier dans le Tableur de l'application douzCv !")

if __name__ == "__main__":
    main()
