"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import SuperAdminDashboard from "./super-admin/page"
import DekanDashboard from "./dekan/page"
import KaprodiDashboard from "./kaprodi/kaprodi-dashboard"
import TuFakultasDashboard from "./fakultas/page"
import TuProdiDashboard from "./tu-prodi/tu-prodi-dashboard"
import DosenDashboard from "./dosen/dosen-dashboard"
import MahasiswaDashboard from "./mahasiswa/mahasiswa-dashboard"

export default function Page() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && user.role_id) {
      // For now, redirect all users to their role-specific dashboard
      // You can add more role-based routing here
      if (user.role_id === 1) { // Assuming role_id 1 is Super Admin
        // Stay on current page as we show SuperAdminDashboard
        return
      } else if (user.role_id === 2) { // Assuming role_id 2 is Dekan
        // Stay on current page as we show DekanDashboard
        return
      } else if (user.role_id === 3) { // Assuming role_id 3 is TU Fakultas
        // Stay on current page as we show TuFakultasDashboard
        return
      } else if (user.role_id === 4) { // Assuming role_id 4 is Kaprodi
        // Stay on current page as we show KaprodiDashboard
        return
      } else if (user.role_id === 5) { // Assuming role_id 5 is TU PRODI
        // Stay on current page as we show TuProdiDashboard
        return
      } else if (user.role_id === 6) { // Assuming role_id 6 is Dosen
        // Stay on current page as we show DosenDashboard
        return
      } else if (user.role_id === 7) { // Assuming role_id 7 is Mahasiswa
        // Stay on current page as we show MahasiswaDashboard
        return
      }
      // Add other role redirects here
    }
  }, [user, router])

  if (!user) return null

  return (
    <>
      {user.role_id === 1 ? (
        <SuperAdminDashboard />
      ) : user.role_id === 2 ? (
        <DekanDashboard />
      ) : user.role_id === 3 ? (
        <TuFakultasDashboard />
      ) : user.role_id === 4 ? (
        <KaprodiDashboard />
      ) : user.role_id === 5 ? (
        <TuProdiDashboard />
      ) : user.role_id === 6 ? (
        <DosenDashboard />
      ) : user.role_id === 7 ? (
        <MahasiswaDashboard />
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold">Welcome to SIM Akademik</h2>
          <p className="text-muted-foreground">Dashboard for role ID: {user.role_id}</p>
        </div>
      )}
    </>
  );
}
