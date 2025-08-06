"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * PostMetrics client component
 * - Displays live views and likes for a post
 * - Increments views on first mount per-session per-slug
 * - Allows toggling like/unlike (auth or anonymous fingerprint)
 *
 * API contract:
 * - GET /api/blog/metrics?slug=... => { slug, views, likes, hasLiked }
 * - POST /api/blog/metrics with:
 *   - { action: "view", slug, fingerprint? } => { slug, views }
 *   - { action: "like", slug, like: boolean, fingerprint? } => { slug, likes, hasLiked }
 */

type Metrics = {
  slug: string;
  views: number;
  likes: number;
  hasLiked: boolean;
};

type Props = {
  slug: string;
  className?: string;
  /**
   * If true, component will try to render compact UI (e.g. on cards).
   */
  compact?: boolean;
};

const LS_KEY_FINGERPRINT = "bc_anon_fingerprint_v1";
const SS_KEY_VIEW_PREFIX = "bc_view_recorded_";

/**
 * Generate (and memoize) a stable anonymous fingerprint in localStorage.
 * This is used to dedupe anonymous likes.
 */
function useAnonymousFingerprint(): string {
  const [fp, setFp] = useState<string>("");
  useEffect(() => {
    try {
      let current = localStorage.getItem(LS_KEY_FINGERPRINT);
      if (!current) {
        // Simple UUID v4-ish generator without crypto dependency.
        current = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
        localStorage.setItem(LS_KEY_FINGERPRINT, current);
      }
      setFp(current);
    } catch {
      // localStorage not available
      setFp("");
    }
  }, []);
  return fp;
}

/**
 * Simple session guard so we don't count multiple views per session for the same slug.
 */
function useSessionViewGuard(slug: string): { shouldRecord: boolean; markRecorded: () => void } {
  const key = `${SS_KEY_VIEW_PREFIX}${slug}`;
  const [shouldRecord, setShouldRecord] = useState<boolean>(false);

  useEffect(() => {
    try {
      const wasRecorded = sessionStorage.getItem(key);
      if (!wasRecorded) setShouldRecord(true);
    } catch {
      setShouldRecord(true);
    }
  }, [key]);

  const markRecorded = useCallback(() => {
    try {
      sessionStorage.setItem(key, "1");
    } catch {
      // ignore
    }
    setShouldRecord(false);
  }, [key]);

  return { shouldRecord, markRecorded };
}

export function PostMetrics({ slug, className, compact = false }: Props) {
  const fingerprint = useAnonymousFingerprint();
  const { shouldRecord, markRecorded } = useSessionViewGuard(slug);

  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [likeBusy, setLikeBusy] = useState<boolean>(false);
  const mountedRef = useRef<boolean>(false);

  // Fetch metrics
  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/blog/metrics?slug=${encodeURIComponent(slug)}`, {
        method: "GET",
        cache: "no-store",
      });
      const data = (await res.json()) as Metrics;
      if (res.ok && data && data.slug) {
        setMetrics(data);
      }
    } catch {
      // swallow errors; keep UI resilient
    } finally {
      setLoading(false);
    }
  }, [slug]);

  // Increment view on first mount if not already recorded in this session
  const recordView = useCallback(async () => {
    if (!shouldRecord) return;
    try {
      await fetch(`/api/blog/metrics`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          action: "view",
          slug,
          fingerprint: fingerprint || null,
        }),
      });
      // Optimistically update local counts
      setMetrics((prev) =>
        prev ? { ...prev, views: Math.max(0, (prev.views ?? 0) + 1) } : prev,
      );
      markRecorded();
    } catch {
      // ignore view errors, non-critical
    }
  }, [slug, fingerprint, shouldRecord, markRecorded]);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    void fetchMetrics().then(() => {
      // After fetch, try to record view
      void recordView();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchMetrics, recordView]);

  const onToggleLike = useCallback(async () => {
    if (!metrics) return;
    if (likeBusy) return;

    const nextLikeState = !metrics.hasLiked;

    // Optimistic update
    setLikeBusy(true);
    setMetrics((prev) =>
      prev
        ? {
            ...prev,
            hasLiked: nextLikeState,
            likes: Math.max(0, (prev.likes ?? 0) + (nextLikeState ? 1 : -1)),
          }
        : prev,
    );

    try {
      const res = await fetch(`/api/blog/metrics`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          action: "like",
          slug,
          like: nextLikeState,
          fingerprint: fingerprint || null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data || data.slug !== slug) {
        throw new Error("Failed to update like");
      }
      // Reconcile with server response
      setMetrics((prev) =>
        prev
          ? {
              ...prev,
              likes: typeof data.likes === "number" ? data.likes : prev.likes,
              hasLiked:
                typeof data.hasLiked === "boolean" ? data.hasLiked : prev.hasLiked,
            }
          : prev,
      );
    } catch {
      // Revert optimistic update on error
      setMetrics((prev) =>
        prev
          ? {
              ...prev,
              hasLiked: !nextLikeState,
              likes: Math.max(0, (prev.likes ?? 0) + (nextLikeState ? -1 : 1)),
            }
          : prev,
      );
    } finally {
      setLikeBusy(false);
    }
  }, [metrics, likeBusy, slug, fingerprint]);

  const viewsText = useMemo(() => {
    const v = metrics?.views ?? 0;
    if (v === 1) return "1 view";
    return `${v} views`;
  }, [metrics?.views]);

  const likesText = useMemo(() => {
    const l = metrics?.likes ?? 0;
    if (l === 1) return "1 like";
    return `${l} likes`;
  }, [metrics?.likes]);

  return (
    <div
      className={cn(
        "flex items-center gap-3 text-sm text-muted-foreground",
        className,
      )}
      aria-live="polite"
      aria-busy={loading}
    >
      <div
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border border-primary/40 px-2 py-1",
          compact && "px-1.5 py-0.5 text-xs",
        )}
        title={viewsText}
      >
        <Eye className={cn("h-4 w-4", compact && "h-3.5 w-3.5")} aria-hidden="true" />
        <span className="tabular-nums">{metrics?.views ?? 0}</span>
      </div>

      <div className="inline-flex items-center gap-1.5">
        <Button
          type="button"
          size={compact ? "sm" : "default"}
          variant={metrics?.hasLiked ? "default" : "outline"}
          aria-pressed={metrics?.hasLiked ? "true" : "false"}
          aria-label={metrics?.hasLiked ? "Unlike this post" : "Like this post"}
          disabled={likeBusy}
          onClick={onToggleLike}
          className={cn(
            "h-8 px-2",
            compact && "h-7 px-2 text-xs",
            "data-[state=on]:bg-primary",
          )}
        >
          <Heart
            className={cn(
              "h-4 w-4",
              metrics?.hasLiked ? "fill-current" : "fill-transparent",
              compact && "h-3.5 w-3.5",
            )}
            aria-hidden="true"
          />
          <span className="ml-1 tabular-nums">{metrics?.likes ?? 0}</span>
        </Button>
      </div>
    </div>
  );
}

export default PostMetrics;