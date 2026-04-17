
'use client';

import { useUser, useFirestore, doc, useDoc, useMemoFirebase, useCollection } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useRef, useMemo } from 'react';
import {
  Loader2,
  LogOut,
  Home,
  Users,
  ShieldAlert,
  Inbox,
  Baby,
  CreditCard,
  Activity,
  Presentation,
  Trophy,
  Ticket,
  Calendar,
  Menu,
  PhoneCall
} from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  TooltipProvider,
} from '@/components/ui/tooltip';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  const userDocRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, 'users', user.uid);
  }, [user, db]);

  const { data: userData, isLoading: userDataLoading } = useDoc(userDocRef);

  const allNavItems = [
    { id: 'dashboard', href: '/yonetici', label: 'Genel Bakış', icon: Home },
    { id: 'canli-takip', href: '/yonetici/canli-takip', label: 'Canlı İzle', icon: Activity },
    { id: 'inbox', href: '/yonetici/inbox', label: 'Mesajlar', icon: Inbox },
    { id: 'satislar', href: '/yonetici/satislar', label: 'Satışlar', icon: CreditCard },
    { id: 'ogretmenler', href: '/yonetici/ogretmenler', label: 'Öğretmenler', icon: Presentation },
    { id: 'dersler', href: '/yonetici/dersler', label: 'Dersler', icon: Calendar },
    { id: 'kullanicilar', href: '/yonetici/kullanicilar', label: 'Veliler', icon: Users },
    { id: 'aramalar', href: '/yonetici/aramalar', label: 'Aramalar', icon: PhoneCall },
    { id: 'ogrenciler', href: '/yonetici/ogrenciler', label: 'Öğrenciler', icon: Baby },
    { id: 'indirimler', href: '/yonetici/indirimler', label: 'İndirimler', icon: Ticket },
    { id: 'puan-merkezi', href: '/yonetici/puan-merkezi', label: 'Puan Merkezi', icon: Trophy },
    { id: 'admin-yonetimi', href: '/yonetici/admin-yonetimi', label: 'Admin Yönetimi', icon: ShieldAlert },
  ];

  const navItems = useMemo(() => {
    const isUltraAdmin = user?.email === 'tubakodak@turkcocukakademisi.com' || user?.email === 'ibrahimcanonder_98@hotmail.com';

    // Core filtering based on permissions
    let items = allNavItems;
    
    if (userData?.permissions) {
      items = allNavItems.filter((item: any) => 
        item.id === 'dashboard' || 
        item.id === 'admin-yonetimi' || // Ensure it potentially stays if we are ultra admin
        userData.permissions.includes(item.id)
      );
    }

    // FINAL STRICT CHECK: Only Ultra Admin sees Admin Management
    return items.filter((item: any) => {
        if (item.id === 'admin-yonetimi') return isUltraAdmin;
        return true;
    });
  }, [userData?.permissions, user?.email]);

  useEffect(() => {
    if (!isMounted || authLoading) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (userDataLoading || !userData) return;
    if (userData.role !== 'admin') {
      router.replace('/');
    }
  }, [user, authLoading, userData, userDataLoading, router, isMounted]);

  // UNREAD MESSAGES NOTIFICATION
  const unreadQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'conversations'), where('status', '==', 'open'));
  }, [db]);
  const { data: unreadConvs } = useCollection(unreadQuery);
  const unreadCount = unreadConvs?.length || 0;
  const prevUnreadCount = useRef(0);
  const isInitialFetch = useRef(true);

  useEffect(() => {
      if (typeof unreadConvs === 'undefined') return;

      if (isInitialFetch.current) {
          isInitialFetch.current = false;
          prevUnreadCount.current = unreadCount;
          return;
      }

      // Play sound only when we go from 0 unread to >0 unread (1 time per emptiness)
      if (unreadCount > 0 && prevUnreadCount.current === 0) {
          try {
              const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
              if (AudioContext) {
                  const ctx = new AudioContext();
                  const osc = ctx.createOscillator();
                  const gainNode = ctx.createGain();
                  
                  osc.connect(gainNode);
                  gainNode.connect(ctx.destination);
                  
                  // Soft melodic ding
                  osc.type = 'sine';
                  osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
                  osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.6);
                  
                  gainNode.gain.setValueAtTime(0, ctx.currentTime);
                  gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
                  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
                  
                  osc.start(ctx.currentTime);
                  osc.stop(ctx.currentTime + 0.6);
              }
          } catch(e) {
              console.error("Ses çalınamadı:", e);
          }
      }
      prevUnreadCount.current = unreadCount;
  }, [unreadCount, unreadConvs]);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/login');
  };

  if (!isMounted || authLoading || (user && (userDataLoading || !userData))) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">Panel Hazırlanıyor...</p>
      </div>
    );
  }

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



  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40 font-sans text-slate-900">
        {/* Desktop Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex shadow-sm">
            <div className="flex h-20 items-center border-b px-6">
              <Link href="/yonetici" className="flex items-center gap-2 overflow-hidden">
                <Logo className="text-lg" />
              </Link>
            </div>
            <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item: any) => (
              <Link key={item.href} href={item.href}
                className={cn('flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200',
                  pathname === item.href ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:text-primary hover:bg-slate-50'
                )}>
                <item.icon className="h-5 w-5 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.href === '/yonetici/inbox' && unreadCount > 0 && (
                  <Badge className="ml-auto bg-red-500 hover:bg-red-600 text-white border-none rounded-full px-1.5 min-w-[20px] h-5 py-0 flex items-center justify-center text-[10px] shadow-sm">
                    +{unreadCount}
                  </Badge>
                )}
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
             <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b bg-background/80 backdrop-blur-md px-10 sm:px-10 px-4">
                <div className="flex items-center gap-4">
                  {/* Mobile Menu Trigger */}
                  <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="sm:hidden">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Menüyü Aç</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-72">
                      <SheetHeader className="sr-only">
                        <SheetTitle>Yönetici Paneli Menüsü</SheetTitle>
                      </SheetHeader>
                      <div className="flex h-20 items-center border-b px-8 mt-4"><Logo /></div>
                      <nav className="flex-1 space-y-1 p-4">
                        {navItems.map((item: any) => (
                          <Link 
                            key={item.href} 
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn('flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200',
                              pathname === item.href ? 'bg-primary/10 text-primary' : 'text-slate-500 hover:text-primary hover:bg-slate-50'
                            )}>
                            <item.icon className="h-5 w-5 shrink-0" />
                            <span className="flex-1">{item.label}</span>
                            {item.href === '/yonetici/inbox' && unreadCount > 0 && (
                              <Badge className="ml-auto bg-red-500 hover:bg-red-600 text-white border-none rounded-full px-1.5 min-w-[20px] h-5 py-0 flex items-center justify-center text-[10px] shadow-sm">
                                +{unreadCount}
                              </Badge>
                            )}
                          </Link>
                        ))}
                      </nav>
                      <div className="p-4 border-t absolute bottom-0 w-full bg-background">
                        <Button variant="ghost" className='w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl font-bold' onClick={handleLogout}>
                          <LogOut className="h-5 w-5" /><span>Çıkış Yap</span>
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                  <h1 className="font-bold text-lg text-slate-800 uppercase tracking-tight">{navItems.find((i: any) => i.href === pathname)?.label || 'Yönetici'}</h1>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end mr-2 hidden xs:flex">
                    <span className="text-xs font-black text-slate-900 leading-none">ADMIN</span>
                    <span className="text-[10px] text-slate-400 font-medium">{user.email}</span>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-sm ring-4 ring-slate-100">{user.email?.[0].toUpperCase()}</div>
                </div>
            </header>
            <main className="flex-1 p-4 sm:p-10 bg-slate-50/50">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminPortalLayout>{children}</AdminPortalLayout>;
}
