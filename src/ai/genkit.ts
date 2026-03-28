import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import 'dotenv/config';

/**
 * Genkit instance initialization.
 * Using a global singleton pattern in development to prevent 
 * multiple server initializations during HMR (Hot Module Replacement).
 */

const aiConfig = {
  plugins: [
    googleAI({
      apiKey: 'AIzaSyDLgZezZUlU9NfsCfGzV1W_sdTrIviuOok',
    }),
  ],
  model: 'googleai/gemini-2.5-flash' as const,
};

// Singleton pattern for Genkit in development
const globalForGenkit = global as unknown as { ai: ReturnType<typeof genkit> };

export const ai = globalForGenkit.ai || genkit(aiConfig);

if (process.env.NODE_ENV !== 'production') {
  globalForGenkit.ai = ai;
}
