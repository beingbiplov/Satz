"use client";

import { useState } from "react";
import { Button } from "@/components/common/button";
import { PageShell } from "@/components/layout/pageShell";

const TOPICS = ["movie", "music", "football", "travel", "random"] as const;

type EvalResult = {
  grade: "perfect" | "minor" | "incorrect";
  corrected_german: string;
  explanation: string;
  mistake_tags: string[];
  alternatives: string[];
};

export default function PracticePage() {
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>("random");
  const [sentence, setSentence] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<EvalResult | null>(null);

  const [loadingSentence, setLoadingSentence] = useState(false);
  const [loadingEval, setLoadingEval] = useState(false);

  async function generateSentence() {
    setLoadingSentence(true);
    setSentence("");
    setUserAnswer("");
    setEvaluation(null);

    const res = await fetch("/api/sentence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    });

    const data = await res.json();
    setSentence(data.sentence ?? "");
    setLoadingSentence(false);
  }

  async function submitAnswer() {
    if (!userAnswer.trim()) return;

    setLoadingEval(true);
    setEvaluation(null);

    const res = await fetch("/api/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        english: sentence,
        userGerman: userAnswer,
        level: "A1",
      }),
    });

    const data = await res.json();
    setEvaluation(data);
    setLoadingEval(false);
  }

  function reset() {
    setSentence("");
    setUserAnswer("");
    setEvaluation(null);
  }

  return (
    <PageShell>
      <div className='mx-auto max-w-2xl px-6 py-10'>
        <div className='mb-6'>
          <h1 className='text-2xl font-semibold'>Practice</h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Pick a topic, generate a sentence, translate it, and get feedback.
          </p>
        </div>

        {/* Topic selector */}
        <div className='flex flex-wrap gap-2'>
          {TOPICS.map((t) => (
            <button
              key={t}
              onClick={() => setTopic(t)}
              className={[
                "rounded-lg border px-3 py-2 text-sm transition-colors",
                topic === t ? "bg-brand text-brand-ink border-brand-40" : "bg-card border-border hover:bg-muted/40",
              ].join(" ")}
            >
              {t}
            </button>
          ))}
        </div>

        <div className='mt-6'>
          {!sentence && (
            <Button onClick={generateSentence} size='lg'>
              {loadingSentence ? "Generating..." : "Generate sentence"}
            </Button>
          )}

          {sentence && (
            <div className='mt-6 space-y-4'>
              <div className='rounded-xl bg-card p-6 shadow-sm ring-1 ring-brand-35'>
                <div className='text-sm text-muted-foreground'>Translate this sentence:</div>
                <div className='mt-2 text-xl font-medium'>{sentence}</div>
              </div>

              {!evaluation && (
                <div className='space-y-3'>
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder='Type your German translation...'
                    className='w-full rounded-xl bg-card p-4 shadow-sm ring-1 ring-border focus:outline-none focus:ring-2 ring-brand-35'
                    rows={3}
                  />

                  <div className='flex gap-2'>
                    <Button onClick={submitAnswer} size='lg'>
                      {loadingEval ? "Evaluating..." : "Submit"}
                    </Button>
                    <Button variant='outline' onClick={reset} size='lg'>
                      New
                    </Button>
                  </div>
                </div>
              )}

              {evaluation && (
                <div className='space-y-4 rounded-xl bg-card p-6 shadow-sm ring-1 ring-brand-35'>
                  <div className='flex items-center justify-between'>
                    <div className='text-sm font-medium'>
                      Grade:{" "}
                      <span
                        className={
                          evaluation.grade === "perfect"
                            ? "text-emerald-600"
                            : evaluation.grade === "minor"
                              ? "text-amber-600"
                              : "text-red-600"
                        }
                      >
                        {evaluation.grade}
                      </span>
                    </div>

                    <button onClick={reset} className='text-sm text-muted-foreground hover:text-foreground'>
                      New sentence
                    </button>
                  </div>

                  <div>
                    <div className='text-sm text-muted-foreground'>Correct version:</div>
                    <div className='mt-1 font-medium'>{evaluation.corrected_german}</div>
                  </div>

                  <div>
                    <div className='text-sm text-muted-foreground'>Explanation:</div>
                    <div className='mt-1 text-sm'>{evaluation.explanation}</div>
                  </div>

                  {evaluation.mistake_tags?.length > 0 && (
                    <div className='flex flex-wrap gap-2'>
                      {evaluation.mistake_tags.map((tag) => (
                        <span key={tag} className='rounded-md border border-brand-40 bg-brand-10 px-2 py-1 text-xs'>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {evaluation.alternatives?.length > 0 && (
                    <div>
                      <div className='text-sm text-muted-foreground'>Alternatives:</div>
                      <ul className='mt-2 space-y-1 text-sm'>
                        {evaluation.alternatives.map((alt, i) => (
                          <li key={i}>• {alt}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
