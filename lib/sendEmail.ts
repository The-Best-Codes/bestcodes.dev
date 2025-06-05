import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    console.error(
      "FATAL: Email credentials (EMAIL_USER or EMAIL_APP_PASSWORD) are not set.",
    );
    throw new Error("Email credentials are not set.");
  }

  const mailOptions = {
    from: `"bestcodes.dev" <${process.env.EMAIL_USER}>`,
    ...options,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      `Email sent successfully to ${Array.isArray(options.to) ? options.to.join(", ") : options.to}`,
    );
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}
