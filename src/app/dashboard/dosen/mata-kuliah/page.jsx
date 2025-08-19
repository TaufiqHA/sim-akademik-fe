"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getJadwalKuliahByDosen, getMateriKuliah } from "@/lib/api";
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
  IconChalkboard,
  IconFileText,
  IconUpload,
  IconDownload,
  IconEye,
  IconSearch,
  IconPlus,
} from "@tabler/icons-react";
import Link from "next/link";

export default function MataKuliahPage() {
  const { user } = useAuth();
  const [jadwalKuliah, setJadwalKuliah] = useState([]);
  const [materiKuliah, setMateriKuliah] = useState([]);
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
      loadMateriKuliah();
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
          file_path: "/uploads/materi/html-css-intro.pdf",
          created_at: "2024-01-15T10:00:00Z"
        },
        {
          id: 2,
          judul: "JavaScript Fundamentals",
          file_path: "/uploads/materi/js-fundamentals.pdf",
          created_at: "2024-01-20T14:30:00Z"
        }
      ]);
    }
  };

  const filteredMateri = materiKuliah.filter(materi =>
    materi.judul.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manajemen Mata Kuliah</h1>
        <p className="text-muted-foreground">
          Kelola materi kuliah dan absensi mahasiswa
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mata Kuliah</CardTitle>
            <IconChalkboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jadwalKuliah.length}</div>
            <p className="text-xs text-muted-foreground">Diampu semester ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Materi</CardTitle>
            <IconFileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materiKuliah.length}</div>
            <p className="text-xs text-muted-foreground">File terupload</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Upload</CardTitle>
            <IconUpload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/dosen/mata-kuliah/upload">
              <Button size="sm" className="w-full">
                <IconPlus className="w-4 h-4 mr-2" />
                Upload Materi
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Jadwal Kuliah List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <IconChalkboard className="w-5 h-5 mr-2" />
            Jadwal Kuliah Semester Ini
          </CardTitle>
          <CardDescription>
            Daftar mata kuliah yang Anda ampu
          </CardDescription>
        </CardHeader>
        <CardContent>
          {jadwalKuliah.length === 0 ? (
            <div className="text-center py-8">
              <IconChalkboard className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                Tidak ada jadwal kuliah
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Belum ada jadwal kuliah yang dialokasikan untuk Anda.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mata Kuliah</TableHead>
                  <TableHead>Kode</TableHead>
                  <TableHead>SKS</TableHead>
                  <TableHead>Hari</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Ruang</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jadwalKuliah.map((jadwal) => (
                  <TableRow key={jadwal.id}>
                    <TableCell className="font-medium">
                      {jadwal.mata_kuliah?.nama_mk || "N/A"}
                    </TableCell>
                    <TableCell>{jadwal.mata_kuliah?.kode_mk || "N/A"}</TableCell>
                    <TableCell>{jadwal.mata_kuliah?.sks || "N/A"}</TableCell>
                    <TableCell>{jadwal.hari}</TableCell>
                    <TableCell>
                      {jadwal.jam_mulai} - {jadwal.jam_selesai}
                    </TableCell>
                    <TableCell>{jadwal.ruang}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedJadwal(jadwal.id)}
                      >
                        <IconEye className="w-4 h-4 mr-1" />
                        Lihat Materi
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Materi Kuliah Section */}
      {selectedJadwal && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconFileText className="w-5 h-5 mr-2" />
              Materi Kuliah
            </CardTitle>
            <CardDescription>
              Materi untuk {jadwalKuliah.find(j => j.id == selectedJadwal)?.mata_kuliah?.nama_mk}
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
                  <IconPlus className="w-4 h-4 mr-2" />
                  Tambah Materi
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Judul Materi</TableHead>
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
                      <TableCell>
                        {new Date(materi.created_at).toLocaleDateString("id-ID")}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {materi.file_path?.split('.').pop()?.toUpperCase() || 'FILE'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
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
