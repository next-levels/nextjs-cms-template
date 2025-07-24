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
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { api } from "~/trpc/react";

function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") ?? "";

  const [formData, setFormData] = useState({
    password: "",
    passwordConfirmation: "",
    token: token,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const resetPassword = api.user.resetPassword.useMutation({
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

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.passwordConfirmation) {
      setError("Die Passwörter stimmen nicht überein");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Das Passwort muss mindestens 8 Zeichen lang sein");
      setIsLoading(false);
      return;
    }

    await resetPassword.mutateAsync({
      password: formData.password,
      passwordConfirmation: formData.passwordConfirmation,
      token: formData.token,
    });
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Neues Passwort festlegen
          </CardTitle>
          <CardDescription>
            Gib deinen Code und ein neues Passwort ein
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="flex flex-col space-y-4">
              <div className="rounded-md bg-green-100 p-4 text-sm text-green-800">
                <p className="flex items-center">
                  <Icons.success className="mr-2 h-4 w-4" />
                  Dein Passwort wurde erfolgreich zurückgesetzt.
                </p>
              </div>
              <Button
                className="w-full"
                onClick={() => router.push("/auth/login")}
              >
                Zur Anmeldung
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
                <Label htmlFor="token">Token</Label>
                <Input
                  id="token"
                  name="token"
                  value={formData.token}
                  onChange={handleChange}
                  placeholder="Dein Reset-Token"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Neues Passwort</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mindestens 8 Zeichen"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordConfirmation">
                  Passwort bestätigen
                </Label>
                <Input
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  type="password"
                  value={formData.passwordConfirmation}
                  onChange={handleChange}
                  placeholder="Passwort wiederholen"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Passwort zurücksetzen
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Icons.spinner className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <ResetPassword />
    </Suspense>
  );
}
