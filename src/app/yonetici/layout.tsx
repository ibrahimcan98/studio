
'use client';

import { useUser } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Loader2,
  LogOut,
  Home,
  Users,
  BookOpen,
  Settings,
  Briefcase,
  TrendingUp,
} from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useFirestore, doc, useDoc, useMemoFirebase } from '@/firebase';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  const { user, loading: userLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const pathname = usePathname();

  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(db, 'users', user.uid);
  }, [user, db]);

  const { data: userData, isLoading: userDataLoading } = useDoc(userDocRef);

  useEffect(() => {
    // Wait until both auth and user data loading are complete
    if (userLoading || userDataLoading) {
      return;
    }

    // After loading, if there's no user or the user is not an admin, redirect.
    if (!user || userData?.role !== 'admin') {
      router.replace('/login');
    }
  }, [user, userLoading, userData, userDataLoading, router]);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/login');
  };

  // While loading, or if the user is not an admin yet, show a full-screen loading spinner.
  // This prevents rendering the layout/children before the auth check is complete.
  if (userLoading || userDataLoading || !user || userData?.role !== 'admin') {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
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
      <div className="flex min-h-screen">
        <aside
          className={cn(
            'hidden md:flex flex-col border-r bg-background w-64'
          )}
        >
          <div className="flex h-20 items-center justify-between border-b p-4">
            <Logo />
          </div>
          <nav className="flex-1 space-y-2 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted',
                  pathname === item.href && 'bg-muted text-primary'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="mt-auto p-4 border-t">
            <Button
              variant="ghost"
              className='w-full justify-start gap-3'
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span>Çıkış Yap</span>
            </Button>
          </div>
        </aside>
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-40 flex h-20 items-center justify-end border-b bg-background px-6">
            <span className="text-sm font-medium text-muted-foreground">
              {userData?.firstName} {userData?.lastName}
            </span>
          </header>
          <main className="flex-1 p-6 bg-muted/40">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminPortalLayout>{children}</AdminPortalLayout>;
}
