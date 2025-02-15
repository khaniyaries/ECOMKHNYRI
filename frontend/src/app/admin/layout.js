"use client"
import { usePathname } from 'next/navigation'
import AdminNavbar from "@/components/AdminComponents/AdminNavbar.jsx";

export default function AdminLayout({ children }) {
    const pathname = usePathname();

    if(pathname === "/admin") {
        return children;
    }

    return (
        <div className="grid h-screen lg:grid-cols-[auto,1fr]">
            <AdminNavbar />
            <div className="grid grid-rows-[auto,1fr]">
                <div className="h-16 lg:h-0"></div>
                <main className="overflow-x-hidden overflow-y-auto">
                    <div className="container mx-auto px-6 py-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
