'use server';
/**
 * @fileOverview A flow for converting text to speech using Genkit.
 *
 * - ttsFlow - A function that takes text and returns a WAV audio data URI.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'zod';
import wav from 'wav';

const TTSOutputSchema = z.object({
  media: z.string().describe("The base64 encoded WAV audio data URI."),
});

type TTSOutput = z.infer<typeof TTSOutputSchema>;

export async function ttsFlow(text: string): Promise<TTSOutput> {
  const { media } = await ai.generate({
      model: 'googleai/gemini-1.5-flash-latest', // En güncel ve kararlı 1.5 sürümünü zorluyoruz
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: text,
    });

    if (!media || !media.url) {
      throw new Error('No media returned from TTS model');
    }
    
    // Gelen veri zaten data URI formatında olabilir veya ham base64 olabilir
    let base64Data = media.url;
    if (base64Data.includes(',')) {
      base64Data = base64Data.split(',')[1];
    }

    const audioBuffer = Buffer.from(base64Data, 'base64');
    const wavData = await toWav(audioBuffer);

    return {
      media: 'data:audio/wav;base64,' + wavData,
    };
}


async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
