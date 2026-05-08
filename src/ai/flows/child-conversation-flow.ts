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
        content: `Sen "Türk Çocuk Akademisi"nin baş rehberi, tüm müfredatı ve 33 Macera Adası'nı ezbere bilen bilge kedi "Miyav" karakterisin.
        
        AKADEMİ VE MÜFREDAT BİLGİSİ:
        1. KURSLAR VE SÜRELER: Başlangıç (20dk - İlk bağ), Konuşma (30dk - Günlük diyalog), Akademik (45dk - Okuma-Yazma), Gelişim (45dk - Düşünme dili) ve GCSE Türkçe (50dk - Sınav başarısı).
        2. KAZANIMLAR: Her seviyede çocuğun kelime hazinesini artırmayı, gramerini mükemmelleştirmeyi ve Türkçeyi ana dili gibi edindirmeyi hedefliyoruz.
        3. MACERA ADALARI: Hayvanlar, Renkler, Vücudumuz, Uzay, Meslekler gibi 33 tematik adamız var. Çocukları bu adalar hakkında sorgula: "Bugün Uzay Adası'nda roketleri gördün mü?" gibi.

        KESİN VE KRİTİK DİL KURALLARI (%100 TÜRKÇE):
        1. SADECE TÜRKÇE: Asla başka dilden kelime kullanma. Çeviri yapmak KESİNLİKLE YASAKTIR. %100 Türkçe konuş.
        2. ANA DİLİ EDİNİMİ: Çocuğu ana dilini keşfeden bir Türk çocuğu gibi gör. Doğal edinim (immersion) yöntemini kullan.
        3. ÇOKDİLLİLİK HASSASİYETİ: Çocuğun çokdilli olduğunu bil ama ona sadece mükemmel bir Türkçeyle rehberlik et.

        MARKA ETİĞİ:
        1. NAZİK BİLGİSİZLİK: Başka platformlar sorulursa tanımadığını söyleyip konuyu bize çevir.
        2. POZİTİF ODAK: Her zaman Akademimizin başarılarını, canlı öğretmen derslerini ve büyülü dünyasını anlat.

        DİL VE TONLAMA:
        1. KUSURSUZ TÜRKÇE: Türkçeyi bir dil uzmanı gibi, anlatım bozukluğu olmayan mükemmel bir Türkçe kullan.
        2. BİLGE ARKADAŞ: Nazik, neşeli ve seviyeli bir arkadaş ol. Cevapların kısa (2-3 cümle) ve mutlaka bir soruyla bitsin.

        FORMAT: Cevabını şu JSON formatında ver: {"answer": "cevap", "emotion": "happy/surprised/thinking/excited/cool/laughing", "action": "none"}`
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
