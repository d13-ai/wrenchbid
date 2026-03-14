import { createClient } from "@supabase/supabase-js";

const rateLimit = new Map();

function isRateLimited(ip, max = 10, windowMs = 60 * 1000) {
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
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim()
    || req.headers["x-real-ip"]
    || req.socket?.remoteAddress
    || "unknown";

  if (isRateLimited(ip, 10)) {
    return res.status(429).json({ error: "Too many requests. Please wait a moment." });
  }

  // Auth check
  const authHeader = req.headers["authorization"];
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.slice(7);
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const key = process.env.DEEPGRAM_API_KEY;
  if (!key) return res.status(500).json({ error: "Missing DEEPGRAM_API_KEY" });

  try {
    const response = await fetch("https://api.deepgram.com/v1/auth/grant", {
      method: "POST",
      headers: {
        "Authorization": `Token ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ttl_seconds: 30 }),
    });

    if (!response.ok) {
      return res.status(200).json({ token: key });
    }

    const data = await response.json();
    const token2 = data.token || data.key || key;
    res.status(200).json({ token: token2 });
  } catch (e) {
    res.status(200).json({ token: key });
  }
}
