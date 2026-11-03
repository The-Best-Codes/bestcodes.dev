import { sendEmail } from "@/lib/sendEmail";
// BotID is disabled for now. To re-enable, uncomment the lines marked "BotID"
// here and in next.config.ts, plus the block in instrumentation-client.ts.
// import { checkBotId } from "botid/server"; // BotID
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.email("Please enter a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );

export async function POST(req: NextRequest) {
  // BotID
  // const { isBot } = await checkBotId();
  // if (isBot) {
  //   return NextResponse.json(
  //     { message: "It looks like you're a bot. Access denied." },
  //     { status: 403 },
  //   );
  // }

  const parsed = formSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues.map((e) => e.message).join(", ") },
      { status: 400 },
    );
  }

  const { name, email, message } = parsed.data;
  try {
    await sendEmail({
      to: process.env.EMAIL_USER!,
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p><p><strong>Message:</strong></p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
      replyTo: email,
    });
    return NextResponse.json({ message: "Email sent successfully!" });
  } catch {
    return NextResponse.json(
      { message: "Failed to send email. Please try again later." },
      { status: 500 },
    );
  }
}
