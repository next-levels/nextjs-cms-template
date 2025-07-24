"use client";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import type { z } from "zod";
import { Icons } from "~/components/icons";
import FormPageLayout from "~/components/layouts/form-page-layout";
import { Button } from "~/components/ui/button";
import type userSchema from "~/schema/user-schema";
import { api } from "~/trpc/react";
import EntityForm from "../_components/entity-form";

type DetailsPageProps = {
  params: Promise<{ id: string }>;
};

type FormValues = z.infer<typeof userSchema>;

export default function DetailsPage({ params }: DetailsPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const [formData, setFormData] = useState<FormValues>({
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const utils = api.useUtils();

  const { data, isLoading } = api.user.fetchById.useQuery({
    documentId: id,
  });

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name ?? "",
        email: data.email,
        password: "",
        passwordConfirmation: "",
      });
    }
  }, [data]);

  const updateEntity = api.user.update.useMutation({
    onSuccess: () => {
      void utils.user.fetchPaginated.invalidate();
      void utils.user.fetchById.invalidate({ documentId: id });
    },
  });

  const handleSubmit = async (values: FormValues) => {
    const { name, email, password, passwordConfirmation } = values;

    setIsSubmitting(true);

    try {
      await updateEntity.mutateAsync({
        id,
        name,
        email,
        password,
        passwordConfirmation,
      });
      toast.success("Der Benutzer wurde erfolgreich aktualisiert!");
      setIsSubmitting(false);
    } catch {
      toast.error(
        "Beim Aktualisieren des Benutzers ist ein Fehler aufgetreten.",
      );
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Icons.spinner className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-64 flex-col items-center justify-center">
        <h2 className="text-xl font-bold">Benutzer nicht gefunden</h2>

        <Button className="mt-4" onClick={() => router.push("/admin/users")}>
          Zurück zur Übersicht
        </Button>
      </div>
    );
  }

  return (
    <FormPageLayout
      title="Benutzerdetails"
      description="Bearbeite die Details des Benutzers."
    >
      <EntityForm
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
        defaultValues={formData}
        onChange={setFormData}
      />
    </FormPageLayout>
  );
}
