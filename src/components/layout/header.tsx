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
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useUser } from '@/firebase';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


export default function Header() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLoggedIn = !!user;

  const handlePortalClick = () => {
    setMobileMenuOpen(false);
    if (isLoggedIn) {
      router.push('/ebeveyn-portali');
    } else {
      router.push('/login');
    }
  };
  
  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    router.push(href);
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

  const UserMenu = () => {
    if (loading) {
      return <div className="h-10 w-10 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
    }
    if (!isLoggedIn) {
      return null;
    }
    return (
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
    )
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center">
        <Link href="/" className="flex items-center space-x-2 mr-6">
          <Logo />
        </Link>

        <nav className="hidden md:flex flex-1 items-center gap-6 text-sm font-medium">
            <button onClick={() => router.push(isLoggedIn ? '/ebeveyn-portali' : '/login')} className="transition-colors hover:text-foreground/80 text-foreground/60">
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

        <div className="flex flex-1 md:flex-none items-center justify-end gap-2 md:gap-4">
          {loading ? (
             <div className="h-10 w-10 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : isLoggedIn ? (
            <>
              <UserMenu />
            </>
          ) : (
            <>
              <Button variant="ghost" className="font-semibold hidden sm:inline-flex" asChild>
                <Link href="/login">Giriş Yap</Link>
              </Button>
            </>
          )}
            
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Menüyü aç</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right">
                    <div className="flex flex-col gap-y-6 pt-10">
                        <SheetClose asChild>
                          <Link href="/" className="flex items-center space-x-2">
                            <Logo />
                          </Link>
                        </SheetClose>
                        <nav className="flex flex-col gap-4">
                            <button onClick={handlePortalClick} className="text-lg font-medium transition-colors hover:text-foreground/80 text-left">
                                Ebeveyn Portalı
                            </button>
                            {navLinks.map((link) => (
                                <button
                                    key={link.label}
                                    onClick={() => handleLinkClick(link.href)}
                                    className="text-lg font-medium transition-colors hover:text-foreground/80 text-left"
                                >
                                    {link.label}
                                </button>
                            ))}
                        </nav>
                        <div className="flex flex-col gap-4">
                          {!isLoggedIn ? (
                              <>
                                <Button variant="outline" className="w-full font-semibold text-lg" onClick={() => handleLinkClick("/login")}>
                                  Giriş Yap
                                </Button>
                              </>
                          ) : (
                             <>
                               <Button variant="outline" className="w-full font-semibold text-lg" onClick={handleLogout}>Çıkış Yap</Button>
                             </>
                          )}
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </header>
  );
}
