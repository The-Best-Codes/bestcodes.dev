import type { APIRoute } from "astro";
import nodeMailer from "nodemailer";

const YOUR_TURNSTILE_SECRET_KEY = import.meta.env.TURNSTILE_SECRET_KEY;
const GMAIL_USER = import.meta.env.GMAIL_USER;
const GMAIL_PSW = import.meta.env.GMAIL_PSW;

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({ message: "GET request is not supported." }),
    { status: 405 }
  );
};

export const POST: APIRoute = async ({ request }) => {
  try {
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ message: "Method Not Allowed" }), {
        status: 405,
      });
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;
    const turnstileResponse = formData.get("turnstileResponse") as string;

    // Basic server-side validation
    const errors: Record<string, string> = {};
    const emailRegex = new RegExp(
      `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`
    );

    if (!name) errors.name = "Name is required";
    if (!email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      errors.email = "Invalid email format";
    }
    if (!message) errors.message = "Message is required";

    if (Object.keys(errors).length > 0) {
      return new Response(JSON.stringify(errors), { status: 400 });
    }

    // Validate Turnstile
    if (!YOUR_TURNSTILE_SECRET_KEY) {
      return new Response(
        JSON.stringify({ message: "Turnstile secret key is missing" }),
        { status: 500 }
      );
    }
    try {
      const turnstileVerification = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            secret: YOUR_TURNSTILE_SECRET_KEY,
            response: turnstileResponse,
          }),
        }
      );

      const turnstileResult = await turnstileVerification.json();

      if (!turnstileResult.success) {
        console.log(turnstileResult);
        return new Response(
          JSON.stringify({
            message: "Turnstile verification failed.",
          }),
          { status: 400 }
        );
      }
    } catch (error) {
      console.error("Error verifying turnstile", error);
      return new Response(
        JSON.stringify({ message: "Error verifying turnstile." }),
        { status: 500 }
      );
    }

    // Email Sending Logic
    if (!GMAIL_USER || !GMAIL_PSW) {
      return new Response(
        JSON.stringify({ message: "Gmail credentials are not set." }),
        { status: 500 }
      );
    }

    try {
      const transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: GMAIL_USER,
          pass: GMAIL_PSW,
        },
      });

      const mailOptions = {
        from: `BestCodes Website <${GMAIL_USER}>`,
        to: `${GMAIL_USER}`,
        subject: `New Submission of BestCodes Contact Form - From ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      };

      await transporter.sendMail(mailOptions);

      return new Response(JSON.stringify({ message: "Message Sent" }), {
        status: 200,
      });
    } catch (error) {
      console.error("Error sending email:", error);
      return new Response(
        JSON.stringify({ message: "Failed to send email." }),
        {
          status: 500,
        }
      );
    }
  } catch (error) {
    console.error("Error processing the form:", error);
    return new Response(
      JSON.stringify({ message: "An unexpected error occurred." }),
      { status: 500 }
    );
  }
};
