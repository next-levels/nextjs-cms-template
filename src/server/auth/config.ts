import { createAuthConfig } from "@mikestraczek/cms-auth";
import { db } from "~/server/db";
import { env } from "~/env";

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 * Using the modular auth configuration from @mikestraczek/cms-auth
 */
export const authConfig = createAuthConfig(db, env);
