"use client"
import { useState, useEffect } from 'react';
import { AiOutlineSend } from "react-icons/ai";
import { RiFacebookLine, RiLinkedinLine } from "react-icons/ri";
import { LuTwitter } from "react-icons/lu";
import { FaInstagram } from "react-icons/fa";

import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle email submission
    };

    return (
        <footer className="bg-black w-full font-poppins text-white py-10 px-6 flex justify-center">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-8 text-center md:text-left place-items-center lg:place-items-start">
                    {/* Column 1 - Exclusive */}
                    <div>
                        <h3 className="text-lg md:text-xl font-poppins font-medium">Exclusive</h3>
                        <p className="mt-2">Subscribe</p>
                        <p className="text-xs md:text-sm">Get 10% off your first order</p>
                        <form onSubmit={handleSubmit} className="mt-3 border border-white p-2 flex items-center justify-between">
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email" 
                                className="bg-transparent outline-none flex-1 text-xs md:text-sm md:px-2 px-1 w-24 md:w-32" 
                            />
                            <button type="submit" aria-label="Submit email" className="text-white">
                                <AiOutlineSend />
                            </button>
                        </form>
                    </div>

                    {/* Column 2 - Support */}
                    <div>
                        <h3 className="text-lg md:text-xl font-poppins font-medium">Support</h3>
                        <address className="mt-2 text-xs md:text-sm not-italic">
                            INDIA 🇮🇳<br />
                            contact.yarees@gmail.com<br />
                            +91 7051350219
                        </address>
                    </div>

                    {/* Column 3 - Account */}
                    <div className="order-2 md:order-none">
                        <h3 className="text-lg md:text-xl font-poppins font-medium">Account</h3>
                        <nav>
                            <ul className="mt-2 space-y-1">
                                {['My Account', 'Login / Register', 'Cart', 'Wishlist', 'Shop'].map((item) => (
                                    <li key={item}>
                                        <Link href="/" className="hover:underline text-sm md:text-base">{item}</Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                    
                    {/* Column 4 - Quick Links */}
                    <div className="order-2 md:order-none">
                        <h3 className="text-lg md:text-xl font-poppins font-medium">Quick Link</h3>
                        <nav>
                            <ul className="mt-2 space-y-1">
                                <li>
                                    <Link href="/privacy-policy" className="text-sm md:text-base hover:underline">Privacy Policy</Link>
                                </li>
                                <li>
                                    <Link href="/terms-of-use" className="text-sm md:text-base hover:underline">Terms Of Use</Link>
                                </li>
                                <li>
                                    <Link href="/return-policy" className="text-sm md:text-base hover:underline">Return Policy</Link>
                                </li>
                                <li>
                                    <Link href="/contact-us" className="text-sm md:text-base hover:underline">Contact</Link>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {/* Column 5 - Download App */}
                    <div className="col-span-2 md:col-span-1 order-3 md:order-none lg:col-span-1 lg:order-none">
                        <h3 className="text-lg md:text-xl font-poppins font-medium">Download App</h3>
                        <p className="mt-2 text-xs md:text-sm font-extralight text-[#fafafa8d]">Save $3 with App New User Only</p>
                        <div className="mt-3 flex flex-row gap-2">
                            <Image 
                                src="/images/qr-code.png" 
                                alt="QR Code" 
                                width={80} 
                                height={80} 
                                className="mx-auto md:mx-0"
                            />
                            <div className="flex flex-col gap-2 mt-2 justify-center md:justify-start">
                                <Image src="/images/download-playstore.png" alt="Google Play" width={106} height={32} />
                                <Image src="/images/download-appstore.png" alt="App Store" width={106} height={36} />
                            </div>
                        </div>
                        <div className='flex w-full justify-center gap-5 mt-2 flex-row'>
                            <RiFacebookLine />
                            <LuTwitter />
                            <FaInstagram />
                            <RiLinkedinLine />
                        </div>
                    </div>
                </div>

                <div className="text-center text-gray-400/50 text-sm mt-10">
                     © 2025 Yarees. All rights reserved
                </div>
            </div>
        </footer>
    );
};

export default Footer;
