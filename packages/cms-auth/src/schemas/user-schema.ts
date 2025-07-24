import { z } from "zod";

export const userSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Der Name muss mindestens 1 Zeichen lang sein" }),
  email: z
    .string()
    .email({ message: "Ungültige E-Mail-Adresse" })
    .min(1, { message: "Die E-Mail muss mindestens 1 Zeichen lang sein" }),
  password: z
    .string()
    .min(1, { message: "Das Passwort muss mindestens 1 Zeichen lang sein" }),
  passwordConfirmation: z.string().min(1, {
    message: "Die Passwortbestätigung muss mindestens 1 Zeichen lang sein",
  }),
});

export const createUserSchema = userSchema;

export const updateUserSchema = userSchema.extend({
  id: z.string(),
  password: z.string().optional(),
  passwordConfirmation: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Ungültige E-Mail-Adresse" }),
  password: z.string().min(1, { message: "Passwort ist erforderlich" }),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Ungültige E-Mail-Adresse" }),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Passwort muss mindestens 6 Zeichen lang sein" }),
    passwordConfirmation: z.string(),
    token: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwörter stimmen nicht überein",
    path: ["passwordConfirmation"],
  });
