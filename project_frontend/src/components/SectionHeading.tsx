export default function SectionHeading({ title, subtitle }: { title: string, subtitle?: string }) {
    return (
        <div className="mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
            {subtitle && <p className="text-gray-500 mt-2 text-sm md:text-base">{subtitle}</p>}
        </div>
    );
}
