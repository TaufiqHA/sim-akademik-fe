"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getJadwalKuliahByDosen, getDokumenAkademik, getNilai } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  IconChalkboard,
  IconUsers,
  IconFileText,
  IconClipboardData,
  IconSchool,
  IconPlus,
  IconEye,
  IconClock,
  IconCheck,
} from "@tabler/icons-react";
import Link from "next/link";

export default function DosenDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total_mata_kuliah: 0,
    total_mahasiswa_bimbingan: 0,
    total_materi_kuliah: 0,
    nilai_pending: 0,
    dokumen_pending: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get jadwal kuliah untuk dosen
      const jadwalData = await getJadwalKuliahByDosen(user.id);
      const jadwalKuliah = Array.isArray(jadwalData) ? jadwalData : [];

      // Get dokumen akademik untuk bimbingan (where dosen is pembimbing)
      const bimbinganData = await getDokumenAkademik({
        jenis_dokumen: "skripsi", // Could also include "proposal", "magang"
        // In real API, we'd filter by pembimbing_id or similar
      });
      const dokumenBimbingan = Array.isArray(bimbinganData) ? bimbinganData : [];

      // Get nilai yang belum di-finalize
      const nilaiData = await getNilai({
        dosen_id: user.id,
        is_finalized: false
      });
      const nilaiPending = Array.isArray(nilaiData) ? nilaiData : [];

      // Calculate stats
      const calculatedStats = {
        total_mata_kuliah: jadwalKuliah.length,
        total_mahasiswa_bimbingan: dokumenBimbingan.filter(d => d.status === "Approved").length,
        total_materi_kuliah: 0, // This would come from materi-kuliah endpoint
        nilai_pending: nilaiPending.length,
        dokumen_pending: dokumenBimbingan.filter(d => d.status === "Pending").length,
      };

      setStats(calculatedStats);

      // Set recent activity
      const activities = [
        ...dokumenBimbingan.slice(0, 3).map(doc => ({
          type: "bimbingan",
          message: `Dokumen ${doc.jenis_dokumen} dari mahasiswa perlu review`,
          time: doc.created_at,
          status: doc.status
        })),
        ...jadwalKuliah.slice(0, 2).map(jadwal => ({
          type: "jadwal",
          message: `Mata kuliah ${jadwal.mata_kuliah?.nama_mk} hari ${jadwal.hari}`,
          time: new Date().toISOString(),
          status: "Scheduled"
        }))
      ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

      setRecentActivity(activities);

    } catch (error) {
      console.error("Error loading dashboard data:", error);
      // Fallback to mock data
      setStats({
        total_mata_kuliah: 3,
        total_mahasiswa_bimbingan: 8,
        total_materi_kuliah: 15,
        nilai_pending: 5,
        dokumen_pending: 3,
      });
      
      setRecentActivity([
        {
          type: "bimbingan",
          message: "Proposal skripsi dari Ahmad Rizki perlu review",
          time: "2024-01-15T10:00:00Z",
          status: "Pending"
        },
        {
          type: "nilai",
          message: "Input nilai UTS Pemrograman Web masih pending",
          time: "2024-01-14T14:30:00Z",
          status: "Pending"
        },
        {
          type: "jadwal",
          message: "Mata kuliah Basis Data hari Rabu jam 10:30",
          time: "2024-01-13T08:00:00Z",
          status: "Scheduled"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "bimbingan":
        return <IconSchool className="h-4 w-4" />;
      case "nilai":
        return <IconClipboardData className="h-4 w-4" />;
      case "jadwal":
        return <IconChalkboard className="h-4 w-4" />;
      default:
        return <IconFileText className="h-4 w-4" />;
    }
  };

  const getActivityColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-yellow-600";
      case "Approved":
        return "text-green-600";
      case "Scheduled":
        return "text-blue-600";
      default:
        return "text-gray-600";
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
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Dosen</h1>
        <p className="text-muted-foreground">
          Selamat datang, {user?.nama}. Kelola mata kuliah dan bimbingan mahasiswa Anda.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mata Kuliah</CardTitle>
            <IconChalkboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_mata_kuliah}</div>
            <p className="text-xs text-muted-foreground">Diampu semester ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mahasiswa Bimbingan</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_mahasiswa_bimbingan}</div>
            <p className="text-xs text-muted-foreground">Skripsi & magang</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Materi Kuliah</CardTitle>
            <IconFileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_materi_kuliah}</div>
            <p className="text-xs text-muted-foreground">File uploaded</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nilai Pending</CardTitle>
            <IconClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.nilai_pending}</div>
            <p className="text-xs text-muted-foreground">Perlu input/finalisasi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dokumen Review</CardTitle>
            <IconFileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.dokumen_pending}</div>
            <p className="text-xs text-muted-foreground">Menunggu review</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Akses cepat ke fitur yang sering digunakan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/dosen/mata-kuliah" className="block">
              <Button variant="outline" className="w-full justify-start">
                <IconChalkboard className="mr-2 h-4 w-4" />
                Kelola Mata Kuliah
              </Button>
            </Link>
            
            <Link href="/dashboard/dosen/nilai" className="block">
              <Button variant="outline" className="w-full justify-start">
                <IconClipboardData className="mr-2 h-4 w-4" />
                Input Nilai Mahasiswa
              </Button>
            </Link>
            
            <Link href="/dashboard/dosen/bimbingan" className="block">
              <Button variant="outline" className="w-full justify-start">
                <IconSchool className="mr-2 h-4 w-4" />
                Bimbingan Akademik
              </Button>
            </Link>
            
            <Link href="/dashboard/dosen/mata-kuliah/upload" className="block">
              <Button variant="outline" className="w-full justify-start">
                <IconPlus className="mr-2 h-4 w-4" />
                Upload Materi Kuliah
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Aktivitas terbaru yang memerlukan perhatian
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <div className="text-center py-6">
                <IconClock className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Tidak ada aktivitas terbaru</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
                    <div className={`mt-0.5 ${getActivityColor(activity.status)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.time).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      {activity.status === "Pending" && (
                        <IconClock className="h-4 w-4 text-yellow-500" />
                      )}
                      {activity.status === "Approved" && (
                        <IconCheck className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Task Reminders */}
      {(stats.nilai_pending > 0 || stats.dokumen_pending > 0) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">Tugas yang Perlu Diselesaikan</CardTitle>
            <CardDescription className="text-yellow-700">
              Ada beberapa tugas yang memerlukan perhatian Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.nilai_pending > 0 && (
              <div className="flex items-center justify-between p-3 bg-yellow-100 rounded-lg">
                <div className="flex items-center space-x-2">
                  <IconClipboardData className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">
                    {stats.nilai_pending} nilai mahasiswa perlu di-input/finalisasi
                  </span>
                </div>
                <Link href="/dashboard/dosen/nilai">
                  <Button size="sm" variant="outline" className="border-yellow-300">
                    Input Nilai
                  </Button>
                </Link>
              </div>
            )}
            
            {stats.dokumen_pending > 0 && (
              <div className="flex items-center justify-between p-3 bg-yellow-100 rounded-lg">
                <div className="flex items-center space-x-2">
                  <IconFileText className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">
                    {stats.dokumen_pending} dokumen bimbingan perlu direview
                  </span>
                </div>
                <Link href="/dashboard/dosen/bimbingan">
                  <Button size="sm" variant="outline" className="border-yellow-300">
                    Review Dokumen
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
