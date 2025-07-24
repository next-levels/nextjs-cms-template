import "~/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { unstable_ViewTransition as ViewTransition } from "react";

import { Providers } from "./providers";

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geist.variable} suppressHydrationWarning>
      <body>
        <ViewTransition>
          <Providers>{children}</Providers>
        </ViewTransition>
      </body>
    </html>
  );
}
