function mustGetEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export async function chatCompletion(params: {
  messages: { role: string; content: string }[];
  temperature?: number;
  maxTokens?: number;
  json?: boolean;
}) {
  const baseUrl = mustGetEnv("LLM_BASE_URL");
  const apiKey = mustGetEnv("LLM_API_KEY");
  const model = mustGetEnv("LLM_MODEL");

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: params.messages,
      temperature: params.temperature ?? 0.7,
      max_tokens: params.maxTokens ?? 300,
      ...(params.json ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`LLM HTTP ${res.status}: ${txt}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content?.trim();

  if (!text) throw new Error("Empty LLM response.");

  return text;
}
