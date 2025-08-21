"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getJadwalKuliahByDosen, getMateriKuliah, getTahunAkademik } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  IconChalkboard,
  IconFileText,
  IconUpload,
  IconDownload,
  IconEye,
  IconSearch,
  IconPlus,
  IconCalendar,
  IconClock,
  IconMapPin,
  IconUsers,
  IconBook,
} from "@tabler/icons-react";
import Link from "next/link";

export default function MataKuliahPage() {
  const { user } = useAuth();
  const [jadwalKuliah, setJadwalKuliah] = useState([]);
  const [materiKuliah, setMateriKuliah] = useState([]);
  const [tahunAkademik, setTahunAkademik] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJadwal, setSelectedJadwal] = useState("");
  const [selectedTahunAkademik, setSelectedTahunAkademik] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (user?.id && selectedTahunAkademik) {
      loadJadwalKuliah();
    }
  }, [user, selectedTahunAkademik]);

  useEffect(() => {
    if (selectedJadwal) {
      loadMateriKuliah();
    } else {
      setMateriKuliah([]);
    }
  }, [selectedJadwal]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load tahun akademik
      const tahunData = await getTahunAkademik();
      const tahunList = Array.isArray(tahunData) ? tahunData : [];
      setTahunAkademik(tahunList);
      
      // Set default to active tahun akademik
      const activeTahun = tahunList.find(t => t.is_aktif);
      if (activeTahun) {
        setSelectedTahunAkademik(activeTahun.id.toString());
      }
      
    } catch (error) {
      console.error("Error loading initial data:", error);
      // Mock data fallback
      setTahunAkademik([
        { id: 1, tahun: "2024/2025", semester: "Ganjil", is_aktif: true },
        { id: 2, tahun: "2023/2024", semester: "Genap", is_aktif: false }
      ]);
      setSelectedTahunAkademik("1");
    } finally {
      setLoading(false);
    }
  };

  const loadJadwalKuliah = async () => {
    try {
      const data = await getJadwalKuliahByDosen(user.id, {
        tahun_akademik_id: selectedTahunAkademik
      });
      setJadwalKuliah(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading jadwal kuliah:", error);
      // Mock data for demo
      setJadwalKuliah([
        {
          id: 1,
          mata_kuliah: { 
            id: 1, 
            nama_mk: "Pemrograman Web", 
            kode_mk: "TI301", 
            sks: 3 
          },
          ruang: "Lab Komputer 1",
          hari: "Senin",
          jam_mulai: "08:00",
          jam_selesai: "10:30",
          tahun_akademik_id: parseInt(selectedTahunAkademik)
        },
        {
          id: 2,
          mata_kuliah: { 
            id: 2, 
            nama_mk: "Basis Data", 
            kode_mk: "TI302", 
            sks: 3 
          },
          ruang: "Lab Komputer 2",
          hari: "Rabu",
          jam_mulai: "10:30",
          jam_selesai: "13:00",
          tahun_akademik_id: parseInt(selectedTahunAkademik)
        },
        {
          id: 3,
          mata_kuliah: { 
            id: 3, 
            nama_mk: "Algoritma dan Struktur Data", 
            kode_mk: "TI201", 
            sks: 4 
          },
          ruang: "Ruang 201",
          hari: "Jumat",
          jam_mulai: "13:00",
          jam_selesai: "16:30",
          tahun_akademik_id: parseInt(selectedTahunAkademik)
        }
      ]);
    }
  };

  const loadMateriKuliah = async () => {
    try {
      const data = await getMateriKuliah({ jadwal_kuliah_id: selectedJadwal });
      setMateriKuliah(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading materi kuliah:", error);
      // Mock data for demo
      setMateriKuliah([
        {
          id: 1,
          judul: "Pengenalan HTML dan CSS",
          deskripsi: "Materi dasar HTML dan CSS untuk pemrograman web",
          file_path: "/uploads/materi/html-css-intro.pdf",
          created_at: "2024-01-15T10:00:00Z"
        },
        {
          id: 2,
          judul: "JavaScript Fundamentals",
          deskripsi: "Konsep dasar JavaScript dan DOM manipulation",
          file_path: "/uploads/materi/js-fundamentals.pdf",
          created_at: "2024-01-20T14:30:00Z"
        },
        {
          id: 3,
          judul: "Framework CSS Bootstrap",
          deskripsi: "Menggunakan Bootstrap untuk responsive design",
          file_path: "/uploads/materi/bootstrap-tutorial.pdf",
          created_at: "2024-01-25T09:15:00Z"
        }
      ]);
    }
  };

  const filteredJadwal = jadwalKuliah.filter(jadwal =>
    jadwal.mata_kuliah?.nama_mk.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jadwal.mata_kuliah?.kode_mk.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMateri = materiKuliah.filter(materi =>
    materi.judul.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSelectedJadwalInfo = () => {
    return jadwalKuliah.find(j => j.id.toString() === selectedJadwal);
  };

  const getDayColor = (hari) => {
    const colors = {
      "Senin": "bg-red-100 text-red-800",
      "Selasa": "bg-orange-100 text-orange-800", 
      "Rabu": "bg-yellow-100 text-yellow-800",
      "Kamis": "bg-green-100 text-green-800",
      "Jumat": "bg-blue-100 text-blue-800",
      "Sabtu": "bg-purple-100 text-purple-800"
    };
    return colors[hari] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading mata kuliah...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Mata Kuliah</h1>
          <p className="text-muted-foreground">
            Kelola jadwal kuliah, materi, dan kegiatan pembelajaran
          </p>
        </div>
        <Link href="/dashboard/dosen/mata-kuliah/upload">
          <Button>
            <IconPlus className="w-4 h-4 mr-2" />
            Upload Materi
          </Button>
        </Link>
      </div>

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <IconCalendar className="w-5 h-5 mr-2" />
            Filter Mata Kuliah
          </CardTitle>
          <CardDescription>
            Pilih tahun akademik dan cari mata kuliah yang Anda ampu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Tahun Akademik</label>
              <Select value={selectedTahunAkademik} onValueChange={setSelectedTahunAkademik}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tahun akademik" />
                </SelectTrigger>
                <SelectContent>
                  {tahunAkademik.map((tahun) => (
                    <SelectItem key={tahun.id} value={tahun.id.toString()}>
                      {tahun.tahun} - {tahun.semester}
                      {tahun.is_aktif && " (Aktif)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Cari Mata Kuliah</label>
              <Input
                placeholder="Cari berdasarkan nama atau kode mata kuliah..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mata Kuliah</CardTitle>
            <IconChalkboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jadwalKuliah.length}</div>
            <p className="text-xs text-muted-foreground">Semester ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total SKS</CardTitle>
            <IconBook className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jadwalKuliah.reduce((total, jadwal) => total + (jadwal.mata_kuliah?.sks || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">SKS diampu</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Materi</CardTitle>
            <IconFileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedJadwal ? materiKuliah.length : "-"}</div>
            <p className="text-xs text-muted-foreground">File uploaded</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kelas Aktif</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jadwalKuliah.length}</div>
            <p className="text-xs text-muted-foreground">Kelas berjalan</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="jadwal" className="space-y-4">
        <TabsList>
          <TabsTrigger value="jadwal">
            Jadwal Kuliah ({filteredJadwal.length})
          </TabsTrigger>
          <TabsTrigger value="materi" disabled={!selectedJadwal}>
            Materi Kuliah ({selectedJadwal ? filteredMateri.length : 0})
          </TabsTrigger>
        </TabsList>

        {/* Jadwal Kuliah Tab */}
        <TabsContent value="jadwal">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <IconChalkboard className="w-5 h-5 mr-2" />
                Jadwal Kuliah
              </CardTitle>
              <CardDescription>
                Daftar mata kuliah yang Anda ampu pada semester ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredJadwal.length === 0 ? (
                <div className="text-center py-8">
                  <IconChalkboard className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">
                    Tidak ada jadwal kuliah
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Belum ada jadwal kuliah yang dialokasikan untuk semester ini atau sesuai dengan pencarian Anda.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredJadwal.map((jadwal) => (
                    <Card 
                      key={jadwal.id} 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedJadwal === jadwal.id.toString() 
                          ? "ring-2 ring-blue-500 bg-blue-50" 
                          : ""
                      }`}
                      onClick={() => setSelectedJadwal(jadwal.id.toString())}
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">
                          {jadwal.mata_kuliah?.nama_mk || "N/A"}
                        </CardTitle>
                        <CardDescription>
                          {jadwal.mata_kuliah?.kode_mk} • {jadwal.mata_kuliah?.sks} SKS
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2">
                          <IconCalendar className="h-4 w-4 text-muted-foreground" />
                          <Badge className={getDayColor(jadwal.hari)}>
                            {jadwal.hari}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <IconClock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {jadwal.jam_mulai} - {jadwal.jam_selesai}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <IconMapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{jadwal.ruang}</span>
                        </div>
                        
                        <div className="pt-2 flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedJadwal(jadwal.id.toString());
                            }}
                          >
                            <IconEye className="w-4 h-4 mr-1" />
                            Lihat Materi
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Materi Kuliah Tab */}
        <TabsContent value="materi">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <IconFileText className="w-5 h-5 mr-2" />
                Materi Kuliah
                {getSelectedJadwalInfo() && (
                  <span className="ml-2 text-base font-normal text-muted-foreground">
                    - {getSelectedJadwalInfo().mata_kuliah?.nama_mk}
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                Kelola materi pembelajaran untuk mata kuliah yang dipilih
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Actions */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Cari materi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <Link href={`/dashboard/dosen/mata-kuliah/upload?jadwal_id=${selectedJadwal}`}>
                  <Button>
                    <IconUpload className="w-4 h-4 mr-2" />
                    Upload Materi
                  </Button>
                </Link>
              </div>

              {/* Materi List */}
              {filteredMateri.length === 0 ? (
                <div className="text-center py-8">
                  <IconFileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">
                    Belum ada materi
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Upload materi pertama untuk mata kuliah ini.
                  </p>
                  <Link href={`/dashboard/dosen/mata-kuliah/upload?jadwal_id=${selectedJadwal}`}>
                    <Button className="mt-4">
                      <IconUpload className="w-4 h-4 mr-2" />
                      Upload Materi
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredMateri.map((materi) => (
                    <Card key={materi.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">
                          {materi.judul}
                        </CardTitle>
                        {materi.deskripsi && (
                          <CardDescription className="line-clamp-2">
                            {materi.deskripsi}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary">
                            {materi.file_path?.split('.').pop()?.toUpperCase() || 'FILE'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(materi.created_at).toLocaleDateString("id-ID")}
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <IconEye className="w-4 h-4 mr-1" />
                            Lihat
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <IconDownload className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
