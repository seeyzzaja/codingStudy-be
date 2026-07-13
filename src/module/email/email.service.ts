import { BrevoClient } from "@getbrevo/brevo";

if (!process.env.BREVO_API_KEY) {
  throw new Error("BREVO_API_KEY belum diatur");
}

if (!process.env.BREVO_SENDER_EMAIL) {
  throw new Error("BREVO_SENDER_EMAIL belum diatur");
}

if (!process.env.BREVO_SENDER_NAME) {
  throw new Error("BREVO_SENDER_NAME belum diatur");
}

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

const sender = {
  name: process.env.BREVO_SENDER_NAME,
  email: process.env.BREVO_SENDER_EMAIL,
};

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

export const sendEmail = async ({
  to,
  subject,
  html,
}: SendEmailParams): Promise<void> => {
  await brevo.transactionalEmails.sendTransacEmail({
    sender,
    to: [{ email: to }],
    subject,
    htmlContent: html,
  });
};