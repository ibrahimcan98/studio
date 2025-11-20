
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
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Logo } from '@/components/logo';
import { Menu, Loader2, LayoutDashboard, User, Package, History, Settings, LogOut, Crown, ShoppingCart } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader } from '@/components/ui/sheet';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { doc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/cart-context';


export default function Header() {
  const pathname = usePathname();
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLoggedIn = !!user;
  const { cartItems, isCartLoaded } = useCart();
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [showHeader, setShowHeader] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, after hydration
    if (pathname.startsWith('/ogretmen-portali') || pathname.startsWith('/cocuk-modu')) {
      setShowHeader(false);
    } else {
      setShowHeader(true);
    }
  }, [pathname]);


  const handlePortalClick = () => {
    setMobileMenuOpen(false);
    if (isLoggedIn) {
      router.push('/ebeveyn-portali');
    } else {
      router.push('/login');
    }
  };
  
  const handleLinkClick = (href: string) => {
    if(!href) return;
    setMobileMenuOpen(false);
    router.push(href);
  };


  const navLinks = [
    { href: '/ogretmen-giris', label: 'Öğretmen Portalı' },
    { href: '/kurslar', label: 'Kurslar' },
  ];

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/');
  };

  const UserMenu = () => {
    const { user } = useUser();
    const db = useFirestore();
    const userDocRef = useMemoFirebase(() => {
        if (!user || !db) return null;
        return doc(db, 'users', user.uid);
    }, [user, db]);
    const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);
    const isPremium = userData?.isPremium || false;


    if (userLoading) {
      return <div className="h-10 w-10 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
    }
    if (!isLoggedIn) {
       return (
        <Button variant="ghost" className="font-semibold" asChild>
            <Link href="/login">Giriş Yap</Link>
        </Button>
      )
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
        <DropdownMenuContent className="w-64" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-2">
                <div className='flex justify-between items-center'>
                    <p className="text-sm font-medium leading-none">{user?.displayName}</p>
                    {isPremium && (
                        <Badge variant="secondary" className="bg-yellow-400 text-yellow-900 hover:bg-yellow-400/90 text-xs cursor-default">
                            <Crown className="mr-1 h-3 w-3" />
                            Premium
                        </Badge>
                    )}
                </div>
              <p className="text-xs leading-none text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => router.push('/ebeveyn-portali')} className="cursor-pointer">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Ebeveyn Sayfası</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profil Ayarları</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/ebeveyn-portali/paketlerim')} className="cursor-pointer">
              <Package className="mr-2 h-4 w-4" />
              <span>Paketlerim</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <History className="mr-2 h-4 w-4" />
              <span>Ders Geçmişi</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/ebeveyn-portali/uyelik')} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Hesap Ayarları</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Çıkış Yap</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  };

  if (!showHeader) {
    return null; // Don't render anything if the header should be hidden
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center">
        <Link href="/" className="flex items-center space-x-2 mr-auto">
          <Logo />
        </Link>
        
        <div className="flex items-center justify-end gap-2 md:gap-4">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <button onClick={() => router.push(isLoggedIn ? '/ebeveyn-portali' : '/login')} className="transition-colors hover:text-foreground/80 text-foreground/60">
              Ebeveyn Portalı
            </button>
            {navLinks.map((link) => {
              const Comp = link.href ? Link : 'span';
              return (
                <Comp
                  key={link.label}
                  // @ts-ignore
                  href={link.href}
                  className={cn("transition-colors hover:text-foreground/80 text-foreground/60", !link.href && "cursor-default")}
                >
                  {link.label}
                </Comp>
              );
            })}
             <Button variant="ghost" asChild className="relative">
                <Link href="/sepet">
                    <ShoppingCart className="h-5 w-5"/>
                    {isCartLoaded && cartItemCount > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 justify-center p-0">{cartItemCount}</Badge>
                    )}
                    <span className="sr-only">Sepeti Görüntüle</span>
                </Link>
            </Button>
          </nav>
          
            <Button variant="secondary" className="font-semibold hidden md:inline-flex">Ücretsiz Deneme</Button>

            <div className="hidden md:flex items-center gap-2">
              <UserMenu />
           </div>

          <div className="md:hidden flex items-center gap-2">
             <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Menüyü aç</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right">
                    <SheetHeader className="border-b pb-4">
                        <SheetClose asChild>
                          <Link href="/" className="flex items-center space-x-2">
                            <Logo />
                          </Link>
                        </SheetClose>
                    </SheetHeader>
                    <div className="flex flex-col gap-y-6 pt-6 h-full">
                        <nav className="flex flex-col gap-4">
                            <button onClick={handlePortalClick} className="text-lg font-medium transition-colors hover:text-foreground/80 text-left">
                                Ebeveyn Portalı
                            </button>
                            {navLinks.map((link) => (
                                <button
                                    key={link.label}
                                    onClick={() => handleLinkClick(link.href)}
                                    disabled={!link.href}
                                    className="text-lg font-medium transition-colors hover:text-foreground/80 text-left disabled:text-foreground/60 disabled:cursor-default"
                                >
                                    {link.label}
                                </button>
                            ))}
                             <button onClick={() => handleLinkClick('/sepet')} className="text-lg font-medium transition-colors hover:text-foreground/80 text-left">
                                Sepet ({isCartLoaded ? cartItemCount : 0})
                            </button>
                            <Button variant="secondary" className="w-full justify-center p-2 h-auto font-medium text-lg" onClick={() => {}}>
                                Ücretsiz Deneme
                            </Button>
                             {!isLoggedIn && (
                                 <Button variant="outline" className="w-full justify-center p-2 h-auto font-medium text-lg" onClick={() => handleLinkClick("/login")}>
                                    Giriş Yap
                                 </Button>
                            )}
                        </nav>
                    </div>
                </SheetContent>
            </Sheet>
            <UserMenu />
           </div>
        </div>
      </div>
    </header>
  );
}
