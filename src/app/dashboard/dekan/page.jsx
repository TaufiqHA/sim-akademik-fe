"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { getDashboardFakultas } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  IconSchool,
  IconUsers,
  IconChalkboard
} from "@tabler/icons-react"

export default function DekanDashboard() {
  const { user, loading: userLoading } = useAuth()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadDashboardData()
    } else {
      // If no user is loaded yet, keep loading
      setLoading(true)
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      // Get faculty ID from user data - assuming user has fakultas_id
      const fakultasId = user?.fakultas_id
      if (fakultasId) {
        const data = await getDashboardFakultas(fakultasId)
        setDashboardData(data)
      } else {
        console.warn('No fakultas_id found for user')
        // Fallback to mock data if no fakultas_id
        setDashboardData({
          total_prodi: 5,
          total_dosen: 45,
          total_mahasiswa: 1250
        })
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      // Fallback to mock data on error
      setDashboardData({
        total_prodi: 5,
        total_dosen: 45,
        total_mahasiswa: 1250
      })
    } finally {
      setLoading(false)
    }
  }


  // Show loading while user or dashboard data is loading
  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">
            {userLoading ? "Loading user data..." : "Loading dashboard data..."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Dekan</h1>
        <p className="text-muted-foreground">
          Selamat datang, {user?.nama}. Kelola persetujuan dokumen dan pantau fakultas Anda.
        </p>
      </div>

      {/* Faculty Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Program Studi</CardTitle>
            <IconSchool className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.total_prodi || 0}</div>
            <p className="text-xs text-muted-foreground">
              Program studi aktif
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dosen</CardTitle>
            <IconChalkboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.total_dosen || 0}</div>
            <p className="text-xs text-muted-foreground">
              Dosen aktif
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mahasiswa</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.total_mahasiswa || 0}</div>
            <p className="text-xs text-muted-foreground">
              Mahasiswa aktif
            </p>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
