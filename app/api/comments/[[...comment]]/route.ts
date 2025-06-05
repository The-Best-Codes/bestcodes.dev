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

  // If comment creation was successful and an email recipient is set,
  // try to send a notification email.
  if (originalResponse.ok && recipientEmail) {
    try {
      // Read the body from the cloned request
      const body = await reqClone.json();
      console.log(body); // Log the body for debugging

      // Check if this is a like action, if so, skip email
      if (body && typeof body.like === "boolean") {
        console.log("Skipping email notification for like action.");
        return originalResponse; // Return the original response immediately
      }

      // Get page from route parameters
      const page = context.params.comment?.[0];
      const content: string | undefined = body?.content; // Get content from body (might be undefined for non-comment payloads)

      // Only proceed with email if we have a page identifier and content
      if (page && content !== undefined) {
        let slug = "unknown";
        if (page.startsWith("blog-comments_")) {
          slug = page.replace("blog-comments_", "");
        } else {
          // Handle cases where page doesn't start with "blog-comments_"
          // Maybe use the raw page identifier as slug or log a warning?
          // For now, just log and use "unknown"
          console.warn(
            `Page identifier "${page}" did not match expected format.`,
          );
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
      } else if (!page) {
        console.warn(
          "Page identifier not found in route parameters. Skipping email notification.",
        );
      } else if (content === undefined) {
        console.warn(
          "Content not found in request body. Skipping email notification (likely not a new comment/reply).",
        );
      }
    } catch (error) {
      console.error(
        "Failed to process comment or send notification email:",
        error,
      );
      // Do not re-throw, as original comment creation might have been successful
    }
  } else if (originalResponse.ok && !recipientEmail) {
    console.warn(
      "EMAIL_USER environment variable is not set. Skipping email notification.",
    );
  }

  // Return the original response from the comment handler
  return originalResponse;
}
