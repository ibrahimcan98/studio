'use client';

import { useUser } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2, LogOut, Calendar, Users } from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const allowedTeacherEmails = ['ibrahimcan@turkcocukakademisii.com', 'teacher@turkcocukakademisi.com'];

function TeacherPortalLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Wait until loading is finished
    if (loading) return;

    // If there is no user, or the user is not an allowed teacher, redirect
    const isAuthorizedTeacher = user && user.email && allowedTeacherEmails.includes(user.email);
    if (!isAuthorizedTeacher) {
      router.replace('/ogretmen-giris');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/ogretmen-giris');
  };
  
  // While loading, or if user is not yet determined to be a teacher, show loading screen
  if (loading || !user || !(user.email && allowedTeacherEmails.includes(user.email))) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const navItems = [
    {
      href: '/ogretmen-portali/takvim',
      label: 'Takvim',
      icon: Calendar
    },
    {
      href: '/ogretmen-portali/ogrenciler',
      label: 'Öğrencilerim',
      icon: Users,
      disabled: true
    }
  ];
  
  // If we reach here, user is an authorized teacher
  return (
    <div className="min-h-screen bg-muted/40">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-20 items-center justify-between">
                <Link href="/ogretmen-portali" className="flex items-center space-x-2 mr-auto">
                    <Logo />
                </Link>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
                        {user?.displayName || user?.email}
                    </span>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Çıkış Yap
                    </Button>
                </div>
            </div>
             <div className="border-b">
                <nav className="container flex items-center">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.disabled ? '#' : item.href}
                            className={cn(
                                'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors',
                                pathname === item.href
                                    ? 'text-primary border-b-2 border-primary'
                                    : 'text-muted-foreground hover:text-primary',
                                item.disabled ? 'cursor-not-allowed opacity-50' : ''
                            )}
                            aria-disabled={item.disabled}
                            tabIndex={item.disabled ? -1 : undefined}
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

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TeacherPortalLayout>{children}</TeacherPortalLayout>
}
