import { z } from "zod";

const userSchema = z.object({
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

export default userSchema;
