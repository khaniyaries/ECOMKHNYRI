"use client"
import { useState } from "react"
import toast from 'react-hot-toast'
import { env } from "../../../../../config/config.js"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [showOTPForm, setShowOTPForm] = useState(false)
  const [otp, setOtp] = useState("")

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${env.API_URL}/api/v1/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      })

      const data = await response.json()
      if (response.ok) {
        localStorage.setItem("resetPasswordUserId", data.userId)
        toast.success("OTP sent to your email")
        setShowOTPForm(true)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Failed to process request")
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${env.API_URL}/api/v1/auth/verify-forgot-password-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          otp,
          userId: localStorage.getItem("resetPasswordUserId")
        })
      })
  
      const data = await response.json()
      if (response.ok) {
        localStorage.setItem("resetToken", data.resetToken)
        toast.success("OTP verified successfully")
        return router.push("/reset-password")
      }
      
      toast.error(data.message)
    } catch (error) {
      toast.error("Verification failed")
    }
  }

  const handleResendOTP = async () => {
    try {
      const response = await fetch(`${env.API_URL}/api/v1/auth/resend-forgot-password-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: localStorage.getItem("resetPasswordUserId")
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
    <div className="h-[70vh] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold">Reset Password</h2>
          <p className="mt-2 text-center text-gray-600">Enter your email to receive OTP</p>
        </div>

        <form onSubmit={handleEmailSubmit} className="mt-8 space-y-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-red-600 text-white rounded-md"
          >
            Send OTP
          </button>
        </form>

        {showOTPForm && (
          <div className="mt-8">
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full px-3 py-2 border rounded-md"
                required
              />
              <button
                type="submit"
                className="w-full py-2 px-4 bg-red-600 text-white rounded-md"
              >
                Verify OTP
              </button>
            </form>
            <button
              onClick={handleResendOTP}
              className="mt-4 text-red-600 text-sm"
            >
              Resend OTP
            </button>
          </div>
        )}
      </div>
    </div>
  )
}