
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, ShoppingCart, ArrowLeft, CreditCard, Tag, Minus, Plus, XCircle, Loader2, Globe, Wallet } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import { useCart, currencyDetails } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { useUser, useFirestore, useMemoFirebase, useDoc, useCollection } from '@/firebase';
import { doc, updateDoc, arrayUnion, increment, collection, addDoc, serverTimestamp, query, where, getDocs, getDoc } from 'firebase/firestore';
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
    const { 
        cartItems, updateQuantity, removeFromCart, cartTotal, 
        applyStandardDiscount, discountAmount, finalTotal, appliedCoupon, appliedCouponData, referrerId,
        removeCoupon, applyReferral, appliedReferralCode, removeReferral, clearCart, selectedCurrency, exchangeRates 
    } = useCart();
    
    const [coupon, setCoupon] = useState('');
    const [referralInput, setReferralInput] = useState('');
    const { toast } = useToast();
    const { user } = useUser();
    const db = useFirestore();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [mounted, setMounted] = useState(false);
    
    // Auto-apply public campaign coupon
    const publicCouponsQuery = useMemoFirebase(() => db ? query(collection(db, 'coupons'), where('isPublicDisplay', '==', true), where('isActive', '==', true)) : null, [db]);
    const { data: publicCoupons } = useCollection(publicCouponsQuery);

    // Redundant auto-apply logic removed as CartProvider now handles multi-discounts automatically for each item.
    // Also removed to prevent setting a single 'appliedCouponData' when multiple targeted public discounts are active.
    
    // Bakiye Logic
    const userDocRef = useMemoFirebase(() => (db && user?.uid) ? doc(db, 'users', user.uid) : null, [db, user?.uid]);
    const { data: userData } = useDoc(userDocRef);
    
    // SUSPENDED: Points Center & Wallet Balance is temporarily disabled
    // const balanceGbp = userData?.walletBalanceGbp ?? (userData?.walletBalanceEur || 0);
    const balanceGbp = 0;
    
    const [useBalance, setUseBalance] = useState(false);
    
    const balanceUsedGbp = useBalance ? Math.min(balanceGbp, finalTotal) : 0;
    const payableTotalGbp = finalTotal - balanceUsedGbp;

    useEffect(() => {
        setMounted(true);
    }, []);

    const rate = exchangeRates[selectedCurrency] || 1;
    const symbol = currencyDetails[selectedCurrency]?.symbol || selectedCurrency;

    const formatPrice = (priceGbp: number) => {
        return (priceGbp * rate).toFixed(2);
    };

    const handleApplyNormalCoupon = async () => {
        if (!coupon) return;
        if (!db) return;
        
        try {
            const couponRef = doc(db, 'coupons', coupon.toUpperCase());
            const couponSnap = await getDoc(couponRef);
            
            if (couponSnap.exists() && couponSnap.data().isActive) {
                 const data = couponSnap.data();
                 const pct = data.discountPct;
                 applyStandardDiscount(
                     coupon.toUpperCase(), 
                     pct, 
                     data.applicableCourseId, 
                     data.applicablePackage
                 );
                 toast({
                     title: 'Kupon Uygulandı!',
                     description: `"${coupon.toUpperCase()}" koduyla %${(pct*100).toFixed(0)} indirim kazandınız.`,
                     className: 'bg-green-500 text-white'
                 });
            } else {
                 toast({
                     variant: 'destructive',
                     title: 'Geçersiz Kupon',
                     description: 'Girdiğiniz indirim kodu geçerli değil veya süresi dolmuş.',
                 });
            }
        } catch (error) {
             console.error("Coupon fetch error:", error);
             toast({ variant: 'destructive', title: 'Hata', description: 'Kupon doğrulanırken hata oluştu.' });
        }
    }

    const handleApplyReferralCode = async () => {
        if (!referralInput) return;
        if (!db || !user) return;
        
        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('referralCode', '==', referralInput.toUpperCase()));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const referrerDoc = querySnapshot.docs[0];
                if (referrerDoc.id === user.uid) {
                    toast({ variant: 'destructive', title: 'Hata', description: 'Kendi davet kodunuzu kullanamazsınız.' });
                    return;
                }
                
                // %5 indirim uygula
                applyReferral(referralInput, 0.05, referrerDoc.id);
                toast({
                    title: 'Referans Kodu Uygulandı!',
                    description: `"${referralInput.toUpperCase()}" koduyla %5 indirim kazandınız!`,
                    className: 'bg-green-500 text-white'
                });
                return;
            }
            
            toast({
                variant: 'destructive',
                title: 'Geçersiz Kod',
                description: 'Girdiğiniz referans kodu bulunamadı.',
            })
        } catch (error) {
            console.error("Referral error:", error);
            toast({ variant: 'destructive', title: 'Hata', description: 'Kod kontrol edilirken bir hata oluştu.' });
        }
    }

    const handleCheckout = async (e?: React.FormEvent) => {
        e?.preventDefault();
        
        if (!user) {
            toast({ variant: 'destructive', title: 'Giriş Gerekli', description: 'Ödeme yapmak için giriş yapmalısınız.' });
            router.push('/login?redirect=/sepet');
            return;
        }
        if (!user.emailVerified) {
            toast({
                variant: 'destructive',
                title: 'E-posta Doğrulanmadı',
                description: 'Satın alma işlemine devam etmek için lütfen e-posta adresinizi doğrulayın.',
                duration: 8000
            });
            router.push('/ebeveyn-portali/ayarlar');
            return;
        }

        if (!db) return;

        setIsProcessing(true);
        const userDocRef = doc(db, "users", user.uid);

        try {
            // Simulate payment processing delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            const totalLessonsToAdd = cartItems.reduce((total, item) => {
                const lessonsText = item.description.split(' ')[0];
                const lessons = parseInt(lessonsText, 10) || 0;
                return total + (item.quantity * lessons);
            }, 0);

            const newPackages = cartItems.flatMap(item => {
                 const [courseId] = item.id.split('-');
                 const lessonsText = item.description.split(' ')[0];
                 const lessons = parseInt(lessonsText, 10) || 0;
                 const courseCode = getCourseCode(courseId);
                 return Array(item.quantity).fill(`${lessons}${courseCode}`);
            });

            const transactionRef = collection(db, "transactions");
            const txDoc = await addDoc(transactionRef, {
                userId: user.uid,
                userName: user.displayName,
                userEmail: user.email,
                amountGbp: payableTotalGbp,
                balanceUsedGbp: balanceUsedGbp,
                type: 'package',
                createdAt: serverTimestamp(),
                status: payableTotalGbp <= 0 ? 'completed' : 'pending',
                newPackages,
                totalLessonsToAdd,
                referrerId: referrerId || null,
                items: cartItems.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    priceGbp: item.price
                }))
            });

            if (payableTotalGbp <= 0) {
               // Full balance coverage, skip Stripe
               const childrenRef = collection(db, "users", user.uid, "children");
               const childrenSnap = await getDocs(childrenRef);
               const children = childrenSnap.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
               const isSingleChild = children.length === 1;

               const batch = writeBatch(db);

               if (isSingleChild) {
                   const child = children[0];
                   const childDocRef = doc(db, "users", user.uid, "children", child.id);
                   const firstPackage = newPackages[0]; // Use first package for naming
                   const lessonsText = firstPackage.replace(/\D/g, '');
                   const prefix = firstPackage.replace(/[0-9]/g, '');
                   
                   const courseNames: { [key: string]: string } = {
                       'B': 'Başlangıç Kursu (Pre A1)',
                       'K': 'Konuşma Kursu (A1)',
                       'A': 'Akademik Kurs (A2)',
                       'G': 'Gelişim Kursu (B1)',
                       'GCSE': 'GCSE Türkçe Kursu'
                   };
                   const courseName = courseNames[prefix] || 'Standart Kurs';

                   batch.update(childDocRef, {
                       remainingLessons: increment(totalLessonsToAdd),
                       assignedPackage: `${prefix}${totalLessonsToAdd / newPackages.length}`, // Approximation for multi-package display
                       assignedPackageName: courseName,
                       updatedAt: serverTimestamp()
                   });

                   batch.update(userDocRef, {
                       walletBalanceGbp: increment(-balanceUsedGbp),
                       // enrolledPackages left unchanged (no items in pool)
                   });
               } else {
                   batch.update(userDocRef, {
                       walletBalanceGbp: increment(-balanceUsedGbp),
                       remainingLessons: increment(totalLessonsToAdd),
                       enrolledPackages: arrayUnion(...newPackages)
                   });
               }
               
               if (referrerId) {
                   const referrerRef = doc(db, 'users', referrerId);
                   batch.update(referrerRef, { walletBalanceEur: increment(30) });
               }

               await batch.commit();

               clearCart();
               toast({ title: 'Tebrikler!', description: isSingleChild ? `Siparişiniz ${children[0].firstName} hesabına otomatik olarak tanımlandı.` : 'Siparişiniz bakiyeniz kullanılarak tamamlandı.', className: 'bg-green-500 text-white' });
               router.push('/ebeveyn-portali/dersler');
               return;
            }

            clearCart();

            // Stripe Checkout Oturumuna Yönlendirme
            const totalDiscountAndBalance = discountAmount + balanceUsedGbp;
            const res = await fetch('/api/checkout_sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cartItems.map(item => ({
                         ...item,
                         price: (item.price * (1 - totalDiscountAndBalance/cartTotal)) * rate
                    })),
                    currency: selectedCurrency.toLowerCase(),
                    customerEmail: user.email,
                    transactionId: txDoc.id
                })
            });
            
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                toast({ variant: 'destructive', title: 'Stripe Hatası', description: data.error || 'Ödeme sayfasına yönlendirilemedi.' });
                setIsProcessing(false);
            }

        } catch (error) {
            console.error("Checkout error:", error);
            toast({ variant: 'destructive', title: 'Hata', description: 'Ödeme sırasında bir sorun oluştu.' });
        } finally {
            setIsProcessing(false);
        }
    };

    if (!mounted) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="bg-muted/30 min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8">
            <div className="container max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <ShoppingCart className="w-8 h-8 text-primary" />
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                            Güvenli Ödeme Çıkışı
                        </h1>
                    </div>
                    <Badge variant="outline" className="w-fit h-8 px-3 gap-2 bg-white">
                        <Globe className="w-3.5 h-3.5" />
                        {currencyDetails[selectedCurrency]?.flag} {selectedCurrency}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Sepetinizdeki Ürünler ({cartItems.length})</CardTitle>
                                </CardHeader>
                                <CardContent className="divide-y">
                                    {cartItems.length > 0 ? (
                                        cartItems.map(item => (
                                            <div key={item.id} className="flex flex-col sm:flex-row items-start gap-6 py-4">

                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg">{item.name}</h3>
                                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                                    {(() => {
                                                        const lessonsCount = parseInt(item.description.split(' ')[0]) || 0;
                                                        if (lessonsCount > 0) {
                                                            let itemBasePriceEur = item.price;
                                                            let hasDiscount = false;
                                                            
                                                            const [courseId] = item.id.split('-');
                                                            let maxItemPct = 0;
                                                            
                                                            // Helper to check if a coupon matches an item
                                                            const isCouponMatching = (c: any) => {
                                                                const c_ids = Array.isArray(c.applicableCourseIds) ? c.applicableCourseIds : (c.applicableCourseId ? [c.applicableCourseId] : []);
                                                                const courseMatches = c_ids.length === 0 || c_ids.includes(courseId);
                                                                
                                                                const c_pkgs = Array.isArray(c.applicablePackages) 
                                                                    ? c.applicablePackages.map((p: any) => Number(p)) 
                                                                    : (c.applicablePackage ? [Number(c.applicablePackage)] : []);
                                                                    
                                                                const packageMatches = c_pkgs.length === 0 || c_pkgs.includes(Number(lessonsCount));

                                                                return courseMatches && packageMatches;
                                                            };
                                                            
                                                            // 1. Check Standard Coupon (Manual)
                                                            if (appliedCouponData && isCouponMatching(appliedCouponData)) {
                                                                maxItemPct = Math.max(maxItemPct, appliedCouponData.discountPct);
                                                            }
                                                            
                                                            // 2. Check Public Coupons (Automatic)
                                                            if (publicCoupons && publicCoupons.length > 0) {
                                                                const matchingPublic = publicCoupons.filter((c: any) => isCouponMatching(c));
                                                                if (matchingPublic.length > 0) {
                                                                    const bestPublicPct = Math.max(...matchingPublic.map((c: any) => c.discountPct || 0));
                                                                    maxItemPct = Math.max(maxItemPct, bestPublicPct);
                                                                }
                                                            }
                                                            
                                                            if (maxItemPct > 0) {
                                                                itemBasePriceEur *= (1 - maxItemPct);
                                                                hasDiscount = true;
                                                            }
                                                            
                                                            // Global referral 5% (Additive)
                                                            if (appliedReferralCode) {
                                                                itemBasePriceEur *= 0.95;
                                                                hasDiscount = true;
                                                            }
                                                            
                                                            return (
                                                                <Badge variant="outline" className={`mt-2 font-medium ${hasDiscount ? 'text-green-600 border-green-200 bg-green-50' : 'text-slate-500'}`}>
                                                                    Ders başı: {symbol}{formatPrice(itemBasePriceEur / lessonsCount)}
                                                                </Badge>
                                                            );
                                                        }
                                                        return null;
                                                    })()}
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
                                                    <p className="font-bold text-lg">{symbol}{formatPrice(item.price * item.quantity)}</p>
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

                        <div className="lg:col-span-1">
                            <Card className="sticky top-28">
                                <CardHeader>
                                    <CardTitle>Sipariş Özeti</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span>Ara Toplam</span>
                                            <span>{symbol}{formatPrice(cartTotal)}</span>
                                        </div>
                                        {discountAmount > 0 && (
                                            <div className="flex justify-between text-green-600 font-bold">
                                                <span>Tamamlanan İndirim</span>
                                                <span>-{symbol}{formatPrice(discountAmount)}</span>
                                            </div>
                                        )}
                                        {balanceUsedGbp > 0 && (
                                            <div className="flex justify-between text-orange-600 font-bold">
                                                <span>Bakiye Kullanımı</span>
                                                <span>-{symbol}{formatPrice(balanceUsedGbp)}</span>
                                            </div>
                                        )}
                                        <Separator />
                                        <div className="flex justify-between font-black text-xl text-primary">
                                            <span>Ödenecek Tutar</span>
                                            <span>{symbol}{formatPrice(payableTotalGbp)}</span>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="space-y-4">
                                        {/* İndirim Kodu Kısımı */}
                                        {appliedCoupon && (
                                            <div className="flex items-center justify-between gap-2">
                                                <Badge>
                                                    <Tag className="w-3 h-3 mr-1"/>
                                                    Kupon: {appliedCoupon} (%{(appliedCouponData!.discountPct * 100).toFixed(0)})
                                                </Badge>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={removeCoupon}>
                                                    <XCircle className="w-4 h-4"/>
                                                </Button>
                                            </div>
                                        )}
                                        {/* If no manual coupon, users can enter one */}
                                        {!appliedCoupon && (
                                            <div className="space-y-2">
                                                <Label htmlFor="coupon">İndirim Kodu</Label>
                                                <div className="flex gap-2">
                                                    <Input id="coupon" placeholder="İndirim kodu girin" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
                                                    <Button variant="outline" onClick={handleApplyNormalCoupon} disabled={!coupon}>Uygula</Button>
                                                </div>
                                            </div>
                                        )}

                                        <Separator />

                                        {/* Referans Kodu Kısımı */}
                                        {appliedReferralCode ? (
                                            <div className="flex items-center justify-between gap-2">
                                                <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                                                    <Tag className="w-3 h-3 mr-1"/>
                                                    {appliedReferralCode} (%5 Davet)
                                                </Badge>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={removeReferral}>
                                                    <XCircle className="w-4 h-4"/>
                                                </Button>
                                            </div>
                                        ): (
                                            <div className="space-y-2">
                                                <Label htmlFor="referral">Referans Kodu</Label>
                                                <div className="flex gap-2">
                                                    <Input id="referral" placeholder="Arkadaş kodu girin" value={referralInput} onChange={(e) => setReferralInput(e.target.value)} />
                                                    <Button variant="outline" onClick={handleApplyReferralCode} disabled={!referralInput}>Uygula</Button>
                                                </div>
                                            </div>
                                        )}

                                        <Separator />

                                        {balanceGbp > 0 && (
                                            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="font-bold flex items-center gap-1.5"><Wallet className="w-4 h-4 text-primary"/> Cüzdan Bakiyesi</span>
                                                    <span className="font-bold">{symbol}{formatPrice(balanceGbp)}</span>
                                                </div>
                                                {useBalance ? (
                                                    <Button variant="secondary" className="w-full text-xs font-bold border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={() => setUseBalance(false)}>
                                                        Bakiyeyi İptal Et
                                                    </Button>
                                                ) : (
                                                    <Button variant="default" className="w-full text-xs font-bold" onClick={() => setUseBalance(true)}>
                                                        Bakiyemi Kullan
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full text-lg h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold" disabled={cartItems.length === 0 || isProcessing} onClick={handleCheckout}>
                                        {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <CreditCard className="mr-2" />}
                                        {isProcessing ? 'Yönlendiriliyor...' : 'Stripe ile Güvenli Öde'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
            </div>
        </div>
    );
}
