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

      // Auto-login in development mode if no token exists
      if (!token && process.env.NODE_ENV === 'development') {
        const mockUser = {
          id: 1,
          nama: 'Mahasiswa Demo',
          email: 'mahasiswa@demo.com',
          role_id: 7, // Mahasiswa
          fakultas_id: 1,
          prodi_id: 1
        }

        if (typeof window !== 'undefined') {
          localStorage.setItem('access_token', 'mock_dev_token')
          localStorage.setItem('user', JSON.stringify(mockUser))
        }

        setUser(mockUser)
        setLoading(false)
        return
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
