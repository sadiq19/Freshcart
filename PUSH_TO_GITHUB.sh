#!/bin/bash

# Script for å pushe FreshCart til GitHub
# Repository: https://github.com/sadiq19/Freshcart

echo "🚀 Initialiserer Git repository..."

cd /Users/f.9sbt/freshcart-frontend

# Initialiser Git
git init

# Legg til remote
git remote add origin https://github.com/sadiq19/Freshcart.git 2>/dev/null || git remote set-url origin https://github.com/sadiq19/Freshcart.git

# Sett branch til main
git branch -M main

# Legg til alle filer
echo "📦 Legger til filer..."
git add .

# Commit
echo "💾 Committer endringer..."
git commit -m "Initial commit: FreshCart Oda-klon med full funksjonalitet

- Implementert handlekurv med produkter og oppdatering av antall
- Produktdetalj-side med næringsinnhold og bærekraftsinformasjon
- Full checkout-prosess med leveringsadresse og betaling
- Header med søk og forbedret brukermeny
- Footer med lenker og betalingsikoner
- Login og registreringssider
- Kategori-sidebar
- Responsive design
- TypeScript + React + Vite"

# Push til GitHub
echo "⬆️  Pusher til GitHub..."
echo ""
echo "⚠️  Du vil bli bedt om GitHub brukernavn og token"
echo "   Bruk GitHub Personal Access Token (ikke passord)"
echo ""
git push -u origin main

echo ""
echo "✅ Ferdig! Koden er nå på GitHub: https://github.com/sadiq19/Freshcart"

