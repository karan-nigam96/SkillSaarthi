"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, ShoppingCart, User, MapPin, ChevronDown, LogOut } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { useLocation } from '@/context/LocationContext';
import LocationSearchModal from './LocationSearchModal';

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const { toggleCart, cartCount } = useCart();
    const { location } = useLocation();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userType, setUserType] = useState<'customer' | 'worker' | null>(null);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        // Check for customer token
        const customerToken = localStorage.getItem('customerToken');
        const workerToken = localStorage.getItem('workerToken');

        if (customerToken) {
            setIsLoggedIn(true);
            setUserType('customer');
        } else if (workerToken) {
            setIsLoggedIn(true);
            setUserType('worker');
        } else {
            setIsLoggedIn(false);
            setUserType(null);
        }
    }, [pathname]); // Re-check on route change

    const handleLogout = () => {
        localStorage.removeItem('customerToken');
        localStorage.removeItem('customerInfo');
        localStorage.removeItem('workerToken');
        localStorage.removeItem('workerInfo');
        setIsLoggedIn(false);
        setUserType(null);
        router.push('/');
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const isActive = (path: string) => {
        if (path === '/' && pathname === '/') return true;
        if (path !== '/' && pathname?.startsWith(path)) return true;
        return false;
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
            <div className="container mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between gap-4">

                {/* Left: Logo & Nav */}
                <div className="flex items-center gap-8 md:gap-12">
                    <Link href="/" className="flex items-center shrink-0">
                        <Image src="/logo.png" alt="Skill Saarthi" width={150} height={40} className="h-10 w-auto object-contain" />
                    </Link>

                    {/* Desktop Nav Links */}
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link
                            href="/"
                            className={`transition-colors ${isActive('/') ? 'text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Home Services
                        </Link>
                        <Link
                            href="/construction"
                            className={`transition-colors ${isActive('/construction') ? 'text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Construction
                        </Link>
                        <Link
                            href="/projects"
                            className={`transition-colors ${isActive('/projects') ? 'text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Projects
                        </Link>
                    </nav>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-4 md:gap-6 flex-1 justify-end">

                    {/* Location & Search (Desktop) */}
                    <div className="hidden md:flex items-center gap-2 max-w-lg w-full justify-end">
                        {/* Location Dropdown */}
                        <div
                            onClick={() => setIsLocationModalOpen(true)}
                            className="flex items-center gap-2 bg-gray-50 px-3 py-2.5 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors min-w-[200px]"
                        >
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-900 truncate flex-1 max-w-[150px]">
                                {location.address}
                            </span>
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                        </div>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="flex items-center gap-2 bg-white px-3 py-2.5 rounded-lg border border-gray-300 w-full max-w-[300px] shadow-sm focus-within:shadow-md transition-shadow">
                            <Search className="h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search for 'AC service'"
                                className="bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-400 w-full flex-1"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>
                    </div>

                    {/* Icons */}
                    <div className="flex items-center gap-4 text-gray-600">
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative" onClick={toggleCart}>
                            <ShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">{cartCount}</span>}
                        </button>

                        {isLoggedIn ? (
                            <div className="relative">
                                <button
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                >
                                    <User className="h-5 w-5" />
                                </button>
                                {showProfileMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100 ring-1 ring-black ring-opacity-5 z-50">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{userType === 'worker' ? 'Worker Account' : 'Customer Account'}</p>
                                        </div>
                                        <Link
                                            href={userType === 'worker' ? "/worker/dashboard" : "/profile"}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setShowProfileMenu(false)}
                                        >
                                            {userType === 'worker' ? 'Worker Dashboard' : 'My Profile'}
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50  flex items-center gap-2"
                                        >
                                            <LogOut className="w-4 h-4" /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link href="/login" className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                                Login
                            </Link>
                        )}

                    </div>
                </div>
            </div>

            <LocationSearchModal
                isOpen={isLocationModalOpen}
                onClose={() => setIsLocationModalOpen(false)}
            />
        </header>
    );
}
