"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams.get('q');
    const { addToCart } = useCart();

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!query) {
            setResults([]);
            setLoading(false);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);
            try {
                const res = await fetch(`https://skillsaarthi.onrender.com/api/services?search=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults(data);
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    const handleAdd = (svc: any) => {
        addToCart({
            id: svc.name + Math.random(),
            name: svc.name,
            price: parseInt(svc.price.replace('₹', '')),
            image: svc.image,
            rating: svc.rating || "4.8 (500)"
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 md:px-32">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-500 hover:text-black mb-6 font-medium transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <h1 className="text-2xl font-bold mb-8">
                    {query ? `Search results for "${query}"` : 'Search Services'}
                </h1>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-500">Searching...</p>
                    </div>
                ) : results.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {results.map((svc: any, idx) => (
                            <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full cursor-pointer" onClick={() => handleAdd(svc)}>
                                <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 bg-gray-100">
                                    <Image
                                        src={svc.image}
                                        alt={svc.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        unoptimized
                                    />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                    {svc.name}
                                </h3>
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
                                    {svc.description || "Professional service at your doorstep."}
                                </p>
                                <div className="flex items-center justify-between mt-auto">
                                    <div className="font-bold text-lg text-gray-900">{svc.price}</div>
                                    <div className="flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        <span>{svc.rating?.split(' ')[0] || "4.8"}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-500 text-lg mb-2">No services found matching "{query}"</p>
                        <p className="text-gray-400 text-sm">Try checking your spelling or search for a different category.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
