// app/api/sentence/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

import { topics } from "./constant";
import { callLLM } from "@/lib/llm/llm";

/**
 *
 * POST /api/sentence
 * @desc Generate a simple English sentence based on the provided topic.
 * @access Protected (requires authentication)
 * @body { topic: string } - The topic for the sentence (e.g., "movie", "music", "football", "travel", "random")
 * @returns { sentence: string } - The generated English sentence
 */
export async function POST(req: Request) {
  try {
    const supabase = await supabaseServer();

    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { topic } = await req.json();
    const topicText = topics[topic as keyof typeof topics] ?? topics.random;

    const sentence = await callLLM([
      {
        role: "system",
        content: "You generate simple English sentences for A1 German learners. Keep them short and clear.",
      },
      {
        role: "user",
        content: `Generate ONE short A1-level English sentence about ${topicText}. Return ONLY the sentence. No quotes.`,
      },
    ]);

    return NextResponse.json({ sentence });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to generate sentence" }, { status: 500 });
  }
}
