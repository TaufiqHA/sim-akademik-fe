"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getDashboardMahasiswa } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconSchool,
  IconClipboard,
  IconFileText,
  IconDownload,
  IconCalendar,
  IconChartBar,
  IconUsers,
  IconEye,
  IconPlus,
  IconUpload,
} from "@tabler/icons-react";
import Link from "next/link";

export default function MahasiswaDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    current_semester: "-",
    total_sks: 0,
    ipk: 0.0,
    status_krs: "Belum Submit",
    mata_kuliah_semester: 0,
    tugas_pending: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await getDashboardMahasiswa();
      setStats(data);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      // Use mock data if API fails
      setStats({
        current_semester: "2024/2025 Ganjil",
        total_sks: 120,
        ipk: 3.45,
        status_krs: "Approved",
        mata_kuliah_semester: 6,
        tugas_pending: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusKrsBadge = (status) => {
    switch (status) {
      case "Draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "Submitted":
        return <Badge variant="outline">Submitted</Badge>;
      case "Approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Akademik</h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Semester Aktif</CardTitle>
            <IconCalendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{stats.current_semester}</div>
            <p className="text-xs text-muted-foreground">Periode aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total SKS</CardTitle>
            <IconSchool className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_sks}</div>
            <p className="text-xs text-muted-foreground">SKS terkumpul</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IPK</CardTitle>
            <IconChartBar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ipk}</div>
            <p className="text-xs text-muted-foreground">Indeks prestasi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status KRS</CardTitle>
            <IconClipboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getStatusKrsBadge(stats.status_krs)}
            </div>
            <p className="text-xs text-muted-foreground">Semester ini</p>
          </CardContent>
        </Card>
      </div>



      {/* Current Semester Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <IconUsers className="w-5 h-5 mr-2" />
            Mata Kuliah Semester Ini
          </CardTitle>
          <CardDescription>
            Ringkasan mata kuliah yang sedang diambil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{stats.mata_kuliah_semester}</p>
              <p className="text-sm text-muted-foreground">Mata kuliah</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{stats.tugas_pending}</p>
              <p className="text-sm text-muted-foreground">Tugas pending</p>
            </div>
            <Link href="/dashboard/mahasiswa/jadwal">
              <Button variant="outline">
                <IconCalendar className="w-4 h-4 mr-2" />
                Lihat Jadwal
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
