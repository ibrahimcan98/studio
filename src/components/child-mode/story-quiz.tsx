'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Sparkles, Brain, Volume2, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTTS } from '@/hooks/use-tts';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface StoryQuizProps {
  questions: Question[];
  onComplete: (allCorrect: boolean) => void;
  onClose: () => void;
}

export function StoryQuiz({ questions, onComplete, onClose }: StoryQuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const { width, height } = useWindowSize();
  const { speak, stop, isPlaying } = useTTS();

  const playQuestion = useCallback(() => {
    speak(questions[currentStep].question);
  }, [currentStep, questions, speak]);

  const playOption = useCallback((text: string) => {
    speak(text);
  }, [speak]);

  useEffect(() => {
    // Küçük bir gecikmeyle soruyu oku ki animasyon tamamlanabilsin
    const timer = setTimeout(() => {
      playQuestion();
    }, 500);
    return () => {
      clearTimeout(timer);
      stop();
    };
  }, [currentStep, playQuestion, stop]);

  const handleOptionClick = (index: number) => {
    if (isCorrect !== null) return;
    stop(); // Seçenek tıklandığında seslendirmeyi durdur
    
    setSelectedOption(index);
    const correct = index === questions[currentStep].correctAnswer;
    setIsCorrect(correct);

    if (!correct) setWrongAnswers(prev => prev + 1);

    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(prev => prev + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        setIsFinished(true);
        const allCorrect = wrongAnswers === 0 && correct;
        
        const finishQuiz = () => onComplete(allCorrect);
        
        // Tebrik mesajını seslendir ve bitmesini bekle
        if (allCorrect) {
          speak("/hikayeler/test-harikasin.mp3", { onEnd: finishQuiz, onError: finishQuiz });
        } else {
          speak("/hikayeler/test-tebrikler.mp3", { onEnd: finishQuiz, onError: finishQuiz });
        }
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-purple-900/40 backdrop-blur-md">
      {isFinished && <Confetti width={width} height={height} numberOfPieces={200} recycle={false} />}
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[50px] p-8 md:p-12 shadow-2xl max-w-lg w-full text-center border-b-[12px] border-slate-200 relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <button 
                onClick={() => {
                  stop();
                  onClose();
                }}
                className="absolute top-0 right-0 p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3">
                <Brain className="w-8 h-8 text-white" />
              </div>

              <h2 className="text-sm font-black text-purple-500 uppercase tracking-widest mb-2 italic">Hikaye Testi</h2>
              <div className="flex justify-center gap-1 mb-6">
                {questions.map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "h-2 rounded-full transition-all duration-500",
                      i === currentStep ? "w-8 bg-purple-500" : i < currentStep ? "w-4 bg-green-400" : "w-4 bg-slate-100"
                    )} 
                  />
                ))}
              </div>

              <div className="space-y-8">
                <div className="flex flex-col items-center gap-4">
                  <button
                    onClick={playQuestion}
                    className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center hover:bg-purple-200 transition-colors"
                  >
                    <Volume2 className={cn("w-6 h-6", isPlaying && "animate-pulse")} />
                  </button>
                  <h3 className="text-2xl font-black text-slate-800 leading-tight">
                    {questions[currentStep].question}
                  </h3>
                </div>

                <div className="grid gap-3">
                  {questions[currentStep].options.map((option, i) => (
                    <div key={i} className="relative group">
                      <button
                        onClick={() => handleOptionClick(i)}
                        className={cn(
                          "w-full p-5 pr-14 rounded-[25px] text-lg font-bold transition-all border-b-4 flex items-center justify-between text-left",
                          selectedOption === null 
                            ? "bg-slate-50 border-slate-200 hover:bg-slate-100 active:translate-y-1" 
                            : i === questions[currentStep].correctAnswer
                              ? "bg-green-100 border-green-300 text-green-700"
                              : i === selectedOption
                                ? "bg-red-100 border-red-300 text-red-700"
                                : "bg-slate-50 border-slate-200 opacity-50"
                        )}
                      >
                        {option}
                        {selectedOption !== null && i === questions[currentStep].correctAnswer && <Check className="w-6 h-6" />}
                        {selectedOption === i && i !== questions[currentStep].correctAnswer && <X className="w-6 h-6" />}
                      </button>
                      {selectedOption === null && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playOption(option);
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-white shadow-sm border border-slate-100 text-slate-400 hover:text-purple-500 hover:border-purple-200 transition-all"
                        >
                          <Volume2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="finished"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-8"
            >
              <div className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(251,191,36,0.5)] animate-bounce">
                <Trophy className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-4xl font-black text-slate-800 mb-4 uppercase italic">TEBRİKLER!</h2>
              <p className="text-xl font-bold text-slate-500 mb-8">
                {wrongAnswers === 0 
                  ? "Bütün soruları doğru bildin! Harikasın!" 
                  : "Hikaye testini başarıyla tamamladın!"}
              </p>
              <div className="flex justify-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Sparkles key={i} className="w-8 h-8 text-yellow-400 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
