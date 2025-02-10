"use client"
import Image from "next/image"
import Link from "next/link"
export default function SigninPage() {
    return (
      <div className="min-h-screen py-10 grid md:grid-cols-2">
        {/* Left Column - Image */}
        <div className="hidden md:block bg-[#E5F2F5] relative">
          <Image
            fill
            src="/images/signup-image.png"
            alt="Shopping cart with smartphone and shopping bags"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
  
        {/* Right Column - Form */}
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-medium font-inter">Log in to Exclusive</h1>
              <p className="font-poppins text-base font-normal">Enter your details below</p>
            </div>
  
            {/* Form */}
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-4">  
                {/* Email/Phone Input */}
                <div>
                  <input
                    type="text"
                    placeholder="Email or Phone Number"
                    className="w-full px-4 py-3 border-b border-gray-300 focus:border-red-500 focus:outline-none transition-colors placeholder:text-base placeholder:font-poppins placeholder:font-normal"
                    required
                  />
                </div>
  
                {/* Password Input */}
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-3 border-b border-gray-300 focus:border-red-500 focus:outline-none transition-colors placeholder:text-base placeholder:font-poppins placeholder:font-normal"
                    required
                  />
                </div>
              </div>
  
              {/* Login and forgot password buttons */}
              <div className="flex flex-row w-full justify-between items-center">
                <button
                    type="submit"
                    className="w-max px-4 md:px-10 bg-red-500 text-white py-3 rounded hover:bg-red-600 transition-colors"
                >
                    Log In
                </button>
                <Link 
                href="/user/forgot-password"
                className="text-red-500 text-sm md:text-base font-poppins">
                    Forgot Password?
                </Link>

              </div>
              
            </form>
  
            {/* Login Link */}
            <div className="text-center text-gray-600">
              Don't have an account yet?{" "}
              <Link href="/user/signup" className="text-gray-900 hover:underline">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  