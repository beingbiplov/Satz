"use client";

import { useMemo, useState } from "react";
import { PageShell } from "@/components/layout/pageShell";
import { Button } from "@/components/common/button";

const TOPICS = ["movie", "music", "football", "travel", "random"] as const;
type Topic = (typeof TOPICS)[number];

type EvalResult = {
  grade: "perfect" | "minor" | "incorrect";
  corrected_german: string;
  explanation: string;
  mistake_tags: string[];
  alternatives: string[];
};

/* ---------------- ICONS ---------------- */

function CheckIcon() {
  return (
    <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
      <path d='M20 6 9 17l-5-5' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
      <path
        d='M12 9v4m0 4h.01M10 3h4l7 12-7 12h-4L3 15 10 3z'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
      <path d='M18 6 6 18M6 6l12 12' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
    </svg>
  );
}

/* ---------------- BADGE ---------------- */

function GradeBadge({ grade }: { grade: EvalResult["grade"] }) {
  const config =
    grade === "perfect"
      ? {
          label: "Perfect",
          cls: "bg-[var(--success-bg)] border border-[var(--success-border)] text-[rgb(var(--success))]",
          icon: <CheckIcon />,
        }
      : grade === "minor"
        ? {
            label: "Minor",
            cls: "bg-[var(--warning-bg)] border border-[var(--warning-border)] text-[rgb(var(--warning))]",
            icon: <WarningIcon />,
          }
        : {
            label: "Incorrect",
            cls: "bg-[var(--error-bg)] border border-[var(--error-border)] text-[rgb(var(--error))]",
            icon: <XIcon />,
          };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${config.cls}`}>
      {config.icon}
      {config.label}
    </span>
  );
}

/* ---------------- TOPIC CHIP ---------------- */

function TopicChip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={[
        "rounded-full px-3 py-1.5 text-sm border transition-all duration-200",
        active
          ? "bg-[var(--brand-surface)] border-[var(--brand-border-strong)] shadow-sm"
          : "bg-background border-[var(--brand-border)] hover:bg-[var(--brand-surface)]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

/* ---------------- PAGE ---------------- */

export default function PracticePage() {
  const [topic, setTopic] = useState<Topic>("random");
  const [sentence, setSentence] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [evaluation, setEvaluation] = useState<EvalResult | null>(null);

  const [loadingSentence, setLoadingSentence] = useState(false);
  const [loadingEval, setLoadingEval] = useState(false);

  const canSubmit = useMemo(
    () => sentence && userAnswer.trim().length > 0 && !loadingEval,
    [sentence, userAnswer, loadingEval],
  );

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
    if (!canSubmit) return;

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

  function resetAll() {
    setSentence("");
    setUserAnswer("");
    setEvaluation(null);
  }

  /* Accent Stripe + Glow */
  const accent =
    evaluation?.grade === "perfect"
      ? "bg-[var(--success-border)] shadow-[0_0_20px_rgba(34,197,94,0.15)]"
      : evaluation?.grade === "minor"
        ? "bg-[var(--warning-border)]"
        : evaluation?.grade === "incorrect"
          ? "bg-[var(--error-border)]"
          : "bg-[var(--brand-border)]";

  return (
    <PageShell>
      <div className='space-y-8'>
        {/* Header */}
        <div>
          <h1 className='text-2xl font-semibold tracking-tight'>Practice</h1>
          <p className='text-sm text-muted-foreground'>Pick a topic, translate one sentence, get quick feedback.</p>
        </div>

        {/* Topics */}
        <div>
          <div className='text-xs font-medium text-muted-foreground mb-2'>Topic</div>
          <div className='flex flex-wrap gap-2'>
            {TOPICS.map((t) => (
              <TopicChip key={t} active={topic === t} onClick={() => setTopic(t)}>
                {t}
              </TopicChip>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <div className='relative rounded-2xl bg-card p-6 shadow-sm border border-[var(--brand-border)] transition-all duration-300'>
          {!sentence ? (
            <div className='space-y-4'>
              <div>
                <div className='text-sm font-medium'>Ready?</div>
                <div className='text-sm text-muted-foreground'>
                  Generate a sentence for <span className='font-medium text-foreground'>{topic}</span>.
                </div>
              </div>

              <Button onClick={generateSentence} size='lg'>
                {loadingSentence ? "Generating..." : "Generate sentence"}
              </Button>
            </div>
          ) : (
            <div className='space-y-6'>
              {/* Prompt */}
              <div className='rounded-xl border border-[var(--brand-border)] bg-background p-5 transition-all'>
                <div className='text-xs font-medium text-muted-foreground'>Translate this sentence</div>
                <div className='mt-2 text-lg font-medium'>{sentence}</div>
              </div>

              {/* Input */}
              {!evaluation && (
                <div className='space-y-3'>
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder='Type your German translation...'
                    className='w-full rounded-xl bg-background p-4 border border-[var(--brand-border)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-border-strong)] transition-all duration-200'
                    rows={3}
                  />

                  <div className='flex gap-2'>
                    <Button onClick={submitAnswer} disabled={!canSubmit}>
                      {loadingEval ? "Evaluating..." : "Submit"}
                    </Button>
                    <Button onClick={resetAll} variant='ghost'>
                      New sentence
                    </Button>
                  </div>
                </div>
              )}

              {/* Evaluation */}
              {evaluation && (
                <div
                  className={[
                    "relative flex rounded-xl border overflow-hidden transition-all duration-300 animate-in fade-in",
                    evaluation.grade === "incorrect" && "animate-shake",
                    evaluation.grade === "perfect" &&
                      "bg-[var(--success-bg)] border-[var(--success-border)] shadow-[0_0_20px_rgba(34,197,94,0.15)]",
                    evaluation.grade === "minor" && "bg-[var(--warning-bg)] border-[var(--warning-border)]",
                    evaluation.grade === "incorrect" && "bg-[var(--error-bg)] border-[var(--error-border)]",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {/* Accent Stripe */}
                  <div
                    className={[
                      "w-1.5",
                      evaluation.grade === "perfect" && "bg-[var(--success-border)]",
                      evaluation.grade === "minor" && "bg-[var(--warning-border)]",
                      evaluation.grade === "incorrect" && "bg-[var(--error-border)]",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  />

                  <div className='flex-1 p-5 space-y-4'>
                    <div className='flex items-center justify-between'>
                      <GradeBadge grade={evaluation.grade} />
                      <button
                        onClick={resetAll}
                        className='text-sm text-muted-foreground hover:text-foreground transition-colors'
                      >
                        New sentence
                      </button>
                    </div>

                    <div>
                      <div className='text-xs text-muted-foreground'>Correct version</div>
                      <div className='mt-1 font-medium'>{evaluation.corrected_german}</div>
                    </div>

                    <div>
                      <div className='text-xs text-muted-foreground'>Explanation</div>
                      <div className='mt-1 text-sm'>{evaluation.explanation}</div>
                    </div>

                    {evaluation.mistake_tags.length > 0 && (
                      <div className='flex flex-wrap gap-2'>
                        {evaluation.mistake_tags.map((tag) => (
                          <span
                            key={tag}
                            className='rounded-full px-3 py-1 text-xs bg-[var(--brand-surface)] border border-[var(--brand-border)]'
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {evaluation.alternatives.length > 0 && (
                      <div>
                        <div className='text-xs text-muted-foreground'>Alternatives</div>
                        <ul className='mt-2 text-sm space-y-1'>
                          {evaluation.alternatives.map((alt, i) => (
                            <li key={i}>• {alt}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
