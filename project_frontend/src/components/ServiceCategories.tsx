import { Wrench, Zap, Paintbrush, Hammer, User, Home, Truck, Monitor } from 'lucide-react';
import Link from 'next/link';

const categories = [
    { name: 'Cleaning', icon: Home, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Electrician', icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { name: 'Plumber', icon: Wrench, color: 'text-cyan-600', bg: 'bg-cyan-100' },
    { name: 'Painter', icon: Paintbrush, color: 'text-pink-600', bg: 'bg-pink-100' },
    { name: 'Labour', icon: Hammer, color: 'text-gray-600', bg: 'bg-gray-100' },
    { name: 'Shop Helper', icon: User, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Movers', icon: Truck, color: 'text-orange-600', bg: 'bg-orange-100' },
    { name: 'Appliance', icon: Monitor, color: 'text-indigo-600', bg: 'bg-indigo-100' },
];

export default function ServiceCategories() {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Trusted blue-collar professionals for every need. From construction to daily help.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
                    {categories.map((cat, idx) => (
                        <Link
                            key={idx}
                            href={`/services/${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                            className="flex flex-col items-center gap-4 group cursor-pointer"
                        >
                            <div className={`w-20 h-20 rounded-2xl ${cat.bg} flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-lg`}>
                                <cat.icon className={`h-8 w-8 ${cat.color}`} />
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
                                {cat.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
