import { Star, Map, BookOpen, Award } from 'lucide-react';

export function LoginIllustration() {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="aspect-square w-full rounded-full bg-amber-100/50 relative flex items-center justify-center">
        <svg
          className="absolute w-full h-full text-amber-200/50"
          width="400"
          height="400"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" />
          <circle cx="200" cy="200" r="140" stroke="currentColor" strokeWidth="1" />
        </svg>
        
        {/* Child */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-amber-200 flex items-center justify-center shadow-inner">
             <span className="text-5xl">👧</span>
          </div>
          <p className="mt-4 font-semibold text-lg text-amber-800">Türkçe Öğreniyorum!</p>
        </div>
        
        {/* Icons */}
        <div className="absolute top-12 left-10 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center transform -rotate-12">
            <BookOpen className="w-6 h-6 text-cyan-500"/>
        </div>
        <div className="absolute top-16 right-8 w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center transform rotate-12">
            <Map className="w-8 h-8 text-green-500"/>
        </div>
        <div className="absolute bottom-16 left-8 w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center transform -rotate-6">
            <Star className="w-8 h-8 text-yellow-500 fill-yellow-400"/>
        </div>
        <div className="absolute bottom-12 right-12 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center transform rotate-6">
            <Award className="w-7 h-7 text-red-500"/>
        </div>

        {/* XP Point */}
        <div className="absolute top-32 left-0 w-16 h-8 bg-yellow-400 rounded-lg flex items-center justify-center shadow-xl transform -rotate-45">
          <span className="font-bold text-white">+10 XP</span>
        </div>
      </div>
    </div>
  );
}