import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import SectionHeading from './SectionHeading';

const offers = [
    {
        id: 1,
        title: "Home Painting",
        subtitle: "starting at ₹5/sq.ft",
        bg: "bg-[#716d64]",
        image: "https://loremflickr.com/300/200/painter,wall/all",
        btnText: "Book free survey"
    },
    {
        id: 2,
        title: "Bathroom Cleaning",
        subtitle: "at ₹399 only",
        bg: "bg-[#e3f0d3]",
        image: "https://loremflickr.com/300/200/bathroom,cleaning/all",
        btnText: "Book now",
        isLight: true
    },
    {
        id: 3,
        title: "Electrician Visit",
        subtitle: "Safety check @ ₹149",
        bg: "bg-[#e8dcd9]",
        image: "https://loremflickr.com/300/200/electrician/all",
        btnText: "Book electrician",
        isLight: true
    }
];

export default function OffersSection() {
    return (
        <section className="py-12">
            <div className="container mx-auto px-4 md:px-6">
                <SectionHeading title="Offers & discounts" />

                <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4 md:pb-0 snap-x">
                    {offers.map((offer) => (
                        <div
                            key={offer.id}
                            className={`min-w-[300px] md:min-w-[380px] h-[200px] rounded-2xl relative overflow-hidden flex-shrink-0 snap-start shadow-sm border border-gray-100 ${!offer.image ? 'bg-gray-800' : 'bg-white'}`}
                        >
                            {/* Background Image/Color container setup - using absolute for full cover */}
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src={offer.image}
                                    alt={offer.title}
                                    fill
                                    className="object-cover"
                                />
                                {/* Overlay gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-r ${offer.isLight ? 'from-white/90 via-white/50 to-transparent' : 'from-black/80 via-black/40 to-transparent'}`} />
                            </div>

                            <div className="relative z-10 p-6 flex flex-col justify-between h-full h-full items-start">
                                <div className={offer.isLight ? 'text-gray-900' : 'text-white'}>
                                    <h3 className="text-xl font-bold leading-tight">{offer.title}</h3>
                                    <p className={`text-lg font-medium opacity-90 ${offer.isLight ? 'text-gray-700' : 'text-gray-200'}`}>{offer.subtitle}</p>
                                </div>
                                <button className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${offer.isLight
                                    ? 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 shadow-sm'
                                    : 'bg-white text-gray-900 hover:bg-gray-100'
                                    }`}>
                                    {offer.btnText}
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* View All Card */}
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
