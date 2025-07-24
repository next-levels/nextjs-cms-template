// Auth configuration
export { authConfig } from "./config/auth-config";
export { auth, signIn, signOut, handlers } from "./lib/auth";

// Utilities
export { hashPassword, verifyPassword } from "./lib/password";
export {
  createPasswordResetToken,
  validatePasswordResetToken,
  markTokenAsUsed,
  generatePasswordResetUrl,
} from "./lib/password-reset";
export { sendPasswordResetEmail } from "./lib/email";

// Types
export type { AuthUser, AuthSession } from "./types/auth";

// HOCs and Components
export { withAuth } from "./components/with-auth";
export { AuthProvider } from "./components/auth-provider";

// Hooks
export { useAuth } from "./hooks/use-auth";
