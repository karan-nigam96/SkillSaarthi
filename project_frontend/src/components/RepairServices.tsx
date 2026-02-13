"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import SectionHeading from './SectionHeading';
import { Star, Plus, Edit } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function RepairServices() {
    const [services, setServices] = useState([]);
    const { addToCart } = useCart();
    const [isAdmin, setIsAdmin] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/services?category=Repair');
                const data = await res.json();
                setServices(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchServices();
        setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    }, []);

    const handleEditClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
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
            const res = await fetch('http://localhost:5000/api/admin/upload', {
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

    if (!services.length) return null;

    return (
        <section className="py-12 bg-white">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />
            <div className="container mx-auto px-4 md:px-32">
                <SectionHeading title="Electrician, Plumber, Carpenters" />

                {/* Horizontal scroll on mobile, Grid on desktop */}
                <div className="flex overflow-x-auto pb-4 md:grid md:grid-cols-5 md:overflow-visible gap-6 snap-x no-scrollbar">
                    {services.map((svc: any, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col gap-3 min-w-[200px] snap-start cursor-pointer group hover:bg-gray-50 p-2 rounded-2xl transition-colors"
                            onClick={() => handleAdd(svc)}
                        >
                            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
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
                                    <Plus className="w-4 h-4 text-black" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm md:text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 min-h-[40px]">
                                    {svc.name}
                                </h3>
                                <div className="flex items-center gap-1 text-xs font-medium text-gray-500">
                                    <Star className="w-3 h-3 fill-gray-900 text-gray-900" />
                                    <span className="text-gray-900">{svc.rating.split(' ')[0]}</span>
                                    <span className="text-gray-400">{svc.rating.split(' ')[1]}</span>
                                </div>
                                <div className="font-bold text-gray-900 text-sm mt-1">
                                    {svc.price}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
