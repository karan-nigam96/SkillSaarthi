"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import SectionHeading from './SectionHeading';
import { Star, Plus, Edit } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CleaningServices() {
    const [services, setServices] = useState([]);
    const { addToCart } = useCart();
    const [isAdmin, setIsAdmin] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/services?category=Cleaning');
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
            <div className="container mx-auto px-6 md:px-32">
                <SectionHeading title="Cleaning & Pest Control" />

                {/* Flex Layout for Fixed Dimensions */}
                <div className="flex flex-wrap gap-6">
                    {services.map((svc: any, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col justify-between bg-white border border-gray-200 rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg transition-all w-[233.1px] h-[279.91px]"
                            onClick={() => handleAdd(svc)}
                        >
                            {/* Text Section at Top */}
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-gray-900 leading-snug">
                                    {svc.name}
                                </h3>
                            </div>

                            {/* Image Section at Bottom */}
                            <div className="relative w-[231.6px] h-[179px] mx-auto mt-auto">
                                <Image
                                    src={svc.image}
                                    alt={svc.name}
                                    fill
                                    className="object-cover object-center"
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
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
