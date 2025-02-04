import type { APIRoute } from "astro";
import { SendMailClient } from "zeptomail";

export const prerender = false;

const YOUR_TURNSTILE_SECRET_KEY = import.meta.env.TURNSTILE_SECRET_KEY;
const ZOHO_API_KEY = import.meta.env.ZOHO_API_KEY;
const FROM_EMAIL = "noreply@bestcodes.dev"; // Changed to constant
const TO_EMAIL = "admin@bestcodes.dev"; // Changed to constant

const url = "api.zeptomail.com/";

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({ message: "GET request is not supported." }),
    { status: 405 }
  );
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;
    const turnstileResponse = formData.get("turnstileResponse") as string;

    // Basic server-side validation
    const errors: Record<string, string> = {};
    const emailRegex = new RegExp(
      `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`
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
    if (!ZOHO_API_KEY) {
      return new Response(
        JSON.stringify({ message: "Zoho API key is missing" }),
        { status: 500 }
      );
    }

    try {
      let client = new SendMailClient({ url, token: ZOHO_API_KEY });

      await client.sendMail({
        from: {
          address: FROM_EMAIL,
          name: "BestCodes Contact Form",
        },
        to: [
          {
            email_address: {
              address: TO_EMAIL,
              name: "BestCodes Admin",
            },
          },
        ],
        subject: `New Submission of BestCodes Contact Form - From ${name}`,
        htmlbody: `
        <div>
            <p><b>Name:</b> ${name}</p>
            <p><b>Email:</b> ${email}</p>
            <p><b>Message:</b> ${message}</p>
        </div>
        `,
      });

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
