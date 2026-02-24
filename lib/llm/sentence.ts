import { chatCompletion } from "./client";

const topics = {
  movie: "movies and cinema",
  music: "music and songs",
  football: "football (soccer)",
  travel: "travel and holidays",
  random: "any everyday topic",
};

/**
 *
 * @param topic - The topic for the sentence (e.g., "movie", "music", "football", "travel", "random")
 * @returns A simple English sentence about the topic, suitable for A1 German learners.
 * @description This function calls the LLM to generate a short, clear English sentence based on the provided topic. It uses a system prompt to instruct the model to create A1-level sentences and a user prompt that specifies the topic and formatting requirements.
 * The response is expected to be just the sentence without any quotes or additional text.
 */
export async function generateSentence(topic: string) {
  const topicText = topics[topic as keyof typeof topics] ?? topics.random;

  const text = await chatCompletion({
    temperature: 0.8,
    messages: [
      {
        role: "system",
        content: "You generate simple English sentences for A1 German learners.",
      },
      {
        role: "user",
        content: `Generate ONE short A1-level English sentence about ${topicText}. Return ONLY the sentence. No quotes.`,
      },
    ],
  });

  return text;
}
