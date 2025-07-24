"use client";

import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

import { Roles, type User } from "../types/user";

interface AuthContextType {
  user: User | null;
  isSignedIn: boolean;
  isLoading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isSignedIn: false,
  isLoading: true,
  isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const isAuthenticated = status === "authenticated";
    const isStillLoading = status === "loading";

    setIsSignedIn(isAuthenticated);
    setIsLoading(isStillLoading);

    if (isAuthenticated && session?.user) {
      const userData = session.user;
      const userObject: User = {
        id: userData.id,
        name: userData.name ?? "",
        email: userData.email ?? "",
        role: userData.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setUser(userObject);

      setIsAdmin(
        userData.role === Roles.ADMIN || userData.role === Roles.SUPERADMIN,
      );
    } else if (status === "unauthenticated") {
      setUser(null);
      setIsAdmin(false);
    }
  }, [session, status]);

  const contextValue = {
    user,
    isSignedIn,
    isLoading,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
