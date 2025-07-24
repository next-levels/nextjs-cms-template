"use client";

import { redirect } from "next/navigation";
import { useAuth } from "~/context/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isSignedIn, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Lädt...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    redirect("/auth/login");
  }

  if (!isAdmin) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="px-4 py-4">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        </div>
      </nav>
      <main className="p-4">{children}</main>
    </div>
  );
}
