import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/contact";
import { rateLimit } from "@/lib/rateLimit";

// Reject oversized request bodies early (defaults to 1 MB otherwise).
export const config = { api: { bodyParser: { sizeLimit: "20kb" } } };

const LIMIT = 5; // submissions
const WINDOW_MS = 10 * 60 * 1000; // per 10 minutes, per IP

function clientIp(req: NextApiRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  const first = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(",")[0]?.trim();
  return first || req.socket.remoteAddress || "unknown";
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const limit = rateLimit(`contact:${clientIp(req)}`, LIMIT, WINDOW_MS);
  if (!limit.ok) {
    res.setHeader("Retry-After", String(limit.retryAfterSec));
    return res.status(429).json({ error: "Too many messages. Please try again later." });
  }

  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", issues: parsed.error.flatten().fieldErrors });
  }

  const { website, ...data } = parsed.data;

  // Honeypot filled → it's a bot. Pretend success so it doesn't retry; store nothing.
  if (website) {
    return res.status(201).json({ success: true });
  }

  try {
    const message = await prisma.contactMessage.create({ data });
    return res.status(201).json({ success: true, id: message.id });
  } catch (err) {
    console.error("Contact form error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
