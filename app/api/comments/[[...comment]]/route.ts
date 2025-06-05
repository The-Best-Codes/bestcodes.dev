import { auth } from "@/lib/auth";
import { db } from "@/lib/database";
import { comments, rates, roles, user } from "@/lib/schema";
import { sendEmail } from "@/lib/sendEmail";
import { createBetterAuthAdapter } from "@fuma-comment/server/adapters/better-auth";
import { createDrizzleAdapter } from "@fuma-comment/server/adapters/drizzle";
import { NextComment } from "@fuma-comment/server/next";
import { NextRequest } from "next/server";

const commentHandlers = NextComment({
  mention: { enabled: true },
  auth: createBetterAuthAdapter(auth),
  role: "database",
  storage: createDrizzleAdapter({
    auth: "better-auth",
    db,
    schemas: {
      comments,
      rates,
      roles,
      user,
    },
  }),
});

export const { GET, DELETE, PATCH } = commentHandlers;

export async function POST(
  req: NextRequest,
  context: { params: { comment: string[] | undefined } },
) {
  const recipientEmail = process.env.EMAIL_USER;

  // Clone the request so the original handler can still read the body
  const reqClone = req.clone();

  // Process the comment creation using the original handler
  const originalResponse = await commentHandlers.POST(req, {
    params: Promise.resolve({ comment: context.params.comment ?? [] }),
  });

  // If comment creation was successful, send an email notification
  if (originalResponse.ok && recipientEmail) {
    try {
      const body = await reqClone.json();
      console.log(body);
      const page: string = body.page; // Assuming page is in the body
      const content: string = body.content; // Assuming content is in the body

      let slug = "unknown";
      if (page.startsWith("blog-comments_")) {
        slug = page.replace("blog-comments_", "");
      }

      const blogPostUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${slug}#page_comments`;

      // Basic preview of the comment
      const preview =
        content.substring(0, 200) + (content.length > 200 ? "..." : "");

      await sendEmail({
        to: recipientEmail,
        subject: `New comment on blog post: "${slug}"`,
        html: `
          <p>A new comment has been posted on your blog post.</p>
          <p><strong>Blog Post:</strong> ${slug}</p>
          <p><strong>Comment Preview:</strong></p>
          <div style="border-left: 4px solid #ccc; padding: 10px; margin-left: 10px; white-space: pre-wrap;">${preview}</div>
          <p><a href="${blogPostUrl}">View Comment</a></p>
        `,
      });
      console.log("Comment notification email sent.");
    } catch (error) {
      console.error("Failed to send comment notification email:", error);
      // Do not re-throw, as comment creation was successful
    }
  } else if (originalResponse.ok && !recipientEmail) {
    console.warn(
      "EMAIL_USER environment variable is not set. Skipping email notification.",
    );
  }

  // Return the original response from the comment handler
  return originalResponse;
}
