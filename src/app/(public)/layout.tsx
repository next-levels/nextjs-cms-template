"use client";

import { Button } from "~/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { MenuIcon, XIcon } from "lucide-react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PublicNavigation />

      <main className="flex-1">{children}</main>

      <PublicFooter />
    </div>
  );
}

function PublicNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-2"
              onClick={closeMobileMenu}
            >
              <span className="text-xl font-bold text-blue-800">
                Next.js CMS Template
              </span>
            </Link>
          </div>

          <div className="hidden items-center space-x-8 md:flex">
            <Link
              href="/about"
              className="text-gray-600 transition-colors hover:text-blue-600"
            >
              Über uns
            </Link>

            <Link
              href="/contact"
              className="text-gray-600 transition-colors hover:text-blue-600"
            >
              Kontakt
            </Link>

            <Link href="/admin">
              <Button variant="blue">Login</Button>
            </Link>
          </div>

          <div className="md:hidden">
            <Button variant="blue" size="sm" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="border-t border-gray-200 pt-4 pb-3">
              <div className="space-y-1">
                <Link
                  href="/about"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  onClick={closeMobileMenu}
                >
                  Über uns
                </Link>

                <Link
                  href="/contact"
                  className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  onClick={closeMobileMenu}
                >
                  Kontakt
                </Link>

                <Link
                  href="/admin"
                  className="block px-3 py-2 text-base font-medium text-blue-600 hover:bg-blue-50"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function PublicFooter() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                <span className="text-sm font-bold text-white">G</span>
              </div>
              <span className="text-xl font-bold text-blue-800">
                Next.js CMS Template
              </span>
            </div>

            <p className="max-w-md text-gray-600">
              A modular Next.js CMS template with authentication, admin panel,
              and reusable components
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-900 uppercase">
              Unternehmen
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 transition-colors hover:text-blue-600"
                >
                  Über uns
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 transition-colors hover:text-blue-600"
                >
                  Kontakt
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/login"
                  className="text-gray-600 transition-colors hover:text-blue-600"
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-900 uppercase">
              Rechtliches
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/impressum"
                  className="text-gray-600 transition-colors hover:text-blue-600"
                >
                  Impressum
                </Link>
              </li>
              <li>
                <Link
                  href="/datenschutz"
                  className="text-gray-600 transition-colors hover:text-blue-600"
                >
                  Datenschutz
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Next.js CMS Template. Alle Rechte
            vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}
