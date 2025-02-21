"use client"
import { useState, useEffect } from 'react';
import Link from "next/link";
import { env } from '../../config/config.js';

const SaleHeader = () => {
    const [headerData, setHeaderData] = useState({
        headerText: '',
        linkText: '',
        linkUrl: ''
    });

    useEffect(() => {
        const fetchHeaderData = async () => {
            try {
                const response = await fetch(`${env.API_URL}/api/v1/saleheader/current`);
                const data = await response.json();
                setHeaderData(data);
            } catch (error) {
                console.error('Error fetching sale header:', error);
            }
        };

        fetchHeaderData();
    }, []);

    return(
        <div className="w-full h-full flex bg-black text-white items-center">
            <div className="mx-auto">
                <h1 className="text-sm font-poppins font-normal">
                    {headerData.headerText}
                    <Link 
                        href={headerData.linkUrl}
                        className="ml-2 font-semibold underline"
                    > 
                        {headerData.linkText}
                    </Link>
                </h1>
            </div>
            <div className="pr-4">
                <select className="appearance-none bg-black border-none outline-none cursor-pointer pr-6 text-sm font-poppins">
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                </select>
                <svg className="w-4 h-4 -ml-6 pointer-events-none inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    )
}

export default SaleHeader;