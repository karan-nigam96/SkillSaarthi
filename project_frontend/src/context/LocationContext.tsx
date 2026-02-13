"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LocationData {
    address: string;
    latitude: number | null;
    longitude: number | null;
    isDefault: boolean;
}

interface LocationContextType {
    location: LocationData;
    isLoading: boolean;
    error: string | null;
    requestLocation: () => Promise<void>;
    setLocationManual: (address: string) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const DEFAULT_LOCATION: LocationData = {
    address: "Select Location",
    latitude: null,
    longitude: null,
    isDefault: true
};

export function LocationProvider({ children }: { children: ReactNode }) {
    const [location, setLocation] = useState<LocationData>(DEFAULT_LOCATION);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('user_location');
        if (saved) {
            try {
                setLocation(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse saved location", e);
            }
        }
    }, []);

    const requestLocation = async () => {
        setIsLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            setIsLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    // Reverse geocoding using OpenStreetMap (Nominatim) - Free & No API Key needed for basic use
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await res.json();

                    const address = data.address.city || data.address.town || data.address.village || data.address.state_district || "Unknown Location";
                    const formattedAddress = `${address}, ${data.address.state || ''}`;

                    const newLocation = {
                        address: formattedAddress,
                        latitude,
                        longitude,
                        isDefault: false
                    };

                    setLocation(newLocation);
                    localStorage.setItem('user_location', JSON.stringify(newLocation));
                } catch (err) {
                    console.error("Error fetching address:", err);
                    // Fallback if reverse geocoding fails
                    const fallbackLocation = {
                        address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
                        latitude,
                        longitude,
                        isDefault: false
                    };
                    setLocation(fallbackLocation);
                    localStorage.setItem('user_location', JSON.stringify(fallbackLocation));
                } finally {
                    setIsLoading(false);
                }
            },
            (err) => {
                setError("Unable to retrieve your location");
                setIsLoading(false);
                console.error(err);
            }
        );
    };

    const setLocationManual = (address: string) => {
        const newLocation = {
            address,
            latitude: null,
            longitude: null,
            isDefault: false
        };
        setLocation(newLocation);
        localStorage.setItem('user_location', JSON.stringify(newLocation));
    };

    return (
        <LocationContext.Provider value={{ location, isLoading, error, requestLocation, setLocationManual }}>
            {children}
        </LocationContext.Provider>
    );
}

export function useLocation() {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
}
