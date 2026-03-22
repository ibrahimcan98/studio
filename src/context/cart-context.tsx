
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getExchangeRates } from '@/ai/flows/exchange-rate-flow';

export type CartItem = {
    id: string;
    name: string;
    description: string;
    price: number; // Base price in EUR
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
    applyStandardDiscount: (code: string, pct: number, applicableCourseId?: string | null, applicablePackage?: number | null) => void;
    discountAmount: number;
    finalTotal: number;
    appliedCoupon: string | null;
    appliedCouponData: {
        code: string;
        discountPct: number;
        applicableCourseId?: string | null;
        applicablePackage?: number | null;
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
        applicableCourseId?: string | null;
        applicablePackage?: number | null;
    } | null>(null);
    const appliedCoupon = appliedCouponData?.code || null;
    const [referralDiscountPct, setReferralDiscountPct] = useState(0);
    const [appliedReferralCode, setAppliedReferralCode] = useState<string | null>(null);
    const [referrerId, setReferrerId] = useState<string | null>(null);
    
    const [selectedCurrency, setSelectedCurrencyState] = useState('EUR');
    const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>({ EUR: 1 });

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
                setExchangeRates({ ...data.rates, EUR: 1 });
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

    const applyStandardDiscount = (code: string, pct: number, applicableCourseId?: string | null, applicablePackage?: number | null) => {
        setAppliedCouponData({
            code: code.toUpperCase(),
            discountPct: pct,
            applicableCourseId: applicableCourseId || null,
            applicablePackage: applicablePackage || null
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
        
        // 1. Check Standard Coupon
        if (appliedCouponData) {
            const [courseId] = item.id.split('-');
            const lessonsCount = parseInt(item.description.split(' ')[0]) || 0;
            
            const courseMatches = !appliedCouponData.applicableCourseId || appliedCouponData.applicableCourseId === courseId;
            const packageMatches = !appliedCouponData.applicablePackage || appliedCouponData.applicablePackage === lessonsCount;
            
            if (courseMatches && packageMatches) {
                itemDiscount += (item.price * item.quantity * appliedCouponData.discountPct);
            }
        }
        
        // 2. Check Referral Discount (Referral is usually global 5%)
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
