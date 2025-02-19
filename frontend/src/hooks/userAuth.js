"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { cartStorage } from '@/utils/cartStorage.js'
import { cartApi } from '@/utils/cartapi.js'

export function useAuth() {
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        // Initialize state with localStorage check if in browser
        if (typeof window !== 'undefined') {
            return !!localStorage.getItem('token')
        }
        return false
    })
    
    const [user, setUser] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('userName')
        }
        return null
    })

    const login = async (token, userData) => {
        localStorage.setItem('token', token)
        localStorage.setItem('userId', userData._id)
        localStorage.setItem('userName', userData.name)
        setIsAuthenticated(true)
        setUser(userData.name)

        const guestCartItems = cartStorage.getCartItems()
        if (guestCartItems.length > 0) {
            await cartApi.migrateGuestCart(guestCartItems)
            cartStorage.clearCart()
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('userName')
        setIsAuthenticated(false)
        setUser(null)
        toast.success('Logged out successfully')
        router.push('/')
    }

    return { isAuthenticated, user, login, logout }
}
