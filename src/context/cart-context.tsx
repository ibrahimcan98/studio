
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getExchangeRates } from '@/ai/flows/exchange-rate-flow';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';

export type CartItem = {
    id: string;
    name: string;
    description: string;
    price: number; // Base price in GBP
    quantity: number;
    image: string;
};

export const currencyDetails: { [key: string]: { name: string; symbol: string; flag: string; } } = {
    EUR: { name: 'Euro', symbol: '€', flag: '🇪🇺' },
    GBP: { name: 'İngiliz Sterlini', symbol: '£', flag: '🇬🇧' },
    USD: { name: 'ABD Doları', symbol: '$', flag: '🇺🇸' },
    AED: { name: 'BAE Dirhemi', symbol: 'AED', flag: '🇦🇪' },
    AUD: { name: 'Avustralya Doları', symbol: 'A$', flag: '🇦🇺' },
    CAD: { name: 'Kanada Doları', symbol: 'C$', flag: '🇨🇦' },
    CHF: { name: 'İsviçre Frankı', symbol: 'CHF', flag: '🇨🇭' },
    IDR: { name: 'Endonezya Rupisi', symbol: 'Rp', flag: '🇮🇩' },
    MYR: { name: 'Malezya Ringgiti', symbol: 'RM', flag: '🇲🇾' },
    NOK: { name: 'Norveç Kronu', symbol: 'kr', flag: '🇳🇴' },
    TRY: { name: 'Türk Lirası', symbol: '₺', flag: '🇹🇷' },
};

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    cartTotal: number;
    applyStandardDiscount: (code: string, pct: number, applicableCourseIds?: string[] | null, applicablePackages?: number[] | null) => void;
    discountAmount: number;
    finalTotal: number;
    appliedCoupon: string | null;
    appliedCouponData: {
        code: string;
        discountPct: number;
        applicableCourseIds?: string[] | null;
        applicablePackages?: number[] | null;
        applicableCourseId?: string | null; // Legacy
        applicablePackage?: number | null; // Legacy
    } | null;
    removeCoupon: () => void;
    
    applyReferral: (code: string, discount: number, referrerId: string) => void;
    appliedReferralCode: string | null;
    removeReferral: () => void;
    referrerId: string | null;
    
    isCartLoaded: boolean;
    // Currency related
    selectedCurrency: string;
    setSelectedCurrency: (currency: string) => void;
    exchangeRates: { [key: string]: number };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartLoaded, setIsCartLoaded] = useState(false);
    const [appliedCouponData, setAppliedCouponData] = useState<{
        code: string;
        discountPct: number;
        applicableCourseIds?: string[] | null;
        applicablePackages?: number[] | null;
        applicableCourseId?: string | null; // Legacy
        applicablePackage?: number | null; // Legacy
    } | null>(null);
    const appliedCoupon = appliedCouponData?.code || null;
    const [referralDiscountPct, setReferralDiscountPct] = useState(0);
    const [appliedReferralCode, setAppliedReferralCode] = useState<string | null>(null);
    const [referrerId, setReferrerId] = useState<string | null>(null);
    
    const [selectedCurrency, setSelectedCurrencyState] = useState('GBP');
    const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>({ GBP: 1 });
    
    // Fetch public coupons to apply automatically
    const db = useFirestore();
    const publicCouponsQuery = useMemoFirebase(() => 
        db ? query(collection(db, 'coupons'), where('isPublicDisplay', '==', true), where('isActive', '==', true)) : null
    , [db]);
    const { data: publicCoupons } = useCollection(publicCouponsQuery);

    useEffect(() => {
        try {
            const localCart = localStorage.getItem('cartItems');
            if (localCart) {
                setCartItems(JSON.parse(localCart));
            }
            
            const localCurrency = localStorage.getItem('selectedCurrency');
            if (localCurrency && currencyDetails[localCurrency]) {
                setSelectedCurrencyState(localCurrency);
            }
        } catch (error) {
            console.error("Failed to parse cart items from localStorage", error);
        }
        setIsCartLoaded(true);

        // Fetch rates on mount
        const fetchRates = async () => {
            try {
                const data = await getExchangeRates();
                setExchangeRates({ ...data.rates, GBP: 1 });
            } catch (e) {
                console.error("Failed to fetch rates in provider", e);
            }
        };
        fetchRates();
    }, []);

    useEffect(() => {
        if (isCartLoaded) {
            try {
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
            } catch (error) {
                console.error("Failed to save cart items to localStorage", error);
            }
        }
    }, [cartItems, isCartLoaded]);

    const setSelectedCurrency = (currency: string) => {
        setSelectedCurrencyState(currency);
        localStorage.setItem('selectedCurrency', currency);
    };

    const addToCart = (item: CartItem) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(i => i.id === item.id);
            if (existingItem) {
                return prevItems.map(i =>
                    i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prevItems, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (id: string) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(id);
            return;
        }
        setCartItems(prevItems =>
            prevItems.map(item => (item.id === id ? { ...item, quantity } : item))
        );
    };
    
    const clearCart = () => {
        setCartItems([]);
    }

    const applyStandardDiscount = (code: string, pct: number, applicableCourseIds?: string[] | null, applicablePackages?: number[] | null) => {
        setAppliedCouponData({
            code: code.toUpperCase(),
            discountPct: pct,
            applicableCourseIds: applicableCourseIds || null,
            applicablePackages: applicablePackages || null
        });
    };
    
    const applyReferral = (code: string, pct: number, refId: string) => {
        setReferralDiscountPct(pct);
        setAppliedReferralCode(code.toUpperCase());
        setReferrerId(refId);
    }

    const removeCoupon = () => {
        setAppliedCouponData(null);
    }

    const removeReferral = () => {
        setReferralDiscountPct(0);
        setAppliedReferralCode(null);
        setReferrerId(null);
    }

    const cartTotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const discountAmount = cartItems.reduce((total, item) => {
        let itemDiscount = 0;
        let maxItemDiscountPct = 0;
        
        const [courseId] = item.id.split('-');
        const lessonsCount = parseInt(item.description.split(' ')[0]) || 0;

        // Helper to check if a coupon matches an item
        const isCouponMatching = (c: any) => {
            // Course Check: If array exists and has length, check includes. Otherwise check legacy.
            const c_ids = Array.isArray(c.applicableCourseIds) ? c.applicableCourseIds : (c.applicableCourseId ? [c.applicableCourseId] : []);
            const courseMatches = c_ids.length === 0 || c_ids.includes(courseId);
            
            // Package Check: Force everything to Number for safe comparison
            const c_pkgs = Array.isArray(c.applicablePackages) 
                ? c.applicablePackages.map((p: any) => Number(p)) 
                : (c.applicablePackage ? [Number(c.applicablePackage)] : []);
            
            const packageMatches = c_pkgs.length === 0 || c_pkgs.includes(Number(lessonsCount));

            return courseMatches && packageMatches;
        };
        
        // 1. Check Standard Coupon (Manually entered)
        if (appliedCouponData && isCouponMatching(appliedCouponData)) {
            maxItemDiscountPct = Math.max(maxItemDiscountPct, appliedCouponData.discountPct);
        }
        
        // 2. Check Automatic Public Coupons
        if (publicCoupons && publicCoupons.length > 0) {
            const matchingPublicCoupons = publicCoupons.filter((c: any) => isCouponMatching(c));
            
            if (matchingPublicCoupons.length > 0) {
                const bestPublicPct = Math.max(...matchingPublicCoupons.map((c: any) => c.discountPct || 0));
                maxItemDiscountPct = Math.max(maxItemDiscountPct, bestPublicPct);
            }
        }
        
        // Apply the best found discount for this item
        itemDiscount += (item.price * item.quantity * maxItemDiscountPct);
        
        // 3. Check Referral Discount (Referral is additive if applicable, but usually kept separate)
        if (referralDiscountPct > 0) {
            itemDiscount += (item.price * item.quantity * referralDiscountPct);
        }
        
        return total + itemDiscount;
    }, 0);

    const finalTotal = cartTotal - discountAmount;

    return (
        <CartContext.Provider value={{ 
            cartItems, addToCart, removeFromCart, updateQuantity, clearCart, 
            cartTotal, applyStandardDiscount, discountAmount, finalTotal, appliedCoupon, appliedCouponData, removeCoupon, 
            applyReferral, appliedReferralCode, removeReferral, referrerId,
            isCartLoaded, selectedCurrency, setSelectedCurrency, exchangeRates 
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
