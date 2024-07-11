import nodemailer from "nodemailer";
import { env } from "../env";

export const getMailClient = async () => {
  let transporter;

  if (!("RENDER" in process.env)) {
    const account = await nodemailer.createTestAccount();

    transporter = await nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });
  } else {
    transporter = await nodemailer.createTransport({
      host: env.SMTP_SERVER,
      port: env.SMTP_PORT,
      secure: false,
      auth: {
        user: env.SMTP_USERNAME,
        pass: env.SMTP_PASSWORD,
      },
    });
  }

  return transporter;
};
