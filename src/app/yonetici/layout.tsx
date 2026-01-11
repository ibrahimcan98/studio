
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(db, 'users', user.uid);
  }, [user, db]);

  const { data: userData, isLoading: userDataLoading } = useDoc(userDocRef);
  const isAdmin = userData?.role === 'admin';

  useEffect(() => {
    if (!userLoading && !userDataLoading) {
      if (!user || !isAdmin) {
        router.replace('/login');
      }
    }
  }, [user, userLoading, userData, userDataLoading, isAdmin, router]);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/login');
  };

  if (userLoading || userDataLoading || !isAdmin) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const navItems = [
    {
      href: '/yonetici',
      label: 'Anasayfa',
      icon: Home,
    },
    {
      href: '/yonetici/kullanicilar',
      label: 'Kullanıcılar',
      icon: Users,
    },
    {
      href: '/yonetici/kurslar',
      label: 'Kurslar',
      icon: BookOpen,
    },
    {
      href: '/yonetici/ayarlar',
      label: 'Ayarlar',
      icon: Settings,
    },
  ];

  return (
    <TooltipProvider>
      <div className="flex min-h-screen">
        <aside
          className={cn(
            'flex-col border-r bg-background transition-all duration-300',
            isSidebarCollapsed ? 'w-16' : 'w-64'
          )}
        >
          <div className="flex h-20 items-center justify-between border-b p-4">
            {!isSidebarCollapsed && <Logo />}
          </div>
          <nav className="flex-1 space-y-2 p-4">
            {navItems.map((item) => (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                      pathname === item.href && 'bg-muted text-primary',
                      isSidebarCollapsed && 'justify-center'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {!isSidebarCollapsed && <span>{item.label}</span>}
                  </Link>
                </TooltipTrigger>
                {isSidebarCollapsed && (
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </nav>
          <div className="mt-auto p-4 border-t">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full justify-start gap-3',
                    isSidebarCollapsed && 'justify-center'
                  )}
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                  {!isSidebarCollapsed && <span>Çıkış Yap</span>}
                </Button>
              </TooltipTrigger>
              {isSidebarCollapsed && (
                <TooltipContent side="right">
                  <p>Çıkış Yap</p>
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </aside>
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-40 flex h-20 items-center justify-end border-b bg-background px-6">
            <span className="text-sm font-medium text-muted-foreground">
              {userData?.firstName} {userData?.lastName}
            </span>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminPortalLayout>{children}</AdminPortalLayout>;
}
