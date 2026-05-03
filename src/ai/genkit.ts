import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { openAI } from 'genkitx-openai';
import 'dotenv/config';

/**
 * Genkit instance initialization.
 * Supporting both Google AI and OpenAI.
 */

const aiConfig = {
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
    openAI({
      apiKey: process.env.OPENAI_API_KEY,
    }),
  ],
  model: 'gpt-4o-mini', // 'openai/' ön eki kaldırıldı
};

// Singleton pattern for Genkit in development
const globalForGenkit = global as unknown as { ai: ReturnType<typeof genkit> };

export const ai = globalForGenkit.ai || genkit(aiConfig);

if (process.env.NODE_ENV !== 'production') {
  globalForGenkit.ai = ai;
}
