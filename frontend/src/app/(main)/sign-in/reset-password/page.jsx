"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from 'react-hot-toast'
import { env } from "../../../../../config/config.js"

export default function ResetPassword() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const resetToken = localStorage.getItem("resetToken")
    const userId = localStorage.getItem("resetPasswordUserId")
  
    console.log('Reset attempt with:', { resetToken, userId }) // Debug log
  
    if (password !== confirmPassword) {
      return toast.error("Passwords don't match")
    }
  
    try {
      const response = await fetch(`${env.API_URL}/api/v1/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          newPassword: password,
          resetToken
        })
      })
  
      const data = await response.json()
      
      if (response.ok) {
        localStorage.removeItem("resetPasswordUserId")
        localStorage.removeItem("resetToken")
        toast.success("Password updated successfully")
        router.push("/sign-in")
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Failed to update password")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-bold">Create New Password</h2>
          <p className="mt-2 text-center text-gray-600">Enter your new password</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-red-600 text-white rounded-md"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  )
}