"use client"

import { useState, useEffect, useContext, createContext } from 'react'
import { getCurrentUser, getStoredUser, getStoredToken, logout as apiLogout } from '@/lib/api'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      let token = getStoredToken()

      // Only auto-login in development mode if token exists or user is already on dashboard
      if (!token && process.env.NODE_ENV === 'development') {
        // Check if we're on a page that should require authentication
        const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''
        const shouldAutoLogin = currentPath.startsWith('/dashboard') || currentPath === '/dashboard'

        if (shouldAutoLogin) {
          const mockUser = {
            id: 2,
            nama: 'Dekan Fakultas Teknik',
            email: 'dekan@ft.example.com',
            role_id: 2, // Dekan
            fakultas_id: 3, // Fakultas Teknik
            prodi_id: null
          }

          if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', 'mock_dev_token')
            localStorage.setItem('user', JSON.stringify(mockUser))
          }

          setUser(mockUser)
          setLoading(false)
          return
        }
      }

      if (token) {
        const storedUser = getStoredUser()
        if (storedUser) {
          setUser(storedUser)
        }

        try {
          const currentUser = await getCurrentUser()
          setUser(currentUser)
        } catch (error) {
          console.error('Failed to get current user:', error)
          await logout()
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const logout = async () => {
    try {
      await apiLogout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
    }
  }

  const value = {
    user,
    setUser,
    logout,
    loading,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
