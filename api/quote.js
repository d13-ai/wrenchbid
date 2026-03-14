import { createClient } from "@supabase/supabase-js";

// In-memory rate limiter
const rateLimit = new Map();

function isRateLimited(ip, max = 20, windowMs = 60 * 1000) {
  const now = Date.now();
  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 1, start: now });
    return false;
  }
  const entry = rateLimit.get(ip);
  if (now - entry.start > windowMs) {
    rateLimit.set(ip, { count: 1, start: now });
    return false;
  }
  entry.count++;
  return entry.count > max;
}

const supabase = createClient(
  "https://rnlrugxpnfanufevypge.supabase.co",
  process.env.SUPABASE_ANON_KEY || "sb_publishable_N3Csawv8SnR4gO9YV7ZQkQ_s1fPC8yI"
);

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Get IP
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim()
    || req.headers["x-real-ip"]
    || req.socket?.remoteAddress
    || "unknown";

  // Rate limit: 20 quotes per IP per minute
  if (isRateLimited(ip, 20)) {
    return res.status(429).json({ error: "Too many requests. Please wait a moment." });
  }

  // Auth check — require valid Supabase session token
  const authHeader = req.headers["authorization"];
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.slice(7);
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Validate body exists
  if (!req.body?.messages) {
    return res.status(400).json({ error: "Invalid request" });
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify(req.body)
  });
  const data = await response.json();
  res.json(data);
}
