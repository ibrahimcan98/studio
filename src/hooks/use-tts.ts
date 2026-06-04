import { useState, useCallback, useRef, useEffect } from 'react';

interface TTSOptions {
  voiceId?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
}

let activeGlobalAudio: HTMLAudioElement | null = null;

export function useTTS() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (activeGlobalAudio === audioRef.current) {
        activeGlobalAudio = null;
      }
    };
  }, []);

  const speak = useCallback(async (text: string, options?: TTSOptions) => {
    if (!text) return;

    try {
      setIsLoading(true);
      setIsPlaying(true);
      options?.onStart?.();

      // Eski sesi durdur (Global)
      if (activeGlobalAudio) {
        activeGlobalAudio.pause();
        activeGlobalAudio = null;
      }

      // Eğer text bir dosya yolu ise (örn: /hikayeler/...) doğrudan o dosyayı çal
      const voiceId = options?.voiceId || '';
      const url = text.startsWith('/') 
        ? text 
        : `/api/ai/tts?text=${encodeURIComponent(text)}${voiceId ? `&voiceId=${voiceId}` : ''}`;
      
      const audio = new Audio(url);
      audioRef.current = audio;
      activeGlobalAudio = audio;

      audio.onplay = () => {
        setIsPlaying(true);
        setIsLoading(false);
      };

      audio.onended = () => {
        setIsPlaying(false);
        options?.onEnd?.();
      };

      audio.onerror = (e) => {
        console.warn('TTS Audio Error (e.g. out of quota):', e);
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

  const preload = useCallback((text: string, voiceId?: string) => {
    if (!text) return;
    const url = `/api/ai/tts?text=${encodeURIComponent(text)}${voiceId ? `&voiceId=${voiceId}` : ''}`;
    const audio = new Audio();
    audio.src = url;
    audio.preload = 'auto';
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const resume = useCallback(() => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  }, []);

  return {
    speak,
    stop,
    resume,
    preload,
    isPlaying,
    isLoading,
  };
}
