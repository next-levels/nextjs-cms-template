# Template Setup Guide

Diese Anleitung hilft dir dabei, das Next.js CMS Template für dein eigenes Projekt einzurichten.

## 🚀 Schnell-Setup für neues Projekt

### 1. Template klonen und vorbereiten

```bash
# Template klonen
git clone https://github.com/yourusername/nextjs-cms-template.git mein-neues-projekt
cd mein-neues-projekt

# Git History entfernen und neues Repository initialisieren
rm -rf .git
git init
git add .
git commit -m "feat: initial project setup from CMS template"
```

### 2. Projekt personalisieren

#### package.json anpassen

```json
{
  "name": "mein-projekt-name",
  "version": "0.1.0",
  "description": "Beschreibung meines Projekts",
  "author": "Dein Name <deine@email.de>"
}
```

#### .env Datei erstellen

```bash
cp .env.example .env
```

Bearbeite die `.env` mit deinen Werten:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/mein_projekt_db"
AUTH_SECRET="dein-super-geheimer-auth-schluessel"
NEXTAUTH_URL="http://localhost:3000"
```

#### Seed-Daten anpassen

Bearbeite `prisma/seed.ts` und ändere die E-Mail-Domains:

```typescript
// Statt template.de
email: "admin@meinprojekt.de";
```

### 3. Installation und Setup

```bash
# Dependencies installieren
bun install

# Datenbank einrichten
bun db:push
bun db:seed

# Development Server starten
bun dev
```

## 🎨 Design anpassen

### Farbschema ändern

Bearbeite `src/app/globals.css` und passe die CSS-Variablen an:

```css
:root {
  --primary: 214 95% 60%; /* Dein Haupt-Blau */
  --primary-foreground: 0 0% 98%;
  /* ... weitere Farben */
}
```

### Landing Page personalisieren

Bearbeite `src/app/(public)/page.tsx`:

- Titel und Beschreibung anpassen
- Features zu deinem Projekt ändern
- GitHub-Links aktualisieren

## 📦 Module und Packages

### Bestehende Packages nutzen

Das Template enthält bereits vorbereitet Package-Strukturen in `/packages/`:

- `@cms-template/core` - Kernfunktionen und Types
- `@cms-template/ui` - UI Komponenten
- `@cms-template/auth` - Authentifizierung

### Eigene Packages erstellen

```bash
# Neues Package erstellen
mkdir packages/mein-package
cd packages/mein-package

# package.json erstellen
cat > package.json << EOF
{
  "name": "@meinprojekt/mein-package",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts"
}
EOF
```

### Packages als NPM Packages veröffentlichen

#### 1. NPM Organisation erstellen

```bash
npm adduser
npm org create @meinprojekt
```

#### 2. Package veröffentlichen

```bash
cd packages/mein-package
npm publish --access public
```

#### 3. In anderen Projekten nutzen

```bash
bun add @meinprojekt/mein-package
```

## 🗂️ Neue Module hinzufügen

### Datenmodell erweitern

1. **Prisma Schema**: `prisma/schema.prisma`

```prisma
model Article {
  id        String   @id @default(cuid())
  title     String
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

2. **Migration ausführen**

```bash
bun db:push
```

### tRPC Router hinzufügen

1. **Router erstellen**: `src/server/api/routers/article.ts`

```typescript
export const articleRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.article.findMany();
  }),
  // ... weitere Procedures
});
```

2. **In Root Router einbinden**: `src/server/api/root.ts`

```typescript
export const appRouter = createTRPCRouter({
  user: userRouter,
  article: articleRouter, // Neue Router hinzufügen
});
```

### Admin-Seiten hinzufügen

1. **Ordner struktur**: `src/app/admin/(data)/articles/`
2. **Tabellen-Seite**: `page.tsx`
3. **Formular-Komponenten**: `_components/entity-form.tsx`
4. **Spalten definieren**: `columns.tsx`

## 🚀 Deployment vorbereiten

### Umgebungsvariablen für Production

```env
# Production Database
DATABASE_URL="postgresql://..."

# Sichere Secrets
AUTH_SECRET="super-sicherer-produktions-schluessel"
NEXTAUTH_URL="https://meinprojekt.de"

# E-Mail für Production
SMTP_HOST="smtp.postmark.com"
SMTP_USER="..."
SMTP_PASS="..."
```

### Docker Setup

Das Template enthält bereits eine `docker-compose.yml` für lokale Entwicklung.

Für Production:

```dockerfile
# Dockerfile ist bereits vorbereitet
docker build -t meinprojekt .
docker run -p 3000:3000 meinprojekt
```

## 🔧 Wartung und Updates

### Template Updates übernehmen

```bash
# Template als Remote hinzufügen
git remote add template https://github.com/yourusername/nextjs-cms-template.git

# Updates holen
git fetch template
git merge template/main --allow-unrelated-histories
```

### Package Updates

```bash
# Alle Packages in /packages/ updaten
cd packages/core && npm publish
cd packages/ui && npm publish
cd packages/auth && npm publish

# In Projekten updaten
bun add @meinprojekt/core@latest
```

## 📋 Checkliste für neues Projekt

- [ ] Repository geklont und Git neu initialisiert
- [ ] `package.json` personalisiert
- [ ] `.env` Datei erstellt und konfiguriert
- [ ] Seed-Daten angepasst (E-Mail-Domains)
- [ ] Dependencies installiert
- [ ] Datenbank eingerichtet
- [ ] Landing Page personalisiert
- [ ] Design-Farben angepasst
- [ ] GitHub Repository erstellt und verbunden
- [ ] Erstes Deployment getestet

## 🆘 Hilfe und Support

- **Template Issues**: [GitHub Issues](https://github.com/yourusername/nextjs-cms-template/issues)
- **Dokumentation**: [README.md](README.md)
- **Beispiel-Projekte**: Siehe `/examples/` Ordner (geplant)

Happy Coding! 🎉
