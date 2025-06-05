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

function extractPlainText(node: any): string {
  if (!node) {
    return "";
  }

  if (node.type === "text" && typeof node.text === "string") {
    return node.text;
  }

  let text = "";
  if (Array.isArray(node.content)) {
    for (const childNode of node.content) {
      text += extractPlainText(childNode);
    }
    if (node.type === "paragraph" && text.length > 0) {
      text += " ";
    }
  } else if (node.content && typeof node.content === "object") {
    text += extractPlainText(node.content);
  }

  return text;
}

export async function POST(
  req: NextRequest,
  context: { params: { comment: string[] | undefined } },
) {
  const recipientEmail = process.env.EMAIL_USER;

  const reqClone = req.clone();

  const originalResponse = await commentHandlers.POST(req, {
    params: Promise.resolve({ comment: context.params.comment ?? [] }),
  });

  if (originalResponse.ok && recipientEmail) {
    try {
      const body = await reqClone.json();
      console.log(body);

      if (body && typeof body.like === "boolean") {
        console.log("Skipping email notification for like action.");
      } else {
        const page = context.params.comment?.[0];
        const richContent = body?.content;

        const content = extractPlainText(richContent).trim();

        if (page && content.length > 0) {
          let slug = "unknown";
          if (page.startsWith("blog-comments_")) {
            slug = page.replace("blog-comments_", "");
          } else {
            console.warn(
              `Page identifier "${page}" did not match expected format.`,
            );
          }

          const blogPostUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}#page_comments`;

          const preview =
            content.substring(0, 200) + (content.length > 200 ? "..." : "");

          await sendEmail({
            to: recipientEmail,
            subject: `New comment on blog post: "${slug}"`,
            html: `
              <p>A new comment has been posted on your blog post "<a href="${process.env.NEXT_PUBLIC_SITE_URL}/blog/${slug}">${slug}</a>".</p>
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
          console.warn(
            "Extracted plain text content is empty. Skipping email notification.",
          );
        }
      }
    } catch (error) {
      console.error(
        "Failed to process comment or send notification email:",
        error,
      );
    }
  } else if (originalResponse.ok && !recipientEmail) {
    console.warn(
      "EMAIL_USER environment variable is not set. Skipping email notification.",
    );
  }

  return originalResponse;
}
