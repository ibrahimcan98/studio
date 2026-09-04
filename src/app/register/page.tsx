'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc, addDoc, collection } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SignUpIllustration } from '@/components/illustrations/signup-illustration';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Loader2, Eye, EyeOff, Search, ChevronDown, Check, Info } from 'lucide-react';
import { trackPixelEvent } from '@/components/analytics/FacebookPixel';
import { COUNTRY_CODES, countryMatchesSearch } from '@/lib/countries';

const adminEmail = 'iletisim@turkcocukakademisi.com';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [areaCode, setAreaCode] = useState('+90');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [searchCountry, setSearchCountry] = useState('');
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading } = useUser();

  const selectedCountry = COUNTRY_CODES.find(c => c.code === areaCode) || COUNTRY_CODES[0];
  const filteredCountries = COUNTRY_CODES.filter((country) =>
    countryMatchesSearch(country, searchCountry)
  );

  useEffect(() => {
    setIsMounted(true);
    
    let loadedFromSession = false;
    try {
      const tempData = sessionStorage.getItem('temp_register_data');
      if (tempData) {
        const parsed = JSON.parse(tempData);
        if (parsed.name) setName(parsed.name);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.areaCode) setAreaCode(parsed.areaCode);
        if (parsed.phoneNumber) setPhoneNumber(parsed.phoneNumber);
        loadedFromSession = true;
      }
    } catch(e) {}

    // Basit tarayıcı dili tabanlı alan kodu tahmini
    if (!loadedFromSession && typeof navigator !== 'undefined') {
      const lang = navigator.language.toLowerCase();
      if (lang.includes('de')) setAreaCode('+49');
      else if (lang.includes('en-gb')) setAreaCode('+44');
      else if (lang.includes('en-us') || lang.includes('en-ca')) setAreaCode('+1');
      else if (lang.includes('nl')) setAreaCode('+31');
      else if (lang.includes('fr')) setAreaCode('+33');
      else if (lang.includes('at')) setAreaCode('+43');
    }
  }, []);

  useEffect(() => {
    if (isMounted && !isSubmitting) {
      sessionStorage.setItem('temp_register_data', JSON.stringify({ name, email, areaCode, phoneNumber }));
    }
  }, [name, email, areaCode, phoneNumber, isMounted, isSubmitting]);

  useEffect(() => {
    if (!loading && user && !user.isAnonymous && isMounted && !isSubmitting) {
      // Sadece sayfa ilk açıldığında halihazırda login olanları yönlendirir.
      // isSubmitting true iken (kayıt esnasında) erken yönlendirmeyi önler.
      const target = user.emailVerified ? '/ebeveyn-portali' : '/auth/verify-email';
      router.push(target);
    }
  }, [user, loading, router, isMounted, isSubmitting]);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Honeypot Check (Bot Protection)
    if (honeypot) {
      console.warn('Bot detected. Registration blocked.');
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        // Silently fail to trick bots
        router.push('/login'); 
      }, 1500);
      return;
    }

    if (!auth || !db) return;

    let cleanEmail = email.trim().replace(/\s+/g, '');
    
    // E-posta yazım hataları kontrolü
    if (cleanEmail.endsWith('@gmail.con') || cleanEmail.endsWith('@gmai.com')) {
      toast({ variant: 'destructive', title: 'Uyarı', description: 'E-posta adresiniz "@gmail.com" mu olmalıydı? Lütfen kontrol edin.' });
      return;
    }
    if (cleanEmail.endsWith('@hotmail.co') || cleanEmail.endsWith('@hotmai.com')) {
      toast({ variant: 'destructive', title: 'Uyarı', description: 'E-posta adresiniz "@hotmail.com" mu olmalıydı? Lütfen kontrol edin.' });
      return;
    }

    const numericPhone = phoneNumber.replace(/\D/g, '');
    if (numericPhone.length === 0) {
      toast({ variant: 'destructive', title: 'Hata', description: 'Lütfen telefon numaranızı girin.' });
      return;
    }
    if (areaCode !== 'other' && numericPhone.length !== selectedCountry.maxLength) {
      toast({ variant: 'destructive', title: 'Hata', description: `${selectedCountry.country.split(' ')[0]} telefon numarası ${selectedCountry.maxLength} rakamdan oluşmalıdır.` });
      return;
    }

    if (password.length < 8) {
      toast({ variant: 'destructive', title: 'Hata', description: 'Şifreniz en az 8 karakter olmalıdır.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const newUser = userCredential.user;

      const slugId = cleanEmail.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_');
      const slugRef = doc(db, 'users', slugId);
      const slugDoc = await getDoc(slugRef);
      const isPreAuthorizedTeacher = slugDoc.exists() && slugDoc.data()?.role === 'teacher';

      await updateProfile(newUser, { displayName: name });
      
      const userDocRef = doc(db, 'users', newUser.uid);
      
      const adminEmails = [
        'iletisim@turkcocukakademisi.com',
        'tubakodak@turkcocukakademisii.com'
      ];
      const isAdmin = adminEmails.map(e => e.toLowerCase()).includes(cleanEmail.toLowerCase());
      const role = isAdmin ? 'admin' : (isPreAuthorizedTeacher ? 'teacher' : 'parent');
      
      let targetPath = '/ebeveyn-portali';
      if (role === 'admin') targetPath = '/yonetici';
      else if (role === 'teacher') targetPath = '/ogretmen-portali/takvim';

      const userData: any = {
        id: newUser.uid,
        shortId: newUser.uid.substring(0, 8).toUpperCase(),
        firstName: name.split(' ')[0] || '',
        lastName: name.split(' ').slice(1).join(' ') || '',
        email: newUser.email?.toLowerCase(),
        phoneNumber: `${areaCode}${phoneNumber}`,
        role: role,
        lives: 5,
        livesLastUpdatedAt: serverTimestamp(),
        emailVerified: false,
        createdAt: serverTimestamp()
      };

      if (isPreAuthorizedTeacher) {
          const teacherDraft = slugDoc.data();
          Object.assign(userData, {
              bio: teacherDraft.bio || '',
              hobbies: teacherDraft.hobbies || [],
              googleMeetLink: teacherDraft.googleMeetLink || '',
              introVideoUrl: teacherDraft.introVideoUrl || '',
              isProfileComplete: true
          });
      }

      // First, create the Firestore document
      await setDoc(userDocRef, userData, { merge: true });

      // Log registration to activity-log
      try {
        await addDoc(collection(db, 'activity-log'), {
            event: role === 'teacher' ? 'Yeni Öğretmen Kaydı' : (role === 'admin' ? 'Yeni Admin Kaydı' : 'Yeni Veli Kaydı'),
            details: { 
                'İsim': name,
                'E-posta': cleanEmail
            },
            icon: role === 'teacher' ? '👨‍🏫' : '👋',
            createdAt: serverTimestamp()
        });
      } catch (logErr) {
        console.error('Failed to log activity:', logErr);
      }

      // Meta Tracking
      trackPixelEvent('CompleteRegistration', {
          role: role,
          method: 'email'
      }, {
          em: newUser.email,
          ph: userData.phoneNumber,
          fn: name
      });
      
      // Also track as Lead for marketing purposes
      trackPixelEvent('Lead', {
          event_category: 'registration',
          role: role
      }, {
          em: newUser.email,
          ph: userData.phoneNumber,
          fn: name
      });

      // Then, try to send verification email (but don't fail registration if it fails)
      try {
        await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: newUser.email, userId: newUser.uid }),
        });
      } catch (verificationError: any) {
        console.error("Verification OTP failed to send via Resend:", verificationError);
      }

      toast({
        title: role === 'teacher' ? 'Hoş Geldiniz Öğretmenim!' : 'Kayıt Başarılı!',
        description: 'Hesabınız oluşturuldu. Portala yönlendiriliyorsunuz. Lütfen e-postanızı kontrol ederek hesabınızı doğrulayın.',
        duration: 8000,
      });

      // Veli kayıt olduktan sonra portalda hoşgeldin modalını kesinlikle görsün diye
      // eğer aynı sekmede daha önce test yapıldıysa kalan flag'i temizliyoruz.
      sessionStorage.removeItem('seenWelcomeTrial');

      if (role === 'parent') {
          router.push('/auth/verify-email');
      } else {
          router.push(targetPath);
      }

    } catch (error: any) {
      let errorMessage = 'Kayıt olurken bir hata oluştu.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Bu e-posta adresi zaten kullanımda.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Lütfen geçerli bir e-posta adresi girin.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Şifreniz en az 8 karakter olmalıdır.';
      }
      
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const [isExiting, setIsExiting] = useState(false);
  const handleNavigateToLogin = () => {
      setIsExiting(true);
      setTimeout(() => {
          router.push('/login');
      }, 400);
  };

  // Prevent hydration flicker by returning a consistent shell
  if (!isMounted) {
    return <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-amber-50 to-white" />;
  }

  return (
     <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-cyan-50 via-amber-50 to-white p-4 overflow-hidden" suppressHydrationWarning>
      <div className="container relative z-10 w-full max-w-6xl flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="w-full flex justify-center overflow-hidden py-10">
           <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-16 w-full max-w-4xl">
              <motion.div 
                 className="hidden md:block"
                 initial={{ x: -150, opacity: 0 }}
                 animate={{ x: isExiting ? -150 : 0, opacity: isExiting ? 0 : 1 }}
                 transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <SignUpIllustration />
              </motion.div>
              <motion.div 
                 className="flex flex-col items-center justify-center md:justify-start w-full max-w-md"
                 initial={{ x: 150, opacity: 0 }}
                 animate={{ x: isExiting ? 150 : 0, opacity: isExiting ? 0 : 1 }}
                 transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                  <div className="w-full mb-10 px-2 mt-4 md:mt-0">
                    <div className="flex items-center justify-between relative">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 rounded-full z-0"></div>
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[10%] h-1 bg-primary rounded-full z-0"></div>
                      
                      <div className="relative z-10 flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-white">1</div>
                        <span className="text-[10px] lg:text-xs font-bold text-primary whitespace-nowrap absolute -bottom-6">
                          <span className="lg:hidden">Hesap</span>
                          <span className="hidden lg:inline">Hesap Oluştur</span>
                        </span>
                      </div>
                      
                      <div className="relative z-10 flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-200 text-slate-400 flex items-center justify-center font-bold text-sm ring-4 ring-white">2</div>
                        <span className="text-[10px] lg:text-xs font-medium text-slate-400 whitespace-nowrap absolute -bottom-6">
                          <span className="lg:hidden">E-posta</span>
                          <span className="hidden lg:inline">E-postayı Doğrula</span>
                        </span>
                      </div>

                      <div className="relative z-10 flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-200 text-slate-400 flex items-center justify-center font-bold text-sm ring-4 ring-white">3</div>
                        <span className="text-[10px] lg:text-xs font-medium text-slate-400 whitespace-nowrap absolute -bottom-6">
                          <span className="lg:hidden">Çocuk</span>
                          <span className="hidden lg:inline">Çocuğu Ekle</span>
                        </span>
                      </div>

                      <div className="relative z-10 flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-200 text-slate-400 flex items-center justify-center font-bold text-sm ring-4 ring-white">4</div>
                        <span className="text-[10px] lg:text-xs font-medium text-slate-400 whitespace-nowrap absolute -bottom-6">
                          <span className="lg:hidden">Randevu</span>
                          <span className="hidden lg:inline">Deneme Saatini Seç</span>
                        </span>
                      </div>
                    </div>
                  </div>

                 <Card className="w-full max-w-md shadow-2xl bg-white/80 backdrop-blur-lg border-white/50">
                  <CardHeader className="text-center space-y-2 pb-4 pt-5">
                    <CardTitle className="text-2xl md:text-3xl font-bold">Hesap Oluştur</CardTitle>
                    <CardDescription className="text-sm">
                      Deneme dersinizi planlamak için veli hesabınızı oluşturun.
                      <span className="text-xs mt-1 block">Yaklaşık 2 dakika sürer.</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSignUp} className="space-y-3">
                      {/* Honeypot Field - Bots will fill this, real users won't see it */}
                      <div className="absolute opacity-0 -z-50 w-0 h-0 pointer-events-none" aria-hidden="true" tabIndex={-1}>
                        <Label htmlFor="company-website">Website URL</Label>
                        <Input
                          id="company-website"
                          type="text"
                          name="company-website"
                          tabIndex={-1}
                          autoComplete="off"
                          value={honeypot}
                          onChange={(e) => setHoneypot(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-1.5">
                        <Label htmlFor="name">İsim Soyisim</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Adınız Soyadınız"
                          required
                          autoComplete="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          disabled={loading || isSubmitting}
                          suppressHydrationWarning
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="email-signup">Email</Label>
                        <Input
                          id="email-signup"
                          type="email"
                          placeholder="ornek@email.com"
                          required
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value.replace(/\s+/g, ''))}
                          disabled={loading || isSubmitting}
                          suppressHydrationWarning
                        />
                      </div>
                       <div className="space-y-1.5">
                        <Label htmlFor="phone-signup">Telefon Numarası</Label>
                        <div className="grid grid-cols-3 gap-2">
                            <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  aria-expanded={comboboxOpen}
                                  className="col-span-1 flex justify-between items-center px-3 font-normal"
                                  disabled={loading || isSubmitting}
                                >
                                  {selectedCountry ? `${selectedCountry.flag} ${selectedCountry.code}` : "Ülke"}
                                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[300px] p-0" align="start">
                                <div className="p-2 border-b">
                                  <div className="flex items-center px-2 pb-1 text-slate-500">
                                    <Search className="mr-2 h-4 w-4 opacity-50" />
                                    <input
                                      className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                                      placeholder="Ülke veya alan kodu ara..."
                                      value={searchCountry}
                                      onChange={(e) => setSearchCountry(e.target.value)}
                                    />
                                  </div>
                                </div>
                                <div className="max-h-60 overflow-y-auto p-1">
                                  {filteredCountries.map((c) => (
                                    <div
                                      key={c.code}
                                      onClick={() => {
                                        setAreaCode(c.code);
                                        setPhoneNumber('');
                                        setComboboxOpen(false);
                                        setSearchCountry('');
                                      }}
                                      className={`flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-slate-100 ${areaCode === c.code ? "bg-slate-100 font-medium" : ""}`}
                                    >
                                      <span>{c.flag} {c.country}</span>
                                      {areaCode === c.code && <Check className="h-4 w-4" />}
                                    </div>
                                  ))}
                                  {filteredCountries.length === 0 && (
                                    <div className="py-6 text-center text-sm text-slate-500">Sonuç bulunamadı.</div>
                                  )}
                                </div>
                              </PopoverContent>
                            </Popover>
                            <Input
                            id="phone-signup"
                            type="tel"
                            placeholder={selectedCountry.example}
                            required
                            autoComplete="tel-national"
                            value={phoneNumber}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '');
                                if (areaCode === 'other' || val.length <= selectedCountry.maxLength) {
                                  setPhoneNumber(val);
                                }
                            }}
                            disabled={loading || isSubmitting}
                            className="col-span-2"
                            suppressHydrationWarning
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5 flex items-start gap-1.5 leading-snug">
                           <Info className="h-4 w-4 shrink-0 text-slate-400" /> 
                           <span>Deneme dersi hatırlatmalarını ve değerlendirme sonucunu WhatsApp üzerinden bu numaraya göndereceğiz.</span>
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="password-signup">Şifre</Label>
                        <div className="relative">
                          <Input
                            id="password-signup"
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="••••••••"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading || isSubmitting}
                            className="pr-10"
                            suppressHydrationWarning
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                            tabIndex={-1}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">En az 8 karakter kullanın.</p>
                      </div>
                      
                      <div className="flex items-start space-x-2 pt-2">
                        <input
                          type="checkbox"
                          id="terms"
                          checked={acceptedTerms}
                          onChange={(e) => setAcceptedTerms(e.target.checked)}
                          className="mt-1 h-4 w-4 rounded border-slate-300 text-purple-600 focus:ring-purple-600"
                          disabled={loading || isSubmitting}
                        />
                        <Label htmlFor="terms" className="text-sm text-slate-600 font-medium leading-relaxed">
                          <Link href="/kullanici-sozlesmesi" target="_blank" className="text-purple-600 hover:underline">Kullanıcı Sözleşmesi</Link>, <Link href="/gizlilik-politikasi" target="_blank" className="text-purple-600 hover:underline">Gizlilik Politikası</Link> ve <Link href="/gizlilik-politikasi" target="_blank" className="text-purple-600 hover:underline">Çocuk Güvenliği Politikası</Link>’nı okudum ve kabul ediyorum.
                        </Label>
                      </div>

                      <Button
                        type="submit"
                        className="w-full font-bold text-lg py-5 mt-1"
                        disabled={loading || isSubmitting || !acceptedTerms}
                        suppressHydrationWarning
                      >
                        {isSubmitting ? <Loader2 className="animate-spin mr-2"/> : null}
                        {isSubmitting ? 'Kayıt Olunuyor...' : 'Hesap Oluştur ve Devam Et'}
                      </Button>
                    </form>
                    <div className="mt-6 text-center text-sm">
                      Zaten hesabınız var mı?{' '}
                      <button
                        type="button"
                        onClick={handleNavigateToLogin}
                        className="font-medium text-primary hover:underline"
                      >
                        Giriş yapın.
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
           </div>
        </div>
      </div>
    </div>
  );
}
