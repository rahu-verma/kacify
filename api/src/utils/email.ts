import { createTransport } from "nodemailer";
import env from "./env";

export const sendEmail = async (to: string, subject: string, text: string) => {
  const transporter = createTransport({
    host: String(env.EMAIL_HOST),
    port: Number(env.EMAIL_PORT),
    auth: {
      user: String(env.EMAIL_ADDRESS),
      pass: String(env.EMAIL_PASSWORD),
    },
  });
  await transporter.sendMail({
    from: String(env.EMAIL_ADDRESS),
    to,
    subject,
    text,
  });
};

export const sendVerificationEmail = async (
  to: string,
  verificationCode: string
) => {
  await sendEmail(
    to,
    "Kacify register verification",
    `Your verification code is: ${verificationCode}`
  );
};

export const sendErrorEmail = async (error: Error) => {
  await sendEmail(
    env.EMAIL_ADDRESS,
    "Kacify API error",
    JSON.stringify({
      error: error?.message,
      stack: error?.stack,
    })
  );
};
