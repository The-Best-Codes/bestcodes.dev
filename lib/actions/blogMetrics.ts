import { db } from "@/lib/database";
import { postLikes, postMetrics } from "@/lib/schema";
import { and, eq, inArray, isNotNull, isNull, sql } from "drizzle-orm";

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

export async function getMetricsForPost(params: {
  slug: string;
  userId?: string | null;
  fingerprint?: string | null;
}): Promise<MetricsResponse> {
  const { slug, userId = null, fingerprint = null } = params;
  assertSlug(slug);
  await ensureMetricsRow(slug);

  const [metric] =
    (await db
      .select()
      .from(postMetrics)
      .where(eq(postMetrics.slug, slug))
      .limit(1)) ?? [];

  const hasLiked = await hasUserLiked({ slug, userId, fingerprint });

  return {
    slug,
    views: metric?.views ?? 0,
    likes: metric?.likes ?? 0,
    hasLiked,
  };
}

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
          : and(
              isNotNull(postLikes.fingerprint),
              eq(postLikes.fingerprint, fingerprint!),
            ),
      ),
    )
    .limit(1);

  return liked.length > 0;
}

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
    await db
      .insert(postLikes)
      .values({
        slug,
        userId: userId ?? null,
        fingerprint: userId ? null : (fingerprint ?? null),
      })
      .onConflictDoNothing()
      .execute();

    await db
      .update(postMetrics)
      .set({
        likes: sql`${postMetrics.likes} + 1`,
        updatedAt: sql`now()`,
      })
      .where(eq(postMetrics.slug, slug))
      .execute();
  } else if (action === "unlike" && currentlyLiked) {
    await db
      .delete(postLikes)
      .where(
        and(
          eq(postLikes.slug, slug),
          userId
            ? and(isNotNull(postLikes.userId), eq(postLikes.userId, userId))
            : and(
                isNull(postLikes.userId),
                isNotNull(postLikes.fingerprint),
                eq(postLikes.fingerprint, fingerprint!),
              ),
        ),
      )
      .execute();

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
    (await db
      .select()
      .from(postMetrics)
      .where(eq(postMetrics.slug, slug))
      .limit(1)) ?? [];
  const hasLikedNow = await hasUserLiked({ slug, userId, fingerprint });

  return {
    slug,
    likes: metric?.likes ?? 0,
    hasLiked: hasLikedNow,
  };
}

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
