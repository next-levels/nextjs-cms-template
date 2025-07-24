import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export const metadata: Metadata = {
  title: "Next.js CMS Template",
  description: "Ein modulares CMS-Template für schnelle Projektentwicklung.",
};

export default async function LandingPage() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <TechStackSection />
      <CTASection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative flex h-[70vh] items-center justify-center bg-gradient-to-r from-blue-600 to-purple-800">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
        <h1 className="mb-6 text-5xl font-bold md:text-6xl">
          Next.js CMS
          <br />
          <span className="text-blue-200">Template</span>
        </h1>

        <p className="mb-8 text-xl text-blue-100 md:text-2xl">
          Ein vollständiges, modulares Content Management System für moderne
          Webanwendungen.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button
            asChild
            size="lg"
            className="bg-blue-600 px-8 py-3 text-lg text-blue-50 hover:bg-blue-700"
          >
            <Link href="/admin">Admin Dashboard</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white px-8 py-3 text-lg text-white hover:bg-white hover:text-blue-600"
          >
            <a
              href="https://github.com/yourusername/nextjs-cms-template"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Features
          </h2>

          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Alles was du für ein modernes CMS brauchst - sofort einsatzbereit
            und vollständig anpassbar.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Benutzer-Management
            </h3>
            <p className="text-gray-600">
              Vollständige Authentifizierung mit Rollen-System (Admin, User) und
              Passwort-Reset.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Admin Dashboard
            </h3>
            <p className="text-gray-600">
              Modernes Admin-Interface mit Datentabellen, CRUD-Operationen und
              responsivem Design.
            </p>
          </div>

          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </div>

            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Modulare Architektur
            </h3>

            <p className="text-gray-600">
              Wiederverwendbare Komponenten und Module für schnelle
              Projektentwicklung.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function TechStackSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Tech Stack
          </h2>
          <p className="text-xl text-gray-600">
            Moderne Technologien für optimale Performance und Developer
            Experience.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {[
            "Next.js 15",
            "TypeScript",
            "Tailwind CSS",
            "Prisma ORM",
            "tRPC",
            "NextAuth.js",
            "Shadcn/ui",
            "PostgreSQL",
          ].map((tech) => (
            <div key={tech} className="text-center">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="font-semibold text-gray-900">{tech}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="bg-blue-50 py-16">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
          Bereit zum Loslegen?
        </h2>
        <p className="mb-8 text-xl text-gray-600">
          Teste das Admin-Dashboard oder starte direkt mit deinem eigenen
          Projekt.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button
            asChild
            size="lg"
            className="bg-blue-600 px-8 py-3 text-lg text-blue-50 hover:bg-blue-700"
          >
            <Link href="/auth/login">Demo Login</Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-blue-600 px-8 py-3 text-lg text-blue-600 hover:bg-blue-600 hover:text-white"
          >
            <Link href="/admin">Admin Bereich</Link>
          </Button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Demo Login: admin@template.de / admin123</p>
        </div>
      </div>
    </section>
  );
}
