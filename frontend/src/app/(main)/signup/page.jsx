"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { auth } from '../../../../config/firebase.js'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import Image from "next/image"
import Link from "next/link"
import toast from 'react-hot-toast'
import { env } from "../../../../config/config.js"

export default function SignupPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
      name: "",
      emailOrPhone: "",  // Changed from email
      password: ""
  })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
      e.preventDefault()
      try {
          const response = await fetch(`${env.API_URL}/api/v1/auth/signup`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formData)
          })
          const data = await response.json()
          
          if (response.ok) {
            localStorage.setItem("pendingUserId", data.user._id)
            toast.success("Account created! Please verify your email.")
            router.push("/signup/verify-otp")
          } else {
            toast.error(data.message || "Signup failed")
          }
      } catch (error) {
          toast.error("Network error occurred")
      }
  }  

    const handleGoogleSignup = async () => {
        try {
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth, provider)
            
            const response = await fetch(`${env.API_URL}/api/v1/auth/google/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: result.user.email,
                    name: result.user.displayName,
                    photo: result.user.photoURL
                })
            })
            
            const data = await response.json()
            if (data.success) {
                localStorage.setItem("token", data.token)
                localStorage.setItem("userId", data.user._id)
                localStorage.setItem("userName", data.user.name)
                toast.success("Signed up with Google successfully!")
                router.push("/user/myaccount")
            }
        } catch (error) {
            toast.error("Google signup failed")
        }
    }

    return (
        <div className="min-h-screen py-10 grid md:grid-cols-2">
            <div className="hidden md:block bg-[#E5F2F5] relative">
                <Image
                    fill
                    src="/images/signup-image.png"
                    alt="Shopping cart with smartphone and shopping bags"
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>

            <div className="flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-semibold">Create an account</h1>
                        <p className="text-gray-600">Enter your details below</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Name"
                                    className="w-full px-4 py-3 border-b border-gray-300 focus:border-red-500 focus:outline-none transition-colors"
                                    required
                                />
                            </div>

                            <div>
                              <input
                                  type="email"  // Changed from email to text
                                  name="emailOrPhone"  // Changed from email
                                  value={formData.emailOrPhone}
                                  onChange={handleChange}
                                  placeholder="Email"
                                  className="w-full px-4 py-3 border-b border-gray-300 focus:border-red-500 focus:outline-none transition-colors"
                                  required
                               />
                            </div>

                            <div>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    className="w-full px-4 py-3 border-b border-gray-300 focus:border-red-500 focus:outline-none transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-red-500 text-white py-4 rounded hover:bg-red-600 transition-colors"
                        >
                            Create Account
                        </button>

                        <button
                            type="button"
                            onClick={handleGoogleSignup}
                            className="w-full border border-gray-300 py-4 rounded flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                        >
                            <svg viewBox="0 0 24 24" className="w-5 h-5">
                              <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              />
                              <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              />
                              <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                              />
                              <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                              />
                            </svg>
                            Sign up with Google
                        </button>
                    </form>

                    <div className="text-center text-gray-600">
                        Already have an account?{" "}
                        <Link href="/sign-in" className="text-gray-900 hover:underline">
                            Log in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
