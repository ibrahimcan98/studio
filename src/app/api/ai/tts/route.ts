import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const text = req.nextUrl.searchParams.get('text') || 'Merhaba';
  return handleTTS(text);
}

export async function POST(req: NextRequest) {
  try {
    const { text, voiceId } = await req.json();
    return handleTTS(text, voiceId);
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
  }
}

/**
 * ElevenLabs telaffuzunu iyileştirmek için metni temizleyen yardımcı.
 */
function fixTurkishPronunciation(text: string): string {
  if (!text) return "";
  
  // Bazı durumlarda ElevenLabs 'ı' harfini 'i' gibi okuyabiliyor.
  // Metni daha yavaş ve vurgulu okuması için sonuna nokta/virgül kontrolü yapıyoruz.
  let fixedText = text.trim();
  
  // Eğer metin tek kelimeyse (örn: "Yanak"), sonuna nokta koymak telaffuzu netleştirir.
  if (!fixedText.includes(" ") && !/[.!?]$/.test(fixedText)) {
      fixedText += ".";
  }

  return fixedText;
}

async function handleTTS(text: string, voiceId?: string) {
  try {
    if (!text) {
      return new Response(JSON.stringify({ error: 'Text is required' }), { status: 400 });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    const selectedVoiceId = voiceId || process.env.ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB';

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'TTS configuration missing' }), { status: 500 });
    }

    // Telaffuz düzelticiyi devreye alıyoruz
    const cleanText = fixTurkishPronunciation(text);

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.6, // Stability'yi biraz artırmak telaffuz hatalarını azaltır
            similarity_boost: 0.8,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return new Response(JSON.stringify({ error: errorData.detail?.message || 'ElevenLabs API error' }), { 
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const audioBuffer = await response.arrayBuffer();

    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'inline; filename="tts.mp3"'
      },
    });
  } catch (error) {
    console.error('TTS Route Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
