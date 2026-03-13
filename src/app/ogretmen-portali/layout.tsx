
'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, LogOut, Calendar, Users, Briefcase, User } from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { doc } from 'firebase/firestore';

function TeacherPortalLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const pathname = usePathname();

  const userDocRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, 'users', user.uid);
  }, [user, db]);

  const { data: userData, isLoading: userDataLoading } = useDoc(userDocRef);

  useEffect(() => {
    // Veriler hala yükleniyorsa bekleyelim
    if (authLoading || userDataLoading) return;

    // Eğer oturum yoksa veya kullanıcı öğretmen değilse yönlendir
    if (!user) {
      router.replace('/ogretmen-giris');
      return;
    }

    if (userData && userData.role !== 'teacher') {
      router.replace('/login');
    }
  }, [user, authLoading, userData, userDataLoading, router]);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/ogretmen-giris');
  };
  
  // Yükleme ekranı: Sadece gerçekten yükleme varsa veya yetki henüz doğrulanmadıysa göster
  if (authLoading || userDataLoading || !user || (userData && userData.role !== 'teacher')) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground animate-pulse">Yetki kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: '/ogretmen-portali/takvim', label: 'Takvim', icon: Calendar },
    { href: '/ogretmen-portali/derslerim', label: 'Derslerim', icon: Briefcase },
    { href: '/ogretmen-portali/ogrencilerim', label: 'Öğrencilerim', icon: Users },
    { href: '/ogretmen-portali/profil', label: 'Profilim', icon: User }
  ];
  
  return (
    <div className="min-h-screen bg-muted/40">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-20 items-center justify-between">
                <Link href="/ogretmen-portali" className="flex items-center space-x-2 mr-auto">
                    <Logo />
                </Link>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end hidden sm:flex">
                        <span className="text-sm font-bold text-slate-900 leading-none">
                            {userData?.firstName} {userData?.lastName}
                        </span>
                        <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Öğretmen</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleLogout} className="rounded-xl font-bold">
                        <LogOut className="mr-2 h-4 w-4" />
                        Çıkış Yap
                    </Button>
                </div>
            </div>
             <div className="border-b bg-white">
                <nav className="container flex items-center">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all',
                                pathname === item.href
                                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                                    : 'text-muted-foreground hover:text-primary hover:bg-slate-50'
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
        <main>{children}</main>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <TeacherPortalLayout>{children}</TeacherPortalLayout>
}
