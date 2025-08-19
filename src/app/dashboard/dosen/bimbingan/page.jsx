"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getDokumenAkademik } from "@/lib/api";
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
  IconSchool,
  IconUsers,
  IconFileText,
  IconDownload,
  IconEye,
  IconPlus,
  IconClock,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";

export default function BimbinganPage() {
  const { user } = useAuth();
  const [dokumenSkripsi, setDokumenSkripsi] = useState([]);
  const [dokumenMagang, setDokumenMagang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadBimbinganData();
  }, []);

  const loadBimbinganData = async () => {
    try {
      setLoading(true);
      
      // Load skripsi documents
      const skripsiData = await getDokumenAkademik({
        jenis_dokumen: "skripsi",
        pembimbing_id: user?.id
      });
      setDokumenSkripsi(Array.isArray(skripsiData) ? skripsiData : []);

      // Load magang documents
      const magangData = await getDokumenAkademik({
        jenis_dokumen: "magang",
        pembimbing_id: user?.id
      });
      setDokumenMagang(Array.isArray(magangData) ? magangData : []);

    } catch (error) {
      console.error("Error loading bimbingan data:", error);
      // Mock data for demo
      setDokumenSkripsi([
        {
          id: 1,
          mahasiswa: { id: 1, nama: "Ahmad Rizki", nim: "2024001" },
          judul: "Sistem Informasi Manajemen Perpustakaan Berbasis Web",
          jenis_dokumen: "skripsi",
          status: "Pending",
          file_path: "/uploads/skripsi/proposal-ahmad.pdf",
          catatan: "Proposal awal skripsi",
          created_at: "2024-01-15T10:00:00Z",
          updated_at: "2024-01-15T10:00:00Z"
        },
        {
          id: 2,
          mahasiswa: { id: 2, nama: "Siti Aminah", nim: "2024002" },
          judul: "Aplikasi Mobile Learning untuk Pembelajaran Bahasa Inggris",
          jenis_dokumen: "skripsi",
          status: "Approved",
          file_path: "/uploads/skripsi/draft1-siti.pdf",
          catatan: "Draft bab 1-3 sudah baik",
          created_at: "2024-01-10T14:30:00Z",
          updated_at: "2024-01-20T09:15:00Z"
        },
        {
          id: 3,
          mahasiswa: { id: 3, nama: "Budi Santoso", nim: "2024003" },
          judul: "Analisis Keamanan Jaringan Komputer Menggunakan Penetration Testing",
          jenis_dokumen: "skripsi",
          status: "Rejected",
          file_path: "/uploads/skripsi/proposal-budi.pdf",
          catatan: "Perlu revisi pada metodologi penelitian",
          created_at: "2024-01-12T16:45:00Z",
          updated_at: "2024-01-25T11:30:00Z"
        }
      ]);

      setDokumenMagang([
        {
          id: 4,
          mahasiswa: { id: 4, nama: "Maya Sari", nim: "2024004" },
          judul: "Magang di PT. Tech Solutions Indonesia",
          jenis_dokumen: "magang",
          status: "Pending",
          file_path: "/uploads/magang/proposal-maya.pdf",
          catatan: "Proposal magang di bidang web development",
          created_at: "2024-01-18T08:20:00Z",
          updated_at: "2024-01-18T08:20:00Z"
        },
        {
          id: 5,
          mahasiswa: { id: 5, nama: "Andi Pratama", nim: "2024005" },
          judul: "Magang di Bank Central Asia - IT Division",
          jenis_dokumen: "magang",
          status: "Approved",
          file_path: "/uploads/magang/laporan-andi.pdf",
          catatan: "Laporan magang lengkap",
          created_at: "2024-01-05T13:10:00Z",
          updated_at: "2024-01-28T15:45:00Z"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterDokumen = (dokumen) => {
    return dokumen.filter(doc => {
      const matchesSearch = 
        doc.mahasiswa?.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.mahasiswa?.nim.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.judul.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <Badge variant="secondary"><IconClock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "Approved":
        return <Badge className="bg-green-100 text-green-800"><IconCheck className="w-3 h-3 mr-1" />Approved</Badge>;
      case "Rejected":
        return <Badge variant="destructive"><IconX className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStats = (dokumen) => {
    const total = dokumen.length;
    const pending = dokumen.filter(d => d.status === "Pending").length;
    const approved = dokumen.filter(d => d.status === "Approved").length;
    const rejected = dokumen.filter(d => d.status === "Rejected").length;
    
    return { total, pending, approved, rejected };
  };

  const skripsiStats = getStats(dokumenSkripsi);
  const magangStats = getStats(dokumenMagang);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading bimbingan data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bimbingan Akademik</h1>
        <p className="text-muted-foreground">
          Kelola bimbingan skripsi dan magang mahasiswa
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bimbingan</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{skripsiStats.total + magangStats.total}</div>
            <p className="text-xs text-muted-foreground">Skripsi & magang</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <IconClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{skripsiStats.pending + magangStats.pending}</div>
            <p className="text-xs text-muted-foreground">Menunggu review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <IconCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{skripsiStats.approved + magangStats.approved}</div>
            <p className="text-xs text-muted-foreground">Sudah disetujui</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quick Upload</CardTitle>
            <IconPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/dosen/bimbingan/upload">
              <Button size="sm" className="w-full">
                <IconPlus className="w-4 h-4 mr-2" />
                Upload Dokumen
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Dokumen</CardTitle>
          <CardDescription>
            Cari dan filter dokumen bimbingan berdasarkan kriteria tertentu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Cari mahasiswa atau judul..."
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
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Skripsi and Magang */}
      <Tabs defaultValue="skripsi" className="space-y-4">
        <TabsList>
          <TabsTrigger value="skripsi">
            Bimbingan Skripsi ({skripsiStats.total})
          </TabsTrigger>
          <TabsTrigger value="magang">
            Bimbingan Magang ({magangStats.total})
          </TabsTrigger>
        </TabsList>

        {/* Skripsi Tab */}
        <TabsContent value="skripsi">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <IconSchool className="w-5 h-5 mr-2" />
                Dokumen Skripsi
              </CardTitle>
              <CardDescription>
                Kelola bimbingan skripsi mahasiswa
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filterDokumen(dokumenSkripsi).length === 0 ? (
                <div className="text-center py-8">
                  <IconFileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">
                    Tidak ada dokumen skripsi
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Belum ada mahasiswa yang mengajukan bimbingan skripsi atau sesuai dengan filter Anda.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NIM</TableHead>
                      <TableHead>Nama Mahasiswa</TableHead>
                      <TableHead>Judul Skripsi</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tanggal Upload</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterDokumen(dokumenSkripsi).map((dokumen) => (
                      <TableRow key={dokumen.id}>
                        <TableCell className="font-medium">
                          {dokumen.mahasiswa?.nim}
                        </TableCell>
                        <TableCell>{dokumen.mahasiswa?.nama}</TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={dokumen.judul}>
                            {dokumen.judul}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(dokumen.status)}</TableCell>
                        <TableCell>
                          {new Date(dokumen.created_at).toLocaleDateString("id-ID")}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <IconEye className="w-4 h-4 mr-1" />
                              Review
                            </Button>
                            <Button variant="outline" size="sm">
                              <IconDownload className="w-4 h-4 mr-1" />
                              Download
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
        </TabsContent>

        {/* Magang Tab */}
        <TabsContent value="magang">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <IconFileText className="w-5 h-5 mr-2" />
                Dokumen Magang
              </CardTitle>
              <CardDescription>
                Kelola bimbingan magang mahasiswa
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filterDokumen(dokumenMagang).length === 0 ? (
                <div className="text-center py-8">
                  <IconFileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">
                    Tidak ada dokumen magang
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Belum ada mahasiswa yang mengajukan bimbingan magang atau sesuai dengan filter Anda.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NIM</TableHead>
                      <TableHead>Nama Mahasiswa</TableHead>
                      <TableHead>Tempat Magang</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tanggal Upload</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterDokumen(dokumenMagang).map((dokumen) => (
                      <TableRow key={dokumen.id}>
                        <TableCell className="font-medium">
                          {dokumen.mahasiswa?.nim}
                        </TableCell>
                        <TableCell>{dokumen.mahasiswa?.nama}</TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={dokumen.judul}>
                            {dokumen.judul}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(dokumen.status)}</TableCell>
                        <TableCell>
                          {new Date(dokumen.created_at).toLocaleDateString("id-ID")}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <IconEye className="w-4 h-4 mr-1" />
                              Review
                            </Button>
                            <Button variant="outline" size="sm">
                              <IconDownload className="w-4 h-4 mr-1" />
                              Download
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
