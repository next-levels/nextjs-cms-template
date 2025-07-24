import nodemailer from "nodemailer";
import { calculateHectares } from "./tree-calculation";
import { env } from "~/env";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: parseInt(env.SMTP_PORT),
  auth:
    env.SMTP_USER && env.SMTP_PASS
      ? {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        }
      : undefined,
});

export type OrderEmailData = {
  userEmail: string;
  userName: string;
  firstName: string;
  lastName: string;
  street: string | null;
  houseNumber: string | null;
  zip: string | null;
  city: string | null;
  phone: string | null;
  amount: number;
  boughtAt: Date;
  resetPasswordLink: string;
};

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const totalHectares = calculateHectares(data.amount);
  const formattedDate = data.boughtAt.toLocaleDateString("de-DE");

  const addressLine = [data.street, data.houseNumber].filter(Boolean).join(" ");
  const cityLine = [data.zip, data.city].filter(Boolean).join(" ");
  const fullAddress = [addressLine, cityLine].filter(Boolean).join(", ");

  const emailText = `
Hallo ${data.userName},

wir haben soeben deinen Kauf im Portal hinterlegt:

Käufer-Informationen:
- Name: ${data.firstName} ${data.lastName}
- E-Mail: ${data.userEmail}
${data.phone ? `- Telefon: ${data.phone}` : ""}
${fullAddress ? `- Adresse: ${fullAddress}` : ""}

Kauf-Informationen:
- Anzahl Bäume: ${data.amount.toLocaleString("de-DE")}
- Hektar: ${totalHectares.toFixed(2)} ha
- Kaufdatum: ${formattedDate}

Du kannst dein Passwort unter folgendem Link setzen:
${data.resetPasswordLink}

Vielen Dank für dein Vertrauen in Greenchild!

Dein Greenchild Team
`;

  const emailHtml = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #22c55e;">Neue Bestellung bestätigt!</h2>

  <p>Hallo ${data.userName},</p>

  <p>wir haben soeben deinen Kauf im Portal hinterlegt:</p>

  <h3>Käufer-Informationen:</h3>
  <ul>
    <li><strong>Name:</strong> ${data.firstName} ${data.lastName}</li>
    <li><strong>E-Mail:</strong> ${data.userEmail}</li>
    ${data.phone ? `<li><strong>Telefon:</strong> ${data.phone}</li>` : ""}
    ${fullAddress ? `<li><strong>Adresse:</strong> ${fullAddress}</li>` : ""}
  </ul>

  <h3>Kauf-Informationen:</h3>
  <ul>
    <li><strong>Anzahl Bäume:</strong> ${data.amount.toLocaleString("de-DE")}</li>
    <li><strong>Hektar:</strong> ${totalHectares.toFixed(2)} ha</li>
    <li><strong>Kaufdatum:</strong> ${formattedDate}</li>
  </ul>

  <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <p><strong>Passwort setzen:</strong></p>
    <p>Du kannst dein Passwort unter folgendem Link setzen:</p>
    <a href="${data.resetPasswordLink}" style="background-color: #22c55e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Passwort setzen</a>
  </div>

  <p>Vielen Dank für dein Vertrauen in Greenchild!</p>

  <p style="color: #6b7280;">Dein Greenchild Team</p>
</div>
`;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? '"Greenchild" <noreply@greenchild.de>',
      to: data.userEmail,
      subject: "Neue Bestellung bei Greenchild bestätigt",
      text: emailText,
      html: emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending order confirmation email:", error);
    return { success: false, error };
  }
}

export type PasswordResetEmailData = {
  userEmail: string;
  userName: string;
  resetPasswordLink: string;
};

export async function sendPasswordResetEmail(data: PasswordResetEmailData) {
  const emailText = `
Hallo ${data.userName},

dein Passwort wurde zurückgesetzt. Unter folgendem Link vergibst du ein neues Passwort.

${data.resetPasswordLink}

Solltest du das Passwort nicht zurückgesetzt haben ignoriere bitte diese E-Mail.

Vielen Dank.

Dein Greenchild Team
`;

  const emailHtml = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #22c55e;">Passwort zurücksetzen</h2>

  <p>Hallo ${data.userName},</p>

  <p>dein Passwort wurde zurückgesetzt. Unter folgendem Link vergibst du ein neues Passwort.</p>

  <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <a href="${data.resetPasswordLink}" style="background-color: #22c55e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Neues Passwort setzen</a>
  </div>

  <p><strong>Solltest du das Passwort nicht zurückgesetzt haben ignoriere bitte diese E-Mail.</strong></p>

  <p>Vielen Dank.</p>

  <p style="color: #6b7280;">Dein Greenchild Team</p>
</div>
`;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? '"Greenchild" <noreply@greenchild.de>',
      to: data.userEmail,
      subject: "Passwort zurücksetzen - Greenchild",
      text: emailText,
      html: emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { success: false, error };
  }
}

// E-Mail Konfiguration testen
export async function testEmailConfiguration() {
  try {
    await transporter.verify();
    return true;
  } catch (error) {
    console.error("❌ Email server connection failed:", error);
    return false;
  }
}
