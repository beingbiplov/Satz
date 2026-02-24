import { NextResponse } from "next/server";
import { evaluateSentence } from "@/lib/llm/evaluate";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const english = typeof body?.english === "string" ? body.english : "";
  const userGerman =
    typeof body?.userGerman === "string" ? body.userGerman : typeof body?.german === "string" ? body.german : "";

  const level = typeof body?.level === "string" ? body.level : "A1";

  if (!english.trim() || !userGerman.trim()) {
    return NextResponse.json({ error: "Missing english or userGerman" }, { status: 400 });
  }

  const result = await evaluateSentence({
    english,
    userGerman,
    level,
  });

  return NextResponse.json(result);
}
