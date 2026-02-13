import { ShieldCheck, Clock, Award, CreditCard } from 'lucide-react';

const features = [
    {
        icon: ShieldCheck,
        title: "100% Verified Pros",
        desc: "Background checked and trained professionals for your safety.",
        color: "text-blue-600",
        bg: "bg-blue-50"
    },
    {
        icon: Clock,
        title: "On-Time Service",
        desc: "We value your time. Our experts arrive at your scheduled slot.",
        color: "text-green-600",
        bg: "bg-green-50"
    },
    {
        icon: CreditCard,
        title: "Transparent Pricing",
        desc: "Standard rates for all services. No hidden charges or surprises.",
        color: "text-purple-600",
        bg: "bg-purple-50"
    },
    {
        icon: Award,
        title: "Service Guarantee",
        desc: "Not satisfied? We will redo the service free of cost.",
        color: "text-orange-600",
        bg: "bg-orange-50"
    }
];

export default function WhyChooseUs() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Skill Saarthi?</h2>
                    <p className="text-gray-600">
                        We are committed to delivering the best home service experience with our trusted network of professionals.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feat, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors">
                            <div className={`w-16 h-16 ${feat.bg} ${feat.color} rounded-2xl flex items-center justify-center mb-6`}>
                                <feat.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{feat.title}</h3>
                            <p className="text-gray-500 leading-relaxed">
                                {feat.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
