import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "ai-career", // Unique app ID
  name: "Ai Career",
  credentials: {
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
    },
  },
});