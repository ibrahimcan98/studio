'use client';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';
import { useUser } from '@/firebase/auth/use-user';
import { getAuth, signOut } from 'firebase/auth';

export default function Header() {
  const { user, loading } = useUser();
  const isLoggedIn = !!user;

  const navLinks = [
    { href: '#parents', label: 'Ebeveyn Portalı' },
    { href: '#teachers', label: 'Öğretmen Portalı' },
    { href: '#pricing', label: 'Paketler' },
  ];

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
  };

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage
              data-ai-hint="woman smiling"
              src={user?.photoURL || "https://picsum.photos/seed/105/40/40"}
              alt={user?.displayName || 'Kullanıcı'}
            />
            <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.displayName || 'Kullanıcı'}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Ebeveyn Sayfası</DropdownMenuItem>
        <DropdownMenuItem>Profil Ayarları</DropdownMenuItem>
        <DropdownMenuItem>Paketlerim</DropdownMenuItem>
        <DropdownMenuItem>Ders Geçmişi</DropdownMenuItem>
        <DropdownMenuItem>Hesap Ayarları</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Çıkış Yap</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center">
        <Link href="/" className="flex items-center space-x-2 mr-6">
          <Logo />
        </Link>

        <div className="flex flex-1 items-center justify-end gap-6">
          <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
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
              {loading ? null : isLoggedIn ? (
                <UserMenu />
              ) : (
                <>
                  <Button variant="ghost" className="font-semibold" asChild>
                    <Link href="/login">Giriş Yap</Link>
                  </Button>
                  <Button className="font-semibold">Ücretsiz Deneme</Button>
                </>
              )}
            </div>
            <div className="md:hidden">
              {loading ? null : isLoggedIn ? (
                <UserMenu />
              ) : (
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
                      <Button asChild className="w-full font-semibold">
                        <Link href="/login">Giriş Yap</Link>
                      </Button>
                       <Button className="w-full font-semibold">Ücretsiz Deneme</Button>
                    </div>
                  </SheetContent>
                </Sheet>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
