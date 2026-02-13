import Image from 'next/image';
import SectionHeading from './SectionHeading';
import { ArrowRight } from 'lucide-react';

const items = [
    { name: "Construction Labour", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=300&q=80" },
    { name: "Shop Helper", image: "https://images.unsplash.com/photo-1556741533-6e6a62bd8b49?auto=format&fit=crop&w=300&q=80" },
    { name: "Full Home Cleaning", image: "/images/full-home-cleaning.png" },
    { name: "Painter", image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=300&q=80" },
    { name: "Carpenter", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80" },
];

export default function NewAndNoteworthy() {
    return (
        <section className="py-12 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <SectionHeading title="Helpers & Labour Services" />
                <p className="text-gray-600 mb-8 mt-2">Find reliable daily wage workers and shop assistants.</p>

                <div className="flex gap-6 overflow-x-auto no-scrollbar snap-x pb-4">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-3 min-w-[160px] md:min-w-[200px] snap-start cursor-pointer group">
                            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-100">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <span className="text-sm md:text-base font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                {item.name}
                            </span>
                        </div>
                    ))}
                    <div className="min-w-[50px] flex items-center justify-center">
                        <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:shadow-md transition-shadow bg-white">
                            <ArrowRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
