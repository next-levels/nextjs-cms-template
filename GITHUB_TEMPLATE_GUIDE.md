# GitHub Template & NPM Package Guide

Eine vollständige Anleitung zum Erstellen eines GitHub Template Repositories, Veröffentlichen von NPM Packages und Erstellen eines CLI Tools.

## 🎯 Übersicht

Wir erstellen:

1. **GitHub Template Repository** - Für das Haupt-CMS Template
2. **NPM Packages** - Modulare Packages (@deinname/cms-core, @deinname/cms-ui, etc.)
3. **CLI Tool** - `create-next-cms` für einfache Projekterstellung

## 📋 Teil 1: GitHub Template Repository erstellen

### 1.1 Repository auf GitHub erstellen

```bash
# 1. Lokales Repository vorbereiten
cd apollon-website
git add .
git commit -m "feat: initial CMS template setup"

# 2. GitHub Repository erstellen (über GitHub UI oder gh CLI)
gh repo create nextjs-cms-template --public --description "A modular Next.js CMS template"

# 3. Repository pushen
git remote add origin https://github.com/deinusername/nextjs-cms-template.git
git branch -M main
git push -u origin main
```

### 1.2 Als Template markieren

1. Gehe zu deinem Repository auf GitHub
2. Klicke auf **Settings** (⚙️)
3. Scrolle zu **Template repository**
4. Aktiviere ✅ **Template repository**
5. Klicke **Save**

### 1.3 Template README aktualisieren

````markdown
# Next.js CMS Template

