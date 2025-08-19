"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getMateriKuliahByJadwal, getKrsMahasiswa } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  IconFileText,
  IconDownload,
  IconCalendar,
  IconChalkboard,
  IconUsers,
  IconSearch,
} from "@tabler/icons-react";

export default function MateriKuliahPage() {
  const { user } = useAuth();
  const [mataKuliahList, setMataKuliahList] = useState([]);
  const [materiList, setMateriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMateri, setLoadingMateri] = useState(false);
  const [selectedMataKuliah, setSelectedMataKuliah] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user?.id) {
      loadMataKuliahData();
    }
  }, [user]);

  useEffect(() => {
    if (selectedMataKuliah) {
      loadMateriData();
    }
  }, [selectedMataKuliah]);

  const loadMataKuliahData = async () => {
    try {
      setLoading(true);
      // Get KRS mahasiswa yang sudah approved untuk mendapatkan mata kuliah yang diambil
      const krsData = await getKrsMahasiswa(user.id, { status: "Approved" });
      
      // Extract mata kuliah dari KRS
      const mataKuliah = [];
      if (Array.isArray(krsData)) {
        krsData.forEach(krs => {
          if (krs.details) {
            krs.details.forEach(detail => {
              if (detail.jadwal_kuliah) {
                mataKuliah.push({
                  jadwal_id: detail.jadwal_kuliah.id,
                  mata_kuliah: detail.jadwal_kuliah.mata_kuliah,
                  dosen: detail.jadwal_kuliah.dosen,
                  hari: detail.jadwal_kuliah.hari,
                  jam_mulai: detail.jadwal_kuliah.jam_mulai,
                  jam_selesai: detail.jadwal_kuliah.jam_selesai,
                  ruang: detail.jadwal_kuliah.ruang,
                  tahun_akademik: krs.tahun_akademik
                });
              }
            });
          }
        });
      }
      
      setMataKuliahList(mataKuliah);
    } catch (error) {
      console.error("Error loading mata kuliah data:", error);
      // Mock data for demo
      setMataKuliahList([
        {
          jadwal_id: 1,
          mata_kuliah: { id: 1, nama_mk: "Pemrograman Web", kode_mk: "TI301", sks: 3 },
          dosen: { id: 1, nama: "Dr. Ahmad Rizki" },
          hari: "Senin",
          jam_mulai: "08:00",
          jam_selesai: "10:30",
          ruang: "Lab Komputer 1",
          tahun_akademik: { tahun: "2024/2025", semester: "Ganjil" }
        },
        {
          jadwal_id: 2,
          mata_kuliah: { id: 2, nama_mk: "Basis Data", kode_mk: "TI302", sks: 3 },
          dosen: { id: 2, nama: "Dr. Siti Aminah" },
          hari: "Rabu",
          jam_mulai: "10:30",
          jam_selesai: "13:00",
          ruang: "Lab Komputer 2",
          tahun_akademik: { tahun: "2024/2025", semester: "Ganjil" }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadMateriData = async () => {
    try {
      setLoadingMateri(true);
      const data = await getMateriKuliahByJadwal(selectedMataKuliah);
      setMateriList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading materi data:", error);
      // Mock data for demo
      setMateriList([
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
    } finally {
      setLoadingMateri(false);
    }
  };

  const handleDownloadMateri = (materi) => {
    // Simulate download
    const link = document.createElement('a');
    link.href = materi.file_path;
    link.download = `${materi.judul}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const filteredMateri = materiList.filter(materi =>
    materi.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (materi.deskripsi && materi.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getFileTypeFromPath = (filePath) => {
    const extension = filePath.split('.').pop()?.toLowerCase();
    return extension?.toUpperCase() || 'FILE';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading materi kuliah...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Materi Kuliah</h1>
        <p className="text-muted-foreground">
          Akses materi pembelajaran dari mata kuliah yang Anda ambil
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mata Kuliah</CardTitle>
            <IconChalkboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mataKuliahList.length}</div>
            <p className="text-xs text-muted-foreground">Sedang diambil</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Materi</CardTitle>
            <IconFileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materiList.length}</div>
            <p className="text-xs text-muted-foreground">File tersedia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dosen Pengampu</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(mataKuliahList.map(mk => mk.dosen?.id)).size}
            </div>
            <p className="text-xs text-muted-foreground">Dosen berbeda</p>
          </CardContent>
        </Card>
      </div>

      {/* Mata Kuliah Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Pilih Mata Kuliah</CardTitle>
          <CardDescription>
            Pilih mata kuliah untuk melihat materi yang tersedia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedMataKuliah} onValueChange={setSelectedMataKuliah}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Pilih mata kuliah" />
            </SelectTrigger>
            <SelectContent>
              {mataKuliahList.map((mk) => (
                <SelectItem key={mk.jadwal_id} value={mk.jadwal_id.toString()}>
                  {mk.mata_kuliah?.nama_mk} ({mk.mata_kuliah?.kode_mk}) - {mk.dosen?.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Mata Kuliah Info */}
      {selectedMataKuliah && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconChalkboard className="w-5 h-5 mr-2" />
              Detail Mata Kuliah
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const selectedMk = mataKuliahList.find(mk => mk.jadwal_id.toString() === selectedMataKuliah);
              return selectedMk ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p><strong>Mata Kuliah:</strong> {selectedMk.mata_kuliah?.nama_mk}</p>
                    <p><strong>Kode:</strong> {selectedMk.mata_kuliah?.kode_mk}</p>
                    <p><strong>SKS:</strong> {selectedMk.mata_kuliah?.sks}</p>
                  </div>
                  <div>
                    <p><strong>Dosen:</strong> {selectedMk.dosen?.nama}</p>
                    <p><strong>Jadwal:</strong> {selectedMk.hari}, {selectedMk.jam_mulai} - {selectedMk.jam_selesai}</p>
                    <p><strong>Ruang:</strong> {selectedMk.ruang}</p>
                  </div>
                </div>
              ) : null;
            })()}
          </CardContent>
        </Card>
      )}

      {/* Materi List */}
      {selectedMataKuliah && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconFileText className="w-5 h-5 mr-2" />
              Daftar Materi
            </CardTitle>
            <CardDescription>
              Materi pembelajaran yang tersedia untuk mata kuliah ini
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Cari materi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </div>

            {/* Materi Table */}
            {loadingMateri ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Loading materi...</p>
                </div>
              </div>
            ) : filteredMateri.length === 0 ? (
              <div className="text-center py-8">
                <IconFileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                  Belum ada materi
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Materi akan muncul setelah dosen mengupload file pembelajaran.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Judul Materi</TableHead>
                    <TableHead>Deskripsi</TableHead>
                    <TableHead>Tanggal Upload</TableHead>
                    <TableHead>File</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMateri.map((materi) => (
                    <TableRow key={materi.id}>
                      <TableCell className="font-medium">
                        {materi.judul}
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={materi.deskripsi}>
                          {materi.deskripsi || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(materi.created_at).toLocaleDateString("id-ID")}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {getFileTypeFromPath(materi.file_path)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownloadMateri(materi)}
                        >
                          <IconDownload className="w-4 h-4 mr-1" />
                          Download
                        </Button>
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
