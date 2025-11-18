'use client';
import Link from 'next/link';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Logo } from '@/components/logo';
import { Menu, Loader2 } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useUser } from '@/firebase';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';


export default function Header() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const isLoggedIn = !!user;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handlePortalClick = () => {
    if (isLoggedIn) {
      router.push('/ebeveyn-portali');
    } else {
      router.push('/login');
    }
  };

  const navLinks = [
    { href: '#teachers', label: 'Öğretmen Portalı' },
    { href: '#pricing', label: 'Paketler' },
  ];

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/');
  };

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.displayName}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/ebeveyn-portali')}>Ebeveyn Sayfası</DropdownMenuItem>
        <DropdownMenuItem>Profil Ayarları</DropdownMenuItem>
        <DropdownMenuItem>Paketlerim</DropdownMenuItem>
        <DropdownMenuItem>Ders Geçmişi</DropdownMenuItem>
        <DropdownMenuItem>Hesap Ayarları</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Çıkış Yap</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderAuthButtons = () => {
    if (!isClient || loading) {
        return <div className="h-10 w-40 flex items-center justify-end"><Loader2 className="h-6 w-6 animate-spin" /></div>;
    }

    if (isLoggedIn) {
        return (
            <>
                <Button className="font-semibold">Ücretsiz Deneme</Button>
                <UserMenu />
            </>
        );
    }

    return (
        <>
             <Button variant="ghost" className="font-semibold" asChild>
              <Link href="/login">Giriş Yap</Link>
            </Button>
            <Button className="font-semibold">Ücretsiz Deneme</Button>
        </>
    );
  }

  const renderMobileAuth = () => {
      if (!isClient || loading) {
          return <Loader2 className="h-6 w-6 animate-spin" />;
      }
      if (isLoggedIn) {
          return <UserMenu />;
      }
      return (
          <Sheet>
              <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Menüyü aç</span>
                  </Button>
              </SheetTrigger>
              <SheetContent side="right">
                  <div className="flex flex-col gap-y-6 pt-10">
                      <Logo />
                      <nav className="flex flex-col gap-4">
                          <button onClick={handlePortalClick} className="text-lg font-medium transition-colors hover:text-foreground/80 text-left">
                              Ebeveyn Portalı
                          </button>
                          {navLinks.map((link) => (
                              <Link
                                  key={link.label}
                                  href={link.href}
                                  className="text-lg font-medium transition-colors hover:text-foreground/80"
                              >
                                  {link.label}
                              </Link>
                          ))}
                      </nav>
                      <Button className="w-full font-semibold">Ücretsiz Deneme</Button>
                      <Button variant="ghost" className="w-full font-semibold" asChild>
                          <Link href="/login">Giriş Yap</Link>
                      </Button>
                  </div>
              </SheetContent>
          </Sheet>
      );
  }


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center">
        <Link href="/" className="flex items-center space-x-2 mr-6">
          <Logo />
        </Link>

        <div className="flex flex-1 items-center justify-end gap-6">
          <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
             <button onClick={handlePortalClick} className="transition-colors hover:text-foreground/80 text-foreground/60">
              Ebeveyn Portalı
            </button>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              {renderAuthButtons()}
            </div>
            <div className="md:hidden">
              {renderMobileAuth()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
