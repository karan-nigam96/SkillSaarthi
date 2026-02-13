import ConstructionServices from "@/components/ConstructionServices";
import ConstructionFeatures from "@/components/ConstructionFeatures";

export default function ConstructionPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <div className="space-y-4 md:space-y-8 pb-20 pt-6">
                <ConstructionServices />
                <ConstructionFeatures />
            </div>
        </div>
    );
}
