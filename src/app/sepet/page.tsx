'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, ShoppingCart, ArrowLeft, CreditCard, Tag, Minus, Plus } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';

const initialCartItem = {
    id: 'konusma-12',
    name: 'Konuşma Kursu',
    description: '12 derslik paket',
    price: 198.00,
    quantity: 1,
    image: '/images/topics/family.png', // Placeholder image
};

export default function SepetPage() {
    const [cartItem, setCartItem] = useState(initialCartItem);
    const [coupon, setCoupon] = useState('');

    const handleQuantityChange = (amount: number) => {
        setCartItem(prev => ({
            ...prev,
            quantity: Math.max(1, prev.quantity + amount)
        }));
    };

    const subtotal = cartItem.price * cartItem.quantity;
    const kdv = subtotal * 0.18; // %18 KDV
    const total = subtotal + kdv;


    return (
        <div className="bg-muted/30 min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8">
            <div className="container max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <ShoppingCart className="w-8 h-8 text-primary" />
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Alışveriş Sepetim</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Cart Items Section */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Sepetinizdeki Ürünler</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {cartItem ? (
                                    <div className="flex flex-col sm:flex-row items-start gap-6 py-4">
                                        <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Image src={cartItem.image} alt={cartItem.name} width={60} height={60} className="object-contain" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg">{cartItem.name}</h3>
                                            <p className="text-sm text-muted-foreground">{cartItem.description}</p>
                                            <div className="flex items-center gap-2 mt-3">
                                                <Label htmlFor="quantity">Miktar:</Label>
                                                <div className="flex items-center gap-1 border rounded-md">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(-1)}>
                                                        <Minus className="h-4 w-4"/>
                                                    </Button>
                                                    <Input
                                                        id="quantity"
                                                        type="number"
                                                        value={cartItem.quantity}
                                                        readOnly
                                                        className="h-8 w-12 text-center border-0 focus-visible:ring-0"
                                                    />
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(1)}>
                                                        <Plus className="h-4 w-4"/>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2 ml-auto">
                                            <p className="font-bold text-lg">€{cartItem.price.toFixed(2)}</p>
                                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => setCartItem(initialCartItem)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
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
                                        <span className="font-medium">€{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>KDV (%18)</span>
                                        <span className="font-medium">€{kdv.toFixed(2)}</span>
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Toplam</span>
                                    <span>€{total.toFixed(2)}</span>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <Label htmlFor="coupon">Kupon Kodu</Label>
                                    <div className="flex gap-2">
                                        <Input id="coupon" placeholder="İndirim kodu girin" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
                                        <Button variant="outline">Uygula</Button>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full text-lg h-12" disabled={!cartItem}>
                                    <CreditCard className="mr-2" />
                                    Ödemeye Geç
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
