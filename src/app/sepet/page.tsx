
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, ShoppingCart, ArrowLeft, CreditCard, Tag, Minus, Plus, XCircle, Loader2, AlertCircle } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const getCourseCode = (courseId: string) => {
    switch (courseId) {
        case 'baslangic': return 'B';
        case 'konusma': return 'K';
        case 'gelisim': return 'G';
        case 'akademik': return 'A';
        case 'gcse': return 'GCSE';
        default: return '';
    }
}

export default function SepetPage() {
    const { cartItems, updateQuantity, removeFromCart, cartTotal, applyCoupon, discountAmount, finalTotal, appliedCoupon, removeCoupon, clearCart } = useCart();
    const [coupon, setCoupon] = useState('');
    const { toast } = useToast();
    const { user } = useUser();
    const db = useFirestore();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [step, setStep] = useState<'cart' | 'payment'>('cart');

    const handleApplyCoupon = () => {
        if (!coupon) return;
        const success = applyCoupon(coupon);
        if (success) {
            toast({
                title: 'Kupon Uygulandı!',
                description: `"${coupon.toUpperCase()}" koduyla %20 indirim kazandınız.`,
                className: 'bg-green-500 text-white'
            })
        } else {
            toast({
                variant: 'destructive',
                title: 'Geçersiz Kupon',
                description: 'Girdiğiniz kupon kodu geçerli değil.',
            })
        }
    }

    const handleProceedToPayment = () => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Giriş Gerekli', description: 'Ödeme yapmak için giriş yapmalısınız.' });
            router.push('/login?redirect=/sepet');
            return;
        }
        if (!user.emailVerified) {
            toast({
                variant: 'destructive',
                title: 'E-posta Doğrulanmadı',
                description: 'Satın alma işlemine devam etmek için lütfen e-posta adresinizi doğrulayın. Profil ayarlarından doğrulama e-postasını tekrar gönderebilirsiniz.',
                duration: 8000
            });
            router.push('/ebeveyn-portali/ayarlar');
            return;
        }
        // Skip payment form for testing
        handleCheckout();
    }
    
    const handleCheckout = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!user || !db) return;

        setIsProcessing(true);
        const userDocRef = doc(db, "users", user.uid);

        try {
            // Simulate payment processing delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            const totalLessonsToAdd = cartItems.reduce((total, item) => {
                const lessons = parseInt(item.description.split(' ')[0], 10);
                return total + (item.quantity * lessons);
            }, 0);

            const newPackages = cartItems.flatMap(item => {
                 const [courseId] = item.id.split('-');
                 const lessons = parseInt(item.description.split(' ')[0], 10);
                 const courseCode = getCourseCode(courseId);
                 return Array(item.quantity).fill(`${lessons}${courseCode}`);
            });

            await updateDoc(userDocRef, {
                enrolledPackages: arrayUnion(...newPackages),
                remainingLessons: increment(totalLessonsToAdd),
            });
            
            clearCart();

            toast({
                title: 'Ödeme Başarılı!',
                description: 'Dersleriniz hesabınıza eklendi. Paketlerim sayfasından atama yapabilirsiniz.',
                className: 'bg-green-500 text-white'
            });

            router.push('/ebeveyn-portali/paketlerim');

        } catch (error) {
            console.error("Checkout error:", error);
            toast({ variant: 'destructive', title: 'Hata', description: 'Ödeme sırasında bir sorun oluştu.' });
        } finally {
            setIsProcessing(false);
        }
    };


    return (
        <div className="bg-muted/30 min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8">
            <div className="container max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <ShoppingCart className="w-8 h-8 text-primary" />
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                        {step === 'cart' ? 'Alışveriş Sepetim' : 'Ödeme Bilgileri'}
                    </h1>
                </div>

                {step === 'cart' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                        {/* Cart Items Section */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Sepetinizdeki Ürünler ({cartItems.length})</CardTitle>
                                </CardHeader>
                                <CardContent className="divide-y">
                                    {cartItems.length > 0 ? (
                                        cartItems.map(item => (
                                            <div key={item.id} className="flex flex-col sm:flex-row items-start gap-6 py-4">
                                                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <Image src={item.image} alt={item.name} width={60} height={60} className="object-contain" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg">{item.name}</h3>
                                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                                    <div className="flex items-center gap-2 mt-3">
                                                        <Label htmlFor={`quantity-${item.id}`}>Miktar:</Label>
                                                        <div className="flex items-center gap-1 border rounded-md">
                                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                                                                <Minus className="h-4 w-4"/>
                                                            </Button>
                                                            <Input
                                                                id={`quantity-${item.id}`}
                                                                type="number"
                                                                value={item.quantity}
                                                                readOnly
                                                                className="h-8 w-12 text-center border-0 focus-visible:ring-0"
                                                            />
                                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                                <Plus className="h-4 w-4"/>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2 ml-auto">
                                                    <p className="font-bold text-lg">€{(item.price * item.quantity).toFixed(2)}</p>
                                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => removeFromCart(item.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 text-muted-foreground">
                                            <ShoppingCart className="w-12 h-12 mx-auto mb-4" />
                                            <p>Sepetiniz şu anda boş.</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                            <Button variant="link" asChild className="mt-4 text-primary">
                                <Link href="/kurslar">
                                    <ArrowLeft className="mr-2" />
                                    Alışverişe Devam Et
                                </Link>
                            </Button>
                        </div>

                        {/* Order Summary Section */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-28">
                                <CardHeader>
                                    <CardTitle>Sipariş Özeti</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>Ara Toplam</span>
                                            <span>€{cartTotal.toFixed(2)}</span>
                                        </div>
                                        {appliedCoupon && (
                                            <div className="flex justify-between text-green-600">
                                                <span>İndirim (%20)</span>
                                                <span>-€{discountAmount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <Separator />
                                        <div className="flex justify-between font-bold text-lg">
                                            <span>Toplam</span>
                                            <span>€{finalTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <Separator />
                                    {appliedCoupon ? (
                                        <div className="flex items-center justify-between gap-2">
                                            <Badge>
                                                <Tag className="w-3 h-3 mr-1"/>
                                                {appliedCoupon}
                                            </Badge>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={removeCoupon}>
                                                <XCircle className="w-4 h-4"/>
                                            </Button>
                                        </div>
                                    ): (
                                        <div className="space-y-2">
                                            <Label htmlFor="coupon">Kupon Kodu</Label>
                                            <div className="flex gap-2">
                                                <Input id="coupon" placeholder="İndirim kodu girin" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
                                                <Button variant="outline" onClick={handleApplyCoupon}>Uygula</Button>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full text-lg h-12" disabled={cartItems.length === 0 || isProcessing} onClick={handleProceedToPayment}>
                                        {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <CreditCard className="mr-2" />}
                                        {isProcessing ? 'İşleniyor...' : 'Satın Al'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                )}

                {step === 'payment' && (
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                        <div className="lg:col-span-2">
                             <form onSubmit={handleCheckout}>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Kredi Kartı Bilgileri</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="card-number">Kart Numarası</Label>
                                            <Input id="card-number" placeholder="•••• •••• •••• ••••" required />
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="space-y-2 col-span-2">
                                                <Label htmlFor="expiry-date">Son Kullanma Tarihi</Label>
                                                <Input id="expiry-date" placeholder="AA / YY" required />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="cvc">CVC</Label>
                                                <Input id="cvc" placeholder="•••" required />
                                            </div>
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="card-holder">Kart Sahibi</Label>
                                            <Input id="card-holder" placeholder="Ad Soyad" required />
                                        </div>
                                    </CardContent>
                                </Card>
                                 <div className="flex justify-between items-center mt-6">
                                     <Button variant="link" onClick={() => setStep('cart')}>
                                        <ArrowLeft className="mr-2" />
                                        Sepete Dön
                                    </Button>
                                     <Button size="lg" type="submit" className="text-lg h-12" disabled={isProcessing}>
                                        {isProcessing ? (
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        ) : (
                                            <CreditCard className="mr-2" />
                                        )}
                                        {isProcessing ? 'İşleniyor...' : `€${finalTotal.toFixed(2)} Ödemeyi Tamamla`}
                                    </Button>
                                </div>
                             </form>
                        </div>
                         <div className="lg:col-span-1">
                             <Card className="sticky top-28">
                                <CardHeader>
                                    <CardTitle>Sipariş Özeti</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     {cartItems.map(item => (
                                         <div key={item.id} className="flex justify-between items-center text-sm">
                                             <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-xs text-muted-foreground">{item.description}</p>
                                             </div>
                                             <p>x{item.quantity}</p>
                                             <p className="font-semibold">€{(item.price * item.quantity).toFixed(2)}</p>
                                         </div>
                                     ))}
                                     <Separator/>
                                     <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Ara Toplam</span>
                                            <span>€{cartTotal.toFixed(2)}</span>
                                        </div>
                                        {appliedCoupon && (
                                            <div className="flex justify-between text-sm text-green-600">
                                                <span>İndirim ({appliedCoupon})</span>
                                                <span>-€{discountAmount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <Separator />
                                        <div className="flex justify-between font-bold text-lg">
                                            <span>Toplam</span>
                                            <span>€{finalTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
