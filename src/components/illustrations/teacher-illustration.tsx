import { BookCheck, Presentation, Users, BrainCircuit } from 'lucide-react';

export function TeacherIllustration() {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="aspect-square w-full rounded-full bg-blue-100/50 relative flex items-center justify-center">
        <svg
          className="absolute w-full h-full text-blue-200/50"
          width="400"
          height="400"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" />
          <circle cx="200" cy="200" r="140" stroke="currentColor" strokeWidth="1" />
        </svg>
        
        {/* Teacher */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center shadow-inner">
             <span className="text-5xl">👩‍🏫</span>
          </div>
          <p className="mt-4 font-semibold text-lg text-blue-800">Öğretmen Portalı</p>
        </div>
        
        {/* Icons */}
        <div className="absolute top-12 left-10 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center transform -rotate-12">
            <BookCheck className="w-6 h-6 text-green-500"/>
        </div>
        <div className="absolute top-16 right-8 w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center transform rotate-12">
            <Presentation className="w-8 h-8 text-purple-500"/>
        </div>
        <div className="absolute bottom-16 left-8 w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center transform -rotate-6">
            <Users className="w-8 h-8 text-orange-500"/>
        </div>
        <div className="absolute bottom-12 right-12 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center transform rotate-6">
            <BrainCircuit className="w-7 h-7 text-cyan-500"/>
        </div>
      </div>
    </div>
  );
}
