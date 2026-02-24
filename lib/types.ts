import { z } from "zod";

export const MISTAKE_TAGS = ["grammar", "vocab", "spelling", "word_order", "politeness", "idiom"] as const;

export type MistakeTag = (typeof MISTAKE_TAGS)[number];

export const EvalResultSchema = z.object({
  grade: z.enum(["perfect", "minor", "incorrect"]),
  corrected_german: z.string().min(1),
  explanation: z.string().min(1),
  mistake_tags: z.array(z.enum(MISTAKE_TAGS)).max(3),
  alternatives: z.array(z.string()).max(2),
});

export type EvalResult = z.infer<typeof EvalResultSchema>;

export type Sentence = {
  id: string;
  level: string;
  english: string;
  tags: string[];
};
