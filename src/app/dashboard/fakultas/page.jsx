"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  IconChalkboard,
  IconFile,
  IconInnerShadowTop,
  IconUsers,
  IconFileText,
  IconCheck,
  IconLoader2
} from "@tabler/icons-react"
import Link from "next/link"
import { getTuFakultasDashboardStats } from "@/lib/api"
import { toast } from "sonner"

export default function TuFakultasPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    total_dosen: 0,
    dokumen_pending: 0,
    dokumen_approved: 0,
    total_dokumen: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      const dashboardStats = await getTuFakultasDashboardStats()
      setStats(dashboardStats)
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      toast.error("Gagal memuat statistik dashboard")
    } finally {
      setLoading(false)
    }
  }

  const dashboardCards = [
    {
      title: "Manajemen Dosen",
      description: "Kelola data dosen fakultas",
      icon: IconChalkboard,
      href: "/dashboard/fakultas/dosen",
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Dokumen Fakultas",
      description: "Upload dan arsip dokumen",
      icon: IconFile,
      href: "/dashboard/fakultas/dokumen",
      color: "text-green-600 dark:text-green-400"
    },
    {
      title: "Distribusi Dokumen",
      description: "Distribusi dokumen ke Dekan",
      icon: IconInnerShadowTop,
      href: "/dashboard/fakultas/distribusi",
      color: "text-purple-600 dark:text-purple-400"
    }
  ]

  const quickStats = [
    {
      title: "Total Dosen",
      value: loading ? <IconLoader2 className="h-4 w-4 animate-spin" /> : stats.total_dosen.toString(),
      icon: IconUsers,
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Dokumen Pending",
      value: loading ? <IconLoader2 className="h-4 w-4 animate-spin" /> : stats.dokumen_pending.toString(),
      icon: IconFileText,
      color: "text-orange-600 dark:text-orange-400"
    },
    {
      title: "Dokumen Approved",
      value: loading ? <IconLoader2 className="h-4 w-4 animate-spin" /> : stats.dokumen_approved.toString(),
      icon: IconCheck,
      color: "text-green-600 dark:text-green-400"
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard TU Fakultas</h1>
        <p className="text-muted-foreground">
          Selamat datang, {user?.nama} - {user?.fakultas_nama || 'Fakultas'}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {typeof stat.value === 'string' ? stat.value : stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Dashboard Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dashboardCards.map((card, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <card.icon className={`h-6 w-6 ${card.color}`} />
                <CardTitle className="text-lg">{card.title}</CardTitle>
              </div>
              <CardDescription>
                {card.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href={card.href}>
                  Kelola {card.title}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terbaru</CardTitle>
          <CardDescription>
            Ringkasan aktivitas terbaru dalam sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Dokumen "Panduan Akademik 2024" telah diupload</span>
              <span className="text-xs text-muted-foreground ml-auto">2 jam lalu</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Data dosen Dr. Ahmad Suryadi telah ditambahkan</span>
              <span className="text-xs text-muted-foreground ml-auto">5 jam lalu</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm">Dokumen telah didistribusikan ke Dekan</span>
              <span className="text-xs text-muted-foreground ml-auto">1 hari lalu</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
