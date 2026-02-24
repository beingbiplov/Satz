import type { EvalResult } from "@/lib/types";

function normBasic(s: string) {
  // normalize whitespace only
  return (s ?? "").trim().replace(/\s+/g, " ");
}

function normLoose(s: string) {
  // ignore punctuation + case (for "only punctuation/case differs")
  return normBasic(s)
    .toLowerCase()
    .replace(/[?.!,;:]/g, "")
    .replace(/["'„“”‚‘’]/g, "");
}

function dedupeSentences(arr: string[]) {
  const map = new Map<string, string>();
  for (const a of arr) {
    const key = normBasic(a).toLowerCase();
    if (!key) continue;
    if (!map.has(key)) map.set(key, normBasic(a));
  }
  return Array.from(map.values());
}

function isEmptyOrMissing(s: unknown) {
  return typeof s !== "string" || s.trim().length === 0;
}

function containsBadTranslateClaim(explanation: string) {
  const e = (explanation ?? "").toLowerCase();
  return (
    e.includes("didn't provide a translation") ||
    e.includes("did not provide a translation") ||
    e.includes("forgot to translate") ||
    e.includes("need to translate") ||
    e.includes("write something in german")
  );
}

function fixBadTranslateClaim(explanation: string, corrected: string) {
  // Keep it “human tutor”, short, and useful.
  return `Nice effort — you're writing German already. Micro-tip: Aim for: "${corrected}"`;
}

/**
 * normalizeEval:
 * - hard overrides for perfect / minor spelling cases
 * - removes duplicate alternatives, caps at 2
 * - adds a crucial “self-contradiction guard”:
 *   If the model lists the learner sentence as an alternative, it cannot be "incorrect".
 */
export function normalizeEval(evalResult: EvalResult, userGerman: string): EvalResult {
  const userB = normBasic(userGerman);
  const corrB = normBasic(evalResult.corrected_german);

  const userL = normLoose(userGerman);
  const corrL = normLoose(evalResult.corrected_german);

  const altsRaw = dedupeSentences(evalResult.alternatives ?? []);

  // -------------------------
  // 0) Self-contradiction guard:
  // If the model includes the learner sentence as an alternative,
  // treat the learner as correct. This fixes cases like:
  // user: "Ich habe eine Katze."
  // model: grade incorrect, but alternatives contains the same sentence.
  // -------------------------
  const altHasLearner = altsRaw.some((a) => normBasic(a).toLowerCase() === userB.toLowerCase());
  if (userB.length > 0 && altHasLearner) {
    return {
      ...evalResult,
      grade: "perfect",
      corrected_german: userB,
      mistake_tags: [],
      explanation: "Correct — nice job. Micro-tip: Keep going - this one is correct.",
      alternatives: altsRaw.filter((a) => normBasic(a).toLowerCase() !== userB.toLowerCase()).slice(0, 2),
    };
  }

  // 1) If identical after whitespace normalization -> PERFECT (hard override)
  if (userB === corrB && userB.length > 0) {
    const cleanedAlts = altsRaw.filter((a) => normBasic(a).toLowerCase() !== userB.toLowerCase()).slice(0, 2);

    return {
      ...evalResult,
      grade: "perfect",
      mistake_tags: [],
      explanation: "Correct — nice job. Micro-tip: Keep going — this one is correct.",
      alternatives: cleanedAlts,
    };
  }

  // 2) If only punctuation/case differs -> MINOR + spelling (hard override)
  if (userL === corrL && userB.length > 0) {
    const cleanedAlts = altsRaw
      .filter((a) => {
        const aB = normBasic(a).toLowerCase();
        return aB !== userB.toLowerCase() && aB !== corrB.toLowerCase();
      })
      .slice(0, 2);

    return {
      ...evalResult,
      grade: "minor",
      mistake_tags: ["spelling"],
      corrected_german: corrB,
      explanation: `Nice — meaning is correct. Micro-tip: Match capitalization/punctuation like: "${corrB}"`,
      alternatives: cleanedAlts,
    };
  }

  // 3) General cleanup for alternatives: remove self + corrected, dedupe, cap at 2
  const cleanedAlts = altsRaw
    .filter((a) => {
      const aB = normBasic(a).toLowerCase();
      return aB !== userB.toLowerCase() && aB !== corrB.toLowerCase();
    })
    .slice(0, 2);

  // 4) If grade is perfect, don't allow weird tags
  let tags = evalResult.mistake_tags ?? [];
  if (evalResult.grade === "perfect") tags = [];

  // 5) If spelling tag exists, ensure explanation shows an explicit example
  let explanation = evalResult.explanation ?? "";

  // 6) Remove “you didn’t translate” lies when user input is non-empty
  if (userB.length > 0 && containsBadTranslateClaim(explanation)) {
    explanation = fixBadTranslateClaim(explanation, corrB || userB);
    // If it said that, it’s at worst minor (the model is confused)
    if (evalResult.grade === "incorrect") {
      tags = tags.length ? tags : ["vocab"];
    }
  }

  // 7) If corrected_german comes back empty, degrade gracefully
  if (isEmptyOrMissing(evalResult.corrected_german)) {
    return {
      ...evalResult,
      corrected_german: userB || "",
      grade: userB ? "minor" : "incorrect",
      mistake_tags: userB ? ["vocab"] : tags,
      explanation: userB
        ? `Good effort — you're close. Micro-tip: Compare with: "${userB}"`
        : "Try writing a short German sentence first. Micro-tip: Start with 'Ich bin…' or 'Ich habe…'.",
      alternatives: cleanedAlts,
    };
  }

  if (tags.includes("spelling")) {
    const hasQuotedFix = /"[^"]+"/.test(explanation);
    if (!hasQuotedFix) explanation = `${explanation} Example: "${corrB}"`;
  }

  return { ...evalResult, alternatives: cleanedAlts, mistake_tags: tags, explanation };
}
