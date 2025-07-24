"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import type { z } from "zod";
import { Form } from "~/components/ui/form";
import { TextInput, FormActions } from "~/components/form";
import userSchema from "~/schema/user-schema";

type FormValues = z.infer<typeof userSchema>;

type EntityFormProps = {
  isSubmitting: boolean;
  handleSubmit: (values: FormValues) => void;
  defaultValues?: FormValues;
  onChange?: (values: FormValues) => void;
  showCancelButton?: boolean;
};

function EntityForm({
  isSubmitting,
  handleSubmit,
  defaultValues = {
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  },
  showCancelButton = false,
}: EntityFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(userSchema),
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      form.setValue("name", defaultValues.name);
      form.setValue("email", defaultValues.email);
      form.setValue("password", defaultValues.password);
      form.setValue("passwordConfirmation", defaultValues.passwordConfirmation);
    }
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="grid grid-cols-2 gap-6"
      >
        <TextInput
          control={form.control}
          name="name"
          label="Name"
          placeholder="Name"
          autoComplete="name"
          id="name"
        />

        <TextInput
          control={form.control}
          name="email"
          label="E-Mail"
          placeholder="E-Mail"
          type="email"
          id="email"
          autoComplete="off"
        />

        <TextInput
          control={form.control}
          name="password"
          label="Passwort"
          placeholder="Passwort"
          type="password"
          id="password"
          autoComplete="off"
        />

        <TextInput
          control={form.control}
          name="passwordConfirmation"
          label="Passwort bestätigen"
          placeholder="Passwort bestätigen"
          type="password"
          id="passwordConfirmation"
          autoComplete="off"
        />

        <FormActions
          isSubmitting={isSubmitting}
          showCancelButton={showCancelButton}
          className="col-span-2"
        />
      </form>
    </Form>
  );
}

export default EntityForm;
