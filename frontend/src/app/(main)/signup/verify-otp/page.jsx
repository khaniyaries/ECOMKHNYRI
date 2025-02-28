"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from 'react-hot-toast'
import { env } from "../../../../../config/config.js"

export default function VerifyOTP() {
  const router = useRouter()
  const [otp, setOtp] = useState("")

  const handleVerify = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${env.API_URL}/api/v1/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          otp,
          userId: localStorage.getItem("pendingUserId")
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        // Store user data after successful verification
        localStorage.setItem("token", data.token)
        localStorage.setItem("userId", data.user._id)
        localStorage.setItem("userName", data.user.name)
        localStorage.removeItem("pendingUserId") // Clean up
  
        toast.success("Email verified successfully!")
        router.push("/user/myaccount")
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Verification failed")
    }
  }

  const handleResend = async () => {
    try {
      const response = await fetch(`${env.API_URL}/api/v1/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId: localStorage.getItem("pendingUserId")
        })
      })

      const data = await response.json()
      if (response.ok) {
        if (data.validUntil) {
          toast.success("Current OTP is still valid. Please check your email.")
        } else {
          toast.success("New OTP sent successfully!")
        }
      } else {
        toast.error(data.message)
      }
  } catch (error) {
    toast.error("Failed to resend OTP")
  }
  }

  return (
    <div className="h-[70vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the OTP sent to your email
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleVerify}>
          <div>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Verify OTP
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            onClick={handleResend}
            className="text-sm text-red-600 hover:text-red-500"
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  )
}