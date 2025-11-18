'use server';
/**
 * @fileOverview A flow for converting text to an image using Genkit.
 *
 * - textToImageFlow - A function that takes a text prompt and returns an image data URI.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'zod';

const TextToImageOutputSchema = z.object({
  dataUri: z.string().describe("The base64 encoded PNG image data URI."),
});

type TextToImageOutput = z.infer<typeof TextToImageOutputSchema>;

export async function textToImageFlow(prompt: string): Promise<TextToImageOutput> {
  const { media } = await ai.generate({
    model: googleAI.model('imagen-4.0-fast-generate-001'),
    prompt: prompt,
    config: {
        safetySettings: [
            {
                category: 'HARM_CATEGORY_HATE_SPEECH',
                threshold: 'BLOCK_NONE',
            },
            {
                category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                threshold: 'BLOCK_NONE',
            },
            {
                category: 'HARM_CATEGORY_HARASSMENT',
                threshold: 'BLOCK_NONE',
            },
            {
                category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                threshold: 'BLOCK_NONE',
            },
        ]
    }
  });

  if (!media || !media.url) {
    throw new Error('No image returned from text-to-image model');
  }

  return {
    dataUri: media.url,
  };
}
