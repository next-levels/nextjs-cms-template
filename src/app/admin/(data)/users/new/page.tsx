"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { z } from "zod";
import FormPageLayout from "~/components/layouts/form-page-layout";
import type userSchema from "~/schema/user-schema";
import { api } from "~/trpc/react";
import EntityForm from "../_components/entity-form";

export default function NewPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const utils = api.useUtils();

  const createEntity = api.user.create.useMutation({
    onSuccess: () => {
      void utils.user.fetchPaginated.invalidate();
    },
  });

  const handleSubmit = async (values: z.infer<typeof userSchema>) => {
    const { name, email, password, passwordConfirmation } = values;

    setIsSubmitting(true);

    try {
      await createEntity.mutateAsync({
        name,
        email,
        password,
        passwordConfirmation,
      });
      toast.success("Der Benutzer wurde erfolgreich erstellt!");

      setTimeout(() => {
        router.push("/admin/users");
      }, 1500);
    } catch {
      toast.error("Beim Erstellen des Benutzers ist ein Fehler aufgetreten.");
      setIsSubmitting(false);
    }
  };

  return (
    <FormPageLayout
      title="Benutzer erstellen"
      description="Bitte gib die Details für den neuen Benutzer ein."
    >
      <EntityForm
        isSubmitting={isSubmitting}
        handleSubmit={handleSubmit}
        showCancelButton={true}
      />
    </FormPageLayout>
  );
}
