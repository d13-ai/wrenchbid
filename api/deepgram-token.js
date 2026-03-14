// In-memory rate limiter — resets on each Vercel cold start
// Max 10 requests per IP per minute
const rateLimit = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const max = 10;

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
  if (entry.count > max) return true;

  return false;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim()
    || req.headers["x-real-ip"]
    || req.socket?.remoteAddress
    || "unknown";

  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Too many requests. Please wait a moment." });
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
    const token = data.token || data.key || key;
    res.status(200).json({ token });
  } catch (e) {
    res.status(200).json({ token: key });
  }
}
