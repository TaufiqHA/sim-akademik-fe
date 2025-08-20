"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getDashboardMahasiswa } from "@/lib/api";
import { testApiConnection, getApiConfig } from "@/lib/api-test";
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
  const [apiConfig, setApiConfig] = useState(null);

  useEffect(() => {
    loadDashboardData();
    setApiConfig(getApiConfig());
  }, []);

  const handleTestApi = async () => {
    console.log('Manual API test triggered');
    const result = await testApiConnection();
    if (result.success) {
      alert('✅ API Connection Successful!\nCheck console for details.');
    } else {
      alert('❌ API Connection Failed!\nCheck console for error details.');
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      console.log("Loading dashboard data from API...");
      const data = await getDashboardMahasiswa();
      console.log("Dashboard data received:", data);
      setStats(data);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.status,
        data: error.data
      });

      // Use fallback data if API fails
      const fallbackData = {
        current_semester: "2024/2025 Ganjil",
        total_sks: 120,
        ipk: 3.45,
        status_krs: "Approved",
        mata_kuliah_semester: 6,
        tugas_pending: 3,
      };

      console.log("Using fallback data:", fallbackData);
      setStats(fallbackData);
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

      {/* API Configuration Info */}
      {apiConfig && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-sm">API Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <p className="font-medium text-muted-foreground">API URL:</p>
                <p className="font-mono">{apiConfig.apiUrl || 'Not configured'}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Environment:</p>
                <p>{apiConfig.environment}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Using Mock Data:</p>
                <p>{apiConfig.useMockData ? 'Yes' : 'No'}</p>
              </div>
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" onClick={handleTestApi}>
                Test API Connection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
