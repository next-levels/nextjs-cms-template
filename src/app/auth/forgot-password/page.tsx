"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icons } from "~/components/icons";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const forgotPassword = api.user.forgotPassword.useMutation({
    onSuccess: () => {
      setSuccess(true);
      setIsLoading(false);
    },
    onError: (error) => {
      setError(
        error.message ||
          "Ein Fehler ist aufgetreten. Bitte versuche es später erneut.",
      );
      setIsLoading(false);
    },
  });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    await forgotPassword.mutateAsync({ email });
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Passwort zurücksetzen
          </CardTitle>
          <CardDescription>
            Gib deine E-Mail-Adresse ein, um einen Code zum Zurücksetzen deines
            Passworts zu erhalten
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="flex flex-col space-y-4">
              <div className="rounded-md bg-green-100 p-4 text-sm text-green-800">
                <p className="flex items-center">
                  <Icons.success className="mr-2 h-4 w-4" />
                  Wir haben dir eine E-Mail mit einem Code zum Zurücksetzen
                  deines Passworts geschickt.
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/auth/reset-password")}
              >
                Weiter zum Zurücksetzen des Passworts
              </Button>
            </div>
          ) : (
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
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@beispiel.de"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Code anfordern
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/auth/login")}
            className="w-full sm:w-auto"
          >
            <Icons.chevronLeft className="mr-2 h-4 w-4" />
            Zurück zur Anmeldung
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
