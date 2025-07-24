"use client";

import { ThemeProvider, Toaster } from "@mikestraczek/cms-ui";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "~/context/auth";
import { TRPCReactProvider } from "~/trpc/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider>
            {children}
            <Toaster />
          </TRPCReactProvider>
        </ThemeProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
