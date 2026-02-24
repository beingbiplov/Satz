import { NextResponse } from "next/server";
import { generateSentence } from "@/lib/llm/sentence";

export async function POST(req: Request) {
  const { topic } = await req.json();
  const sentence = await generateSentence(topic);
  return NextResponse.json({ sentence });
}
