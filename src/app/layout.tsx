import "~/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { unstable_ViewTransition as ViewTransition } from "react";

import { SessionProvider } from "next-auth/react";
import { TRPCReactProvider } from "~/trpc/react";
import { AuthProvider } from "~/context/auth";
import { ThemeProvider } from "~/components/provider/theme-provider";
import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Admin Panel mit gesichertem Login-Bereich",
};
const geist = Geist({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`${geist.variable}`} suppressHydrationWarning>
      <body>
        <ViewTransition>
          <TRPCReactProvider>
            <SessionProvider>
              <AuthProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                  {children}
                </ThemeProvider>
              </AuthProvider>
            </SessionProvider>
          </TRPCReactProvider>

          <Toaster />
        </ViewTransition>
      </body>
    </html>
  );
}
