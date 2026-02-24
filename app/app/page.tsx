"use client";

import { useState } from "react";
import { Button } from "@/components/common/button";

const TOPICS = ["movie", "music", "football", "travel", "random"];

export default function PracticePage() {
  const [topic, setTopic] = useState("random");
  const [sentence, setSentence] = useState("");
  const [loading, setLoading] = useState(false);

  async function generateSentence() {
    setLoading(true);
    setSentence("");

    const res = await fetch("/api/sentence", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic }),
    });

    const data = await res.json();
    setSentence(data.sentence);
    setLoading(false);
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

        <Button onClick={generateSentence} size='lg'>
          {loading ? "Generating..." : "Generate sentence"}
        </Button>

        {sentence && (
          <div className='mt-6 p-6 rounded-xl bg-card ring-1 ring-border'>
            <div className='text-sm text-muted-foreground'>Translate this sentence:</div>
            <div className='mt-2 text-xl font-medium'>{sentence}</div>
          </div>
        )}
      </div>
    </main>
  );
}
