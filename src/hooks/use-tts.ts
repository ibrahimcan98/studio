import { useState, useCallback, useRef } from 'react';

interface TTSOptions {
  voiceId?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
}

export function useTTS() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speak = useCallback(async (text: string, options?: TTSOptions) => {
    if (!text) return;

    try {
      setIsLoading(true);
      setIsPlaying(true);
      options?.onStart?.();

      // Eski sesi durdur
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      // Doğrudan URL üzerinden çalmak en performanslı ve garantili yöntemdir
      const voiceId = options?.voiceId || '';
      const url = `/api/ai/tts?text=${encodeURIComponent(text)}${voiceId ? `&voiceId=${voiceId}` : ''}`;
      
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onplay = () => {
        setIsPlaying(true);
        setIsLoading(false);
      };

      audio.onended = () => {
        setIsPlaying(false);
        options?.onEnd?.();
      };

      audio.onerror = (e) => {
        console.error('TTS Audio Error:', e);
        setIsPlaying(false);
        setIsLoading(false);
        options?.onError?.(new Error('Ses çalınırken bir hata oluştu'));
      };

      // Play promise'ini yakalayarak kesilme hatalarını sessizce geçiştiriyoruz
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          if (error.name === 'AbortError') {
            console.log('Ses çalma işlemi yeni bir istek geldiği için durduruldu.');
          } else {
            console.error('Playback error:', error);
          }
        });
      }
    } catch (error) {
      console.error('useTTS error:', error);
      setIsPlaying(false);
      setIsLoading(false);
      options?.onError?.(error as Error);
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  return {
    speak,
    stop,
    isPlaying,
    isLoading,
  };
}
