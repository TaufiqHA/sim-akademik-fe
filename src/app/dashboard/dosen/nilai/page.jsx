"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { 
  getJadwalKuliahByDosen, 
  getNilai, 
  getTahunAkademik,
  finalizeNilai 
} from "@/lib/api";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  IconClipboardData,
  IconUsers,
  IconCheck,
  IconClock,
  IconPlus,
  IconEye,
  IconEdit,
  IconLock,
  IconCalendar,
  IconCalculator,
  IconFileText,
  IconTrendingUp,
  IconAlertCircle,
} from "@tabler/icons-react";
import Link from "next/link";

export default function NilaiPage() {
  const { user } = useAuth();
  const [jadwalKuliah, setJadwalKuliah] = useState([]);
  const [nilaiData, setNilaiData] = useState([]);
  const [tahunAkademik, setTahunAkademik] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJadwal, setSelectedJadwal] = useState("");
  const [selectedTahunAkademik, setSelectedTahunAkademik] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
      loadNilaiData();
    } else {
      setNilaiData([]);
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
        }
      ]);
    }
  };

  const loadNilaiData = async () => {
    try {
      const data = await getNilai({ jadwal_kuliah_id: selectedJadwal });
      setNilaiData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading nilai data:", error);
      // Mock data for demo
      setNilaiData([
        {
          id: 1,
          mahasiswa: { id: 1, nama: "Ahmad Rizki", nim: "2024001" },
          mahasiswa_id: 1,
          jadwal_kuliah_id: parseInt(selectedJadwal),
          tugas: 85,
          uts: 78,
          uas: 82,
          nilai_akhir: 81.5,
          nilai_huruf: "B+",
          is_finalized: false,
          created_at: "2024-01-15T10:00:00Z",
          updated_at: "2024-01-15T10:00:00Z"
        },
        {
          id: 2,
          mahasiswa: { id: 2, nama: "Siti Aminah", nim: "2024002" },
          mahasiswa_id: 2,
          jadwal_kuliah_id: parseInt(selectedJadwal),
          tugas: 92,
          uts: 88,
          uas: 90,
          nilai_akhir: 90,
          nilai_huruf: "A-",
          is_finalized: true,
          created_at: "2024-01-15T10:00:00Z",
          updated_at: "2024-01-20T14:30:00Z"
        },
        {
          id: 3,
          mahasiswa: { id: 3, nama: "Budi Santoso", nim: "2024003" },
          mahasiswa_id: 3,
          jadwal_kuliah_id: parseInt(selectedJadwal),
          tugas: 75,
          uts: 70,
          uas: 73,
          nilai_akhir: 72.5,
          nilai_huruf: "B-",
          is_finalized: false,
          created_at: "2024-01-15T10:00:00Z",
          updated_at: "2024-01-22T11:15:00Z"
        },
        {
          id: 4,
          mahasiswa: { id: 4, nama: "Maya Sari", nim: "2024004" },
          mahasiswa_id: 4,
          jadwal_kuliah_id: parseInt(selectedJadwal),
          tugas: null,
          uts: null,
          uas: null,
          nilai_akhir: null,
          nilai_huruf: null,
          is_finalized: false,
          created_at: "2024-01-15T10:00:00Z",
          updated_at: "2024-01-15T10:00:00Z"
        }
      ]);
    }
  };

  const handleFinalizeNilai = async (nilaiId) => {
    try {
      await finalizeNilai(nilaiId);
      toast.success("Nilai berhasil difinalisasi");
      
      // Update local state
      setNilaiData(prev => 
        prev.map(nilai => 
          nilai.id === nilaiId 
            ? { ...nilai, is_finalized: true }
            : nilai
        )
      );
    } catch (error) {
      console.error("Error finalizing nilai:", error);
      toast.error("Gagal memfinalisasi nilai");
    }
  };

  const filteredNilai = nilaiData.filter(nilai => {
    const matchesSearch = 
      nilai.mahasiswa?.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nilai.mahasiswa?.nim.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" ||
      (statusFilter === "finalized" && nilai.is_finalized) ||
      (statusFilter === "draft" && !nilai.is_finalized && nilai.nilai_akhir !== null) ||
      (statusFilter === "empty" && nilai.nilai_akhir === null);
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (nilai) => {
    if (nilai.is_finalized) {
      return <Badge className="bg-green-100 text-green-800"><IconLock className="w-3 h-3 mr-1" />Finalized</Badge>;
    } else if (nilai.nilai_akhir !== null) {
      return <Badge variant="secondary"><IconClock className="w-3 h-3 mr-1" />Draft</Badge>;
    } else {
      return <Badge variant="outline"><IconAlertCircle className="w-3 h-3 mr-1" />Belum Input</Badge>;
    }
  };

  const getNilaiHurufBadge = (huruf) => {
    const colors = {
      "A": "bg-green-100 text-green-800",
      "A-": "bg-green-100 text-green-800",
      "B+": "bg-blue-100 text-blue-800",
      "B": "bg-blue-100 text-blue-800",
      "B-": "bg-yellow-100 text-yellow-800",
      "C+": "bg-orange-100 text-orange-800",
      "C": "bg-orange-100 text-orange-800",
      "C-": "bg-red-100 text-red-800",
      "D": "bg-red-100 text-red-800",
      "E": "bg-red-100 text-red-800"
    };
    return colors[huruf] || "bg-gray-100 text-gray-800";
  };

  const getStats = () => {
    const total = nilaiData.length;
    const finalized = nilaiData.filter(n => n.is_finalized).length;
    const draft = nilaiData.filter(n => !n.is_finalized && n.nilai_akhir !== null).length;
    const empty = nilaiData.filter(n => n.nilai_akhir === null).length;
    const rata2 = nilaiData.filter(n => n.nilai_akhir !== null).length > 0
      ? nilaiData
          .filter(n => n.nilai_akhir !== null)
          .reduce((sum, n) => sum + n.nilai_akhir, 0) / nilaiData.filter(n => n.nilai_akhir !== null).length
      : 0;

    return { total, finalized, draft, empty, rata2 };
  };

  const stats = getStats();
  const selectedJadwalInfo = jadwalKuliah.find(j => j.id.toString() === selectedJadwal);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading nilai data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Nilai</h1>
          <p className="text-muted-foreground">
            Input, kelola, dan finalisasi nilai mahasiswa
          </p>
        </div>
        <Link href="/dashboard/dosen/nilai/input">
          <Button>
            <IconPlus className="w-4 h-4 mr-2" />
            Input Nilai
          </Button>
        </Link>
      </div>

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <IconCalendar className="w-5 h-5 mr-2" />
            Filter Nilai
          </CardTitle>
          <CardDescription>
            Pilih tahun akademik dan mata kuliah untuk mengelola nilai
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
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
            
            <div>
              <label className="text-sm font-medium mb-2 block">Mata Kuliah</label>
              <Select value={selectedJadwal} onValueChange={setSelectedJadwal}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih mata kuliah" />
                </SelectTrigger>
                <SelectContent>
                  {jadwalKuliah.map((jadwal) => (
                    <SelectItem key={jadwal.id} value={jadwal.id.toString()}>
                      {jadwal.mata_kuliah?.nama_mk} ({jadwal.mata_kuliah?.kode_mk}) - {jadwal.hari}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      {selectedJadwal && (
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Mahasiswa</CardTitle>
              <IconUsers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Terdaftar di kelas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Finalized</CardTitle>
              <IconCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.finalized}</div>
              <p className="text-xs text-muted-foreground">Sudah dikunci</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft</CardTitle>
              <IconClock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.draft}</div>
              <p className="text-xs text-muted-foreground">Belum dikunci</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Belum Input</CardTitle>
              <IconAlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.empty}</div>
              <p className="text-xs text-muted-foreground">Perlu input</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rata-rata</CardTitle>
              <IconTrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rata2.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Nilai kelas</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Nilai Management */}
      {selectedJadwal && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconClipboardData className="w-5 h-5 mr-2" />
              Daftar Nilai - {selectedJadwalInfo?.mata_kuliah?.nama_mk}
            </CardTitle>
            <CardDescription>
              Kelola nilai mahasiswa untuk mata kuliah yang dipilih
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search and Filter */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Cari mahasiswa berdasarkan nama atau NIM..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="finalized">Finalized</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="empty">Belum Input</SelectItem>
                </SelectContent>
              </Select>
              <Link href={`/dashboard/dosen/nilai/input?jadwal_id=${selectedJadwal}`}>
                <Button>
                  <IconPlus className="w-4 h-4 mr-2" />
                  Input Nilai Baru
                </Button>
              </Link>
            </div>

            {/* Nilai Table */}
            {filteredNilai.length === 0 ? (
              <div className="text-center py-8">
                <IconClipboardData className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                  {nilaiData.length === 0 ? "Belum ada data nilai" : "Tidak ada hasil"}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {nilaiData.length === 0 
                    ? "Mulai input nilai untuk mahasiswa di kelas ini."
                    : "Tidak ada data yang sesuai dengan filter pencarian."
                  }
                </p>
                {nilaiData.length === 0 && (
                  <Link href={`/dashboard/dosen/nilai/input?jadwal_id=${selectedJadwal}`}>
                    <Button className="mt-4">
                      <IconPlus className="w-4 h-4 mr-2" />
                      Input Nilai
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>NIM</TableHead>
                    <TableHead>Nama Mahasiswa</TableHead>
                    <TableHead className="text-center">Tugas</TableHead>
                    <TableHead className="text-center">UTS</TableHead>
                    <TableHead className="text-center">UAS</TableHead>
                    <TableHead className="text-center">Nilai Akhir</TableHead>
                    <TableHead className="text-center">Huruf</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNilai.map((nilai) => (
                    <TableRow key={nilai.id}>
                      <TableCell className="font-medium">
                        {nilai.mahasiswa?.nim}
                      </TableCell>
                      <TableCell>{nilai.mahasiswa?.nama}</TableCell>
                      <TableCell className="text-center">
                        {nilai.tugas !== null ? nilai.tugas : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {nilai.uts !== null ? nilai.uts : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {nilai.uas !== null ? nilai.uas : "-"}
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {nilai.nilai_akhir !== null ? nilai.nilai_akhir : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {nilai.nilai_huruf && (
                          <Badge className={getNilaiHurufBadge(nilai.nilai_huruf)}>
                            {nilai.nilai_huruf}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(nilai)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {!nilai.is_finalized && (
                            <>
                              <Link href={`/dashboard/dosen/nilai/input?id=${nilai.id}&jadwal_id=${selectedJadwal}`}>
                                <Button variant="outline" size="sm">
                                  <IconEdit className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                              </Link>
                              {nilai.nilai_akhir !== null && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <IconLock className="w-4 h-4 mr-1" />
                                      Finalize
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Finalisasi Nilai</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Anda yakin ingin memfinalisasi nilai untuk {nilai.mahasiswa?.nama}? 
                                        Setelah difinalisasi, nilai tidak dapat diubah lagi.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Batal</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleFinalizeNilai(nilai.id)}
                                      >
                                        Finalisasi
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                            </>
                          )}
                          <Button variant="outline" size="sm">
                            <IconEye className="w-4 h-4 mr-1" />
                            Detail
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instructions when no jadwal selected */}
      {!selectedJadwal && (
        <Card>
          <CardContent className="text-center py-12">
            <IconCalculator className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Pilih Mata Kuliah
            </h3>
            <p className="text-gray-500 mb-4">
              Pilih tahun akademik dan mata kuliah terlebih dahulu untuk melihat dan mengelola nilai mahasiswa.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
