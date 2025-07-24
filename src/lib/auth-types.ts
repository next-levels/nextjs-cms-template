import { z } from "zod";

export const Roles = {
  USER: "USER",
  ADMIN: "ADMIN",
  SUPERADMIN: "SUPERADMIN",
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};

export const userSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().min(1, "Name ist erforderlich"),
    email: z.string().email("Ungültige E-Mail-Adresse"),
    role: z.enum([Roles.USER, Roles.ADMIN, Roles.SUPERADMIN]),
    password: z
      .string()
      .min(8, "Passwort muss mindestens 8 Zeichen lang sein")
      .optional(),
    passwordConfirmation: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password && data.passwordConfirmation) {
        return data.password === data.passwordConfirmation;
      }
      return true;
    },
    {
      message: "Passwörter stimmen nicht überein",
      path: ["passwordConfirmation"],
    },
  );

export type UserInput = z.infer<typeof userSchema>;
