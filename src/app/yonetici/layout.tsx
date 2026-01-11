
'use client';

import { useUser, useFirestore, doc, useDoc, useMemoFirebase } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Loader2,
  LogOut,
  Home,
  Users,
  BookOpen,
  Settings,
  TrendingUp,
} from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(db, 'users', user.uid);
  }, [user, db]);

  const { data: userData, isLoading: userDataLoading } = useDoc(userDocRef);

  useEffect(() => {
    // Auth yüklemesi bittiyse ve kullanıcı yoksa direkt login'e at
    if (!authLoading && !user) {
      router.replace('/login');
      return;
    }

    // Kullanıcı verisi yüklendiğinde admin kontrolü yap
    if (!userDataLoading && userData) {
      if (userData.role === 'admin') {
        setIsAuthorized(true);
      } else {
        console.log("Yetki Hatası: Admin rolü bulunamadı, mevcut rol:", userData.role);
        router.replace('/'); // Admin değilse ana sayfaya at
      }
    } else if (!userDataLoading && !userData && user) {
      // Veri yüklemesi bitti, kullanıcı var ama doküman yoksa
      console.error("Hata: Kullanıcı belgesi Firestore'da bulunamadı!");
      // Geliştirme kolaylığı için: Eğer doküman yoksa ama kullanıcı giriş yapmışsa 
      // belki admin olarak kabul etmek isteyebilirsiniz ama güvenlik için şimdilik login'e atıyoruz.
      // router.replace('/login'); 
    }
  }, [user, authLoading, userData, userDataLoading, router]);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/login');
  };

  // YÜKLEME EKRANI: Sadece auth veya veri beklenirken göster
  if (authLoading || (user && userDataLoading && isAuthorized === null)) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-sm font-medium text-muted-foreground">Yönetici Yetkileri Kontrol Ediliyor...</p>
      </div>
    );
  }

  // Yetki yoksa içeriği gösterme
  if (!isAuthorized && user) {
    return (
       <div className="flex h-screen w-full flex-col items-center justify-center bg-white p-6 text-center">
          <div className="bg-red-50 p-4 rounded-full mb-4">
            <Settings className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-xl font-bold mb-2">Erişim Yetkiniz Yok</h2>
          <p className="text-slate-500 mb-6 max-w-xs">Bu sayfaya sadece yöneticiler erişebilir. Hesabınızın 'admin' rolüne sahip olduğundan emin olun.</p>
          <Button onClick={handleLogout} variant="outline">Farklı Hesapla Giriş Yap</Button>
       </div>
    );
  }

  const navItems = [
    { href: '/yonetici', label: 'Dashboard', icon: Home },
    { href: '/yonetici/kullanicilar', label: 'Veliler', icon: Users },
    { href: '/yonetici/satislar', label: 'Satışlar', icon: TrendingUp },
    { href: '/yonetici/kurslar', label: 'Kurslar', icon: BookOpen },
    { href: '/yonetici/ayarlar', label: 'Ayarlar', icon: Settings },
  ];

  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40 font-sans text-slate-900">
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background sm:flex shadow-sm">
            <div className="flex h-20 items-center border-b px-6">
                 <Link href="/yonetici" className="flex items-center gap-2">
                    <Logo />
                </Link>
            </div>
            <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200',
                  pathname === item.href 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-slate-500 hover:text-primary hover:bg-slate-50'
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
           <div className="p-4 border-t">
            <Button
              variant="ghost"
              className='w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors'
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span className="font-bold">Çıkış Yap</span>
            </Button>
          </div>
        </aside>
         <div className="flex flex-col sm:pl-60">
             <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b bg-background/80 backdrop-blur-md px-8 shadow-sm">
                <h1 className="font-bold text-lg text-slate-800 uppercase tracking-tight">
                  {navItems.find(i => i.href === pathname)?.label || 'Yönetici Paneli'}
                </h1>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end mr-2">
                    <span className="text-xs font-black text-slate-900 leading-none">ADMIN</span>
                    <span className="text-[10px] text-slate-400 font-medium">{user?.email}</span>
                  </div>
                  <div className="h-9 w-9 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-sm ring-2 ring-slate-100">
                    {user?.email?.[0].toUpperCase()}
                  </div>
                </div>
            </header>
            <main className="flex-1 p-8 bg-slate-50/50">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminPortalLayout>{children}</AdminPortalLayout>;
}
