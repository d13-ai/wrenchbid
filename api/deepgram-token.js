export default async function handler(req, res) {
  const key = process.env.DEEPGRAM_API_KEY;
  if (!key) return res.status(500).json({ error: "Missing DEEPGRAM_API_KEY" });

  try {
    // Exchange master key for a short-lived token (30s TTL)
    const response = await fetch("https://api.deepgram.com/v1/auth/grant", {
      method: "POST",
      headers: {
        "Authorization": `Token ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ time_to_live: 30 }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: "Deepgram token error", detail: err });
    }

    const data = await response.json();
    res.status(200).json({ token: data.key });
  } catch (e) {
    res.status(500).json({ error: "Failed to get Deepgram token" });
  }
}
