// Basic API handler for OpenAI replies
export async function POST(req: Request) {
  const { prompt } = await req.json();

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [{ role: "user", content: `Reply to this comment as ZiiBot in a witty tone: "${prompt}"` }],
      max_tokens: 50,
      temperature: 0.8
    })
  });

  const data = await response.json();
  return new Response(JSON.stringify({ reply: data.choices?.[0]?.message?.content }));
}
