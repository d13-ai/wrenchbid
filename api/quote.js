import { createClient } from "@supabase/supabase-js";

// In-memory rate limiter
const rateLimit = new Map();
// Separate limiter for unauthenticated trial quotes (2 per IP per day)
const trialLimit = new Map();

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

function isTrialLimited(ip, max = 2, windowMs = 24 * 60 * 60 * 1000) {
  const now = Date.now();
  if (!trialLimit.has(ip)) {
    trialLimit.set(ip, { count: 1, start: now });
    return false;
  }
  const entry = trialLimit.get(ip);
  if (now - entry.start > windowMs) {
    trialLimit.set(ip, { count: 1, start: now });
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

  // Auth check — allow trial quotes (limited) or require valid Supabase session
  const authHeader = req.headers["authorization"];
  const isTrial = req.headers["x-trial"] === "1";
  let authenticated = false;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (!authError && user) authenticated = true;
  }

  if (!authenticated && isTrial) {
    // Allow limited trial quotes — 2 per IP per day
    if (isTrialLimited(ip, 2)) {
      return res.status(429).json({ error: "trial_limit", message: "You've used your free trial quotes. Create a free account to keep going!" });
    }
  } else if (!authenticated) {
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
