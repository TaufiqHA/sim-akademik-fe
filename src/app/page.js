"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && user) {
        // Jika sudah login, arahkan ke dashboard
        router.replace("/dashboard")
      } else {
        // Jika belum login, arahkan ke login
        router.replace("/login")
      }
    }
  }, [user, loading, isAuthenticated, router])

  // Tampilkan loading saat mengecek status autentikasi
  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Return null karena user akan di-redirect
  return null
}
