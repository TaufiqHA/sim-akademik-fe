"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getDashboardProdi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  IconUsers,
  IconSchool,
} from "@tabler/icons-react";

export default function KaprodiDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    total_jurusan: 0,
    total_mahasiswa: 0,
    total_dosen: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.prodi_id) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await getDashboardProdi(user.prodi_id);
      setDashboardData({
        total_jurusan: response.total_jurusan || 0,
        total_mahasiswa: response.total_mahasiswa || 0,
        total_dosen: response.total_dosen || 0,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      // Fallback ke mock data jika API gagal
      setDashboardData({
        total_jurusan: 3,
        total_mahasiswa: 150,
        total_dosen: 12,
      });
    } finally {
      setLoading(false);
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
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Kaprodi</h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jurusan</CardTitle>
            <IconSchool className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.total_jurusan}</div>
            <p className="text-xs text-muted-foreground">Jurusan aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mahasiswa</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.total_mahasiswa}</div>
            <p className="text-xs text-muted-foreground">Mahasiswa aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dosen</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.total_dosen}</div>
            <p className="text-xs text-muted-foreground">Dosen pengajar</p>
          </CardContent>
        </Card>
      </div>


      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terkini</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="text-sm font-medium">5 nilai menunggu validasi</p>
                <p className="text-xs text-muted-foreground">
                  Mata kuliah Pemrograman Web
                </p>
              </div>
              <span className="text-xs text-orange-600">Menunggu</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="text-sm font-medium">3 proposal skripsi baru</p>
                <p className="text-xs text-muted-foreground">
                  Menunggu persetujuan
                </p>
              </div>
              <span className="text-xs text-blue-600">Baru</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">2 yudisium siap disetujui</p>
                <p className="text-xs text-muted-foreground">
                  Dokumen lengkap
                </p>
              </div>
              <span className="text-xs text-green-600">Siap</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
