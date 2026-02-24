"use client";

import { useState } from "react";
import { Button } from "@/components/common/button";

const TOPICS = ["movie", "music", "football", "travel", "random"];

type EvalResult = {
  grade: "perfect" | "minor" | "incorrect";
  corrected_german: string;
  explanation: string;
  mistake_tags: string[];
  alternatives: string[];
};

export default function PracticePage() {
  const [topic, setTopic] = useState("random");
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
    setSentence(data.sentence);
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
    <main className='min-h-screen bg-background text-foreground p-8'>
      <div className='max-w-2xl mx-auto space-y-6'>
        <h1 className='text-2xl font-semibold'>Practice</h1>

        {/* Topic selector */}
        <div className='flex flex-wrap gap-2'>
          {TOPICS.map((t) => (
            <button
              key={t}
              onClick={() => setTopic(t)}
              className={`px-3 py-2 rounded-lg text-sm border ${
                topic === t ? "bg-brand text-brand-ink border-brand-40" : "bg-card border-border"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Generate */}
        {!sentence && (
          <Button onClick={generateSentence} size='lg'>
            {loadingSentence ? "Generating..." : "Generate sentence"}
          </Button>
        )}

        {/* Sentence */}
        {sentence && (
          <div className='space-y-4'>
            <div className='p-6 rounded-xl bg-card ring-1 ring-border'>
              <div className='text-sm text-muted-foreground'>Translate this sentence:</div>
              <div className='mt-2 text-xl font-medium'>{sentence}</div>
            </div>

            {/* Input */}
            {!evaluation && (
              <div className='space-y-3'>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder='Type your German translation...'
                  className='w-full rounded-xl bg-card p-4 ring-1 ring-border focus:outline-none focus:ring-2 focus:ring-brand-45'
                  rows={3}
                />

                <Button onClick={submitAnswer} size='lg'>
                  {loadingEval ? "Evaluating..." : "Submit"}
                </Button>
              </div>
            )}

            {/* Evaluation */}
            {evaluation && (
              <div className='space-y-4 p-6 rounded-xl bg-card ring-1 ring-border'>
                <div className='flex items-center justify-between'>
                  <div className='text-sm font-medium'>
                    Grade:{" "}
                    <span
                      className={
                        evaluation.grade === "perfect"
                          ? "text-green-600"
                          : evaluation.grade === "minor"
                            ? "text-yellow-600"
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

                {evaluation.mistake_tags.length > 0 && (
                  <div className='flex flex-wrap gap-2'>
                    {evaluation.mistake_tags.map((tag) => (
                      <span key={tag} className='px-2 py-1 text-xs rounded-md bg-brand-10 border border-brand-40'>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {evaluation.alternatives.length > 0 && (
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
    </main>
  );
}
