"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, Edit } from "lucide-react";

export default function ConstructionFeatures() {
    const [content, setContent] = useState<any>({});
    const [isAdmin, setIsAdmin] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedSectionKey, setSelectedSectionKey] = useState<string | null>(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/content');
                const data = await res.json();
                setContent(data);
            } catch (error) {
                console.error('Failed to fetch content', error);
            }
        };
        fetchContent();
        setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    }, []);

    const handleEditClick = (e: React.MouseEvent, key: string) => {
        e.preventDefault();
        setSelectedSectionKey(key);
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0] || !selectedSectionKey) return;

        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        formData.append('type', 'site_content');
        formData.append('id', selectedSectionKey);

        try {
            const token = localStorage.getItem('customerToken');
            const res = await fetch('http://localhost:5000/api/admin/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            const data = await res.json();
            if (res.ok) {
                alert('Image updated successfully!');
                // Update local state with cache busting
                setContent((prev: any) => ({
                    ...prev,
                    [selectedSectionKey]: { ...prev[selectedSectionKey], imageUrl: data.imageUrl + '?t=' + Date.now() }
                }));
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error(error);
            alert('Upload failed');
        }
    };

    const getImage = (key: string, fallback: string) => {
        return content[key]?.imageUrl || fallback;
    };

    return (
        <div className="flex flex-col gap-20 py-16 bg-white overflow-hidden relative">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />

            {/* Section 1: Change the Game */}
            <section className="container mx-auto px-4 md:px-32 relative group">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="w-full lg:w-1/2 relative">
                        {/* Beige background shape */}
                        <div className="absolute -top-10 -left-10 w-3/4 h-3/4 bg-[#FFE8D6] rounded-3xl -z-10"></div>
                        <div className="relative rounded-3xl overflow-hidden shadow-xl">
                            <Image
                                src={getImage('construction_change_game', '/features/change_the_game.png')}
                                alt="Construction workers team"
                                width={600}
                                height={400}
                                className="w-full h-auto object-cover"
                                unoptimized
                            />
                            {isAdmin && (
                                <button
                                    onClick={(e) => handleEditClick(e, 'construction_change_game')}
                                    className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
                                >
                                    <Edit className="w-4 h-4 text-black" />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-blue-700 leading-tight">
                            Change the Game in Construction Jobs
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Say goodbye to the old routine of waiting at labor chowks for work. Skill Saarthi, a trusted construction workers hiring platform, brings construction jobs right to your fingertips. Find opportunities based on your skills and location, access expert training resources, and secure better pay—without the need to migrate.
                        </p>
                    </div>
                </div>
            </section>

            {/* Section 2: Our Solution */}
            <section className="w-full bg-[#FAFAFA] py-12 relative group-solution">
                <div className="container mx-auto px-4 md:px-32 text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-blue-700 mb-6">Our solution</h2>
                    <p className="text-gray-600 max-w-4xl mx-auto text-lg leading-relaxed">
                        The Skill Saarthi worker app empowers skilled laborers by providing a platform to showcase their expertise and connect with potential employers. Workers can create detailed profiles highlighting their skills, experience, and certifications. The app offers real-time job listings, allowing workers to find and apply for jobs that match their skill set. Additionally, it features a secure payment system, ensuring timely and fair compensation. Workers can also receive ratings and reviews from employers, helping them build a strong reputation. This app not only simplifies the job search process but also enhances job security and career growth for workers.
                    </p>
                </div>
                <div className="container mx-auto px-4 md:px-32">
                    <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl">
                        <Image
                            src={getImage('construction_solution', '/features/our_solution.png')}
                            alt="Skill Saarthi App Interface"
                            width={1200}
                            height={600}
                            className="w-full h-auto object-cover"
                            unoptimized
                        />
                        {isAdmin && (
                            <button
                                onClick={(e) => handleEditClick(e, 'construction_solution')}
                                className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
                            >
                                <Edit className="w-4 h-4 text-black" />
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Section 3: Time to Make Better */}
            <section className="container mx-auto px-4 md:px-32">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="w-full lg:w-1/2 space-y-6 order-2 lg:order-1">
                        <h2 className="text-3xl md:text-4xl font-bold text-blue-700 leading-tight">
                            Time to Make Construction Jobs Better
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            In a world full of opportunities, it's time to build a brighter future in the construction industry. Skill Saarthi, a leading construction workers hiring platform, empowers daily wage workers by connecting them with the right construction jobs based on their skills. Join us in creating a strong network where workers and employers come together to transform the industry. Let's build success—together!
                        </p>
                        <div className="flex gap-4 pt-4">
                            <div className="bg-green-500 rounded-full p-3 text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
                            </div>
                            <button className="bg-blue-700 text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-blue-800 transition-colors">
                                DOWNLOAD OUR APP <ArrowUpRight size={20} />
                            </button>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 relative order-1 lg:order-2">
                        <div className="flex gap-4">
                            <div className="w-1/2 pt-12">
                                <div className="rounded-3xl overflow-hidden shadow-lg h-full relative min-h-[300px]">
                                    {/* LEFT IMAGE OF SPLIT - For now treating as same key or separate if user wanted. 
                                         User said "thses all section". 
                                         The screenshot showed two images. 
                                         I will use ONE key for the main image for now as implemented previously.
                                         Or better: 'construction_make_better_1' and 'construction_make_better_2'?
                                         I'll stick to 'construction_make_better' to keep it simple as previous implementation used one file path for both slots (or reused).
                                         Actually, previously I used it for both slots? No, I see fetchContent usage.
                                         The previous code had:
                                         src="/features/time_to_make_better.png" for LEFT
                                         src="/features/time_to_make_better.png" for RIGHT
                                         So I will keep using the same key for both, or let admin edit them to be the SAME image.
                                         If admin wants different, I need 2 keys. 
                                         I'll Add a suffix for the right one: 'construction_make_better_right'
                                     */}
                                    <Image
                                        src={getImage('construction_make_better', '/features/time_to_make_better.png')}
                                        alt="Construction worker"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                    {isAdmin && (
                                        <button
                                            onClick={(e) => handleEditClick(e, 'construction_make_better')}
                                            className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
                                        >
                                            <Edit className="w-4 h-4 text-black" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2 pb-12">
                                <div className="rounded-3xl overflow-hidden shadow-lg h-full relative min-h-[300px] bg-gray-200">
                                    <Image
                                        src={getImage('construction_make_better_right', '/features/time_to_make_better.png')}
                                        alt="Women construction workers"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                    {isAdmin && (
                                        <button
                                            onClick={(e) => handleEditClick(e, 'construction_make_better_right')}
                                            className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
                                        >
                                            <Edit className="w-4 h-4 text-black" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 4: Hire / Find Cards */}
            <section className="container mx-auto px-4 md:px-32">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Card 1 */}
                    <div className="bg-[#1e1b4b] rounded-3xl p-10 md:p-14 text-white relative overflow-hidden group">
                        <div className="relative z-10 space-y-6">
                            <h3 className="text-3xl md:text-4xl font-bold">Hire the best talent</h3>
                            <p className="text-gray-300 text-lg">
                                “Streamline your hiring process and find top talent effortlessly! Download Skill Saarthi today!”
                            </p>
                            {/* ... stats ... */}
                            <div className="flex gap-12 pt-4">
                                <div>
                                    <div className="text-4xl font-bold">160,000+</div>
                                    <div className="text-gray-400 mt-1">Worker network</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-bold">10+</div>
                                    <div className="text-gray-400 mt-1">Worker skills</div>
                                </div>
                            </div>
                            <button className="bg-white text-blue-900 px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-gray-100 transition-colors mt-4">
                                <span className="text-xl">▶</span> DOWNLOAD BUSINESS APP
                            </button>
                        </div>
                        {/* Decorative circle/glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-[#2563eb] rounded-3xl p-10 md:p-14 text-white relative overflow-hidden group">
                        <div className="relative z-10 space-y-6">
                            <h3 className="text-3xl md:text-4xl font-bold">Find your next job</h3>
                            <p className="text-blue-100 text-lg">
                                “Unlock endless job opportunities and secure your future with just one click! Download Skill Saarthi now!”
                            </p>
                            {/* ... stats ... */}
                            <div className="flex gap-12 pt-4">
                                <div>
                                    <div className="text-4xl font-bold">12,000+</div>
                                    <div className="text-blue-200 mt-1">Employers for you</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-bold">10,000+</div>
                                    <div className="text-blue-200 mt-1">Monthly job openings</div>
                                </div>
                            </div>
                            <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-gray-100 transition-colors mt-4">
                                <span className="text-xl">▶</span> DOWNLOAD WORKER APP
                            </button>
                        </div>
                        {/* Decorative circle/glow */}
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-[100px] opacity-20 translate-y-1/2 -translate-x-1/2"></div>
                    </div>
                </div>
            </section>

        </div>
    );
}
