# Next.js CMS Template

Ein vollständiges, modulares Content Management System Template für moderne Webanwendungen, basierend auf dem T3 Stack.

## 🚀 Features

- **🔐 Benutzer-Management**: Vollständige Authentifizierung mit NextAuth.js
- **👥 Rollen-System**: SuperAdmin, Admin und User Rollen
- **📊 Admin Dashboard**: Modernes Admin-Interface mit Datentabellen
- **🎨 UI Components**: Shadcn/ui + Tailwind CSS für konsistentes Design
- **🔧 Type-Safe**: Vollständig typisiert mit TypeScript und tRPC
- **📦 Modulare Architektur**: Wiederverwendbare Komponenten und Module
- **🗃️ Prisma ORM**: Type-safe Datenbankoperationen
- **📧 E-Mail System**: Passwort-Reset und Benachrichtigungen

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Sprache**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **Datenbank**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js
- **API**: tRPC für Type-Safe APIs
- **Package Manager**: Bun
- **Icons**: Lucide React + Tabler Icons

## 📋 Voraussetzungen

- Node.js 18+ oder Bun
- PostgreSQL Datenbank
- Git

## 🚀 Quick Start

### 1. Repository klonen

```bash
git clone https://github.com/yourusername/nextjs-cms-template.git
cd nextjs-cms-template
```

### 2. Dependencies installieren

```bash
bun install
```

### 3. Umgebungsvariablen einrichten

```bash
cp .env.example .env
```

Bearbeite die `.env` Datei mit deinen Werten:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/your-db"
AUTH_SECRET="your-super-secret-auth-key"
NEXTAUTH_URL="http://localhost:3000"

# E-Mail Konfiguration (optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### 4. Datenbank einrichten

```bash
# Prisma generieren
bun db:generate

# Datenbank migrieren
bun db:push

# Beispieldaten laden
bun db:seed
```

### 5. Development Server starten

```bash
bun dev
```

Öffne [http://localhost:3000](http://localhost:3000) in deinem Browser.

## 👤 Standard Login-Daten

Nach dem Seeding stehen folgende Benutzer zur Verfügung:

| Rolle      | E-Mail                 | Passwort      |
| ---------- | ---------------------- | ------------- |
| SuperAdmin | superadmin@template.de | superadmin123 |
| Admin      | admin@template.de      | admin123      |
| User       | max@template.de        | user123       |

## 📁 Projektstruktur

```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # Öffentliche Seiten
│   ├── admin/              # Admin Dashboard
│   ├── auth/               # Authentifizierung
│   └── api/                # API Routes
├── components/             # React Komponenten
│   ├── ui/                 # Shadcn/ui Komponenten
│   ├── form/               # Formular Komponenten
│   └── layouts/            # Layout Komponenten
├── lib/                    # Utility Funktionen
├── server/                 # Server-side Code
│   ├── api/                # tRPC Router
│   └── auth/               # Auth Konfiguration
├── schema/                 # Zod Schemas
└── types/                  # TypeScript Types
```

## 🔧 Verfügbare Scripts

```bash
# Development
bun dev                     # Development server starten
bun build                   # Production build
bun start                   # Production server starten

# Datenbank
bun db:generate            # Prisma Client generieren
bun db:push                # Schema zur DB pushen
bun db:migrate             # Migrationen ausführen
bun db:studio              # Prisma Studio öffnen
bun db:seed                # Beispieldaten laden

# Code Quality
bun lint                   # ESLint ausführen
bun lint:fix               # ESLint mit Auto-Fix
bun typecheck              # TypeScript prüfen
bun format:check           # Prettier prüfen
bun format:write           # Prettier ausführen
```

## 🎨 Als Template verwenden

### 1. Template Repository erstellen

1. Klone dieses Repository
2. Entferne die Git History: `rm -rf .git`
3. Initialisiere neues Git Repository: `git init`
4. Erstelle dein eigenes Repository auf GitHub
5. Verbinde es: `git remote add origin <your-repo-url>`

### 2. Projekt anpassen

1. **package.json**: Name, Version und Author anpassen
2. **README.md**: Projektspezifische Informationen hinzufügen
3. **Branding**: Farben und Styling in `globals.css` anpassen
4. **Domain**: E-Mail-Domains in Seed-Daten anpassen

### 3. Neue Module hinzufügen

Das Template ist so strukturiert, dass du einfach neue Module hinzufügen kannst:

```bash
# Neues Datenmodell in Prisma Schema
# Neue tRPC Router in server/api/routers/
# Neue Admin-Seiten in app/admin/
# Neue Komponenten in components/
```

## 📦 Modulare Packages (Geplant)

Zukünftig werden Kernfunktionen in separate NPM Packages ausgelagert:

- `@yourname/cms-auth` - Authentifizierung & Benutzer-Management
- `@yourname/cms-admin` - Admin Dashboard Komponenten
- `@yourname/cms-forms` - Formular Komponenten
- `@yourname/cms-ui` - UI Komponenten Library

## 🔒 Umgebungsvariablen

Kopiere `.env.example` zu `.env` und passe die Werte an:

```env
# Datenbank
DATABASE_URL="postgresql://..."

# NextAuth.js
AUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"

# E-Mail (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="..."
SMTP_PASS="..."
```

## 🚀 Deployment

### Vercel (Empfohlen)

1. GitHub Repository mit Vercel verbinden
2. Umgebungsvariablen in Vercel Dashboard setzen
3. PostgreSQL Datenbank (z.B. Supabase, PlanetScale) einrichten
4. Deploy!

### Docker

```bash
# Docker Build
docker build -t nextjs-cms-template .

# Docker Run
docker run -p 3000:3000 nextjs-cms-template
```

## 🤝 Contributing

1. Fork das Repository
2. Erstelle einen Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit deine Änderungen (`git commit -m 'Add amazing feature'`)
4. Push zum Branch (`git push origin feature/amazing-feature`)
5. Erstelle einen Pull Request

## 📝 Lizenz

Dieses Projekt steht unter der MIT Lizenz. Siehe [LICENSE](LICENSE) für Details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/nextjs-cms-template/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/nextjs-cms-template/discussions)

## 🙏 Credits

Basiert auf dem [T3 Stack](https://create.t3.gg/) und nutzt:

- [Next.js](https://nextjs.org)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Prisma](https://prisma.io)
- [tRPC](https://trpc.io)
- [NextAuth.js](https://next-auth.js.org)
- [Shadcn/ui](https://ui.shadcn.com)
