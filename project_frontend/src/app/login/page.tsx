"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [role, setRole] = useState<'user' | 'worker' | null>(null);
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        mobile: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRoleSelect = (selectedRole: 'user' | 'worker') => {
        if (selectedRole === 'worker') {
            router.push('/worker/login');
        } else {
            setRole('user');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const endpoint = isLogin ? '/api/customer/login' : '/api/customer/register';

        try {
            const res = await fetch(`https://skillsaarthi.onrender.com${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('customerToken', data.token);
                localStorage.setItem('customerInfo', JSON.stringify(data));

                if (data.isAdmin) {
                    localStorage.setItem('isAdmin', 'true');
                } else {
                    localStorage.removeItem('isAdmin');
                }

                alert(isLogin ? 'Login Successful!' : 'Registration Successful!');
                router.push('/');
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
            alert('Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    if (!role) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Select Your Role
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Choose how you want to continue
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 space-y-4">
                        <button
                            onClick={() => handleRoleSelect('user')}
                            className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-black hover:bg-gray-50 transition-all group"
                        >
                            <div className="text-left">
                                <h3 className="font-bold text-lg text-gray-900">Customer / User</h3>
                                <p className="text-sm text-gray-500">I want to hire workers</p>
                            </div>
                            <span className="text-2xl group-hover:scale-110 transition-transform">🏠</span>
                        </button>

                        <button
                            onClick={() => handleRoleSelect('worker')}
                            className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-600 hover:bg-indigo-50 transition-all group"
                        >
                            <div className="text-left">
                                <h3 className="font-bold text-lg text-gray-900">Worker / Contractor</h3>
                                <p className="text-sm text-gray-500">I want to apply for jobs</p>
                            </div>
                            <span className="text-2xl group-hover:scale-110 transition-transform">👷</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <button
                    onClick={() => setRole(null)}
                    className="mb-4 text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1"
                >
                    ← Back to role selection
                </button>
                <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
                    {isLogin ? 'Customer Login' : 'Create Account'}
                </h2>

                {/* Google Login Removed */}
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleAuth}>
                        {!isLogin && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input name="name" type="text" required value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                                    <input name="mobile" type="text" required value={formData.mobile} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Address (Optional)</label>
                                    <input name="address" type="text" value={formData.address} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm" />
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input name="email" type="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input name="password" type="password" required value={formData.password} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm" />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                            >
                                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="relative flex justify-center text-sm">
                                <button
                                    onClick={() => setIsLogin(!isLogin)}
                                    className="font-medium text-black hover:text-gray-500"
                                >
                                    {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
