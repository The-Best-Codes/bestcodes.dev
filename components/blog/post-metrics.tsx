"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { generateUUIDv4 } from "@/lib/uuid";
import { Eye, Heart } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Metrics = {
  slug: string;
  views: number;
  likes: number;
  hasLiked: boolean;
};

type Props = {
  slug: string;
  className?: string;
};

const LS_KEY_FINGERPRINT = "bc_anon_fingerprint_v1";
const SS_KEY_VIEW_PREFIX = "bc_view_recorded_";

function useAnonymousFingerprint(): string {
  const [fp, setFp] = useState<string>("");
  useEffect(() => {
    try {
      let current = localStorage.getItem(LS_KEY_FINGERPRINT);
      if (!current) {
        current = generateUUIDv4();
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

function useSignedInFingerprint(): string | null {
  const [fp, setFp] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/auth/fingerprint", {
          method: "GET",
          cache: "no-store",
        });
        if (!res.ok) {
          if (!cancelled) setFp(null);
          return;
        }
        const data = (await res.json()) as { fingerprint: string | null };
        if (!cancelled) {
          setFp(
            typeof data?.fingerprint === "string" ? data.fingerprint : null,
          );
        }
      } catch {
        if (!cancelled) setFp(null);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return fp;
}

function useSessionViewGuard(slug: string): {
  shouldRecord: boolean;
  markRecorded: () => void;
} {
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

export function PostMetrics({ slug, className }: Props) {
  const anonFingerprint = useAnonymousFingerprint();
  const signedInFingerprint = useSignedInFingerprint();
  const effectiveFingerprint = signedInFingerprint || anonFingerprint;
  const { shouldRecord, markRecorded } = useSessionViewGuard(slug);

  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [likeBusy, setLikeBusy] = useState<boolean>(false);
  const mountedRef = useRef<boolean>(false);

  const fetchMetrics = useCallback(
    async (opts?: { fp?: string | null }) => {
      try {
        if (!opts?.fp) return;
        setLoading(true);
        const url = new URL(`/api/blog/metrics`, window.location.origin);
        url.searchParams.set("slug", slug);
        url.searchParams.set("fp", opts.fp);
        const res = await fetch(url.toString(), {
          method: "GET",
          cache: "no-store",
        });
        const data = (await res.json()) as Metrics;
        if (res.ok && data && data.slug) {
          setMetrics(data);
        }
      } catch {
        // swallow errors
      } finally {
        setLoading(false);
      }
    },
    [slug],
  );

  const recordView = useCallback(async () => {
    if (!shouldRecord) return;
    if (!effectiveFingerprint) return;
    try {
      await fetch(`/api/blog/metrics`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          action: "view",
          slug,
          fingerprint: effectiveFingerprint,
        }),
      });
      setMetrics((prev) =>
        prev ? { ...prev, views: Math.max(0, (prev.views ?? 0) + 1) } : prev,
      );
      markRecorded();
    } catch {
      // ignore view errors
    }
  }, [slug, effectiveFingerprint, shouldRecord, markRecorded]);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
  }, []);

  useEffect(() => {
    if (!shouldRecord) return;
    void recordView();
  }, [shouldRecord, recordView]);

  useEffect(() => {
    if (!effectiveFingerprint) return;
    void fetchMetrics({ fp: effectiveFingerprint });
  }, [effectiveFingerprint, fetchMetrics]);

  const onToggleLike = useCallback(async () => {
    if (!metrics) return;
    if (likeBusy) return;

    const nextLikeState = !metrics.hasLiked;

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
      if (!effectiveFingerprint) throw new Error("missing fingerprint");
      const res = await fetch(`/api/blog/metrics`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          action: "like",
          slug,
          like: nextLikeState,
          fingerprint: effectiveFingerprint,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data || data.slug !== slug) {
        throw new Error("Failed to update like");
      }

      setMetrics((prev) =>
        prev
          ? {
              ...prev,
              likes: typeof data.likes === "number" ? data.likes : prev.likes,
              hasLiked:
                typeof data.hasLiked === "boolean"
                  ? data.hasLiked
                  : prev.hasLiked,
            }
          : prev,
      );
    } catch {
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
  }, [metrics, likeBusy, slug, effectiveFingerprint]);

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
        "flex items-center gap-2 text-xs text-muted-foreground",
        className,
      )}
      aria-live="polite"
      aria-busy={loading}
    >
      <Badge
        variant="outline"
        className={cn(
          "h-6 px-2 py-0.5 text-xs rounded-md border border-primary",
          loading && !metrics && "brightness-50 animate-pulse",
        )}
        aria-label={viewsText}
      >
        <Eye />
        <span className="tabular-nums leading-none">{metrics?.views ?? 0}</span>
      </Badge>

      <div className="inline-flex items-center gap-1">
        <Button
          onClick={onToggleLike}
          disabled={likeBusy || (loading && !metrics)}
          variant={metrics?.hasLiked ? "default" : "outline"}
          size="sm"
          aria-pressed={metrics?.hasLiked ? "true" : "false"}
          aria-label={metrics?.hasLiked ? "Unlike this post" : "Like this post"}
          className={cn(
            "h-6 px-2 py-0.5 text-xs rounded-md border border-primary",
            loading && !metrics && "brightness-50 animate-pulse",
          )}
        >
          <Heart
            className={metrics?.hasLiked ? "fill-current" : "fill-transparent"}
          />
          <span className="sr-only">{likesText}</span>
          <span className="tabular-nums leading-none">
            {metrics?.likes ?? 0}
          </span>
        </Button>
      </div>
    </div>
  );
}
