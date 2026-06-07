"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Puzzle, Mic, BookOpen, Bot, Star, Heart, ArrowRight, Gamepad2, Compass, Book, Smile } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

const games = [
  {
    id: "puzzle",
    title: "Macera Adası",
    description: "Özenle hazırlanmış temalar, eğlenceli oyunlar ve etkileşimli etkinliklerle Türkçeyi keşfet!",
    icon: <Gamepad2 className="w-6 h-6 text-white" />,
    image: "/images/child-mode/island.png",
    color: "bg-purple-500",
    buttonText: "Maceralara Başla",
    buttonColor: "text-purple-600 bg-purple-50 hover:bg-purple-100",
  },
  {
    id: "voice",
    title: "Türkçe Hazinem",
    description: "Kelime dağarcığını zenginleştir, sesli eşleştirmeler ve eğlenceli etkinliklerle öğrendiklerini pekiştir!",
    icon: <Compass className="w-6 h-6 text-white" />,
    image: "/turkce-hazinem/sandik-acik.png",
    color: "bg-orange-500",
    buttonText: "Hazinemi Keşfet",
    buttonColor: "text-orange-600 bg-orange-50 hover:bg-orange-100",
  },
  {
    id: "story",
    title: "Hikaye Bölümü",
    description: "Sesli hikâyelerle okuduğunu anla, okuma becerilerini geliştir ve eğitici içeriklerle yeni bilgiler kazan!",
    icon: <Book className="w-6 h-6 text-white" />,
    color: "bg-green-500",
    image: "/images/child-mode/book.png",
    buttonText: "Hikayelere Göz At",
    buttonColor: "text-green-600 bg-green-50 hover:bg-green-100",
  },
  {
    id: "ai",
    title: "AI Konuşma Arkadaşım",
    description: "Her gün pratik yap, Türkçe'ni geliştir! En yakın yapay zeka arkadaşınla sohbet et!",
    icon: <Bot className="w-6 h-6 text-white" />,
    color: "bg-blue-500",
    image: "/ai/oturuyor.png",
    speechBubble: "MERHABA!",
    buttonText: "Sohbete Başla",
    buttonColor: "text-blue-600 bg-blue-50 hover:bg-blue-100",
  }
];

export default function GameShowcase() {
  return (
    <section className="py-24 bg-gradient-to-b from-purple-50/50 via-pink-50/50 to-white relative overflow-hidden">
      {/* Playful Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-pink-300/20 rounded-full blur-3xl" />
        
        {/* Floating elements like the mockup */}
        <Gamepad2 className="absolute top-[20%] left-[10%] w-24 h-24 text-purple-200/60 -rotate-12 animate-float" />
        <Puzzle className="absolute bottom-[20%] right-[10%] w-20 h-20 text-pink-200/60 rotate-12 animate-float-slow" />
        <BookOpen className="absolute top-[10%] right-[20%] w-16 h-16 text-orange-200/60 rotate-12 animate-pulse" />
      </div>

      <div className="container relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white shadow-sm border border-purple-100 text-purple-700 font-bold text-sm mb-2">
            <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span>YENİ ÇOCUK MODU EKLENDİ!</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#1B2B4B] tracking-tight leading-[1.1]">
            Türkçeyi Eğlenceli <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 inline-block">Oyunlarla</span> Keşfet!
          </h2>
          <p className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-3xl mx-auto">
            Öğrenmek hiç bu kadar eğlenceli olmamıştı! Çocuğunuz, oyunlar, sesli hikâyeler ve yapay zeka destekli maceralarla oynayarak farkında olmadan Türkçesini geliştirecek.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 px-4">
          {games.map((game) => (
            <Card 
              key={game.id} 
              className="group relative border border-slate-100 bg-white rounded-[32px] p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
            >
              {/* Top Left Icon */}
              <div className={cn(
                "w-12 h-12 rounded-[16px] flex items-center justify-center mb-6 shadow-md relative z-20",
                game.color
              )}>
                {game.icon}
              </div>

              {/* 3D Image */}
              <div className="relative w-full h-48 mb-6 mt-2 flex items-center justify-center">
                <Image 
                  src={game.image}
                  alt={game.title}
                  fill
                  className="object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
                />
                {(game as any).speechBubble && (
                  <div className="absolute top-0 right-0 md:-right-2 bg-white text-blue-600 font-black text-sm md:text-base px-4 py-2 rounded-2xl rounded-bl-sm shadow-xl border-2 border-blue-100 animate-bounce z-30">
                    {(game as any).speechBubble}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col flex-grow">
                <h3 className="text-xl font-extrabold text-[#1B2B4B] mb-3">{game.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">
                  {game.description}
                </p>
                
                {/* Button */}
                <button className={cn(
                  "w-full py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300",
                  game.buttonColor
                )}>
                  {game.buttonText}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="flex justify-center">
          <div className="bg-white/80 backdrop-blur-md border border-purple-100 rounded-full py-4 px-8 md:px-12 flex items-center gap-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <div className="bg-purple-100 p-2 rounded-full">
              <Heart className="w-6 h-6 text-purple-600 fill-purple-600" />
            </div>
            <div className="text-left">
              <h4 className="text-purple-700 font-bold text-base leading-tight">Türkçeyi öğrenmek bir macera!</h4>
              <p className="text-slate-500 text-sm">Haydi, sen de bu maceraya katıl!</p>
            </div>
          </div>
        </div>

      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(-12deg); }
          50% { transform: translateY(-20px) rotate(-10deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(12deg); }
          50% { transform: translateY(-15px) rotate(15deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
