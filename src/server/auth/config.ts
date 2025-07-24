import { createAuthConfig } from "~/lib/auth-config";
import { db } from "~/server/db";
import { env } from "~/env";

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 * Using the local auth configuration
 */
export const authConfig = createAuthConfig(db, env);
