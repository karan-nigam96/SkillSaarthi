import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-100 py-12">
            <div className="container mx-auto px-4 md:px-32">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Brand Column */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-white">Skill Saarthi</h3>
                        <p className="text-gray-400 text-sm">
                            Connecting skilled blue-collar professionals with customers. From construction to daily chores, we help you get the job done.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">Company</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/careers" className="hover:text-white transition-colors">Join as Professional</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">Top Services</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/services/cleaning" className="hover:text-white transition-colors">Home Cleaning</Link></li>
                            <li><Link href="/services/labour" className="hover:text-white transition-colors">Construction Labour</Link></li>
                            <li><Link href="/services/plumber" className="hover:text-white transition-colors">Plumbers & Electricians</Link></li>
                            <li><Link href="/services/painting" className="hover:text-white transition-colors">Painters</Link></li>
                            <li><Link href="/services/helper" className="hover:text-white transition-colors">Shop Helpers</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">Contact Us</h4>
                        <ul className="space-y-3 text-sm text-gray-400">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-indigo-500 shrink-0" />
                                <span>123 Skill Street, Tech Park, New Delhi, India</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-indigo-500 shrink-0" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-indigo-500 shrink-0" />
                                <span>support@skillsaarthi.com</span>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} Skill Saarthi. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
