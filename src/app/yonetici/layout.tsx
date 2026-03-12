
'use client';

import { useUser, useFirestore, doc, useDoc, useMemoFirebase } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Loader2,
  LogOut,
  Home,
  Users,
  TrendingUp,
  ShieldAlert,
  Inbox,
  Baby
} from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipProvider,
} from '@/components/ui/tooltip';

function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  const userDocRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, 'users', user.uid);
  }, [user, db]);

  const { data: userData, isLoading: userDataLoading } = useDoc(userDocRef);

  useEffect(() => {
    // Component mount olana kadar veya auth yüklenene kadar bekle
    if (!isMounted || authLoading) return;

    // Oturum kapalıysa girişe yönlendir
    if (!user) {
      router.replace('/login');
      return;
    }

    // Kullanıcı varsa ama profil verisi henüz yüklenmemişse bekle
    // userDataLoading true iken veya veri henüz gelmemişken yönlendirme yapma
    if (userDataLoading || !userData) return;

    // Veri yüklendiğinde admin değilse ana sayfaya yönlendir
    if (userData.role !== 'admin') {
      router.replace('/');
    }
  }, [user, authLoading, userData, userDataLoading, router, isMounted]);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/login');
  };

  // Yükleme ekranı: isMounted false iken, auth yüklenirken veya user varken userData yüklenirken göster
  if (!isMounted || authLoading || (user && (userDataLoading || !userData))) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Panel Hazırlanıyor...</p>
      </div>
    );
  }

  // Yetki kontrolü (Yönlendirme gerçekleşene kadar güvenlik amaçlı)
  if (!user || userData?.role !== 'admin') {
    return (
       <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 p-6 text-center">
          <div className="bg-red-100 p-4 rounded-full mb-6"><ShieldAlert className="h-10 w-10 text-red-600" /></div>
          <h2 className="text-2xl font-bold mb-2">Yönetici Yetkisi Gereklidir</h2>
          <p className="text-muted-foreground max-w-sm mx-auto">Bu sayfaya erişmek için admin yetkisine sahip olmanız gerekmektedir.</p>
          <div className="flex gap-4 mt-8">
             <Button onClick={() => router.push('/')} variant="outline">Ana Sayfaya Dön</Button>
             <Button onClick={handleLogout} className="bg-slate-900">Farklı Hesapla Giriş Yap</Button>
          </div>
       </div>
    );
  }

  const navItems = [
    { href: '/yonetici', label: 'Dashboard', icon: Home },
    { href: '/yonetici/inbox', label: 'Inbox', icon: Inbox },
    { href: '/yonetici/kullanicilar', label: 'Veliler', icon: Users },
    { href: '/yonetici/ogrenciler', label: 'Öğrenciler', icon: Baby },
  ];

  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40 font-sans text-slate-900">
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex shadow-sm">
            <div className="flex h-20 items-center border-b px-8"><Link href="/yonetici" className="flex items-center gap-2"><Logo /></Link></div>
            <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}
                className={cn('flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200',
                  pathname === item.href ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:text-primary hover:bg-slate-50'
                )}>
                <item.icon className="h-5 w-5" /><span>{item.label}</span>
              </Link>
            ))}
          </nav>
           <div className="p-4 border-t">
            <Button variant="ghost" className='w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl font-bold' onClick={handleLogout}>
              <LogOut className="h-5 w-5" /><span>Çıkış Yap</span>
            </Button>
          </div>
        </aside>
         <div className="flex flex-col sm:pl-64">
             <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b bg-background/80 backdrop-blur-md px-10">
                <h1 className="font-bold text-lg text-slate-800 uppercase tracking-tight">{navItems.find(i => i.href === pathname)?.label || 'Yönetici'}</h1>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end mr-2">
                    <span className="text-xs font-black text-slate-900 leading-none">ADMIN</span>
                    <span className="text-[10px] text-slate-400 font-medium">{user.email}</span>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-sm ring-4 ring-slate-100">{user.email?.[0].toUpperCase()}</div>
                </div>
            </header>
            <main className="flex-1 p-10 bg-slate-50/50">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminPortalLayout>{children}</AdminPortalLayout>;
}
