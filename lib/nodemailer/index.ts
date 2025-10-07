import nodemailer from "nodemailer";
import { WELCOME_EMAIL_TEMPLATE } from "./template";
import { text } from "stream/consumers";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL!,
    pass: process.env.NODEMAILER_PASSWORD!,
  },
});

export const sendWelcomeEmail = async ({email, name, intro}: WelcomeEmailData) => {
  const htmlTemplate = WELCOME_EMAIL_TEMPLATE.replace("{{name}}", name).replace("{{intro}}", intro);

  const mailOptions = {
    from: `"Signalist" <signalist@djangobona.pro>`,
    to: email,
    subject: "Welcome to Signlist - Your stock market toolkit is ready!",
    text: `Hello ${name}, We're excited to have you on board! Explore our tools and features to enhance your stock market experience.\n\nBest regards,\nThe Signlist Team`,
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
};
