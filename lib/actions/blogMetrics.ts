#!/usr/bin/env ts
/**
 * Blog metrics helper actions for views and likes.
 *
 * These helpers encapsulate database interactions for:
 * - Retrieving metrics for a post (views, likes, and whether the current user/fingerprint has liked)
 * - Incrementing views with optional soft dedupe
 * - Toggling likes for authenticated and anonymous users
 *
 * Usage notes:
 * - userId is optional; when present, likes are tied to the authenticated user.
 * - fingerprint is optional; when user is anonymous, generate and store a UUID in localStorage/cookie on the client and pass it here.
 * - To prevent abuse, consider adding rate limiting at the route level and/or IP-based dedupe for views.
 */
 
import { and, eq, isNotNull, isNull, sql, inArray } from "drizzle-orm";
import { db } from "@/lib/database";
import { postLikes, postMetrics } from "@/lib/schema";
 
export type PostMetricsRow = {
  slug: string;
  views: number;
  likes: number;
  updatedAt: Date | null;
};
 
export type MetricsResponse = {
  slug: string;
  views: number;
  likes: number;
  hasLiked: boolean;
};

function assertSlug(slug: string) {
  if (!slug || typeof slug !== "string") {
    throw new Error("Invalid slug");
  }
  if (slug.length > 256) {
    throw new Error("Slug exceeds maximum length");
  }
}

async function ensureMetricsRow(slug: string) {
  // Upsert-like behavior: try insert; if conflict, ignore.
  await db
    .insert(postMetrics)
    .values({
      slug,
      views: 0,
      likes: 0,
    })
    .onConflictDoNothing()
    .execute();
}

/**
 * Retrieve metrics for a single post, including whether this user/fingerprint has liked it.
 */
export async function getMetricsForPost(params: {
  slug: string;
  userId?: string | null;
  fingerprint?: string | null;
}): Promise<MetricsResponse> {
  const { slug, userId = null, fingerprint = null } = params;
  assertSlug(slug);
  await ensureMetricsRow(slug);

  const [metric] =
    (await db.select().from(postMetrics).where(eq(postMetrics.slug, slug)).limit(1)) ??
    [];
 
  const hasLiked = await hasUserLiked({ slug, userId, fingerprint });
 
  return {
    slug,
    views: metric?.views ?? 0,
    likes: metric?.likes ?? 0,
    hasLiked,
  };
}

/**
 * Retrieve metrics for multiple posts in a single call.
 */
export async function getMetricsForPosts(params: {
  slugs: string[];
  userId?: string | null;
  fingerprint?: string | null;
}): Promise<Record<string, MetricsResponse>> {
  const { slugs, userId = null, fingerprint = null } = params;
  const uniqueSlugs = Array.from(new Set(slugs.filter(Boolean)));
  uniqueSlugs.forEach(assertSlug);

  // Ensure all rows exist
  await Promise.all(uniqueSlugs.map((s) => ensureMetricsRow(s)));

  const rows = await db
    .select()
    .from(postMetrics)
    .where(inArray(postMetrics.slug, uniqueSlugs));

  const result: Record<string, MetricsResponse> = {};
  for (const slug of uniqueSlugs) {
    const metric = rows.find((r) => r.slug === slug);
    const liked = await hasUserLiked({ slug, userId, fingerprint });
    result[slug] = {
      slug,
      views: metric?.views ?? 0,
      likes: metric?.likes ?? 0,
      hasLiked: liked,
    };
  }
  return result;
}

/**
 * Increment views for a post.
 * Soft dedupe strategy can be applied at the caller level (e.g., sessionStorage guard).
 * Optionally pass an IP and/or fingerprint for server-side dedupe windows if you later add a dedupe table.
 */
export async function incrementView(params: {
  slug: string;
}): Promise<{ slug: string; views: number }> {
  const { slug } = params;
  assertSlug(slug);
  await ensureMetricsRow(slug);

  const updated = await db
    .update(postMetrics)
    .set({
      views: sql`${postMetrics.views} + 1`,
      updatedAt: sql`now()`,
    })
    .where(eq(postMetrics.slug, slug))
    .returning({
      slug: postMetrics.slug,
      views: postMetrics.views,
    });

  const row = updated?.[0];
  return { slug, views: row?.views ?? 0 };
}

