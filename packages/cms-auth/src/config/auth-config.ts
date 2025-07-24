import { type Role } from "../types/user";
import bcrypt from "bcryptjs";
import type { DefaultSession, NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { type PrismaClient } from "@prisma/client";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: Role;
      email: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: Role;
    email: string;
  }

  interface JWT {
    id: string;
    role: Role;
    email: string;
  }
}

export function createAuthConfig(
  db: PrismaClient,
  env: { AUTH_SECRET: string },
): NextAuthConfig {
  return {
    trustHost: true,
    session: {
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60,
    },
    pages: {
      signIn: "/auth/login",
      signOut: "/auth/login",
      error: "/auth/login",
    },
    providers: [
      CredentialsProvider({
        id: "credentials",
        name: "Credentials",
        credentials: {
          identifier: { label: "E-Mail", type: "email" },
          password: { label: "Passwort", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials?.identifier || !credentials?.password) {
            throw new Error("Fehlende Login-Daten");
          }

          try {
            const user = await db.user.findFirst({
              where: { email: credentials.identifier as string },
            });

            if (!user) {
              return null;
            }

            const isPasswordValid = await bcrypt.compare(
              credentials.password as string,
              user.password,
            );

            if (!isPasswordValid) {
              return null;
            }

            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          } catch (error) {
            console.error("Auth error:", error);
            return null;
          }
        },
      }),
    ],
    callbacks: {
      jwt: ({ token, user }) => {
        if (user) {
          return {
            ...token,
            id: user.id,
            role: user.role,
            email: user.email,
          };
        }

        return token;
      },
      session: ({ session, token }) => {
        if (session.user && token) {
          return {
            ...session,
            user: {
              ...session.user,
              id: token.id as string,
              role: token.role as Role,
            },
          };
        }

        return session;
      },
      authorized: ({ auth, request }) => {
        const { pathname } = request.nextUrl;

        if (!auth && !pathname.startsWith("/auth")) {
          return false;
        }

        return true;
      },
    },
    secret: env.AUTH_SECRET,
  };
}

// Default export for backwards compatibility
export const authConfig = createAuthConfig;
