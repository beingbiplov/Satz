import { chatCompletion } from "./client";
import { extractJsonObject } from "./json";
import { normalizeEval } from "./normalize";
import { EvalResultSchema, type EvalResult } from "@/lib/types";

function asString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function asStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => (typeof x === "string" ? x : "")).filter(Boolean);
}

import { MISTAKE_TAGS, type MistakeTag } from "@/lib/types";

const ALLOWED_TAGS = new Set<MistakeTag>(MISTAKE_TAGS);

function sanitizeTags(tags: string[]): MistakeTag[] {
  const cleaned = tags.filter((t): t is MistakeTag => ALLOWED_TAGS.has(t as MistakeTag));
  return Array.from(new Set(cleaned)).slice(0, 3);
}

function clampAlternatives(arr: string[], userGerman: string, corrected: string) {
  const norm = (s: string) => s.trim().toLowerCase();
  const u = norm(userGerman);
  const c = norm(corrected);

  const dedup = new Map<string, string>();
  for (const a of arr) {
    const clean = a.trim();
    if (!clean) continue;
    const k = norm(clean);
    if (k === u || k === c) continue;
    if (!dedup.has(k)) dedup.set(k, clean);
  }
  return Array.from(dedup.values()).slice(0, 2);
}

/**
 * Repair raw model output into a valid EvalResult (never crash on bad model JSON).
 * Ensures corrected_german is non-empty.
 */
function repairToEvalResult(raw: unknown, userGerman: string): EvalResult {
  const obj = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  const gradeRaw = asString(obj.grade).toLowerCase();
  const grade: EvalResult["grade"] =
    gradeRaw === "perfect" || gradeRaw === "minor" || gradeRaw === "incorrect"
      ? (gradeRaw as EvalResult["grade"])
      : "minor";

  const correctedCandidate = asString(obj.corrected_german).trim();
  const corrected_german = correctedCandidate.length > 0 ? correctedCandidate : userGerman.trim();

  let explanation = asString(obj.explanation).trim();
  if (!explanation) {
    explanation =
      grade === "perfect"
        ? "Correct, nice job. Micro-tip: Keep going, this one is correct."
        : `Good attempt, you're close. Micro-tip: Compare with: "${corrected_german}"`;
  }

  const mistake_tags = sanitizeTags(asStringArray(obj.mistake_tags));
  const alternatives = clampAlternatives(asStringArray(obj.alternatives), userGerman, corrected_german);

  return { grade, corrected_german, explanation, mistake_tags, alternatives };
}

/**
 * STRICT step-based evaluator (evidence-first).
 * Goal: reduce hallucinations and force grounded feedback.
 */
export async function evaluateSentence(params: {
  english: string;
  userGerman: string;
  level: string;
}): Promise<EvalResult> {
  const { english, userGerman, level } = params;

  const system = `
You are "Satz Coach", a friendly but rigorous German tutor for CEFR ${level}.
You are evidence-first: you never invent mistakes.
Your tone is warm, concise, slightly playful, and practical.
`.trim();

  const user = `
You are evaluating a learner's German translation for CEFR ${level}.

You MUST follow these steps internally before producing the final JSON.

STEP 1 — Error Detection (evidence required):
- Look ONLY at the learner sentence.
- If you think something is wrong, you MUST be able to quote the exact wrong substring from the learner sentence.
- If you cannot quote an exact wrong substring, then there is NO error for that category.
- Do not invent missing punctuation or missing words.
- Do not claim the learner "didn't translate" unless the learner sentence is empty.
- NON-GERMAN / GIBBERISH RULE:
  - If Learner German does not resemble German (random characters/words, not related to German),
    then:
    - grade MUST be "incorrect"
    - mistake_tags MUST be ["vocab"]
    - corrected_german MUST be a correct A1 sentence for the English meaning
    - explanation must be playful + encouraging, and MUST NOT mention specific grammar categories
      like "verb", "case", "word order" (because there is no usable evidence)

STEP 2 — Classification (be strict and fair):
- If the learner sentence is correct German AND matches the English meaning → grade = "perfect".
- If only capitalization or punctuation differs → grade = "minor" and mistake_tags = ["spelling"].
- If meaning is clear but there are small grammar/vocab issues → grade = "minor".
- Use "incorrect" ONLY when meaning is broken/unclear or the structure is not a valid A1 sentence.

STEP 3 — corrected_german (minimal correction):
- Provide the simplest correct A1 version that matches the English meaning.
- Keep it close to the learner sentence (do NOT rewrite for style).
- corrected_german MUST be non-empty.

STEP 4 — Explanation (human tutor style):
- Max 2 short sentences, English-only.
- Sentence 1: encouragement + correctness status (e.g. "Correct — nice job." / "Close — small fix needed." / "Not quite yet, let's fix it.")
- Sentence 2: exactly ONE micro-tip that references evidence.
  If you mention a fix, include the corrected form in quotes, and show evidence as '"wrong" -> "right"'.

STEP 5 — Alternatives:
- Provide 0–2 alternatives.
- Meaning-equivalent and A1.
- Must be DISTINCT from learner and corrected sentences (case-insensitive). If not possible, return [].

Return ONLY JSON in this exact format:

{
  "grade": "perfect" | "minor" | "incorrect",
  "corrected_german": string,
  "explanation": string,
  "mistake_tags": string[],
  "alternatives": string[]
}

Allowed mistake_tags:
["word_order","article","verb","case","vocab","spelling","politeness","idiom","plural"]

English sentence: "${english}"
Learner German: "${userGerman}"

Now output ONLY the JSON.
`.trim();

  const text = await chatCompletion({
    temperature: 0.05,
    json: true,
    maxTokens: 500,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  let obj: unknown;
  try {
    obj = extractJsonObject(text);
  } catch {
    const repaired = repairToEvalResult({}, userGerman);
    return normalizeEval(repaired, userGerman);
  }

  const attempted = EvalResultSchema.safeParse(obj);
  const parsed: EvalResult = attempted.success ? attempted.data : repairToEvalResult(obj, userGerman);

  // normalizeEval will hard-override obvious contradictions (perfect/minor punctuation etc)
  return normalizeEval(parsed, userGerman);
}
