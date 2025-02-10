"use client"
import "../globals.css";
import { usePathname } from 'next/navigation'
import AdminNavbar from "@/components/AdminComponents/AdminNavbar";

export default function AdminLayout({ children }) {
    const pathname = usePathname();

    // For the admin root path
    if(pathname === "/admin"){
        return (
            <html lang="en">
                <body className="min-h-screen bg-gray-50">     
                    {children}
                </body>
            </html>
        );
    }

    // For all other admin routes
    return (
        <html lang="en">
            <body className="min-h-screen bg-gray-50">
                <div className="grid h-screen lg:grid-cols-[auto,1fr]">
                    {/* Left column - Sidebar */}
                    <AdminNavbar />
                    
                    {/* Right column - Content */}
                    <div className="grid grid-rows-[auto,1fr]">
                        {/* Empty header space on desktop, actual header on mobile */}
                        <div className="h-16 lg:h-0"></div>
                        
                        {/* Main content */}
                        <main className="overflow-x-hidden overflow-y-auto">
                            <div className="container mx-auto px-6 py-8">
                                {children}
                            </div>
                        </main>
                    </div>
                </div>
            </body>
        </html>
    );
}