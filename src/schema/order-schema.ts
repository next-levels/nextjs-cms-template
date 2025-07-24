import { z } from "zod";

const orderSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "Der Vorname muss mindestens 1 Zeichen lang sein" }),
  lastName: z
    .string()
    .min(1, { message: "Der Nachname muss mindestens 1 Zeichen lang sein" }),
  street: z
    .string()
    .min(1, { message: "Die Straße muss mindestens 1 Zeichen lang sein" })
    .nullable(),
  houseNumber: z
    .string()
    .min(1, { message: "Die Hausnummer muss mindestens 1 Zeichen lang sein" })
    .nullable(),
  zip: z
    .string()
    .min(1, { message: "Die PLZ muss mindestens 1 Zeichen lang sein" })
    .nullable(),
  city: z
    .string()
    .min(1, { message: "Die Stadt muss mindestens 1 Zeichen lang sein" })
    .nullable(),
  boughtAt: z.date(),
  amount: z.coerce
    .number()
    .min(1, { message: "Die Menge muss mindestens 1 sein" }),
  email: z
    .string()
    .email({ message: "Ungültige E-Mail-Adresse" })
    .min(1, { message: "Die E-Mail muss mindestens 1 Zeichen lang sein" }),
  phone: z
    .string()
    .min(1, {
      message: "Die Telefonnummer muss mindestens 1 Zeichen lang sein",
    })
    .nullable(),
  userId: z.string().nullable(),
});

export default orderSchema;
