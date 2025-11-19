
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

export type CartItem = {
    id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    image: string;
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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        if (typeof window === 'undefined') {
            return [];
        }
        try {
            const localData = localStorage.getItem('cartItems');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error("Failed to parse cart items from localStorage", error);
            return [];
        }
    });

    const [discount, setDiscount] = useState(0); // discount percentage
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

    useEffect(() => {
        try {
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        } catch (error) {
            console.error("Failed to save cart items to localStorage", error);
        }
    }, [cartItems]);

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
            setDiscount(0.20); // 20% discount
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
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, applyCoupon, discountAmount, finalTotal, appliedCoupon, removeCoupon }}>
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
