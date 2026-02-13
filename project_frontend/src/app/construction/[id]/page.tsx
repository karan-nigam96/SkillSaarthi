"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { CheckCircle, Phone, Clock, MapPin, User, Star, Shield, ArrowRight, Edit } from 'lucide-react';
import Link from 'next/link';

export default function ServiceDetailPage() {
    const params = useParams();
    const [service, setService] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchService = async () => {
            try {
                // In a real app, you might fetch by ID. 
                // For now, we'll fetch all and find the one matching the ID from params.
                // Or if the API supports it: /api/services/${params.id}
                const res = await fetch(`https://skillsaarthi.onrender.com/api/services`);
                const data = await res.json();
                const found = data.find((s: any) => s._id === params.id);
                setService(found);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        if (params.id) fetchService();
        setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    }, [params.id]);

    const handleEditClick = (e: React.MouseEvent) => {
        e.preventDefault();
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0] || !service) return;

        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        formData.append('type', 'service');
        formData.append('id', service._id);

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
                alert('Hero image updated successfully!');
                // Update local state to reflect change immediately
                setService({ ...service, image: data.imageUrl + '?t=' + Date.now() });
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
            alert('Upload failed');
        }
    };

    const roleDetails: any = {
        'Carpenter': {
            heroImage: '/images/carpenter_hero.png',
            tasks: ['Furniture Making', 'Wood Polishing', 'Door Installation', 'Repair Works', 'Cabinet Assembly', 'Custom Woodwork', 'Window Frames', 'Interior Fittings'],
            images: [
                '/images/carpenter_main.png',
                'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80'
            ]
        },
        'Mason': {
            heroImage: '/images/mason_main.png',
            tasks: ['Bricklaying', 'Plastering', 'Tile Installation', 'Concrete Work', 'Foundation', 'Wall Repair', 'Flooring', 'Waterproofing'],
            images: [
                '/images/mason_main.png',
                'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80',
                'https://plus.unsplash.com/premium_photo-1663045625699-b14eb0a59a7b?auto=format&fit=crop&q=80'
            ]
        },
        'Painter': {
            heroImage: '/images/painter_main.png',
            tasks: ['Interior Painting', 'Exterior Painting', 'Wall Putty', 'Texture Painting', 'Wood Polishing', 'Waterproofing', 'Stencil Work', 'Wallpaper'],
            images: [
                '/images/painter_main.png',
                'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1595814433015-e6f5ce69614e?auto=format&fit=crop&q=80'
            ]
        },
        'Labour': {
            heroImage: '/images/labour_main.png',
            tasks: ['Material Shifting', 'Site Cleaning', 'Concrete Mixing', 'Digging', 'Loading/Unloading', 'Helper Work', 'Demolition', 'General Assistance'],
            images: [
                '/images/labour_main.png',
                '/images/labour_sub.png',
                'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80'
            ]
        },
        'Electrician': {
            heroImage: '/images/electrician_main.png',
            tasks: ['Wiring', 'Switch Installation', 'Fan/Light Fitting', 'Fuse Repair', 'Inverter Connection', 'MCB Installation', 'Earthing', 'Drilling'],
            images: [
                '/images/electrician_main.png',
                'https://images.unsplash.com/photo-1558402529-d2638a7023e9?auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&q=80'
            ]
        },
        'Plumber': {
            heroImage: '/images/plumber_main.png',
            tasks: ['Pipe Fitting', 'Leak Repair', 'Tap Installation', 'Drain Cleaning', 'Water Tank', 'Sanitary Logic', 'Basin Installation', 'Pipeline'],
            images: [
                '/images/plumber_main.png', // User provided blue shirt guy
                'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&q=80'
            ]
        }
    };

    const currentRoleData = service ? roleDetails[service.name] || roleDetails['Labour'] : roleDetails['Labour'];
    const tasks = currentRoleData.tasks;
    const workImages = currentRoleData.images;
    const heroImage = currentRoleData.heroImage;

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!service) return <div className="min-h-screen flex items-center justify-center">Service not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />
            {/* Hero Section */}
            <div className="bg-indigo-50 py-12 md:py-20">
                <div className="container mx-auto px-4 md:px-32 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-6">
                        <span className="inline-block bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
                            India's Trusted Construction Labour Platform
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                            Hire Professional <span className="text-indigo-600">{service.name}s</span> for <br className="hidden md:block" />
                            Construction & Site Work
                        </h1>
                        <p className="text-lg text-gray-700 max-w-xl">
                            From {tasks[0].toLowerCase()} to {tasks[1].toLowerCase()} — hire verified, experienced {service.name.toLowerCase()}s across India for your next project.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <button className="bg-white text-gray-900 border border-gray-300 px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors shadow-sm">
                                Download App Now
                            </button>
                            <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-indigo-200 shadow-lg flex items-center gap-2">
                                <Phone className="w-5 h-5" /> Call 9654007500
                            </button>
                        </div>
                        <div className="flex items-center gap-6 text-sm font-medium text-green-700 pt-2">
                            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Get Started for Only ₹5</span>
                            <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Trusted by 10,000+ Contractors</span>
                        </div>
                    </div>
                    <div className="flex-1 w-full max-w-lg md:max-w-xl relative aspect-video md:aspect-square rounded-2xl overflow-hidden shadow-2xl group">
                        {/* Fallback to generic image if service image fails or is duplicated */}
                        <Image
                            src={service.image || heroImage || "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop"}
                            alt={service.name}
                            fill
                            className="object-cover"
                            unoptimized
                        />
                        {isAdmin && (
                            <button
                                onClick={handleEditClick}
                                className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
                                title="Edit Hero Image (Admin)"
                            >
                                <Edit className="w-5 h-5 text-black" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Who Can Apply / Sub-categories & WORK IMAGES */}
            <div className="container mx-auto px-4 md:px-32 py-16">
                {/* Types of Work Only */}
                <div className="container mx-auto px-4 md:px-32 py-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">What {service.name}s Do?</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {tasks.map((item: string, idx: number) => (
                            <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                    <CheckCircle className="w-5 h-5" />
                                </div>
                                <span className="font-semibold text-gray-700">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* How to Hire Steps */}
            <div className="bg-white py-16 border-y border-gray-100">
                <div className="container mx-auto px-4 md:px-32">
                    <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center text-indigo-600">How to Hire in 4 Simple Steps</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { title: 'Post Your Requirement', desc: `Select the type of ${service.name} you need, work location, and start date.'`, icon: '📝' },
                            { title: 'Get Matched Instantly', desc: 'Our platform connects you with available workers nearby.', icon: '⚡' },
                            { title: 'View Profiles & Call', desc: 'See worker details, experience, and call directly from the app.', icon: '📱' },
                            { title: 'Hire & Start Work', desc: 'Finalize and get workers on-site quickly — no delays.', icon: '🤝' },
                        ].map((step, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center p-6">
                                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-4xl mb-6 shadow-lg shadow-blue-200 text-white">
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Demo Profiles */}
            <div className="container mx-auto px-4 md:px-32 py-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center text-indigo-600">Demo Profiles of {service.name}s</h2>
                <p className="text-center text-gray-600 mb-12">Get a glimpse of how {service.name.toLowerCase()}s are listed by skill and experience.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map((card) => (
                        <div key={card} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-shadow flex flex-col">
                            <div className="bg-blue-600 p-6 text-white pb-12 relative">
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center text-2xl font-bold">
                                        {card === 1 ? 'R' : card === 2 ? 'M' : 'S'}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{card === 1 ? 'Rajesh Kumar' : card === 2 ? 'Mukesh Singh' : 'Suresh Patel'}</h3>
                                        <p className="opacity-90 text-sm">{service.name}</p>
                                        <p className="opacity-75 text-xs mt-1">{card === 1 ? 'Bihar' : card === 2 ? 'Delhi' : 'Pune'}</p>
                                    </div>
                                </div>
                                <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md px-2 py-1 rounded text-xs font-semibold border border-white/20">
                                    Verified
                                </div>
                            </div>

                            <div className="px-6 relative -mt-6">
                                <div className="flex justify-between items-end">
                                    <div className="bg-white p-2 rounded-lg shadow-sm text-center min-w-[80px]">
                                        <p className="text-xs text-gray-500">Rating</p>
                                        <p className="font-bold text-gray-900">4.{8 + (card % 2)}</p>
                                    </div>
                                    <p className="font-bold text-blue-600 pb-2">₹{700 + (card * 50)}/day</p>
                                </div>
                            </div>

                            <div className="p-6 space-y-4 text-sm text-gray-600 flex-grow">
                                <div className="flex justify-between py-2 border-b border-gray-50">
                                    <span>Experience</span>
                                    <span className="font-semibold text-gray-900">{2 + card * 2} Years</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-50">
                                    <span>Availability</span>
                                    <span className="font-semibold text-green-600">Additional Info</span>
                                </div>
                                <p className="leading-relaxed text-xs">
                                    Experienced {service.name.toLowerCase()} with expertise in residential and commercial projects. Hardworking and reliable.
                                </p>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {['Repair', 'Fitting', 'Full Day'].map(tag => (
                                        <span key={tag} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">{tag}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 border-t border-gray-100 bg-gray-50">
                                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
                                    Contact Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
