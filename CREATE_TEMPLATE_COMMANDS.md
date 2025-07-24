# 🎯 Template Erstellung - Exakte Befehle

Hier sind die exakten Befehle, um das Template Repository und NPM Packages zu erstellen.

## 📋 Schritt 1: Repository vorbereiten

```bash
# Aktuelles Verzeichnis (sollte apollon-website sein)
pwd

# Git Status prüfen
git status

# Alle Änderungen committen
git add .
git commit -m "feat: complete CMS template with packages and CLI"

# Neue Repository URL setzen (ERSETZE "deinusername")
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/deinusername/nextjs-cms-template.git

# Main branch pushen
git branch -M main
git push -u origin main
```

## 📦 Schritt 2: NPM Organisation erstellen

```bash
# NPM Login (falls noch nicht eingeloggt)
npm whoami || npm login

# Organisation erstellen (ERSETZE "deinname")
npm org create @deinname

# Oder manuell über: https://www.npmjs.com/org/create
```

## 🔧 Schritt 3: Packages bauen und veröffentlichen

```bash
# Core Package
cd packages/cms-core

# package.json anpassen (Name ändern)
# "name": "@deinname/cms-core",

# Dependencies installieren und bauen
bun install
bun run build

# Veröffentlichen
npm publish --access public

# Zurück zum Root
cd ../..

# UI Package
cd packages/cms-ui
# "name": "@deinname/cms-ui",
bun install
bun run build
npm publish --access public
cd ../..

# Auth Package
cd packages/cms-auth
# "name": "@deinname/cms-auth",
bun install
bun run build
npm publish --access public
cd ../..

# CLI Package
cd packages/create-next-cms
bun install
bun run build
npm publish --access public
cd ../..
```

## 🌿 Schritt 4: Template-Branch ohne Packages

```bash
# Neuen Branch für sauberes Template erstellen
git checkout -b template-clean

# Packages Ordner entfernen
rm -rf packages/

# package.json anpassen - veröffentlichte Packages als Dependencies hinzufügen
# Bearbeite package.json manuell oder mit sed:

# Dependencies hinzufügen
cat package.json | jq '.dependencies += {
  "@deinname/cms-core": "^1.0.0",
  "@deinname/cms-ui": "^1.0.0",
  "@deinname/cms-auth": "^1.0.0"
}' > package.json.tmp && mv package.json.tmp package.json

# Workspace-Konfiguration entfernen (falls vorhanden)
cat package.json | jq 'del(.workspaces)' > package.json.tmp && mv package.json.tmp package.json

# Änderungen committen
git add .
git commit -m "feat: create clean template without packages directory"

# Template-Branch pushen
git push -u origin template-clean

# Zurück zum main branch
git checkout main
```

## ⚙️ Schritt 5: GitHub Template aktivieren

### Option A: GitHub CLI

```bash
# Repository Settings via API (experimental)
gh api repos/deinusername/nextjs-cms-template -X PATCH -f is_template=true
```

### Option B: Manual (empfohlen)

1. Gehe zu: https://github.com/deinusername/nextjs-cms-template
2. Klicke **Settings** ⚙️
3. Scrolle zu **Template repository**
4. Aktiviere ✅ **Template repository**
5. Klicke **Save**

## 🔗 Schritt 6: CLI Tool testen

```bash
# CLI global installieren (lokal testen)
cd packages/create-next-cms
npm link

# CLI testen
create-next-cms test-project

# Oder direkt mit bunx
bunx create-next-cms@latest test-project

# Test-Projekt entfernen
rm -rf test-project
```

## 📖 Schritt 7: README aktualisieren

Bearbeite die README.md mit dem "Use this template" Button:

````markdown
# Next.js CMS Template

[![Use this template](https://img.shields.io/badge/use%20this-template-blue?logo=github)](https://github.com/deinusername/nextjs-cms-template/generate)

## 🚀 Schnellstart

### CLI verwenden (empfohlen)

```bash
bunx create-next-cms mein-projekt
```
````

### GitHub Template verwenden

1. Klicke "Use this template" oben
2. Erstelle neues Repository
3. Setup:

```bash
git clone https://github.com/deinusername/mein-repo.git
cd mein-repo
cp .env.example .env
bun install && bun db:push && bun db:seed && bun dev
```

````

Committe die README Änderungen:

```bash
git add README.md
git commit -m "docs: add template usage instructions"
git push origin main

# Auch template-clean branch aktualisieren
git checkout template-clean
git cherry-pick main~1  # Letzten commit von main übernehmen
git push origin template-clean
git checkout main
````

## ✅ Schritt 8: Alles testen

```bash
# 1. Template via GitHub UI testen
# Gehe zu Repository → "Use this template"

# 2. CLI Tool testen
bunx create-next-cms@latest my-test-cms
cd my-test-cms
bun dev

# 3. Direkte Clone testen
git clone https://github.com/deinusername/nextjs-cms-template.git -b template-clean direct-test
cd direct-test
cp .env.example .env
bun install && bun db:push && bun dev
```

## 🔄 Schritt 9: Updates automatisieren (Optional)

GitHub Actions für automatische Updates:

```bash
# Workflow-Ordner erstellen
mkdir -p .github/workflows

# Publish Workflow
cat > .github/workflows/publish-packages.yml << 'EOF'
name: Publish Packages
on:
  push:
    branches: [main]
    paths: ['packages/**']
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: cd packages/cms-core && bun run build && npm publish --access public
      - run: cd packages/cms-ui && bun run build && npm publish --access public
      - run: cd packages/cms-auth && bun run build && npm publish --access public
      - run: cd packages/create-next-cms && bun run build && npm publish --access public
    env:
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
EOF

# Template Update Workflow
cat > .github/workflows/update-template.yml << 'EOF'
name: Update Template Branch
on:
  push:
    branches: [main]
jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - run: |
          git checkout template-clean
          git merge main --no-edit
          rm -rf packages/
          git add .
          git commit -m "chore: sync with main" || exit 0
          git push
EOF

# NPM Token als GitHub Secret hinzufügen:
# GitHub → Settings → Secrets and variables → Actions → New repository secret
# Name: NPM_TOKEN
# Value: (dein NPM Access Token von npmjs.com)

git add .github/
git commit -m "ci: add GitHub Actions workflows"
git push origin main
```

## 🎉 Fertig!

Du hast jetzt:

✅ **GitHub Template Repository** mit "Use this template" Button
✅ **NPM Packages** veröffentlicht (@deinname/cms-\*)
✅ **CLI Tool** (`create-next-cms`) global verfügbar
✅ **Sauberer Template-Branch** ohne packages/
✅ **Automatisierte Workflows** (optional)

### Nächste Schritte für Benutzer:

```bash
# Einfachste Methode
bunx create-next-cms mein-neues-cms

# Oder GitHub Template verwenden
# https://github.com/deinusername/nextjs-cms-template/generate
```

**Viel Erfolg mit deinem Template!** 🚀
