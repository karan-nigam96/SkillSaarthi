"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import SectionHeading from './SectionHeading';
import { Star, ArrowRight, Plus, Edit } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function MostBookedServices() {
    const { addToCart } = useCart();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch('https://skillsaarthi.onrender.com/api/services?category=Most Booked');
                const data = await res.json();
                setServices(data);
            } catch (error) {
                console.error("Failed to fetch services", error);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
        setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    }, []);

    const handleEditClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // Prevent card click
        e.preventDefault();
        setSelectedServiceId(id);
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0] || !selectedServiceId) return;

        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        formData.append('type', 'service');
        formData.append('id', selectedServiceId);

        try {
            const token = localStorage.getItem('customerToken');
            const res = await fetch('https://skillsaarthi.onrender.com/api/admin/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                alert('Image updated successfully!');
                // Refresh items
                const updated = services.map((s: any) => s._id === selectedServiceId ? { ...s, image: data.imageUrl + '?t=' + Date.now() } : s);
                setServices(updated as any);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
            alert('Upload failed');
        }
    };

    const handleAdd = (svc: any) => {
        addToCart({
            id: svc.name + Math.random(),
            name: svc.name,
            price: parseInt(svc.price.replace('₹', '')),
            image: svc.image,
            rating: svc.rating
        });
    };

    if (loading) return null; // Or a skeleton loader
    if (!services.length) return null;

    return (
        <section className="py-12 bg-gray-50">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />
            <div className="container mx-auto px-4 md:px-6">
                <SectionHeading title="Most booked services" />

                <div className="flex gap-6 overflow-x-auto no-scrollbar snap-x pb-4">
                    {services.map((svc: any, idx) => (
                        <div key={idx} className="flex flex-col gap-3 min-w-[240px] snap-start cursor-pointer group bg-white p-3 rounded-2xl hover:shadow-lg transition-all" onClick={() => handleAdd(svc)}>
                            <div className="relative w-full h-40 rounded-xl overflow-hidden bg-gray-100">
                                <Image
                                    src={svc.image}
                                    alt={svc.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    unoptimized
                                />
                                {isAdmin && (
                                    <button
                                        onClick={(e) => handleEditClick(e, svc._id)}
                                        className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
                                        title="Edit Image (Admin)"
                                    >
                                        <Edit className="w-4 h-4 text-black" />
                                    </button>
                                )}
                                <div className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Plus className="w-5 h-5 text-black" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                    {svc.name}
                                </h3>
                                <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                                    <Star className="w-3 h-3 fill-gray-900 text-gray-900" />
                                    <span className="text-gray-900">{svc.rating.split(' ')[0]}</span>
                                    <span className="text-gray-400">{svc.rating.split(' ')[1]}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="font-bold text-gray-900 text-sm">{svc.price}</span>
                                    {svc.originalPrice && (
                                        <span className="text-gray-400 line-through text-xs">{svc.originalPrice}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="min-w-[50px] flex items-center justify-center">
                        <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:shadow-md transition-shadow bg-white">
                            <ArrowRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
