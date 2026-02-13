"use client";

import SectionHeading from "@/components/SectionHeading";

export default function ProjectApplicationForm() {
    return (
        <section className="py-12 bg-gray-50 rounded-2xl my-12">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <SectionHeading title="Submit Your Interest" />
                <p className="text-gray-600 mb-8">
                    Fill the form below to submit your interest - our team will connect you with the project PoC.
                </p>

                <form className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" placeholder="Enter your name" required />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Phone Number *</label>
                        <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" placeholder="+91 98765 43210" required />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input type="email" suppressHydrationWarning={true} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" placeholder="you@example.com" />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Current Location *</label>
                        <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" placeholder="City, State" required />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Trade / Expertise *</label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all">
                            <option value="">Select your expertise</option>
                            <option value="civil_contractor">Civil Contractor</option>
                            <option value="labour_supply">Labour Supply</option>
                            <option value="carpenter">Carpenter</option>
                            <option value="painter">Painter</option>
                            <option value="welder">Welder</option>
                            <option value="electrician">Electrician</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Workforce Strength</label>
                        <input type="number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" placeholder="How many workers do you have?" />
                    </div>

                    <div className="md:col-span-2 pt-4">
                        <button type="submit" className="w-full md:w-auto bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                            Submit Application
                        </button>
                    </div>

                </form>
            </div>
        </section>
    );
}
