"use client";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Icons,
  Input,
  Label,
} from "@mikestraczek/cms-ui";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") ?? "/admin";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setError("Bitte gib deine E-Mail und dein Passwort ein");
      setIsLoading(false);
      return;
    }

    try {
      const response = await signIn("credentials", {
        redirect: false,
        identifier: email,
        password,
        callbackUrl,
      });

      if (response?.error) {
        setError("Ungültige E-Mail oder Passwort");
        setIsLoading(false);
        return;
      }

      if (response?.url) {
        window.location.href = response.url;
      } else {
        setError("Unerwarteter Fehler bei der Anmeldung");
        setIsLoading(false);
      }
    } catch {
      setError(
        "Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.",
      );
      setIsLoading(false);
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Anmelden</CardTitle>
          <CardDescription>
            Gib deine E-Mail und dein Passwort ein, um dich anzumelden
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/15 text-destructive rounded-md p-3 text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@beispiel.de"
                required
                tabIndex={1}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Passwort</Label>

                <Link
                  href="/auth/forgot-password"
                  className="text-primary text-sm hover:underline"
                  tabIndex={4}
                >
                  Passwort vergessen?
                </Link>
              </div>

              <Input
                id="password"
                name="password"
                type="password"
                required
                tabIndex={2}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              tabIndex={3}
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Anmelden
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-muted-foreground text-sm">
            🔒 Sichere Verbindung - Deine Daten werden verschlüsselt übertragen
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Icons.spinner className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
