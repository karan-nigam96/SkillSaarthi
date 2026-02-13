"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
    id: string;
    name: string;
    price: number;
    image: string;
    rating?: string;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
    isCartOpen: boolean;
    toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const addToCart = (item: CartItem) => {
        // Simple check to avoid duplicates for services that are generally one-off per booking
        // Or we can allow duplicates. For services, allowing multiples usually implies different units, 
        // but for simplicity here we'll check by ID or Name.
        // Let's assume unique items for now for simplicity, or just append.
        // User asked "more than 1 service", so append is safer.
        console.log("Adding to cart:", item); // Debug
        setItems((prev) => [...prev, { ...item, id: item.id || Math.random().toString() }]);
        // setIsCartOpen(true); // Don't auto open cart on add
    };

    const removeFromCart = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const clearCart = () => {
        setItems([]);
    };

    const toggleCart = () => {
        setIsCartOpen((prev) => !prev);
    };

    const cartCount = items.length;
    const cartTotal = items.reduce((total, item) => total + item.price, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, cartCount, cartTotal, isCartOpen, toggleCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
