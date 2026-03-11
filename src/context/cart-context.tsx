
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
    applyCoupon: (code: string) => boolean;
    discountAmount: number;
    finalTotal: number;
    appliedCoupon: string | null;
    removeCoupon: () => void;
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
    const [discount, setDiscount] = useState(0); 
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
    
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

    const applyCoupon = (code: string): boolean => {
        if (code.toUpperCase() === 'ISVICRE') {
            setDiscount(0.20);
            setAppliedCoupon(code.toUpperCase());
            return true;
        }
        setDiscount(0);
        setAppliedCoupon(null);
        return false;
    };
    
    const removeCoupon = () => {
        setDiscount(0);
        setAppliedCoupon(null);
    }

    const cartTotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const discountAmount = cartTotal * discount;
    const finalTotal = cartTotal - discountAmount;

    return (
        <CartContext.Provider value={{ 
            cartItems, addToCart, removeFromCart, updateQuantity, clearCart, 
            cartTotal, applyCoupon, discountAmount, finalTotal, appliedCoupon, removeCoupon, 
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
