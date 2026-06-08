export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { messages, system } = req.body;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: messages
      })
    }
  );

  const data = await response.json();
  res.status(200).json(data);
}
