'use server';
/**
 * @fileOverview Çocuklar için AI konuşma akışı (Official OpenAI SDK Versiyonu).
 */

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type ChildConversationInput = {
  history: { role: 'user' | 'assistant'; content: string }[];
  question: string;
  childName?: string;
};

export type ChildConversationOutput = {
  answer: string;
  emotion: string;
  action?: string;
};

export async function childConversationFlow(input: ChildConversationInput): Promise<ChildConversationOutput> {
  console.log("Miyav Direct OpenAI Request:", input.question);
  
  try {
    if (!process.env.OPENAI_API_KEY) {
      return { answer: "Hata: OpenAI API Key eksik!", emotion: 'thinking' };
    }

    const messages: any[] = [
      {
        role: "system",
        content: `Sen 5-8 yaş arası çocuklarla konuşan, çok neşeli, meraklı ve nazik bir turuncu kedi olan "Miyav" karakterisin.
        
        KURALLAR:
        1. DOĞAL KONUŞ: Arkadaş gibi konuş, her cümleye "Miyav" deme.
        2. BASİT VE KISA: Çok basit, en fazla 2-3 cümlelik cevaplar kur.
        3. ETKİLEŞİM: Cevabının sonunda mutlaka merak uyandırıcı bir soru sor.
        4. GÜVENLİK: Kişisel bilgi isteme.
        5. FORMAT: Cevabını şu JSON formatında ver: {"answer": "cevap", "emotion": "happy/surprised/thinking/excited/cool/laughing", "action": "none"}`
      },
      ...input.history.map(h => ({ role: h.role, content: h.content })),
      { role: "user", content: input.question }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const output = JSON.parse(response.choices[0].message.content || "{}");

    return {
      answer: output.answer || "Miyav! Seni duydum ama biraz şaşırdım. Tekrar söyler misin?",
      emotion: output.emotion || 'happy',
      action: output.action || 'none'
    };
  } catch (error: any) {
    console.error("OpenAI SDK Error:", error);
    return { 
      answer: `Miyav! Küçük bir teknik sorun oldu: ${error.message}. Lütfen tekrar dener misin?`,
      emotion: 'surprised',
      action: 'none'
    };
  }
}
