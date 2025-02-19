import { usePathname } from 'next/navigation'
import { useState, useEffect } from "react"
import Link from "next/link"
import { useAdminAuth } from '@/hooks/useAdminAuth'
import Image from "next/image"
import { TbLogout2 } from "react-icons/tb";
import { MdCategory } from "react-icons/md";
import { GiKnightBanner } from "react-icons/gi";

const AdminNavbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { isAuthenticated, logout } = useAdminAuth()

  const pathname = usePathname()

  useEffect(() => {
    if (isMobile) {
        setIsSidebarOpen(false)
    }
}, [pathname, isMobile])

  useEffect(() => {

    if (!isAuthenticated) {
      return
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
      setIsSidebarOpen(window.innerWidth >= 1024)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center h-16 bg-white border-b border-gray-200">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-4"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </header>

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40
        w-72 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-0
    `}>
        <div className="flex items-center gap-2 p-6 border-b">
          <Image 
            src="/images/logo.png" 
            alt="Logo" 
            width={60} height={35} 
            className="rounded" 
          />
          <span className="font-semibold text-xl">Admin Panel</span>
          {isMobile && (
            <button 
                onClick={() => setIsSidebarOpen(false)}
                className="ml-auto hover:bg-gray-100 rounded-full border"
            >
                <svg 
                    className="w-6 h-6" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
        )}
        </div>

        <nav className="p-4 space-y-2">
          <Link 
            href="/admin/dashboard" 
            className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg"
            onClick={() => isMobile && setIsSidebarOpen(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Dashboard
          </Link>
          <Link 
            href="/admin/analytics" 
            className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg"
            onClick={() => isMobile && setIsSidebarOpen(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M3 3v18h18M7 16v-4m4 4V9m4 7v-2m4 2V7"
              />
            </svg>
            Analytics
          </Link>
          <Link 
            href="/admin/products" 
            className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg"
            onClick={() => isMobile && setIsSidebarOpen(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            Products
          </Link>
          <Link 
            href="/admin/orders" 
            className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg"
            onClick={() => isMobile && setIsSidebarOpen(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            Orders
          </Link>
          <Link 
            href="/admin/customers" 
            className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg"
            onClick={() => isMobile && setIsSidebarOpen(false)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Customers
          </Link>
          <Link 
            href="/admin/categories" 
            className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg"
            onClick={() => isMobile && setIsSidebarOpen(false)}
          >
            <MdCategory />
            Categories
          </Link>
          <Link 
            href="/admin/banners" 
            className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg"
            onClick={() => isMobile && setIsSidebarOpen(false)}
          >
            <GiKnightBanner />
            Banners
          </Link>
          <button
            className="flex w-full items-center gap-2 p-2 hover:bg-gray-50 rounded-lg"
            onClick={() => {
              isMobile && setIsSidebarOpen(false)
              logout()
            }}
          >
            <TbLogout2 />
            Logout
          </button>
        </nav>
      </aside>
    </>
  )
}

export default AdminNavbar;