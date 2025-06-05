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

/**
 * Recursively extracts plain text from a rich text document structure.
 * Assumes a structure similar to ProseMirror/TipTap output.
 */
function extractPlainText(node: any): string {
  if (!node) {
    return "";
  }

  // If the node is a text node, return its text
  if (node.type === "text" && typeof node.text === "string") {
    return node.text;
  }

  let text = "";
  // If the node has children in a 'content' array, recursively process them
  if (Array.isArray(node.content)) {
    for (const childNode of node.content) {
      text += extractPlainText(childNode);
    }
    // Add a space or newline after block elements like paragraphs
    if (node.type === "paragraph" && text.length > 0) {
      text += " "; // Using space for readability
    }
  } else if (node.content && typeof node.content === "object") {
    // Handle a single content object if necessary (less common based on your logs)
    text += extractPlainText(node.content);
  }

  return text;
}

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
        // Continue processing the original response return
      } else {
        // Only process email for non-like actions
        // Get page from route parameters
        const page = context.params.comment?.[0];
        const richContent = body?.content; // Get the rich text content object

        // Extract plain text from the rich content object
        const content = extractPlainText(richContent).trim(); // Trim whitespace

        // Only proceed with email if we have a page identifier and extracted text content
        if (page && content.length > 0) {
          let slug = "unknown";
          if (page.startsWith("blog-comments_")) {
            slug = page.replace("blog-comments_", "");
          } else {
            // Handle cases where page doesn't start with "blog-comments_"
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
        } else {
          // content.length is 0 after extraction and trim
          console.warn(
            "Extracted plain text content is empty. Skipping email notification.",
          );
        }
      } // End of non-like action processing
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
