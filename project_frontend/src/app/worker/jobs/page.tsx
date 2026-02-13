"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WorkerJobs() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchJobs = async () => {
            const token = localStorage.getItem('workerToken');
            if (!token) {
                router.push('/worker/login');
                return;
            }

            try {
                const res = await fetch('http://localhost:5000/api/jobs/worker', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setJobs(data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [router]);

    const handleStatusUpdate = async (jobId: string, status: string) => {
        const token = localStorage.getItem('workerToken');
        try {
            const res = await fetch(`http://localhost:5000/api/jobs/${jobId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                // Remove job from list if accepted or rejected (or move to another tab)
                setJobs(jobs.filter(job => job._id !== jobId));
                alert(`Job ${status}`);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to update job status');
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Job Notifications</h1>
                <button onClick={() => router.push('/worker/dashboard')} className="text-indigo-600 hover:underline">Back to Dashboard</button>
            </header>

            {jobs.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">No new job notifications.</div>
            ) : (
                <div className="space-y-4">
                    {jobs.map((job) => (
                        <div key={job._id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800">{job.serviceType} Request</h2>
                                    <p className="text-gray-600 mt-1"><span className="font-medium">Customer:</span> {job.customerName}</p>
                                    <p className="text-gray-600"><span className="font-medium">Location:</span> {job.location}</p>
                                    {job.price && <p className="text-green-600 font-semibold mt-1">₹{job.price}</p>}
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-400">{new Date(job.createdAt).toLocaleTimeString()}</p>
                                </div>
                            </div>

                            <div className="mt-4 flex space-x-3">
                                <button
                                    onClick={() => handleStatusUpdate(job._id, 'Accepted')}
                                    className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleStatusUpdate(job._id, 'Rejected')}
                                    className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
