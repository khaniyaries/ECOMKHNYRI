import "./globals.css"
import "../../config/firebase.js"
import { Geist, Geist_Mono } from "next/font/google"
import ToasterProvider from '@/components/ToasterProvider.jsx'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-gray-50`}>
        <ToasterProvider />
        {children}
      </body>
    </html>
  )
}
