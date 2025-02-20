"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'
import { env } from "../../../../config/config.js"

export function useAdminAuth() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin')
    setIsAuthenticated(!!isAdmin)
    if (!isAdmin) {
      router.replace('/admin')
    }
  }, [router])

  const login = async ({ username, password }) => {
    try {
      const response = await axios.post(`${env.API_URL}/api/v1/adminLogin`, {
        username,
        password
      })

      if (response?.data?.success) {
        document.cookie = "isAdmin=true; path=/; max-age=86400; secure; samesite=strict"
        localStorage.setItem('admin', username)
        localStorage.setItem('isAdmin', 'true')
        setIsAuthenticated(true)
        toast.success(response.data.message)
        router.push('admin/dashboard')
      } else {
        toast.error("There was some problem, try again..")
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  const logout = () => {
    document.cookie = "isAdmin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    localStorage.removeItem('admin')
    localStorage.removeItem('isAdmin')
    setIsAuthenticated(false)
    router.push('/admin')
  }

  return { isAuthenticated, login, logout }
}
