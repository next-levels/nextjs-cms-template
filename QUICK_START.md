# 🚀 Quick Start Guide

Die schnellste Art, mit dem Next.js CMS Template loszulegen!

## 🎯 3 Wege zum Start

### 1. CLI Tool (Empfohlen) ⚡

```bash
# Projekt erstellen
bunx create-next-cms mein-cms-projekt

# In Ordner wechseln
cd mein-cms-projekt

# Starten
bun dev
```

**Das war's!** 🎉 Das CLI macht alles automatisch.

### 2. GitHub Template 📋

1. Gehe zu: [nextjs-cms-template](https://github.com/yourusername/nextjs-cms-template)
2. Klicke **"Use this template"** → **"Create a new repository"**
3. Clone dein neues Repository:

```bash
git clone https://github.com/deinusername/mein-neues-repo.git
cd mein-neues-repo

# Setup
cp .env.example .env
bun install
bun db:push
bun db:seed
bun dev
```

### 3. Direkt klonen 📥

```bash
git clone https://github.com/yourusername/nextjs-cms-template.git mein-projekt
cd mein-projekt

# Git History entfernen
rm -rf .git && git init

# Setup
cp .env.example .env
bun install
bun db:push
bun db:seed
bun dev
```

## ⚙️ Basis-Konfiguration

### .env Datei anpassen

```env
# Datenbank (PostgreSQL empfohlen)
DATABASE_URL="postgresql://username:password@localhost:5432/mein_projekt"

# Auth Secret (neuen Schlüssel generieren!)
AUTH_SECRET="dein-super-geheimer-auth-schluessel"

# URL (bei Deployment anpassen)
NEXTAUTH_URL="http://localhost:3000"
```

### Datenbank Setup

```bash
# PostgreSQL/MySQL
bun db:push    # Schema erstellen
bun db:seed    # Demo-Daten laden

# SQLite (lokale Entwicklung)
# Funktioniert automatisch, keine weitere Konfiguration nötig
```

## 👤 Standard Login-Daten

Nach dem Seeding:

| **Rolle**      | **E-Mail**               | **Passwort**    |
| -------------- | ------------------------ | --------------- |
| 🔧 Super Admin | `superadmin@template.de` | `superadmin123` |
| ⚙️ Admin       | `admin@template.de`      | `admin123`      |
| 👤 User        | `user@template.de`       | `user123`       |

## 🌐 Wichtige URLs

- **Frontend**: http://localhost:3000
- **Admin**: http://localhost:3000/admin
- **Login**: http://localhost:3000/auth/login
- **Prisma Studio**: http://localhost:5555 (`bun db:studio`)

## 📝 Erste Anpassungen

### 1. Projekt-Info ändern

```json
// package.json
{
  "name": "mein-projekt-name",
  "description": "Mein CMS Projekt",
  "author": "Dein Name <deine@email.de>"
}
```

### 2. E-Mail-Domains anpassen

```typescript
// prisma/seed.ts - E-Mail-Adressen ändern
email: "admin@meinprojekt.de"; // statt template.de
```

### 3. Landing Page personalisieren

```tsx
// src/app/(public)/page.tsx
export const metadata: Metadata = {
  title: "Mein CMS Projekt",
  description: "Beschreibung meines Projekts",
};
```

### 4. Design anpassen

```css
/* src/app/globals.css - Farbschema ändern */
:root {
  --primary: 214 95% 60%; /* Deine Hauptfarbe */
  --primary-foreground: 0 0% 98%;
}
```

## 🛠️ Entwicklung

### Wichtige Commands

```bash
# Development
bun dev                 # Server starten
bun build              # Production Build
bun start              # Production Server

# Datenbank
bun db:push            # Schema aktualisieren
bun db:seed            # Demo-Daten laden
bun db:studio          # Prisma Studio öffnen

# Code Quality
bun lint               # Linting
bun typecheck          # TypeScript prüfen
bun format:write       # Code formatieren
```

### Neue Module hinzufügen

1. **Datenmodell** in `prisma/schema.prisma`
2. **tRPC Router** in `src/server/api/routers/`
3. **Admin-Seiten** in `src/app/admin/(data)/`
4. **UI-Komponenten** in `src/components/`

## 🚀 Deployment

### Vercel (empfohlen)

```bash
# 1. Vercel CLI installieren
npm i -g vercel

# 2. Deployen
vercel

# 3. Umgebungsvariablen setzen (in Vercel Dashboard)
# DATABASE_URL, AUTH_SECRET, NEXTAUTH_URL
```

### Docker

```bash
# Build
docker build -t mein-cms .

# Run
docker run -p 3000:3000 mein-cms
```

## 🎨 Weitere Anpassungen

### Theme/Branding

- **Logo**: `public/images/logo.svg`
- **Favicon**: `public/favicon.ico`
- **Farben**: `src/app/globals.css`
- **Fonts**: `src/app/layout.tsx`

### Features erweitern

- **E-Mail**: SMTP-Konfiguration in `.env`
- **Datei-Upload**: Neue tRPC Router
- **API Routes**: `src/app/api/`
- **Middleware**: `middleware.ts`

## 🆘 Probleme lösen

### Port bereits belegt

```bash
# Anderen Port verwenden
bun dev -- -p 3001
```

### Datenbank-Verbindung

```bash
# Verbindung testen
bun db:studio
```

### Dependencies-Probleme

```bash
# Cache leeren
rm -rf node_modules/.cache
rm -rf .next
bun install
```

## 📚 Weiterführende Docs

- **Vollständige Dokumentation**: [README.md](README.md)
- **Template Setup**: [TEMPLATE_SETUP.md](TEMPLATE_SETUP.md)
- **GitHub Guide**: [GITHUB_TEMPLATE_GUIDE.md](GITHUB_TEMPLATE_GUIDE.md)

---

**Happy Coding!** 🎉 Bei Fragen schaue in die [Issues](https://github.com/yourusername/nextjs-cms-template/issues) oder erstelle ein neues Issue.
