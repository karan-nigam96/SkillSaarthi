"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import SectionHeading from './SectionHeading';
import Link from 'next/link';
import { ArrowRight, Edit } from 'lucide-react';

export default function ConstructionServices() {
    const [services, setServices] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch('https://skillsaarthi.onrender.com/api/services?category=Construction');
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
        e.preventDefault(); // Prevent navigation
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
            <div className="container mx-auto px-4 md:px-32">
                <SectionHeading
                    title="Construction & Site Services"
                />
                <p className="text-gray-600 mb-8 max-w-2xl">
                    Reliable construction workers and professionals for your projects. Find skilled labor, supervisors, and engineers quickly and efficiently.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {services.map((svc: any, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow group cursor-pointer border border-gray-100 flex flex-col h-full relative">
                            <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4 bg-gray-100">
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
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                {svc.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-4 flex-grow">
                                {svc.description || 'Professional service for your construction needs.'}
                            </p>
                            <Link href={`/construction/${svc._id}`} className="flex items-center text-indigo-600 font-medium text-sm mt-auto hover:underline">
                                Learn More <ArrowRight className="w-4 h-4 ml-1" />
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
