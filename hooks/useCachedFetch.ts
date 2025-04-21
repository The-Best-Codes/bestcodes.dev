"use client";
import { useEffect, useRef, useState } from "react";

function getLocalStorageSize() {
  let total = 0;
  for (let key in window.localStorage) {
    if (!window.localStorage.hasOwnProperty(key)) continue;
    const value = window.localStorage.getItem(key);
    if (value) total += key.length + value.length;
  }
  return total;
}

function cleanupLocalStorage(prefix: string, maxBytes: number) {
  let entries: { key: string; time: number }[] = [];
  for (let key in window.localStorage) {
    if (!window.localStorage.hasOwnProperty(key)) continue;
    if (key.startsWith(prefix)) {
      try {
        const item = JSON.parse(window.localStorage.getItem(key) || "null");
        if (item && item.time) {
          entries.push({ key, time: item.time });
        }
      } catch { }
    }
  }

  entries.sort((a, b) => a.time - b.time);
  while (getLocalStorageSize() > maxBytes && entries.length > 0) {
    const oldest = entries.shift();
    if (oldest) window.localStorage.removeItem(oldest.key);
  }
}

export function useCachedFetch<T = any>(
  url: string,
  options?: RequestInit,
  {
    cacheKey,
    cachePrefix = "cachedfetch:",
    maxCacheBytes = 2 * 1024 * 1024,
    cacheTimeMs = 1000 * 60 * 60 * 24,
  }: {
    cacheKey?: string;
    cachePrefix?: string;
    maxCacheBytes?: number;
    cacheTimeMs?: number;
  } = {}
): { data: T | null; loading: boolean; error: string | null } {
  const key = `${cachePrefix}${cacheKey || url}`;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchedRef.current = false;

    const itemRaw = window.localStorage.getItem(key);
    if (itemRaw) {
      try {
        const item = JSON.parse(itemRaw);
        if (item && item.data && (!item.time || Date.now() - item.time < cacheTimeMs)) {
          setData(item.data);
          setLoading(false);
          console.log("set cached fetch")
        }
      } catch { }
    }

    fetch(url, options)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const json = await res.json();
        if (cancelled) return;
        fetchedRef.current = true;
        if (JSON.stringify(json) !== JSON.stringify(data)) {
          setData(json);
        }
        setLoading(false);

        try {
          window.localStorage.setItem(
            key,
            JSON.stringify({ data: json, time: Date.now() })
          );
          cleanupLocalStorage(cachePrefix, maxCacheBytes);
        } catch (e) {
          cleanupLocalStorage(cachePrefix, maxCacheBytes);
          try {
            window.localStorage.setItem(
              key,
              JSON.stringify({ data: json, time: Date.now() })
            );
          } catch { }
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setLoading(false);
        if (data) {
          console.warn("useCachedFetch: fetch failed, using cached data", err);
        } else {
          setError(err.message || "Fetch error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [url, cacheKey]);

  return { data, loading: loading && !data, error };
}
