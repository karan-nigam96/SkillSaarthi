import Image from 'next/image';
import Link from 'next/link';
import { Home, Zap, Wrench, Paintbrush, Hammer, User, Monitor, Bug } from 'lucide-react';

const categories = [
    { name: "Construction Labour", icon: Hammer, href: "/services/labour", color: "text-orange-600" },
    { name: "Shop Helper", icon: User, href: "/services/helper", color: "text-purple-600" },
    { name: "Cleaning", icon: Home, href: "/services/cleaning", color: "text-violet-600" },
    { name: "Electrician, Plumber", icon: Wrench, href: "/services/repairs", color: "text-blue-600" },
    { name: "Full home painting", icon: Paintbrush, href: "/services/painting", color: "text-pink-600" },
    { name: "Appliance Repair", icon: Zap, href: "/services/appliances", color: "text-sky-600" },
    { name: "Pest Control", icon: Bug, href: "/services/pest-control", color: "text-red-500" },
    // Keeping one visual slot empty or using 7 items is fine, or add one more
];

export default function Hero() {
    return (
        <section className="relative bg-white pt-8 pb-16 md:pt-12 md:pb-20">
            <div className="container mx-auto px-6 md:px-32">

                {/* Heading */}
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 md:mb-12 tracking-tight pl-2">
                    Skilled hands for your <br /> every need
                </h1>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                    {/* Left: Service Selection Card */}
                    <div className="w-full lg:w-[45%] bg-white rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 p-6 md:p-8">
                        <h2 className="text-xl font-semibold text-gray-600 mb-6 uppercase tracking-wider text-sm">What work do you need done?</h2>

                        <div className="grid grid-cols-3 gap-y-8 gap-x-4">
                            {categories.map((cat, idx) => (
                                <Link
                                    key={idx}
                                    href={cat.href}
                                    className="flex flex-col items-center gap-3 group text-center"
                                >
                                    <div className="w-14 h-14 md:w-16 md:h-16 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-gray-100 group-hover:shadow-md transition-all relative">
                                        <cat.icon className={`h-6 w-6 md:h-7 md:w-7 ${cat.color}`} />
                                    </div>
                                    <span className="text-[11px] md:text-xs font-medium text-gray-700 leading-tight max-w-[80px]">
                                        {cat.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right: Hero Collage/Image */}
                    <div className="w-full lg:w-[55%] grid grid-cols-2 gap-4 h-full min-h-[400px]">
                        <div className="space-y-4 pt-12">
                            <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-lg">
                                <Image
                                    src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80"
                                    alt="Construction Worker" // Construction/Architectural
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="relative h-48 w-full rounded-2xl overflow-hidden shadow-lg">
                                <Image
                                    src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80"
                                    alt="AC Repair"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-lg">
                                <Image
                                    src="https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?auto=format&fit=crop&w=800&q=80"
                                    alt="Painter"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
