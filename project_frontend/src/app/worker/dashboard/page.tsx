"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Star, MapPin, Phone, Briefcase, Clock, IndianRupee } from 'lucide-react';

export default function WorkerDashboard() {
    const [worker, setWorker] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Availability State
    const [isAvailable, setIsAvailable] = useState(false);
    const [mode, setMode] = useState('Full Day');
    const [slots, setSlots] = useState<string[]>([]);
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('workerToken');
            if (!token) {
                router.push('/worker/login');
                return;
            }

            try {
                const res = await fetch('http://localhost:5000/api/worker/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setWorker(data);
                    setIsAvailable(data.isAvailable);
                    setMode(data.availabilityDetails?.mode || 'Full Day');
                    setSlots(data.availabilityDetails?.slots || []);
                } else {
                    localStorage.removeItem('workerToken');
                    router.push('/worker/login');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        const fetchApplications = async () => {
            const token = localStorage.getItem('workerToken');
            if (!token) return;

            try {
                const res = await fetch('http://localhost:5000/api/worker/applications', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setApplications(data);
                }
            } catch (error) {
                console.error("Failed to fetch applications", error);
            }
        };

        fetchProfile();
        fetchApplications();
    }, [router]);

    const updateAvailability = async (newIsAvailable: boolean, newMode: string, newSlots: string[]) => {
        const token = localStorage.getItem('workerToken');
        try {
            const res = await fetch('http://localhost:5000/api/worker/availability', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ isAvailable: newIsAvailable, mode: newMode, slots: newSlots }),
            });
            if (res.ok) {
                setIsAvailable(newIsAvailable);
                setMode(newMode);
                setSlots(newSlots);
                alert('Availability Updated!');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to update availability');
        }
    };

    const handleSlotChange = (slot: string) => {
        if (slots.includes(slot)) {
            updateAvailability(isAvailable, mode, slots.filter(s => s !== slot));
        } else {
            updateAvailability(isAvailable, mode, [...slots, slot]);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!worker) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-indigo-600 text-white p-4 shadow-md flex justify-between items-center">
                <h1 className="text-xl font-bold">Skill Saarthi Worker</h1>
                <button onClick={() => { localStorage.removeItem('workerToken'); router.push('/worker/login'); }} className="text-sm bg-indigo-800 px-3 py-1 rounded">Logout</button>
            </header>

            <main className="max-w-4xl mx-auto p-4 space-y-6">
                {/* Profile Card */}
                {/* Profile Card */}
                <div className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
                    <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center text-3xl font-bold text-gray-500 overflow-hidden shrink-0 border-4 border-white shadow-sm">
                        {worker.profilePhoto ? (
                            <img src={worker.profilePhoto} alt={worker.name} className="h-full w-full object-cover" />
                        ) : (
                            worker.name[0]
                        )}
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-2">
                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                            <h2 className="text-2xl font-bold text-gray-800">{worker.name}</h2>
                            <div className="flex items-center justify-center md:justify-start gap-1 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-100">
                                <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                                <span className="text-xs font-bold text-yellow-700">{worker.rating || 'New'}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <Briefcase className="w-4 h-4 text-gray-400" />
                                <span>{worker.skill}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span>{worker.experience} Yrs Exp</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span>{worker.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span>{worker.mobile}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => alert('Edit Profile functionality coming soon')}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                        Edit Profile
                    </button>
                </div>

                {/* Status / Availability */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Availability Status</h3>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" checked={isAvailable} onChange={(e) => updateAvailability(e.target.checked, mode, slots)} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            <span className="ml-3 text-sm font-medium text-gray-900">{isAvailable ? 'Available' : 'Not Available'}</span>
                        </label>
                    </div>

                    {isAvailable && (
                        <div className="space-y-4 border-t pt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Working Mode</label>
                                <select
                                    value={mode}
                                    onChange={(e) => updateAvailability(isAvailable, e.target.value, slots)}
                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                                >
                                    <option value="Full Day">Full Day</option>
                                    <option value="Half Day">Half Day</option>
                                    <option value="Specific Hours">Specific Hours</option>
                                </select>
                            </div>

                            {mode === 'Specific Hours' && (
                                <div>
                                    <span className="block text-sm font-medium text-gray-700 mb-2">Select Slots</span>
                                    <div className="flex space-x-2">
                                        {['Morning', 'Afternoon', 'Evening'].map(slot => (
                                            <button
                                                key={slot}
                                                onClick={() => handleSlotChange(slot)}
                                                className={`px-3 py-1 rounded-full text-sm border ${slots.includes(slot) ? 'bg-indigo-100 border-indigo-500 text-indigo-700' : 'bg-gray-50 border-gray-300 text-gray-600'}`}
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow text-center">
                        <p className="text-gray-500 text-sm">Today's Earnings</p>
                        <p className="text-xl font-bold text-green-600">₹{worker.earnings?.daily || 0}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow text-center">
                        <p className="text-gray-500 text-sm">Wallet Balance</p>
                        <p className="text-xl font-bold text-indigo-600">₹{worker.earnings?.walletBalance || 0}</p>
                    </div>
                </div>

                {/* My Applications */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">My Applications</h3>
                    {applications.length === 0 ? (
                        <p className="text-gray-500 text-sm">No applications found.</p>
                    ) : (
                        <div className="space-y-4">
                            {applications.map((app: any) => (
                                <div key={app._id} className="border-b last:border-0 pb-4 last:pb-0 flex justify-between items-center">
                                    <div>
                                        <h4 className="font-medium text-gray-900">{app.project?.role || 'Project Role'}</h4>
                                        <p className="text-sm text-gray-500">{app.project?.company} • {app.project?.location}</p>
                                        <p className="text-xs text-gray-400 mt-1">Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-bold capitalize ${app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                        app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {app.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Navigation Links */}
                <div className="grid grid-cols-2 gap-4">
                    <button className="bg-white p-4 rounded-lg shadow hover:bg-gray-50 text-indigo-600 font-medium">
                        View Job Notifications
                    </button>
                    <button className="bg-white p-4 rounded-lg shadow hover:bg-gray-50 text-indigo-600 font-medium">
                        Detailed Earnings
                    </button>
                </div>

            </main>
        </div>
    );
}
