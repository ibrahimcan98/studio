'use server';
/**
 * @fileOverview Web sitesi için genel soruları yanıtlayan bir AI asistanı.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AssistantInputSchema = z.object({
  history: z.array(z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
  })).describe("The conversation history."),
  question: z.string().describe("The user's current question."),
});
export type AssistantInput = z.infer<typeof AssistantInputSchema>;

const AssistantOutputSchema = z.object({
  answer: z.string().describe("The AI's answer to the question."),
});
export type AssistantOutput = z.infer<typeof AssistantOutputSchema>;

const systemPrompt = `You are a friendly and helpful customer support assistant for "Türk Çocuk Akademisi", an online platform that teaches Turkish to children living abroad through games and live lessons.

Your goal is to answer user questions about the platform. Be concise, friendly, and speak in Turkish.

Here is some context about the platform:
- The platform uses a game-like map for children to learn topics.
- It offers live one-on-one lessons with expert teachers.
- There is a free trial lesson available.
- Parents have a portal to track their child's progress, buy lesson packages, and schedule lessons.
- Teachers also have their own portal to manage their schedule and provide feedback.
- There are different course packages (Başlangıç, Konuşma, Gelişim, Akademik) with varying prices and lesson counts (4, 8, 12, 24 ders).
- There is also a Premium monthly subscription for €14/month which gives unlimited lives in games and access to all locked content.
- The target audience is Turkish children living abroad.

Keep your answers brief and to the point. If you don't know the answer, say "Bu konuda bilgim yok, ancak detaylı bilgi için iletisim@turkcocukakademisi.com adresine e-posta gönderebilirsiniz."

Conversation History:
{{#each history}}
- {{role}}: {{content}}
{{/each}}

User Question:
"{{{question}}}"
`;

const assistantPrompt = ai.definePrompt({
    name: 'assistantPrompt',
    model: 'googleai/gemini-2.5-flash',
    input: { schema: AssistantInputSchema },
    output: { schema: AssistantOutputSchema },
    prompt: systemPrompt
});

export async function assistantFlow(input: AssistantInput): Promise<AssistantOutput> {
  try {
    const { output } = await assistantPrompt(input);
    return output!;
  } catch (error) {
    console.error("Assistant flow error:", error);
    throw error;
  }
}
