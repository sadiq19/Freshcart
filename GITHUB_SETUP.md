# Slik legger du FreshCart inn i GitHub

## Steg 1: Initialiser Git repository

Kjør disse kommandoene i terminalen (i prosjektmappen):

```bash
cd /Users/f.9sbt/freshcart-frontend

# Initialiser git repository
git init

# Legg til alle filer
git add .

# Lag første commit
git commit -m "Initial commit: FreshCart Oda-klon med full funksjonalitet"
```

## Steg 2: Opprett repository på GitHub

1. Gå til [GitHub.com](https://github.com) og logg inn
2. Klikk på **"+"** i øvre høyre hjørne
3. Velg **"New repository"**
4. Fyll ut:
   - **Repository name:** `freshcart-frontend` (eller hva du vil)
   - **Description:** "FreshCart - Oda-klon nettbutikk bygget med React og TypeScript"
   - **Public** eller **Private** (velg det du foretrekker)
   - **IKKE** hukk av "Initialize with README" (vi har allerede filer)
5. Klikk **"Create repository"**

## Steg 3: Koble lokal repository til GitHub

Etter at repositoryet er opprettet, GitHub vil vise instruksjoner. Kjør disse kommandoene:

```bash
# Legg til remote repository (erstatt USERNAME med ditt GitHub-brukernavn)
git remote add origin https://github.com/USERNAME/freshcart-frontend.git

# Sjekk at remote er lagt til riktig
git remote -v
```

## Steg 4: Push til GitHub

```bash
# Sjekk at du er på main/master branch
git branch -M main

# Push til GitHub
git push -u origin main
```

Hvis du blir bedt om autentisering:
- **Personal Access Token:** Du må bruke et GitHub Personal Access Token (ikke passord)
- For å lage token: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token
- Hukk av `repo` scope

## Alternativ: Bruk GitHub CLI

Hvis du har GitHub CLI installert:

```bash
# Installer GitHub CLI (hvis du ikke har det)
brew install gh

# Logg inn
gh auth login

# Opprett og push repository
gh repo create freshcart-frontend --public --source=. --remote=origin --push
```

## Nyttige Git-kommandoer

```bash
# Se status
git status

# Legg til filer
git add .

# Commit endringer
git commit -m "Din commit melding"

# Push til GitHub
git push

# Se commit historikk
git log

# Se branches
git branch
```

## Troubleshooting

### Hvis du får "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/USERNAME/freshcart-frontend.git
```

### Hvis du får autentiseringsfeil
1. Bruk Personal Access Token i stedet for passord
2. Eller sett opp SSH keys

### Hvis du vil endre remote URL
```bash
git remote set-url origin https://github.com/USERNAME/freshcart-frontend.git
```

