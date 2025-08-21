"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  getDashboardMahasiswa,
  getKrsMahasiswa,
  getKhsMahasiswa,
} from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  IconSchool,
  IconClipboard,
  IconChartBar,
  IconCalendar,
  IconRefresh,
  IconBell,
  IconAlertCircle,
} from "@tabler/icons-react";
import Link from "next/link";

export default function MahasiswaDashboard() {
  const { user } = useAuth();

  // Dashboard data based on sim.json API response
  const [dashboardData, setDashboardData] = useState({
    ipk: 0.0,
    sks: 0,
    notifikasi: [],
  });

  // Additional data from other APIs
  const [krsList, setKrsList] = useState([]);
  const [khsList, setKhsList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.id) {
      loadAllData();
    }
  }, [user]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load dashboard data from /dashboard/mahasiswa API
      console.log("📊 Loading dashboard data from /dashboard/mahasiswa API...");
      const dashboard = await getDashboardMahasiswa();
      console.log("📊 Dashboard API response:", dashboard);
      setDashboardData(dashboard || { ipk: 0.0, sks: 0, notifikasi: [] });

      // Load KRS data
      console.log("📋 Loading KRS data...");
      const krs = await getKrsMahasiswa(user.id);
      setKrsList(Array.isArray(krs) ? krs : []);

      // Load KHS data
      console.log("📈 Loading KHS data...");
      const khs = await getKhsMahasiswa(user.id);
      setKhsList(Array.isArray(khs) ? khs : []);
    } catch (error) {
      console.error("❌ Error loading dashboard data:", error);
      setError(`Gagal memuat data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentSemesterKrs = () => {
    // Find the most recent KRS or current semester KRS
    return (
      krsList.find(
        (krs) => krs.status === "Approved" || krs.status === "Submitted"
      ) || krsList[0]
    );
  };

  const getCurrentSemesterInfo = () => {
    const currentKrs = getCurrentSemesterKrs();
    if (currentKrs && currentKrs.tahun_akademik) {
      return `${currentKrs.tahun_akademik.tahun} ${currentKrs.tahun_akademik.semester}`;
    }
    return "Belum ada data";
  };

  const getKrsStatus = () => {
    const currentKrs = getCurrentSemesterKrs();
    return currentKrs ? currentKrs.status : "Belum Dibuat";
  };

  const getStatusBadge = (status) => {
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
          <p className="mt-2 text-muted-foreground">Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard Mahasiswa
          </h1>
          <p className="text-muted-foreground">
            Ringkasan data akademik berdasarkan API sim.json
          </p>
          {error && (
            <Alert className="mt-4 border-red-200 bg-red-50">
              <IconAlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-600">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </div>
        <Button variant="outline" onClick={loadAllData} disabled={loading}>
          <IconRefresh className="w-4 h-4 mr-2" />
          {loading ? "Loading..." : "Refresh"}
        </Button>
      </div>

      {/* Main Statistics - Based on API Data */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IPK</CardTitle>
            <IconChartBar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.ipk?.toFixed(2) || "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">
              Indeks Prestasi Kumulatif
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total SKS</CardTitle>
            <IconSchool className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.sks || 0}</div>
            <p className="text-xs text-muted-foreground">SKS Terkumpul</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status KRS</CardTitle>
            <IconClipboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getStatusBadge(getKrsStatus())}
            </div>
            <p className="text-xs text-muted-foreground">
              Semester: {getCurrentSemesterInfo()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Notifications Section */}
      {dashboardData.notifikasi && dashboardData.notifikasi.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconBell className="w-5 h-5 mr-2" />
              Notifikasi ({dashboardData.notifikasi.length})
            </CardTitle>
            <CardDescription>
              Pemberitahuan dari sistem akademik
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {dashboardData.notifikasi.map((notif, index) => (
                <Alert key={index}>
                  <IconBell className="h-4 w-4" />
                  <AlertDescription>{notif}</AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* KRS Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <IconClipboard className="w-5 h-5 mr-2" />
            Ringkasan KRS
          </CardTitle>
          <CardDescription>Data KRS berdasarkan API /krs</CardDescription>
        </CardHeader>
        <CardContent>
          {krsList.length === 0 ? (
            <div className="text-center py-8">
              <IconClipboard className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                Belum ada data KRS
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Data KRS akan muncul setelah melakukan pengisian KRS.
              </p>
              <Link
                href="/dashboard/mahasiswa/krs"
                className="mt-4 inline-block"
              >
                <Button>
                  <IconClipboard className="w-4 h-4 mr-2" />
                  Lihat KRS
                </Button>
              </Link>
            </div>
          ) : (
            <div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium">Total KRS:</p>
                  <p className="text-2xl font-bold">{krsList.length}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status Aktif:</p>
                  <div className="mt-1">{getStatusBadge(getKrsStatus())}</div>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/dashboard/mahasiswa/krs">
                  <Button variant="outline">
                    <IconClipboard className="w-4 h-4 mr-2" />
                    Kelola KRS
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* KHS Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <IconChartBar className="w-5 h-5 mr-2" />
            Ringkasan KHS
          </CardTitle>
          <CardDescription>Data KHS berdasarkan API /khs</CardDescription>
        </CardHeader>
        <CardContent>
          {khsList.length === 0 ? (
            <div className="text-center py-8">
              <IconChartBar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                Belum ada data KHS
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Data KHS akan muncul setelah nilai semester diinput.
              </p>
              <Link
                href="/dashboard/mahasiswa/khs"
                className="mt-4 inline-block"
              >
                <Button>
                  <IconChartBar className="w-4 h-4 mr-2" />
                  Lihat KHS
                </Button>
              </Link>
            </div>
          ) : (
            <div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium">Total Semester:</p>
                  <p className="text-2xl font-bold">{khsList.length}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">IPK Terakhir:</p>
                  <p className="text-2xl font-bold">
                    {khsList[0]?.ipk?.toFixed(2) ||
                      dashboardData.ipk?.toFixed(2) ||
                      "0.00"}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <Link href="/dashboard/mahasiswa/khs">
                  <Button variant="outline">
                    <IconChartBar className="w-4 h-4 mr-2" />
                    Lihat KHS
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Menu Cepat</CardTitle>
          <CardDescription>
            Akses fitur yang tersedia berdasarkan API sim.json
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/dashboard/mahasiswa/krs">
              <Button variant="outline" className="w-full h-auto py-4">
                <div className="text-center">
                  <IconClipboard className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">KRS</div>
                  <div className="text-xs text-muted-foreground">
                    Kartu Rencana Studi
                  </div>
                </div>
              </Button>
            </Link>

            <Link href="/dashboard/mahasiswa/khs">
              <Button variant="outline" className="w-full h-auto py-4">
                <div className="text-center">
                  <IconChartBar className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">KHS</div>
                  <div className="text-xs text-muted-foreground">
                    Kartu Hasil Studi
                  </div>
                </div>
              </Button>
            </Link>

            <Link href="/dashboard/mahasiswa/materi">
              <Button variant="outline" className="w-full h-auto py-4">
                <div className="text-center">
                  <IconCalendar className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">Materi</div>
                  <div className="text-xs text-muted-foreground">
                    Materi Kuliah
                  </div>
                </div>
              </Button>
            </Link>

            <Button
              variant="outline"
              className="w-full h-auto py-4"
              onClick={loadAllData}
            >
              <div className="text-center">
                <IconRefresh className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-medium">Refresh</div>
                <div className="text-xs text-muted-foreground">
                  Muat Ulang Data
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
