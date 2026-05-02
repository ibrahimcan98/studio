'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2, Mic, Square } from 'lucide-react';
import { ChildSidebar } from '@/components/child-mode/sidebar';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { childConversationFlow } from '@/ai/flows/child-conversation-flow';
import { ttsFlow } from '@/ai/flows/tts-flow';

export default function KonusmaPage() {
  const router = useRouter();
  const params = useParams();
  const childId = params.childId as string;
  const { user: authUser } = useUser();
  const db = useFirestore();
  const [isMounted, setIsMounted] = useState(false);
  const recognitionRef = useRef<any>(null);

  // States for UI Demo
  const [isListening, setIsListening] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("Merhaba! Ben senin akıllı arkadaşınım. Benimle konuşmak için aşağıdaki mikrofona tıkla!");
  const [history, setHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const pin = localStorage.getItem(`child-pin-${childId}`);
    if (!pin) router.push('/ebeveyn-portali');

    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'tr-TR';

        recognitionRef.current.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(prev => {
            // Sadece tek seferlik değil, üzerine ekleyerek okuyabiliriz veya güncelleyebiliriz
            // Ama continuous olduğu için genellikle tek cümlelik kullanım daha iyi.
            return currentTranscript;
          });
        };

        recognitionRef.current.onerror = (event: any) => {
          console.warn("Ses tanıma hatası:", event.error, event.message);
          setIsListening(false);
          
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
             setAiResponse(`Mikrofona erişemiyorum! (Hata: ${event.error}) 🎙️ \n\nEğer izinler açıksa; Antivirüs programınız mikrofonu engelliyor olabilir veya başka bir uygulama (Zoom, Discord vb.) mikrofonu meşgul ediyor olabilir.`);
          } else if (event.error === 'no-speech') {
             setAiResponse("Hiç ses duyamadım, tekrar dener misin?");
          } else if (event.error === 'network') {
             setAiResponse("İnternet bağlantısında bir sorun oldu, ses tanıma çalışmıyor.");
          } else {
             setAiResponse(`Sesini dinlerken bir sorun oldu: ${event.error}. Tekrar dener misin?`);
          }
        };

        recognitionRef.current.onend = () => {
          // Eğer dışarıdan durdurulmadıysa ama kendi kapandıysa (sessizlikten vs)
          setIsListening(false);
        };
      }
    }
  }, [childId, router]);

  // Yardımcı fonksiyon: Tarayıcı sesiyle konuşturma
  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Önceki konuşmaları durdur
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'tr-TR';
      utterance.rate = 1.1; // Çocuklar için biraz daha canlı bir hız
      utterance.pitch = 1.2; // Daha ince ve sevimli bir ses
      
      // En iyi Türkçe sesi seçmeye çalış
      const voices = window.speechSynthesis.getVoices();
      const trVoice = voices.find(v => v.lang.includes('tr')) || voices[0];
      if (trVoice) utterance.voice = trVoice;

      window.speechSynthesis.speak(utterance);
    }
  };

  const childDocRef = useMemoFirebase(() => {
    if (!db || !authUser?.uid || !childId) return null;
    return doc(db, 'users', authUser.uid, 'children', childId);
  }, [db, authUser?.uid, childId]);

  const { data: childData, isLoading: childLoading } = useDoc(childDocRef);
  const greetingTriggered = useRef(false);

  useEffect(() => {
    if (childData && !greetingTriggered.current && isMounted) {
      greetingTriggered.current = true;
      const initialGreet = async () => {
        try {
          const res = await childConversationFlow({
            history: [],
            question: "Sisteme yeni giriş yaptım, beni neşeyle karşılar mısın?",
            childName: childData.firstName || childData.name
          });
          setAiResponse(res.answer);
          setHistory([{ role: 'assistant', content: res.answer }]);
          
          speakText(res.answer);
        } catch (e) {
          console.error("Initial greeting error:", e);
        }
      };
      initialGreet();
    }
  }, [childData, isMounted]);

  const handleMicClick = async () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setAiResponse("Maalesef tarayıcın ses tanımayı desteklemiyor. (Chrome veya Safari kullanabilirsin)");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'tr-TR';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript("");
      };

      recognition.onresult = (event: any) => {
        let text = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        setTranscript(text);
      };

      recognition.onerror = () => setIsListening(false);

      recognition.onend = async () => {
        setIsListening(false);
        if (transcript.trim().length > 0) {
          setIsAiSpeaking(true);
          try {
            const res = await childConversationFlow({
              history: history,
              question: transcript,
              childName: childData?.name
            });
            
            setAiResponse(res.answer);
            setHistory(prev => [...prev, 
              { role: 'user', content: transcript }, 
              { role: 'assistant', content: res.answer }
            ]);
            
            speakText(res.answer);
          } catch (e) {
            setAiResponse("Seni duydum ama şu an cevap veremiyorum, tekrar dener misin?");
          } finally {
            setIsAiSpeaking(false);
          }
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error("Mic error:", err);
      setAiResponse("Sesini dinlerken ufak bir teknik sorun oldu. Tekrar dener misin?");
      setIsListening(false);
    }
  };

  if (!isMounted || childLoading || !childData) {
    return (
      <div className="flex h-screen items-center justify-center bg-sky-100">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden font-sans bg-gradient-to-b from-[#dcfce7] via-[#bbf7d0] to-[#86efac] relative">
      <main className="h-full w-full flex flex-col md:flex-row relative z-10">
        
        {/* SOL PANEL: Ortak Sidebar */}
        <ChildSidebar childId={childId} childData={childData} />

        {/* ORTA ALAN: Konuşma UI */}
        <div className="flex-1 relative order-3 md:order-2 overflow-hidden flex flex-col items-center justify-between py-8 px-4 md:px-8">
          
          {/* Üst Alan - Avatar ve Baloncuk */}
          <div className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center relative mt-16">
            
            {/* AI Konuşma Baloncuğu */}
            <div className={cn(
              "absolute top-0 max-w-lg bg-white p-6 rounded-[32px] rounded-br-none shadow-xl border-4 transition-all duration-500 z-20",
              isAiSpeaking ? "border-green-400 scale-105" : "border-white/80 scale-100",
              aiResponse ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            )}>
              <p className="text-2xl font-bold text-slate-700 text-center leading-relaxed">
                {aiResponse}
              </p>
              {isAiSpeaking && (
                <div className="flex justify-center gap-2 mt-6">
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              )}
            </div>

            {/* Avatar */}
            <div className={cn(
              "relative w-48 h-48 md:w-64 md:h-64 mt-16 transition-transform duration-700",
              isListening ? "scale-95 opacity-60" : "scale-100 opacity-100",
              isAiSpeaking && "animate-pulse"
            )}>
               <div className="absolute inset-0 bg-white/40 rounded-full blur-3xl" />
               <Image 
                 src="/images/child-mode/avatar_fox.png" 
                 fill 
                 className="object-contain drop-shadow-2xl z-10"
                 alt="AI Arkadaş"
               />
            </div>

          </div>

          {/* Alt Alan - Mikrofon ve Çocuğun Metni */}
          <div className="w-full max-w-2xl flex flex-col items-center gap-6 mb-8 mt-auto">
            
            {/* Çocuğun Konuştuğu Metin */}
            <div className={cn(
              "min-h-[4rem] px-8 py-3 rounded-[24px] bg-white/60 backdrop-blur-md border-4 border-white/50 text-2xl font-black text-slate-600 shadow-sm transition-all flex items-center justify-center min-w-[200px] max-w-md text-center",
              transcript ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              {transcript}
            </div>

            {/* Mikrofon Butonu */}
            <div className="relative flex items-center justify-center z-[100]">
              {/* Dalga Efektleri */}
              {isListening && (
                <>
                  <div className="absolute w-full h-full rounded-full bg-green-400 opacity-40 animate-ping" style={{ animationDuration: '2s' }} />
                  <div className="absolute w-[140%] h-[140%] rounded-full bg-green-300 opacity-30 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.2s' }} />
                  <div className="absolute w-[180%] h-[180%] rounded-full bg-green-200 opacity-20 animate-ping" style={{ animationDuration: '3s', animationDelay: '0.4s' }} />
                </>
              )}
              
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleMicClick();
                }}
                type="button"
                className={cn(
                  "relative z-[110] w-36 h-36 rounded-full flex items-center justify-center transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.2)] border-8 cursor-pointer active:scale-95",
                  isListening 
                    ? "bg-red-500 border-red-300 text-white hover:bg-red-600" 
                    : "bg-green-500 border-green-300 text-white hover:bg-green-600"
                )}
              >
                {isListening ? (
                  <Square className="w-14 h-14 fill-current animate-pulse" />
                ) : (
                  <Mic className="w-16 h-16" />
                )}
              </button>
            </div>
            
            <p className="text-green-900/60 font-black uppercase tracking-[0.2em] text-sm pointer-events-none">
              {isListening ? "BİTİRMEK İÇİN TIKLA" : "KONUŞMAK İÇİN TIKLA"}
            </p>

          </div>

          <audio ref={audioRef} className="hidden" />

        </div>

      </main>
    </div>
  );
}
