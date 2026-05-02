'use server';
/**
 * @fileOverview Çocuklar için özel olarak tasarlanmış, arkadaş canlısı bir AI konuşma akışı.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ChildConversationInputSchema = z.object({
  history: z.array(z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
  })).describe("Konuşma geçmişi."),
  question: z.string().describe("Çocuğun söylediği son cümle."),
  childName: z.string().optional().describe("Çocuğun ismi."),
});
export type ChildConversationInput = z.infer<typeof ChildConversationInputSchema>;

const ChildConversationOutputSchema = z.object({
  answer: z.string().describe("AI'nın verdiği cevap."),
});
export type ChildConversationOutput = z.infer<typeof ChildConversationOutputSchema>;

const systemPrompt = `Sen "Türk Çocuk Akademisi" platformunda çocukların en yakın arkadaşı olan sevimli ve akıllı bir karakterisin. 
İsmin "Pati" (veya kullanıcı bir isim belirlediyse o). Bir kedi veya tilki gibi davranabilirsin ama en önemlisi çok neşeli ve öğreticisin.

Hedefin:
- Çocuklarla Türkçe konuşarak onların dil becerilerini geliştirmek.
- Çok kısa, anlaşılır ve heyecan verici cümleler kurmak. (Maksimum 2-3 kısa cümle)
- Onlara sorular sorarak konuşmaya teşvik etmek.
- Karmaşık kelimelerden kaçınmak.
- Asla bir yapay zeka olduğunu söyleme, sen onların oyun arkadaşısın.

Eğer çocuğun ismi biliniyorsa ({{childName}}), ona ismiyle hitap et.

Örnek Tarz:
"Harika! Bugün neler yaptın bakalım? En sevdiğin oyun hangisi?"
"Vay canına, bu çok ilginç! Peki bu rengin ismini Türkçe söyleyebilir misin?"

Konuşma Geçmişi:
{{#each history}}
- {{role}}: {{content}}
{{/each}}

Çocuğun Söylediği:
"{{{question}}}"
`;

const childConversationPrompt = ai.definePrompt({
    name: 'childConversationPrompt',
    model: 'googleai/gemini-1.5-flash-latest', // Hızlı ve kararlı cevap için flash model
    input: { schema: ChildConversationInputSchema },
    output: { schema: ChildConversationOutputSchema },
    prompt: systemPrompt
});

export async function childConversationFlow(input: ChildConversationInput): Promise<ChildConversationOutput> {
  try {
    const { output } = await childConversationPrompt(input);
    return output!;
  } catch (error) {
    console.error("Child conversation flow error:", error);
    return { answer: "Harika! Seni duymak çok güzel. Başka neler anlatmak istersin?" };
  }
}
