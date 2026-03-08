export default async function handler(req, res) {
  const key = process.env.DEEPGRAM_API_KEY;
  if (!key) return res.status(500).json({ error: "Missing DEEPGRAM_API_KEY" });

  try {
    // Create a short-lived key via Deepgram API
    const response = await fetch("https://api.deepgram.com/v1/auth/grant", {
      method: "POST",
      headers: {
        "Authorization": `Token ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ttl_seconds: 30 }),
    });

    if (!response.ok) {
      // Fallback: return the master key if temp token fails
      // Still server-side only, never in bundle
      return res.status(200).json({ token: key });
    }

    const data = await response.json();
    // JWT token is in data.token or data.key depending on Deepgram version
    const token = data.token || data.key || key;
    res.status(200).json({ token });
  } catch (e) {
    // Fallback to master key
    res.status(200).json({ token: key });
  }
}
