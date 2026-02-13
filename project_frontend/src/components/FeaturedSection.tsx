import { Star, MapPin, BadgeCheck, Clock } from 'lucide-react';
import Image from 'next/image';

const professionals = [
    {
        id: 1,
        name: "Rajesh Kumar",
        profession: "Electrician",
        rating: 4.8,
        jobs: 1240,
        location: "New Delhi",
        image: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        tags: ["Wiring", "Installation", "Repair"],
        price: "₹299/visit"
    },
    {
        id: 2,
        name: "Sunita Sharma",
        profession: "Beautician",
        rating: 4.9,
        jobs: 850,
        location: "Gurgaon",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        tags: ["Facial", "Makeup", "Bridal"],
        price: "₹999/session"
    },
    {
        id: 3,
        name: "Vikram Singh",
        profession: "Plumber",
        rating: 4.7,
        jobs: 2100,
        location: "Noida",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        tags: ["Leakage", "Fittings", "Tank"],
        price: "₹349/visit"
    }
];

export default function FeaturedSection() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-gray-900">Top Rated Professionals</h2>
                        <p className="text-gray-600">Highly skilled experts recommended by your neighbors</p>
                    </div>
                    <button className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline flex items-center gap-1">
                        View All Professionals
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {professionals.map((pro) => (
                        <div key={pro.id} className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                            <div className="flex gap-4">
                                <div className="relative w-20 h-20 shrink-0">
                                    <Image
                                        src={pro.image}
                                        alt={pro.name}
                                        fill
                                        className="object-cover rounded-xl"
                                    />
                                    <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md">
                                        <BadgeCheck className="w-5 h-5 text-green-500 fill-green-100" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">{pro.name}</h3>
                                    <p className="text-gray-500 text-sm font-medium">{pro.profession}</p>
                                    <div className="flex items-center gap-1 mt-1 text-amber-500">
                                        <Star className="w-4 h-4 fill-current" />
                                        <span className="font-bold text-sm">{pro.rating}</span>
                                        <span className="text-gray-400 text-xs">({pro.jobs} Jobs)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {pro.tags.map(tag => (
                                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                    <MapPin className="w-4 h-4" />
                                    {pro.location}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-gray-900">{pro.price}</span>
                                </div>
                            </div>

                            <button className="w-full mt-4 bg-gray-900 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-600 transition-colors">
                                Book Now
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
