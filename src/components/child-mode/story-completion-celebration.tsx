'use client';

import { useEffect } from 'react';
import Confetti from 'react-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { useTTS } from '@/hooks/use-tts';
import { Brain, Star } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, collection, query, where, getDocs, serverTimestamp, arrayRemove } from 'firebase/firestore';

interface StoryCompletionCelebrationProps {
  show: boolean;
  onAction: () => void;
  storyId?: string; // e.g. 'sari-top'
}

export function StoryCompletionCelebration({ show, onAction, storyId }: StoryCompletionCelebrationProps) {
  const { speak, stop } = useTTS();
  const message = "Tebrikler hikayeyi bitirdin, şimdi soruları cevaplama vakti!";
  
  const params = useParams();
  const childId = params.childId as string;
  const { user: authUser } = useUser();
  const db = useFirestore();

  const childDocRef = useMemoFirebase(() => {
    if (!db || !authUser?.uid || !childId) return null;
    return doc(db, 'users', authUser.uid, 'children', childId);
  }, [db, authUser?.uid, childId]);

  const { data: childData } = useDoc(childDocRef);

  useEffect(() => {
    if (show) {
      speak("/hikayeler/tebrikler.mp3");
      
      // Ödev kontrolü (Spesifik Hikaye)
      const isHomework = Array.isArray(childData?.activeHomeworkTopics) ? childData.activeHomeworkTopics.includes(storyId) : childData?.activeHomeworkTopic === storyId;
      if (storyId && childDocRef && db) {
        if (isHomework) {
            updateDoc(childDocRef, { activeHomeworkTopic: null, activeHomeworkTopics: arrayRemove(storyId) }).catch(console.error);
        }
        
        const hwQuery = query(
            collection(db, 'game-homeworks'),
            where('childId', '==', childId)
        );
        getDocs(hwQuery).then(async (hwDocs) => {
            const promises: Promise<void>[] = [];
            hwDocs.forEach(docSnap => {
                const d = docSnap.data();
                if (d.topicId === storyId && d.status === 'assigned') {
                    promises.push(updateDoc(docSnap.ref, { status: 'completed', completedAt: serverTimestamp() }));
                }
            });
            await Promise.all(promises);
        }).catch((e: any) => {
            console.error(e);
            alert("Ödev durumu güncellenemedi: " + e.message);
        });
      }
    } else {
      stop();
    }
  }, [show, speak, stop, childData?.activeHomeworkTopic, childData?.activeHomeworkTopics, childDocRef, db, childId, storyId]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <Confetti 
            width={typeof window !== 'undefined' ? window.innerWidth : 1000} 
            height={typeof window !== 'undefined' ? window.innerHeight : 1000} 
            recycle={false} 
            numberOfPieces={400} 
          />
          
          <motion.div
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", duration: 0.8, bounce: 0.5 }}
            className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl flex flex-col items-center text-center max-w-lg mx-4 border-8 border-purple-100 relative"
          >
            <div className="absolute -top-12 bg-yellow-400 p-4 rounded-full border-4 border-white shadow-lg">
              <Star className="w-12 h-12 text-white fill-current" />
            </div>

            <h2 className="text-3xl md:text-4xl font-black text-purple-700 mt-6 mb-4 uppercase italic tracking-tighter">
              Harika İş Çıkardın!
            </h2>
            
            <p className="text-lg md:text-xl font-bold text-slate-700 leading-relaxed mb-8">
              {message}
            </p>

            <button
              onClick={() => {
                stop();
                onAction();
              }}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-10 py-6 rounded-[25px] text-xl shadow-[0_10px_20px_rgba(16,185,129,0.3)] border-b-[6px] border-emerald-700 transition-all active:scale-95 flex items-center gap-3 w-full justify-center group"
            >
              <Brain className="w-8 h-8 group-hover:rotate-12 transition-transform" />
              SORULARI CEVAPLA
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