[![Use this template](https://img.shields.io/badge/use%20this-template-blue?logo=github)](https://github.com/deinusername/nextjs-cms-template/generate)

Ein vollständiges, modulares CMS Template für Next.js Projekte.

## 🚀 Schnellstart

### Option 1: CLI verwenden (empfohlen)

```bash
bunx create-next-cms mein-projekt
```
````

### Option 2: GitHub Template verwenden

1. Klicke auf "Use this template"
2. Erstelle neues Repository
3. Clone und setup:

```bash
git clone https://github.com/deinusername/mein-neues-repo.git
cd mein-neues-repo
cp .env.example .env
bun install
bun db:push && bun db:seed
bun dev
```

````

## 📦 Teil 2: NPM Packages veröffentlichen

### 2.1 NPM Account und Organisation einrichten

```bash
# 1. NPM Account erstellen (falls noch nicht vorhanden)
npm adduser

# 2. Organisation erstellen
npm org create @deinname

# 3. Oder über NPM Website: https://www.npmjs.com/org/create
````

### 2.2 Package Workspace einrichten

Erstelle eine `package.json` im Root mit Workspace-Konfiguration:

```json
{
  "name": "nextjs-cms-monorepo",
  "private": true,
  "workspaces": ["packages/*"],
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "lint": "turbo lint",
    "publish-packages": "bun run build && changeset publish"
  },
  "devDependencies": {
    "@changesets/cli": "^2.27.0",
    "turbo": "^2.0.0"
  }
}
```

### 2.3 Packages aktualisieren

Aktualisiere alle `package.json` Dateien in `/packages/`:

```bash
# packages/cms-core/package.json
{
  "name": "@deinname/cms-core",
  "version": "1.0.0",
  "publishConfig": {
    "access": "public"
  }
}

# packages/cms-ui/package.json
{
  "name": "@deinname/cms-ui",
  "version": "1.0.0",
  "publishConfig": {
    "access": "public"
  }
}

# packages/cms-auth/package.json
{
  "name": "@deinname/cms-auth",
  "version": "1.0.0",
  "publishConfig": {
    "access": "public"
  }
}
```

### 2.4 Packages bauen und veröffentlichen

```bash
# 1. Alle Packages bauen
cd packages/cms-core && bun run build
cd ../cms-ui && bun run build
cd ../cms-auth && bun run build

# 2. Einzeln veröffentlichen
cd packages/cms-core && npm publish
cd ../cms-ui && npm publish
cd ../cms-auth && npm publish

# 3. Oder mit Changesets (automatisiert)
bun add -D @changesets/cli
bunx changeset init
bunx changeset add
bunx changeset version
bunx changeset publish
```

### 2.5 Template für Package-freie Version erstellen

Erstelle einen separaten Branch/Repository ohne `/packages/` Ordner:

```bash
# 1. Neuer Branch für Template ohne Packages
git checkout -b template-clean
git rm -r packages/
git commit -m "feat: remove packages for clean template"

# 2. Package.json für Template anpassen
# Entferne workspace-spezifische Konfigurationen
# Füge veröffentlichte Packages als Dependencies hinzu:
{
  "dependencies": {
    "@deinname/cms-core": "^1.0.0",
    "@deinname/cms-ui": "^1.0.0",
    "@deinname/cms-auth": "^1.0.0"
  }
}

# 3. Imports in Code anpassen
# Von: import { cn } from "~/lib/utils"
# Zu:  import { cn } from "@deinname/cms-core"

git add .
git commit -m "feat: use published packages instead of local packages"
git push origin template-clean
```

## 🛠️ Teil 3: CLI Tool veröffentlichen

### 3.1 create-next-cms Package vorbereiten

```bash
# 1. Separates Repository für CLI (oder als Package)
cd packages/create-next-cms

# 2. Package bauen
bun run build

# 3. Lokal testen
npm link
create-next-cms test-project

# 4. Veröffentlichen
npm publish
```

### 3.2 CLI Tool global installierbar machen

```json
// packages/create-next-cms/package.json
{
  "name": "create-next-cms",
  "bin": {
    "create-next-cms": "./dist/index.js"
  },
  "files": ["dist/**/*"],
  "publishConfig": {
    "access": "public"
  }
}
```

### 3.3 Template Repository im CLI konfigurieren

Aktualisiere die Template-URL im CLI:

```typescript
// packages/create-next-cms/src/index.ts
const TEMPLATE_REPO =
  "https://github.com/deinusername/nextjs-cms-template.git#template-clean";
```

## 🚀 Teil 4: Alles zusammenführen

### 4.1 GitHub Repository Struktur

```
nextjs-cms-template/
├── main branch          # Mit packages/ für Entwicklung
├── template-clean       # Ohne packages/ für Template
└── releases/            # Automatische Releases
```

### 4.2 Automatisierung mit GitHub Actions

`.github/workflows/publish.yml`:

```yaml
name: Publish Packages

on:
  push:
    branches: [main]
    paths: ["packages/**"]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1

      - name: Install dependencies
        run: bun install

      - name: Build packages
        run: bun run build

      - name: Publish to NPM
        run: |
          echo "//registry.npmjs.org/:_authToken=${{ secrets.NPM_TOKEN }}" > ~/.npmrc
          bunx changeset publish
        env:
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 4.3 Template Update Workflow

`.github/workflows/update-template.yml`:

```yaml
name: Update Template Branch

on:
  push:
    branches: [main]

jobs:
  update-template:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Update template-clean branch
        run: |
          git checkout template-clean
          git merge main --strategy-option=theirs
          rm -rf packages/
          # Update package.json to use published packages
          git add .
          git commit -m "chore: sync with main, remove packages" || exit 0
          git push origin template-clean
```

## 🎯 Teil 5: Benutzung

### 5.1 Für Entwickler (neues Projekt)

```bash
# Option 1: CLI (einfachste Methode)
bunx create-next-cms mein-cms-projekt

# Option 2: GitHub Template
# Klicke "Use this template" auf GitHub

# Option 3: Direkt klonen
git clone https://github.com/deinusername/nextjs-cms-template.git -b template-clean mein-projekt
```

### 5.2 Für Package Updates

```bash
# Als Package-Maintainer
cd packages/cms-core
# Änderungen machen
bunx changeset add
bunx changeset version
bunx changeset publish

# In Projekten updaten
bun add @deinname/cms-core@latest
```

## 📋 Checkliste

### Repository Setup

- [ ] GitHub Repository erstellt und als Template markiert
- [ ] `template-clean` Branch ohne packages/ erstellt
- [ ] README mit "Use this template" Button aktualisiert

### NPM Packages

- [ ] NPM Organisation `@deinname` erstellt
- [ ] Alle Packages erfolgreich veröffentlicht:
  - [ ] `@deinname/cms-core`
  - [ ] `@deinname/cms-ui`
  - [ ] `@deinname/cms-auth`
- [ ] Template verwendet veröffentlichte Packages

### CLI Tool

- [ ] `create-next-cms` Package erstellt und veröffentlicht
- [ ] CLI funktional getestet
- [ ] Template-Repository korrekt referenziert

### Automatisierung

- [ ] GitHub Actions für Package Publishing eingerichtet
- [ ] Template-Branch automatisch aktualisiert
- [ ] Versionierung mit Changesets konfiguriert

## 🆘 Troubleshooting

### NPM Publishing Probleme

```bash
# Package Name bereits vergeben
npm view @deinname/cms-core  # Prüft ob Name frei ist

# Login Probleme
npm whoami  # Zeigt aktuellen User
npm logout && npm login  # Neu anmelden

# Scope/Organisation Probleme
npm org ls @deinname  # Zeigt Organisation Members
```

### Template Probleme

```bash
# Template Repository als normale Clone
git clone --template=false <repo-url>

# Branch-spezifische Clone
git clone -b template-clean <repo-url>
```

### CLI Tool Debugging

```bash
# Lokal testen
npm link
create-next-cms --help

# Debug Mode
DEBUG=* create-next-cms test-project
```

---

**🎉 Glückwunsch!** Du hast jetzt ein vollständiges GitHub Template Repository mit modularen NPM Packages und einem CLI Tool für einfache Projekterstellung!
