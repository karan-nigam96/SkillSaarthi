"use client";

import { CartProvider } from "@/context/CartContext";
import { LocationProvider } from "@/context/LocationContext";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <LocationProvider>
            <CartProvider>
                {children}
            </CartProvider>
        </LocationProvider>
    );
}