/**
 * Determine whether a user (or anonymous fingerprint) has liked a post.
 */
export async function hasUserLiked(params: {
  slug: string;
  userId?: string | null;
  fingerprint?: string | null;
}): Promise<boolean> {
  const { slug, userId = null, fingerprint = null } = params;
  assertSlug(slug);

  if (!userId && !fingerprint) return false;

  const liked = await db
    .select({ id: postLikes.id })
    .from(postLikes)
    .where(
      and(
        eq(postLikes.slug, slug),
        userId
          ? and(isNotNull(postLikes.userId), eq(postLikes.userId, userId))
          : and(isNotNull(postLikes.fingerprint), eq(postLikes.fingerprint, fingerprint!)),
      ),
    )
    .limit(1);

  return liked.length > 0;
}

/**
 * Toggle like for a post. If already liked, and action is "unlike", it will remove the like.
 * If not liked, and action is "like", it will add a like.
 * Returns the new likes count and hasLiked.
 */
export async function toggleLike(params: {
  slug: string;
  action: "like" | "unlike";
  userId?: string | null;
  fingerprint?: string | null;
}): Promise<{ slug: string; likes: number; hasLiked: boolean }> {
  const { slug, action, userId = null, fingerprint = null } = params;
  assertSlug(slug);

  if (!userId && !fingerprint) {
    throw new Error("Either userId or fingerprint is required to like/unlike.");
  }

  await ensureMetricsRow(slug);

  const currentlyLiked = await hasUserLiked({ slug, userId, fingerprint });

  if (action === "like" && !currentlyLiked) {
    // Insert like record
    await db
      .insert(postLikes)
      .values({
        slug,
        userId: userId ?? null,
        fingerprint: userId ? null : fingerprint ?? null,
      })
      .onConflictDoNothing()
      .execute();

    // Increment likes counter
    await db
      .update(postMetrics)
      .set({
        likes: sql`${postMetrics.likes} + 1`,
        updatedAt: sql`now()`,
      })
      .where(eq(postMetrics.slug, slug))
      .execute();
  } else if (action === "unlike" && currentlyLiked) {
    // Delete like record
    await db
      .delete(postLikes)
      .where(
        and(
          eq(postLikes.slug, slug),
          userId
            ? and(isNotNull(postLikes.userId), eq(postLikes.userId, userId))
            : and(isNull(postLikes.userId), isNotNull(postLikes.fingerprint), eq(postLikes.fingerprint, fingerprint!)),
        ),
      )
      .execute();

    // Decrement likes counter but not below zero
    await db
      .update(postMetrics)
      .set({
        likes: sql`GREATEST(${postMetrics.likes} - 1, 0)`,
        updatedAt: sql`now()`,
      })
      .where(eq(postMetrics.slug, slug))
      .execute();
  }

  const [metric] =
    (await db.select().from(postMetrics).where(eq(postMetrics.slug, slug)).limit(1)) ?? [];
  const hasLikedNow = await hasUserLiked({ slug, userId, fingerprint });

  return {
    slug,
    likes: metric?.likes ?? 0,
    hasLiked: hasLikedNow,
  };
}

/**
 * Internal helper for admin/repair operations to set a precise like count
 * from the actual likes table. Not exposed by default.
 */
export async function reconcileLikesCount(slug: string): Promise<number> {
  assertSlug(slug);

  const [{ count }] =
    (await db
      .select({ count: sql<number>`count(*)` })
      .from(postLikes)
      .where(eq(postLikes.slug, slug))) ?? [];

  await db
    .update(postMetrics)
    .set({
      likes: count ?? 0,
      updatedAt: sql`now()`,
    })
    .where(eq(postMetrics.slug, slug))
    .execute();

  return count ?? 0;
}

export async function seedMetricsIfMissing(slug: string) {
  await ensureMetricsRow(slug);
}

/**
 * Optional utility to clear all likes for a slug (admin only).
 */
export async function clearLikesForSlug(slug: string): Promise<number> {
  assertSlug(slug);
  const deleted = await db
    .delete(postLikes)
    .where(eq(postLikes.slug, slug))
    .returning({ id: postLikes.id });

  await db
    .update(postMetrics)
    .set({ likes: 0, updatedAt: sql`now()` })
    .where(eq(postMetrics.slug, slug))
    .execute();

  return deleted.length;
}
