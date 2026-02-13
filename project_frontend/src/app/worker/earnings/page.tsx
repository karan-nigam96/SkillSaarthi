"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WorkerEarnings() {
    const [earnings, setEarnings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchEarnings = async () => {
            const token = localStorage.getItem('workerToken');
            if (!token) {
                router.push('/worker/login');
                return;
            }

            try {
                const res = await fetch('https://skillsaarthi.onrender.com/api/worker/earnings', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setEarnings(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchEarnings();
    }, [router]);

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!earnings) return null;

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Earnings & Wallet</h1>
                <button onClick={() => router.push('/worker/dashboard')} className="text-indigo-600 hover:underline">Back to Dashboard</button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md text-center border-t-4 border-green-500">
                    <p className="text-gray-500 font-medium">Wallet Balance</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">₹{earnings.walletBalance}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center border-t-4 border-blue-500">
                    <p className="text-gray-500 font-medium">Daily Earnings</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">₹{earnings.daily}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center border-t-4 border-purple-500">
                    <p className="text-gray-500 font-medium">Monthly Earnings</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">₹{earnings.monthly}</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Payout Options</h2>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <button className="flex-1 bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 transition font-medium">
                        Withdraw to Bank Account
                    </button>
                    <button className="flex-1 bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition font-medium">
                        UPI Transfer
                    </button>
                </div>
                <p className="text-sm text-gray-500 mt-4 text-center">Payouts are processed within 24 hours.</p>
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h2>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-4 text-center text-gray-500">No recent transactions found.</div>
                </div>
            </div>
        </div>
    );
}
