"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getJadwalKuliahByDosen, getNilai } from "@/lib/api";
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
  IconClipboardData,
  IconUsers,
  IconCheck,
  IconClock,
  IconPlus,
  IconEye,
  IconEdit,
  IconLock,
} from "@tabler/icons-react";
import Link from "next/link";

export default function NilaiPage() {
  const { user } = useAuth();
  const [jadwalKuliah, setJadwalKuliah] = useState([]);
  const [nilaiData, setNilaiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJadwal, setSelectedJadwal] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user?.id) {
      loadJadwalKuliah();
    }
  }, [user]);

  useEffect(() => {
    if (selectedJadwal) {
      loadNilaiData();
    }
  }, [selectedJadwal]);

  const loadJadwalKuliah = async () => {
    try {
      setLoading(true);
      const data = await getJadwalKuliahByDosen(user.id);
      setJadwalKuliah(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading jadwal kuliah:", error);
      // Mock data for demo
      setJadwalKuliah([
        {
          id: 1,
          mata_kuliah: { id: 1, nama_mk: "Pemrograman Web", kode_mk: "TI301", sks: 3 },
          ruang: "Lab Komputer 1",
          hari: "Senin",
          jam_mulai: "08:00",
          jam_selesai: "10:30",
          tahun_akademik: { tahun: "2024/2025", semester: "Ganjil" }
        },
        {
          id: 2,
          mata_kuliah: { id: 2, nama_mk: "Basis Data", kode_mk: "TI302", sks: 3 },
          ruang: "Lab Komputer 2",
          hari: "Rabu",
          jam_mulai: "10:30",
          jam_selesai: "13:00",
          tahun_akademik: { tahun: "2024/2025", semester: "Ganjil" }
        }
      ]);
    } finally {
      setLoading(false);
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
          tugas: 85,
          uts: 78,
          uas: 82,
          nilai_akhir: 81.5,
          nilai_huruf: "B+",
          is_finalized: false,
          created_at: "2024-01-15T10:00:00Z"
        },
        {
          id: 2,
          mahasiswa: { id: 2, nama: "Siti Aminah", nim: "2024002" },
          tugas: 92,
          uts: 88,
          uas: 90,
          nilai_akhir: 90,
          nilai_huruf: "A-",
          is_finalized: true,
          created_at: "2024-01-15T10:00:00Z"
        },
        {
          id: 3,
          mahasiswa: { id: 3, nama: "Budi Santoso", nim: "2024003" },
          tugas: 75,
          uts: 70,
          uas: 73,
          nilai_akhir: 72.5,
          nilai_huruf: "B-",
          is_finalized: false,
          created_at: "2024-01-15T10:00:00Z"
        }
      ]);
    }
  };

  const filteredNilai = nilaiData.filter(nilai =>
    nilai.mahasiswa?.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nilai.mahasiswa?.nim.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (nilai) => {
    if (nilai.is_finalized) {
      return <Badge className="bg-green-100 text-green-800"><IconLock className="w-3 h-3 mr-1" />Finalized</Badge>;
    } else if (nilai.nilai_akhir) {
      return <Badge variant="secondary"><IconClock className="w-3 h-3 mr-1" />Draft</Badge>;
    } else {
      return <Badge variant="outline"><IconClock className="w-3 h-3 mr-1" />Belum Input</Badge>;
    }
  };

  const getTotalMahasiswa = () => {
    // In real implementation, this would come from KRS data
    return nilaiData.length || 0;
  };

  const getFinalizedCount = () => {
    return nilaiData.filter(nilai => nilai.is_finalized).length;
  };

  const getPendingCount = () => {
    return nilaiData.filter(nilai => !nilai.is_finalized).length;
  };

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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manajemen Nilai</h1>
        <p className="text-muted-foreground">
          Input dan kelola nilai mahasiswa
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mahasiswa</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalMahasiswa()}</div>
            <p className="text-xs text-muted-foreground">Terdaftar di kelas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nilai Finalized</CardTitle>
            <IconCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getFinalizedCount()}</div>
            <p className="text-xs text-muted-foreground">Sudah dikunci</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <IconClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getPendingCount()}</div>
            <p className="text-xs text-muted-foreground">Belum dikunci</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Input</CardTitle>
            <IconPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/dosen/nilai/input">
              <Button size="sm" className="w-full">
                <IconPlus className="w-4 h-4 mr-2" />
                Input Nilai
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Jadwal Kuliah Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Pilih Mata Kuliah</CardTitle>
          <CardDescription>
            Pilih mata kuliah untuk melihat dan mengelola nilai mahasiswa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedJadwal} onValueChange={setSelectedJadwal}>
            <SelectTrigger className="w-full max-w-md">
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
        </CardContent>
      </Card>

      {/* Nilai Table */}
      {selectedJadwal && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconClipboardData className="w-5 h-5 mr-2" />
              Daftar Nilai - {jadwalKuliah.find(j => j.id == selectedJadwal)?.mata_kuliah?.nama_mk}
            </CardTitle>
            <CardDescription>
              Kelola nilai mahasiswa untuk mata kuliah yang dipilih
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search and Actions */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Cari mahasiswa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Link href={`/dashboard/dosen/nilai/input?jadwal_id=${selectedJadwal}`}>
                <Button>
                  <IconPlus className="w-4 h-4 mr-2" />
                  Input Nilai Baru
                </Button>
              </Link>
            </div>

            {/* Nilai List */}
            {filteredNilai.length === 0 ? (
              <div className="text-center py-8">
                <IconClipboardData className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                  Belum ada nilai
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Mulai input nilai untuk mahasiswa di kelas ini.
                </p>
                <Link href={`/dashboard/dosen/nilai/input?jadwal_id=${selectedJadwal}`}>
                  <Button className="mt-4">
                    <IconPlus className="w-4 h-4 mr-2" />
                    Input Nilai
                  </Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>NIM</TableHead>
                    <TableHead>Nama Mahasiswa</TableHead>
                    <TableHead>Tugas</TableHead>
                    <TableHead>UTS</TableHead>
                    <TableHead>UAS</TableHead>
                    <TableHead>Nilai Akhir</TableHead>
                    <TableHead>Huruf</TableHead>
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
                      <TableCell>{nilai.tugas || "-"}</TableCell>
                      <TableCell>{nilai.uts || "-"}</TableCell>
                      <TableCell>{nilai.uas || "-"}</TableCell>
                      <TableCell className="font-medium">
                        {nilai.nilai_akhir || "-"}
                      </TableCell>
                      <TableCell>
                        {nilai.nilai_huruf && (
                          <Badge variant="outline">{nilai.nilai_huruf}</Badge>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(nilai)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {!nilai.is_finalized && (
                            <Button variant="outline" size="sm">
                              <IconEdit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
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
    </div>
  );
}
