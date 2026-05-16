export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { prompt } = req.body;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      system: "Escreva devocionais cristãos femininos em português brasileiro. Responda APENAS com JSON válido.",
      messages: [{ role: "user", content: prompt }]
    })
  });

  if (!response.ok) {
    return res.status(500).json({ error: "API error" });
  }

  const data = await response.json();
  const text = data.content?.filter(b => b.type === "text").map(b => b.text).join("") || "";

  try {
    const clean = text.replace(/```json|```/g, "").trim();
    const devo = JSON.parse(clean);
    res.status(200).json(devo);
  } catch (e) {
    res.status(500).json({ error: "Parse error" });
  }
}
