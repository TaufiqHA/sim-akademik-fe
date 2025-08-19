"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { IconUsers, IconClipboard, IconCalendar, IconFile } from "@tabler/icons-react"

export default function TuProdiDashboard() {
  const menuItems = [
    {
      title: "Manajemen Data Mahasiswa",
      description: "Tambah, edit, dan kelola data mahasiswa",
      icon: IconUsers,
      href: "/dashboard/tu-prodi/mahasiswa",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "KRS & Nilai",
      description: "Validasi KRS dan input nilai mahasiswa",
      icon: IconClipboard,
      href: "/dashboard/tu-prodi/krs-nilai",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Jadwal Kuliah & Ujian",
      description: "Kelola jadwal kuliah dan ujian",
      icon: IconCalendar,
      href: "/dashboard/tu-prodi/jadwal",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Pengajuan Surat",
      description: "Kelola pengajuan surat akademik",
      icon: IconFile,
      href: "/dashboard/tu-prodi/surat",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard TU PRODI</h1>
      </div>


      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total Mahasiswa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">+12 dari bulan lalu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">KRS Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">Memerlukan validasi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Surat Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Menunggu persetujuan</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
