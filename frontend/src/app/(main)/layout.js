"use client"

import Navbar from "@/components/Navbar.jsx"
import Footer from "@/components/Footer.jsx"
import SaleHeader from "@/components/SaleHeader.jsx"

export default function MainLayout({ children }) {
  return (
    <>
      <div className="hidden md:block h-12">
        <SaleHeader/>
      </div>
      <div className="md:h-20 h-14">
        <Navbar/>
      </div>
      <main className="flex-grow">
        {children}
      </main>
      <div className="w-full">
        <Footer />
      </div>
    </>
  )
}
