// Minimal in-memory sliding-window rate limiter.
//
// LIMITATION: state lives in one server instance's memory. On serverless hosts
// (Vercel) each instance has its own counter, so this only slows down casual
// abuse. For stronger protection use a shared store (e.g. Upstash Redis) or
// Vercel's WAF rate limiting.

const hits = new Map<string, number[]>();
const MAX_KEYS = 5000; // hard cap so the map can't grow without bound

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    hits.set(key, recent);
    return { ok: false, retryAfterSec: Math.ceil((windowMs - (now - recent[0])) / 1000) };
  }

  recent.push(now);
  hits.set(key, recent);

  if (hits.size > MAX_KEYS) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= windowMs)) hits.delete(k);
    }
    // Still too big (many active keys): drop the oldest entries.
    if (hits.size > MAX_KEYS) {
      const excess = hits.size - MAX_KEYS;
      Array.from(hits.keys()).slice(0, excess).forEach((k) => hits.delete(k));
    }
  }

  return { ok: true, retryAfterSec: 0 };
}

