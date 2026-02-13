"use client";

import { useLocation } from "@/context/LocationContext";
import { MapPin, X, Navigation } from "lucide-react";
import { useState } from "react";

interface LocationSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LocationSearchModal({ isOpen, onClose }: LocationSearchModalProps) {
    const { requestLocation, setLocationManual, isLoading, error } = useLocation();
    const [manualInput, setManualInput] = useState("");

    if (!isOpen) return null;

    const handleCurrentLocation = async () => {
        await requestLocation();
        onClose();
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (manualInput.trim()) {
            setLocationManual(manualInput);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>

                <h2 className="text-xl font-bold mb-6">Select your Location</h2>

                <div className="space-y-4">
                    {/* Current Location Button */}
                    <button
                        onClick={handleCurrentLocation}
                        disabled={isLoading}
                        className="w-full flex items-center gap-3 p-4 border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-50 rounded-xl transition-all group"
                    >
                        <div className="p-2 bg-white rounded-full shadow-sm text-indigo-600 group-hover:scale-110 transition-transform">
                            <Navigation className={`w-5 h-5 ${isLoading ? 'animate-pulse' : ''}`} />
                        </div>
                        <div className="text-left">
                            <p className="font-semibold text-indigo-900">Use Current Location</p>
                            <p className="text-xs text-indigo-600/70">Using GPS</p>
                        </div>
                    </button>

                    {error && (
                        <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">{error}</p>
                    )}

                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-100" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-400">Or enter manually</span>
                        </div>
                    </div>

                    {/* Manual Input Form */}
                    <form onSubmit={handleManualSubmit} className="space-y-3">
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Enter city or area..."
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                value={manualInput}
                                onChange={(e) => setManualInput(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!manualInput.trim()}
                            className="w-full py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Confirm Location
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
