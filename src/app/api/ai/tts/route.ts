import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text, voiceId } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'ElevenLabs API Key is missing' }, { status: 500 });
    }

    // Varsayılan ses ID'si (Seçtiğiniz özel karakter sesi)
    const selectedVoiceId = voiceId || 'UKn8d228qbbMa2f9ezXL'; 
    
    console.log(`TTS Request: "${text}" with Voice ID: ${selectedVoiceId}`);

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}?optimize_streaming_latency=0`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_turbo_v2_5', // Daha hızlı ve Türkçe desteği çok iyi
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.0,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('ElevenLabs Error:', errorData);
      return NextResponse.json({ error: 'Failed to generate speech' }, { status: response.status });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Ses verisini döndürüyoruz (Cache engelleme ekledik)
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    console.error('TTS Route Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
