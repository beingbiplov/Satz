export async function callLLM(messages: any[]) {
  const response = await fetch(`${process.env.LLM_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.LLM_MODEL,
      messages,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`LLM Error: ${text}`);
  }

  const data = await response.json();

  return data.choices?.[0]?.message?.content ?? "";
}
