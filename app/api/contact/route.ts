import { sendEmail } from "@/lib/sendEmail";
import { checkBotId } from "botid/server";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.email("Please enter a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export async function POST(req: NextRequest) {
  const { isBot } = await checkBotId();
  if (isBot) {
    return NextResponse.json(
      { message: "It looks like you're a bot. Access denied." },
      { status: 403 },
    );
  }

  try {
    let validatedData: z.infer<typeof formSchema>;

    try {
      const body = await req.json();
      validatedData = formSchema.parse(body);
    } catch (error) {
      console.error("Validation Error:", error);
      let errorMessage = "Invalid request body.";
      if (error instanceof z.ZodError) {
        errorMessage = error.issues.map((e) => e.message).join(", ");
      }
      return NextResponse.json({ message: errorMessage }, { status: 400 });
    }

    const { name, email, message } = validatedData;
    const mailOptions = {
      to: process.env.EMAIL_USER!,
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, "<br>")}</p>`,
      replyTo: email,
    };

    try {
      await sendEmail(mailOptions);
      return NextResponse.json(
        { message: "Email sent successfully!" },
        { status: 200 },
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Failed to send email. Please try again later." },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Internal Server Error in contact route:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
