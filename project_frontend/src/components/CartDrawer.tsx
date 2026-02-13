"use client";

import { X, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

import { useRouter } from "next/navigation";

export default function CartDrawer() {
    const { items, removeFromCart, cartTotal, isCartOpen, toggleCart } = useCart();
    const router = useRouter();

    if (!isCartOpen) return null;

    const handleCheckout = () => {
        const customerInfoStr = localStorage.getItem('customerInfo');
        if (!customerInfoStr) {
            alert("Please login to proceed with checkout.");
            router.push('/login');
            return;
        }

        const customerInfo = JSON.parse(customerInfoStr);
        if (!customerInfo.mobile) {
            alert("Please add your mobile number to complete your profile before booking.");
            router.push('/profile'); // Assuming /profile page exists for editing details
            toggleCart(); // Close drawer
            return;
        }

        // Proceed with checkout logic (Placeholder)
        alert("Proceeding to checkout...");
    };

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={toggleCart}
            ></div>

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
                    <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
                    <button
                        onClick={toggleCart}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                                <span className="text-4xl">🛒</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Your cart is empty</h3>
                                <p className="text-gray-500 max-w-xs mx-auto">Looks like you haven't added any services yet.</p>
                            </div>
                        </div>
                    ) : (
                        items.map((item, index) => (
                            <div key={item.id} className="flex gap-4 p-3 border border-gray-100 rounded-xl bg-gray-50 hover:bg-white hover:shadow-sm transition-all">
                                <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-200">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 line-clamp-2">{item.name}</h4>
                                        <p className="text-sm text-gray-500">{item.rating}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-gray-900">₹{item.price}</span>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-red-500 hover:text-red-600 text-xs font-medium flex items-center gap-1"
                                        >
                                            <Trash2 className="w-3 h-3" /> Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-4 border-t border-gray-100 bg-white space-y-4">
                        <div className="flex items-center justify-between text-lg font-bold text-gray-900">
                            <span>Total</span>
                            <span>₹{cartTotal}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-black text-white py-3.5 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200 active:scale-[0.98] transform"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
