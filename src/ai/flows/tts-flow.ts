'use server';
/**
 * @fileOverview A flow for converting text to speech using ElevenLabs.
 * 
 * - ttsFlow - A function that takes text and returns a WAV audio data URI.
 */

import { z } from 'zod';

const TTSOutputSchema = z.object({
  media: z.string().describe("The base64 encoded MP3 audio data URI."),
});

type TTSOutput = z.infer<typeof TTSOutputSchema>;

export async function ttsFlow(text: string): Promise<TTSOutput> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const voiceId = process.env.ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB';

  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY is not set');
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail?.message || 'ElevenLabs API error');
  }

  const audioBuffer = await response.arrayBuffer();
  const base64Data = Buffer.from(audioBuffer).toString('base64');

  return {
    media: 'data:audio/mpeg;base64,' + base64Data,
  };
}
