"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getDashboardProdi } from "@/lib/api";
import { testKaprodiApiConnection, getApiConfig } from "@/lib/api-test";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  const [apiConfig, setApiConfig] = useState(null);

  useEffect(() => {
    if (user?.prodi_id) {
      loadDashboardData();
    }
    setApiConfig(getApiConfig());
  }, [user]);

  const handleTestApi = async () => {
    if (!user?.prodi_id) {
      alert('❌ Prodi ID tidak tersedia');
      return;
    }

    console.log('Manual Kaprodi API test triggered for prodi_id:', user.prodi_id);
    const result = await testKaprodiApiConnection(user.prodi_id);
    if (result.success) {
      alert('✅ Kaprodi API Connection Successful!\nCheck console for details.');
    } else {
      alert('❌ Kaprodi API Connection Failed!\nCheck console for error details.');
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      console.log("Loading dashboard data for prodi_id:", user.prodi_id);
      const response = await getDashboardProdi(user.prodi_id);
      console.log("Dashboard API response:", response);

      // Sesuai dengan API spec sim.json: /dashboard/prodi/{id}
      setDashboardData({
        total_jurusan: response.total_jurusan || 0,
        total_mahasiswa: response.total_mahasiswa || 0,
        total_dosen: response.total_dosen || 0,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.status,
        data: error.data
      });

      // Fallback ke mock data jika API gagal
      const fallbackData = {
        total_jurusan: 3,
        total_mahasiswa: 150,
        total_dosen: 12,
      };

      console.log("Using fallback data:", fallbackData);
      setDashboardData(fallbackData);
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
        <p className="text-muted-foreground">
          Selamat datang, {user?.nama} - Program Studi{" "}
          {user?.prodi_id ? `ID: ${user.prodi_id}` : ""}
        </p>
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


    </div>
  );
}
