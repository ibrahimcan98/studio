'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader2, Mic, Square, Sparkles } from 'lucide-react';
import { ChildSidebar } from '@/components/child-mode/sidebar';
import { cn } from '@/lib/utils';
import { childConversationFlow } from '@/ai/flows/child-conversation-flow';
import { useTTS } from '@/hooks/use-tts';
import { PatiAvatar } from '@/components/child-mode/pati-avatar';
import { motion, AnimatePresence } from 'framer-motion';

export default function KonusmaPage() {
  const router = useRouter();
  const params = useParams();
  const childId = params.childId as string;
  const { user: authUser } = useUser();
  const db = useFirestore();
  const [isMounted, setIsMounted] = useState(false);
  const recognitionRef = useRef<any>(null);

  const [isListening, setIsListening] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("Pati seni bekliyor! Haydi konuşmaya başlayalım!");
  const [currentEmotion, setCurrentEmotion] = useState<'happy' | 'surprised' | 'thinking' | 'excited' | 'cool' | 'laughing'>('happy');
  const [history, setHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const { speak, isPlaying: isAudioPlaying } = useTTS();
  const [hasInteracted, setHasInteracted] = useState(false);
  const greetingTriggered = useRef(false);
  const transcriptRef = useRef("");

  useEffect(() => {
    setIsMounted(true);
    const pin = localStorage.getItem(`child-pin-${childId}`);
    if (!pin) router.push('/ebeveyn-portali');
  }, [childId, router]);

  const childDocRef = useMemoFirebase(() => {
    if (!db || !authUser?.uid || !childId) return null;
    return doc(db, 'users', authUser.uid, 'children', childId);
  }, [db, authUser?.uid, childId]);

  const { data: childData, isLoading: childLoading } = useDoc(childDocRef);

  const startConversation = async () => {
    setHasInteracted(true);
    if (childData && !greetingTriggered.current) {
      greetingTriggered.current = true;
      try {
        const childName = childData.firstName || childData.name || "arkadaşım";
        const res = await childConversationFlow({
          history: [],
          question: `Sisteme ${childName} isimli çocuk giriş yaptı. Onu çok neşeli karşıla.`,
          childName: childName
        });
        setAiResponse(res.answer);
        setCurrentEmotion(res.emotion as any);
        setHistory([{ role: 'assistant', content: res.answer }]);
        speak(res.answer);
      } catch (e) {
        console.error("Initial greeting error:", e);
      }
    }
  };

  const handleMicClick = async () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setAiResponse("Maalesef tarayıcın ses tanımayı desteklemiyor.");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
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
        transcriptRef.current = "";
      };

      recognition.onresult = (event: any) => {
        let text = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        setTranscript(text);
        transcriptRef.current = text;
      };

      recognition.onend = async () => {
        setIsListening(false);
        const finalTranscript = transcriptRef.current.trim();
        
        if (finalTranscript.length > 0) {
          setIsAiSpeaking(true);
          try {
            const res = await childConversationFlow({
              history: history.slice(-10),
              question: finalTranscript,
              childName: childData?.name
            });
            
            setAiResponse(res.answer);
            setCurrentEmotion(res.emotion as any);
            setHistory(prev => [...prev, 
              { role: 'user', content: finalTranscript }, 
              { role: 'assistant', content: res.answer }
            ]);
            speak(res.answer);
          } catch (e) {
            setAiResponse("Seni duydum ama şu an cevap veremiyorum.");
          } finally {
            setIsAiSpeaking(false);
          }
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setIsListening(false);
    }
  };

  if (!isMounted || childLoading || !childData) {
    return (
      <div className="flex h-screen items-center justify-center bg-sky-50">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden font-sans bg-[#E0F7FA] relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4DD0E1 2px, transparent 2px)', backgroundSize: '40px 40px' }} />

      {!hasInteracted && (
        <div className="absolute inset-0 z-[500] bg-black/40 backdrop-blur-xl flex items-center justify-center p-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[50px] p-10 shadow-2xl text-center max-w-sm border-b-[12px] border-slate-200"
          >
            <div className="relative w-40 h-40 mx-auto mb-6 bg-sky-50 rounded-full p-4 border-4 border-white">
              <PatiAvatar emotion="happy" />
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-2 uppercase italic">Miyav Hazır!</h2>
            <button
              onClick={startConversation}
              className="w-full bg-[#FF7043] hover:bg-[#F4511E] text-white font-black py-5 rounded-[25px] text-xl shadow-xl transition-all active:scale-95 border-b-[6px] border-[#BF360C] flex items-center justify-center gap-3"
            >
              HAYDİ BAŞLA! <Sparkles className="w-6 h-6" />
            </button>
          </motion.div>
        </div>
      )}

      <main className="h-full w-full flex flex-col md:flex-row relative z-10">
        <ChildSidebar childId={childId} childData={childData} />

        <div className="flex-1 relative flex flex-col items-center justify-center px-4 py-6">
          
          <div className="w-full max-w-3xl flex flex-col items-center justify-center">
            
            {/* Speech Bubble - Spacing Reduced (mb-6) */}
            <AnimatePresence mode="wait">
              {aiResponse && (
                <motion.div
                  key={aiResponse}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative z-20 mb-8"
                >
                  <div className={cn(
                    "relative max-w-md bg-white px-8 py-6 md:px-10 md:py-8 rounded-[35px] shadow-[0_15px_40px_rgba(0,0,0,0.08)] border-4 transition-all duration-500",
                    (isAiSpeaking || isAudioPlaying) ? "border-[#4DB6AC] scale-105" : "border-white"
                  )}>
                    <p className="text-xl md:text-2xl font-black text-slate-700 text-center leading-snug italic">
                      {aiResponse}
                    </p>
                    
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[25px] border-t-white" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Avatar - Spacing Tightened */}
            <div className={cn(
              "relative w-48 h-48 md:w-72 md:h-72 transition-all duration-700",
              isListening ? "scale-90" : "scale-100"
            )}>
                <PatiAvatar 
                  emotion={currentEmotion as any} 
                  isSpeaking={isAiSpeaking || isAudioPlaying} 
                />
            </div>
          </div>

          {/* Controls - Spacing Reduced (mt-6) */}
          <div className="w-full max-w-xl flex flex-col items-center gap-4 mt-6 relative z-[200]">
            
            {/* Transcript - More Compact */}
            <div className={cn(
              "min-h-[4rem] w-full px-8 py-3 rounded-[25px] bg-white/70 backdrop-blur-sm border-2 border-white/50 text-xl font-bold text-[#00796B] shadow-sm transition-all flex items-center justify-center text-center",
              transcript ? "opacity-100" : "opacity-0 invisible"
            )}>
              {transcript}
            </div>

            {/* Mic Button - More Compact Size */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                {isListening && (
                  <motion.div 
                    animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="absolute inset-0 rounded-full bg-red-400"
                  />
                )}
                <button
                  onClick={handleMicClick}
                  className={cn(
                    "relative z-[210] w-28 h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl border-b-[8px] cursor-pointer active:scale-95 active:border-b-0 active:translate-y-1",
                    isListening ? "bg-[#FF5252] border-[#D32F2F] text-white" : "bg-[#4CAF50] border-[#388E3C] text-white"
                  )}
                >
                  {isListening ? (
                    <Square className="w-12 h-12 fill-current" />
                  ) : (
                    <Mic className="w-14 h-14" />
                  )}
                </button>
              </div>
              <p className="text-[#004D40] font-black text-sm uppercase tracking-widest bg-white/50 px-4 py-1 rounded-full">
                {isListening ? "DURDUR" : "KONUŞ"}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
