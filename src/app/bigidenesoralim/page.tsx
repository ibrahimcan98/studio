'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, ArrowRight, Play, Gamepad2, GraduationCap, Mic, Star } from 'lucide-react';
import { Logo } from '@/components/logo';
import Link from 'next/link';

const ShowcaseImage = ({ src, alt, className, tooltipText, onClick }: { src: string, alt: string, className: string, tooltipText: string, onClick?: () => void }) => {
  return (
    <div className={`group absolute transition-all duration-500 hover:z-50 cursor-pointer ${className}`} onClick={onClick}>
      <img src={src} alt={alt} className="w-full h-full object-cover rounded-xl md:rounded-3xl shadow-2xl border-4 border-white transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300 bg-slate-900 text-white text-[10px] md:text-sm font-bold px-4 py-2 rounded-full whitespace-nowrap shadow-xl pointer-events-none z-50">
        {tooltipText}
      </div>
    </div>
  );
};

export default function InfluencerPage() {
  const router = useRouter();
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{src: string, alt: string} | null>(null);

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      title: 'Eğlenceli Oyunlar',
      description: 'Çocukların bayılacağı interaktif ve öğretici oyunlar.',
      icon: <Gamepad2 className="w-8 h-8 text-pink-500" />,
      color: 'bg-pink-100',
    },
    {
      title: 'Canlı Dersler',
      description: 'Uzman eğitmenlerle birebir veya grup konuşma dersleri.',
      icon: <GraduationCap className="w-8 h-8 text-blue-500" />,
      color: 'bg-blue-100',
    },
    {
      title: 'Yapay Zeka',
      description: 'Anında sesli geri bildirim veren akıllı asistan.',
      icon: <Mic className="w-8 h-8 text-green-500" />,
      color: 'bg-green-100',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden relative selection:bg-teal-200">
      {/* Confetti Animation */}
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} gravity={0.15} className="z-[100]" />}

      {/* Simplified Header */}
      <header className="absolute top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-transparent">
        <Logo />
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex flex-col items-center justify-center text-center px-4">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-teal-400/20 blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[100px]" />
          <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] rounded-full bg-yellow-400/20 blur-[80px]" />
        </div>

        {/* Floating Icons */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="absolute top-32 left-10 lg:left-32 opacity-60"
        >
          <Sparkles className="w-12 h-12 text-yellow-400" />
        </motion.div>
        
        <motion.div
          animate={{ y: [0, 30, 0], x: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute bottom-32 right-10 lg:right-32 opacity-60"
        >
          <Star className="w-16 h-16 text-pink-400" />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white shadow-xl shadow-teal-500/10 mb-8 border border-slate-100">
              <span className="text-2xl">🎙️</span>
              <span className="text-sm md:text-base font-bold text-slate-700 uppercase tracking-widest">
                @bigidenesoralim Tavsiyesiyle
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight mb-6">
              Eğlenceli <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600">Türkçe Öğrenme</span><br/>
              Macerasına Katılın!
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Çocuklarınızın Türkçeyi oynayarak ve eğlenerek öğrenmesini sağlayan muhteşem eğitim platformu.
            </p>
          </div>

          {/* Path Splitter */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mt-12">
            {/* Canlı Dersler */}
            <motion.div
              initial={{ opacity: 0, y: 50, x: -50 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-[40px] p-8 shadow-2xl border-4 border-indigo-50 hover:border-indigo-200 transition-all flex flex-col items-center text-center cursor-pointer group"
              onClick={() => document.getElementById('canli-dersler')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-4xl">👨‍🏫</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4">Canlı Dersler</h2>
              <p className="text-slate-600 mb-8">Uzman eğitmenlerle birebir veya grup konuşma pratikleri.</p>
              
              <div className="inline-block bg-rose-100 text-rose-600 border-2 border-rose-200 px-4 py-2 rounded-xl mb-6 transform rotate-2 group-hover:rotate-0 transition-transform shadow-sm">
                <span className="font-bold text-sm md:text-base">🎁 Podcast dinleyicilerine özel tam %40 İNDİRİM!</span>
              </div>
              
              <Button 
                className="h-14 px-8 text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full shadow-lg group-hover:shadow-indigo-500/50 w-full"
                onClick={(e) => { e.stopPropagation(); router.push('/register'); }}
              >
                ÜCRETSİZ DENE
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Button>
            </motion.div>

            {/* Oyun Platformumuz */}
            <motion.div
              initial={{ opacity: 0, y: 50, x: 50 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-[40px] p-8 shadow-2xl border-4 border-teal-50 hover:border-teal-200 transition-all flex flex-col items-center text-center cursor-pointer group"
              onClick={() => document.getElementById('oyun-platformu')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <div className="w-24 h-24 rounded-full bg-teal-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-4xl">🎮</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4">Oyun Platformumuz</h2>
              <p className="text-slate-600 mb-8">Eğlenceli oyunlar, hikayeler, rozetler ve sürpriz dolu adalar.</p>
              
              <div className="mt-auto pt-6">
                <Button 
                  className="h-14 px-8 text-lg font-bold bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-full shadow-lg group-hover:shadow-teal-500/50 w-full pointer-events-none"
                >
                  PLATFORMU KEŞFET
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform rotate-90" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Canlı Dersler Section */}
      <section id="canli-dersler" className="py-24 px-4 bg-indigo-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm uppercase tracking-wider">
                👨‍🏫 Uzman Eğitmenler
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                Canlı ve Etkileşimli<br/>Konuşma Pratiği
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Çocuklarınız anadili Türkçe olan veya alanında uzman eğitmenlerle, güvenli bir ortamda canlı görüşmeler yaparak Türkçe konuşma yeteneklerini geliştirir.
              </p>
              
              <ul className="space-y-4">
                <li className="flex items-start gap-4 bg-white/50 p-4 rounded-2xl border border-indigo-100">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-xl">📱</div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Kapsamlı Veli Paneli</h4>
                    <p className="text-sm text-slate-600">Tüm kursları, detayları ve bakiyenizi tek ekrandan kolayca yönetin.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4 bg-white/50 p-4 rounded-2xl border border-indigo-100">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-cyan-100 flex items-center justify-center text-xl">🗓️</div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Esnek Ders Planlama</h4>
                    <p className="text-sm text-slate-600">Kendi ülkenizin saat dilimine uygun, tamamen esnek programlar oluşturun.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4 bg-white/50 p-4 rounded-2xl border border-indigo-100">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-fuchsia-100 flex items-center justify-center text-xl">📈</div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">Anlık Gelişim Takibi</h4>
                    <p className="text-sm text-slate-600">Tamamlanan dersler, eğitmen değerlendirmeleri ve çocuğunuzun başarısını anbean izleyin.</p>
                  </div>
                </li>
              </ul>
              
              <div className="pt-4">
                <div className="inline-block bg-rose-100 text-rose-600 border-2 border-rose-200 px-6 py-3 rounded-2xl mb-4 transform -rotate-1 shadow-sm">
                  <span className="font-bold text-lg">🎁 %40 İndirim Fırsatını Kaçırmayın!</span>
                </div>
                <Button 
                  className="h-16 px-10 text-xl font-black bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-700 w-full sm:w-auto block"
                  onClick={() => router.push('/register')}
                >
                  HEMEN ÜCRETSİZ DENE
                </Button>
              </div>
            </div>
            
            <div className="flex-1 w-full mt-10 lg:mt-0 flex flex-col gap-6 relative">
              <div className="absolute inset-0 bg-indigo-400/20 blur-3xl rounded-full" />
              <ShowcaseImage src="/bigezenesoralim/ebeveyn.png" alt="Veli Paneli" className="!relative w-full z-20 shadow-xl" tooltipText="Tüm detayları görebileceğin bir veli paneli" onClick={() => setSelectedImage({ src: '/bigezenesoralim/ebeveyn.png', alt: 'Veli Paneli' })} />
              
              <div className="flex flex-col sm:flex-row items-start gap-6 w-full z-20">
                <ShowcaseImage src="/bigezenesoralim/planla.jpeg" alt="Ders Planla" className="!relative flex-1 w-full shadow-lg" tooltipText="Esnek bir şekilde kendi ülkenin saatine göre ders planlayabilirsiniz" onClick={() => setSelectedImage({ src: '/bigezenesoralim/planla.jpeg', alt: 'Ders Planla' })} />
                <ShowcaseImage src="/bigezenesoralim/cocuk.png" alt="Çocuk Gelişimi" className="!relative flex-1 w-full shadow-lg" tooltipText="Çocuğun gelişimini görebileceğin yer" onClick={() => setSelectedImage({ src: '/bigezenesoralim/cocuk.png', alt: 'Çocuk Gelişimi' })} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* App Showcase Section */}
      <section id="oyun-platformu" className="py-24 px-4 bg-slate-50 relative overflow-hidden">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">Oyun Platformumuz</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">Sıkıcı derslere veda edin! Çocukların bayılarak oynadığı, oynarken de fark etmeden yepyeni Türkçe kelimeler öğrendiği dünyamızı keşfedin.</p>
        </div>
        <div className="max-w-7xl mx-auto space-y-32">
          
          {/* 1. Macera Haritası */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex-1 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-600 font-bold text-sm uppercase tracking-wider mb-2">
                🗺️ Adım Adım Keşif
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                Macera Haritası
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Çocuğunuz adalar arasında gezinerek yepyeni kelimeler ve kavramlar öğrenir. Her ada, tamamlanmayı bekleyen eğlenceli görevler ve sürprizlerle dolu bir dünyaya açılır.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex-1 relative w-full aspect-square md:aspect-[4/3] mt-10 md:mt-0 flex items-center justify-center"
            >
              <div className="absolute inset-0 bg-orange-400/20 blur-3xl rounded-full" />
              <ShowcaseImage src="/bigezenesoralim/adalar.jpeg" alt="Adalar" className="w-[50%] z-20" tooltipText="Küçük yaşta çocukların çeşitli kelimeler öğreneceği bölüm" onClick={() => setSelectedImage({ src: '/bigezenesoralim/adalar.jpeg', alt: 'Adalar' })} />
              <ShowcaseImage src="/bigezenesoralim/adalar1.jpeg" alt="Oyunlar" className="top-0 left-0 w-[35%] z-30" tooltipText="Oyunların iç yüzü" onClick={() => setSelectedImage({ src: '/bigezenesoralim/adalar1.jpeg', alt: 'Oyunlar' })} />
              <ShowcaseImage src="/bigezenesoralim/adalar2.jpeg" alt="Kartlar" className="bottom-0 right-0 w-[35%] z-40" tooltipText="Kelime kartları" onClick={() => setSelectedImage({ src: '/bigezenesoralim/adalar2.jpeg', alt: 'Kartlar' })} />
              <ShowcaseImage src="/bigezenesoralim/adalar3.jpeg" alt="Dinle Bul" className="top-0 right-0 w-[35%] z-30" tooltipText="Dinle bul" onClick={() => setSelectedImage({ src: '/bigezenesoralim/adalar3.jpeg', alt: 'Dinle Bul' })} />
              <ShowcaseImage src="/bigezenesoralim/adalar4.jpeg" alt="Yapboz" className="bottom-0 left-0 w-[35%] z-40" tooltipText="Yapboz" onClick={() => setSelectedImage({ src: '/bigezenesoralim/adalar4.jpeg', alt: 'Yapboz' })} />
            </motion.div>
          </div>

          {/* 2. Türkçe Hazinem */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex-1 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-600 font-bold text-sm uppercase tracking-wider mb-2">
                💎 Gizli Sandıklar
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                Türkçe Hazinem
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Kelime dağarcığını geliştirmek hiç bu kadar keyifli olmamıştı! Açtıkları her sandıktan yeni kelimeler fışkırıyor, öğrenme heyecanı katlanıyor.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex-1 relative w-full aspect-square md:aspect-[4/3] flex items-center justify-center mt-10 md:mt-0"
            >
              <div className="absolute inset-0 bg-emerald-400/20 blur-3xl rounded-full" />
              <ShowcaseImage src="/bigezenesoralim/sandik.jpeg" alt="Sandık" className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] z-20" tooltipText="İleri yaşta çocuklar kelime ve bilgi dolu sandıklar" onClick={() => setSelectedImage({ src: '/bigezenesoralim/sandik.jpeg', alt: 'Sandık' })} />
              <ShowcaseImage src="/bigezenesoralim/sandik1.jpeg" alt="Okuyorum Anlıyorum" className="top-0 left-0 w-[40%] z-30" tooltipText="Okuyorum Anlıyorum" onClick={() => setSelectedImage({ src: '/bigezenesoralim/sandik1.jpeg', alt: 'Okuyorum Anlıyorum' })} />
              <ShowcaseImage src="/bigezenesoralim/sandik2.jpeg" alt="Dilimi Öğreniyorum" className="bottom-0 right-0 w-[40%] z-40" tooltipText="Dilimi öğreniyorum" onClick={() => setSelectedImage({ src: '/bigezenesoralim/sandik2.jpeg', alt: 'Dilimi Öğreniyorum' })} />
              <ShowcaseImage src="/bigezenesoralim/sandik3.jpeg" alt="Ülkemi Öğreniyorum" className="-bottom-6 left-10 w-[35%] z-30" tooltipText="Ülkemi öğreniyorum" onClick={() => setSelectedImage({ src: '/bigezenesoralim/sandik3.jpeg', alt: 'Ülkemi Öğreniyorum' })} />
            </motion.div>
          </div>

          {/* 3. Yapay Zeka */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex-1 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 text-pink-600 font-bold text-sm uppercase tracking-wider mb-2">
                🤖 Akıllı Arkadaş
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                Yapay Zeka ile Konuşma
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Platformumuzdaki güvenli yapay zeka asistanı, çocuğunuzun sorduğu soruları yanıtlar ve onunla eğitici, Türkçe diyaloglar kurar.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex-1 relative w-full aspect-square md:aspect-[4/3] flex items-center justify-center mt-10 md:mt-0"
            >
              <div className="absolute inset-0 bg-pink-400/20 blur-3xl rounded-full" />
              <div className="relative w-full h-full flex items-center justify-center">
                <ShowcaseImage src="/bigezenesoralim/aikonusma.jpeg" alt="Yapay Zeka" className="w-[85%] z-30 rotate-2 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" tooltipText="Bizim tarafımızdan eğitilen şirin mi şirin patimiz" onClick={() => setSelectedImage({ src: '/bigezenesoralim/aikonusma.jpeg', alt: 'Yapay Zeka' })} />
              </div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-purple-400 rounded-full blur-2xl opacity-50 animate-pulse" />
            </motion.div>
          </div>

          {/* 4. Okuma ve Hikaye */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex-1 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-600 font-bold text-sm uppercase tracking-wider mb-2">
                📚 Sürükleyici Serüvenler
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                Hikaye Okuma ve Dinleme
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Sesli ve görsel destekli interaktif hikayelerle okuma alışkanlığını güçlendiriyoruz. Okuduklarını anlama testleriyle süreci pekiştiriyoruz.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex-1 relative w-full aspect-square md:aspect-[4/3] mt-10 md:mt-0"
            >
              <div className="absolute inset-0 bg-blue-400/20 blur-3xl rounded-full" />
              <ShowcaseImage src="/bigezenesoralim/hikaye1.jpeg" alt="Hikaye İç Yüzü" className="top-0 right-10 w-[70%] z-20" tooltipText="Hikayelerin iç yüzü" onClick={() => setSelectedImage({ src: '/bigezenesoralim/hikaye1.jpeg', alt: 'Hikaye İç Yüzü' })} />
              <ShowcaseImage src="/bigezenesoralim/hikaye2.jpeg" alt="Hikaye Bölümü" className="bottom-4 left-0 w-[65%] z-30" tooltipText="Hikaye bölümü" onClick={() => setSelectedImage({ src: '/bigezenesoralim/hikaye2.jpeg', alt: 'Hikaye Bölümü' })} />
            </motion.div>
          </div>

          {/* 5. Rozetler & Etiketler */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex-1 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-600 font-bold text-sm uppercase tracking-wider mb-2">
                🏆 Ödüller ve Başarılar
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                Rozet Koleksiyonu
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Her başarı bir kutlamayı hak eder! Çocuğunuz oyunları tamamladıkça harika çıkartmalar ve pırıl pırıl rozetler kazanır. Kendi başarı koleksiyonunu oluşturmak onu daha fazla öğrenmeye motive eder.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="flex-1 relative w-full aspect-square md:aspect-[4/3] mt-10 md:mt-0"
            >
              <div className="absolute inset-0 bg-purple-400/20 blur-3xl rounded-full" />
              <div className="relative w-full h-full flex items-center justify-center">
                <ShowcaseImage src="/bigezenesoralim/rozet1.jpeg" alt="Rozet 1" className="top-0 left-0 w-[45%] z-10" tooltipText="Harika Çıkartmalar!" onClick={() => setSelectedImage({ src: '/bigezenesoralim/rozet1.jpeg', alt: 'Rozet 1' })} />
                <ShowcaseImage src="/bigezenesoralim/rozet2.jpeg" alt="Rozet 2" className="bottom-10 right-0 w-[45%] z-20" tooltipText="Ada Gezgini" onClick={() => setSelectedImage({ src: '/bigezenesoralim/rozet2.jpeg', alt: 'Rozet 2' })} />
                <ShowcaseImage src="/bigezenesoralim/rozet3.jpeg" alt="Rozet 3" className="top-10 right-10 w-[40%] z-10" tooltipText="Başarı Koleksiyonu" onClick={() => setSelectedImage({ src: '/bigezenesoralim/rozet3.jpeg', alt: 'Rozet 3' })} />
                <ShowcaseImage src="/bigezenesoralim/rozet4.jpeg" alt="Rozet 4" className="bottom-0 left-10 w-[45%] z-30" tooltipText="İlk Adım Rozeti" onClick={() => setSelectedImage({ src: '/bigezenesoralim/rozet4.jpeg', alt: 'Rozet 4' })} />
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[999] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
          >
            <motion.img 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", bounce: 0.4 }}
              src={selectedImage.src} 
              alt={selectedImage.alt} 
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border-4 border-white/20" 
              onClick={(e) => e.stopPropagation()}
            />
            <button 
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors text-2xl"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom CTA */}
      <section className="py-24 px-4 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-teal-500/20 to-blue-500/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Hazır Mısınız?
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Hemen ücretsiz hesabınızı oluşturun ve bu eşsiz öğrenme deneyimini çocuğunuza armağan edin.
          </p>
          <Button 
            className="h-16 px-12 text-xl font-black bg-white text-slate-900 hover:bg-slate-100 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
            onClick={() => router.push('/register')}
          >
            Maceraya Başla
          </Button>
        </div>
      </section>
    </div>
  );
}
