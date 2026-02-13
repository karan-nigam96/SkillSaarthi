"use client";

import { User, Mail, Phone, MapPin, Camera } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Pre-fill data if available in localStorage
        const storedInfo = localStorage.getItem('customerInfo');
        if (storedInfo) {
            const info = JSON.parse(storedInfo);
            setFormData(prev => ({
                ...prev,
                name: info.name !== 'New User' ? info.name : '',
                mobile: info.mobile || '',
                // other fields usually not in basic login response unless we fetch profile separately
            }));
        } else {
            // Not logged in, redirect to login
            router.push('/login');
        }
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('customerToken');

        if (!token) {
            alert('Please login first');
            router.push('/login');
            return;
        }

        try {
            const res = await fetch('https://skillsaarthi.onrender.com/api/customer/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok) {
                // Update local storage with new name
                localStorage.setItem('customerInfo', JSON.stringify(data));
                alert('Profile Saved Successfully!');
                router.push('/');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to save profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-2xl">

                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
                    <p className="text-gray-600 mt-2">Update your details to manage bookings.</p>
                </div>

                <form className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6" onSubmit={handleSubmit}>

                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center justify-center mb-6">
                        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center relative cursor-pointer group overflow-hidden border-2 border-dashed border-gray-300 hover:border-indigo-500 transition-colors">
                            <Camera className="w-8 h-8 text-gray-400 group-hover:text-indigo-500" />
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                        <span className="text-sm text-gray-500 mt-2">Upload Profile Picture</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" /> Full Name
                            </label>
                            <input name="name" type="text" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400" /> Phone Number
                            </label>
                            <input name="mobile" type="tel" value={formData.mobile} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" placeholder="9876543210" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" /> Email Address
                        </label>
                        <input name="email" type="email" value={formData.email} onChange={handleChange} suppressHydrationWarning={true} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" placeholder="john@example.com" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" /> Address
                        </label>
                        <textarea name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all h-24 resize-none" placeholder="Enter your full address" />
                    </div>

                    <div className="pt-4">
                        <button type="submit" disabled={loading} className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200">
                            {loading ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
}
