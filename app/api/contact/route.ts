import { verifySignedCSRFToken } from "@/app/actions";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";
import { verifySignedBCaptchaToken } from "@/app/actions"; // Import the bcaptcha verification

const CSRF_COOKIE_NAME = "csrf_token";
const CSRF_SECRET = process.env.CSRF_SECRET;

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

const requestBodySchema = formSchema.extend({
  csrf_token: z.string().min(1, "CSRF token is required."),
  bcaptcha_token: z.string().min(1, "BCaptcha token is required."), // Add bcaptcha token
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export async function POST(req: NextRequest) {
  try {
    const cookieData = await cookies();
    const signedTokenFromCookie = cookieData.get(CSRF_COOKIE_NAME)?.value;
    let rawTokenFromBody: string | undefined;
    let validatedData: z.infer<typeof formSchema>;
    let bcaptchaToken: string | undefined;

    if (!CSRF_SECRET) {
      console.error("FATAL: CSRF_SECRET environment variable is not set.");
      throw new Error("CSRF_SECRET environment variable is not set.");
    }

    try {
      const body = await req.json();
      const parsedBody = requestBodySchema.parse(body);
      rawTokenFromBody = parsedBody.csrf_token;
      bcaptchaToken = parsedBody.bcaptcha_token; // Extract bcaptcha token

      validatedData = {
        name: parsedBody.name,
        email: parsedBody.email,
        message: parsedBody.message,
      };
    } catch (error) {
      console.error("Validation Error:", error);
      let errorMessage = "Invalid request body.";
      if (error instanceof z.ZodError) {
        errorMessage = error.errors.map((e) => e.message).join(", ");
      }
      return NextResponse.json({ message: errorMessage }, { status: 400 });
    }

    if (
      !signedTokenFromCookie ||
      !rawTokenFromBody ||
      !verifySignedCSRFToken(signedTokenFromCookie, rawTokenFromBody)
    ) {
      console.warn("CSRF Verification Failed");
      return NextResponse.json(
        { message: "Invalid CSRF token." },
        { status: 403 },
      );
    }

    // Verify bcaptcha token
    if (!bcaptchaToken || !(await verifySignedBCaptchaToken(bcaptchaToken))) {
      console.warn("BCaptcha Verification Failed");
      return NextResponse.json(
        { message: "Invalid BCaptcha token." },
        { status: 403 },
      );
    }

    const { name, email, message } = validatedData;
    const mailOptions = {
      from: `"Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, "<br>")}</p>`,
      replyTo: email,
    };

    try {
      await transporter.sendMail(mailOptions);
      // Optional: Clear the CSRF cookie after successful use? Maybe not necessary if it expires or is overwritten on next page load.
      // cookies().delete(CSRF_COOKIE_NAME);
      return NextResponse.json(
        { message: "Email sent successfully!" },
        { status: 200 },
      );
    } catch (error) {
      console.error("Failed to send email:", error);
      return NextResponse.json(
        { message: "Failed to send email. Please try again later." },
        { status: 500 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: `Internal Server Error: ${error}` },
      { status: 500 },
    );
  }
}
