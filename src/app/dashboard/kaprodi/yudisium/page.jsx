"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  IconCertificate,
  IconSearch,
  IconUser,
  IconCheck,
  IconX,
  IconEye,
  IconCalendar,
  IconDownload,
  IconFileText,
} from "@tabler/icons-react";
import { useToast } from "@/hooks/use-toast";

export default function YudisiumApprovalPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [yudisium, setYudisium] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedYudisium, setSelectedYudisium] = useState(null);
  const [approvalReason, setApprovalReason] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    if (user) {
      loadYudisium();
    }
  }, [user]);

  const loadYudisium = async () => {
    try {
      setLoading(true);
      // Mock data - in real app: GET /dokumen-akademik?jenis_dokumen=yudisium&prodi_id={user.prodi_id}
      setTimeout(() => {
        setYudisium([
          {
            id: 1,
            mahasiswa: { 
              nama: "John Doe", 
              nim: "2020001",
              angkatan: "2020"
            },
            judul_skripsi: "Implementasi Machine Learning untuk Prediksi Cuaca",
            pembimbing_1: "Dr. Ahmad Rizki",
            pembimbing_2: "Prof. Sari Indah",
            penguji_1: "Dr. Budi Santoso",
            penguji_2: "Dr. Rina Kusuma",
            tanggal_sidang: "2024-01-20",
            nilai_sidang: 85,
            ipk: 3.65,
            total_sks: 144,
            status: "Pending",
            tanggal_upload: "2024-01-22",
            dokumen: [
              { nama: "Transkrip Nilai", status: "Complete" },
              { nama: "Sertifikat TOEFL", status: "Complete" },
              { nama: "Kartu Bebas Pustaka", status: "Complete" },
              { nama: "Laporan Skripsi Final", status: "Complete" },
              { nama: "Surat Keterangan Bebas Tunggakan", status: "Complete" },
            ],
          },
          {
            id: 2,
            mahasiswa: { 
              nama: "Jane Smith", 
              nim: "2020002",
              angkatan: "2020"
            },
            judul_skripsi: "Sistem Informasi Manajemen Perpustakaan Berbasis Web",
            pembimbing_1: "Dr. Budi Santoso",
            pembimbing_2: "M.Kom. Lisa Dewi",
            penguji_1: "Dr. Ahmad Rizki",
            penguji_2: "Dr. Rina Kusuma",
            tanggal_sidang: "2024-01-18",
            nilai_sidang: 88,
            ipk: 3.75,
            total_sks: 144,
            status: "Approved",
            tanggal_upload: "2024-01-19",
            tanggal_approve: "2024-01-21",
            dokumen: [
              { nama: "Transkrip Nilai", status: "Complete" },
              { nama: "Sertifikat TOEFL", status: "Complete" },
              { nama: "Kartu Bebas Pustaka", status: "Complete" },
              { nama: "Laporan Skripsi Final", status: "Complete" },
              { nama: "Surat Keterangan Bebas Tunggakan", status: "Complete" },
            ],
          },
          {
            id: 3,
            mahasiswa: { 
              nama: "Bob Wilson", 
              nim: "2021001",
              angkatan: "2021"
            },
            judul_skripsi: "Aplikasi Mobile E-Commerce dengan Flutter",
            pembimbing_1: "Dr. Rina Kusuma",
            pembimbing_2: "M.T. Andi Prasetyo",
            penguji_1: "Dr. Ahmad Rizki",
            penguji_2: "Dr. Budi Santoso",
            tanggal_sidang: "2024-01-15",
            nilai_sidang: 75,
            ipk: 3.45,
            total_sks: 144,
            status: "Pending",
            tanggal_upload: "2024-01-16",
            dokumen: [
              { nama: "Transkrip Nilai", status: "Complete" },
              { nama: "Sertifikat TOEFL", status: "Missing" },
              { nama: "Kartu Bebas Pustaka", status: "Complete" },
              { nama: "Laporan Skripsi Final", status: "Complete" },
              { nama: "Surat Keterangan Bebas Tunggakan", status: "Complete" },
            ],
          },
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error loading yudisium:", error);
      setLoading(false);
    }
  };

  const approveYudisium = async (yudisiumId) => {
    try {
      // In real app: POST /dokumen-akademik/{yudisiumId}/approve
      setYudisium((prev) =>
        prev.map((y) =>
          y.id === yudisiumId
            ? {
                ...y,
                status: "Approved",
                tanggal_approve: new Date().toISOString().split("T")[0],
              }
            : y
        )
      );

      toast({
        title: "Berhasil",
        description: "Yudisium berhasil disetujui",
      });
      setSelectedYudisium(null);
      setApprovalReason("");
    } catch (error) {
      console.error("Error approving yudisium:", error);
      toast({
        title: "Error",
        description: "Gagal menyetujui yudisium",
        variant: "destructive",
      });
    }
  };

  const rejectYudisium = async (yudisiumId) => {
    try {
      // In real app: POST /dokumen-akademik/{yudisiumId}/reject
      setYudisium((prev) =>
        prev.map((y) =>
          y.id === yudisiumId
            ? {
                ...y,
                status: "Rejected",
                tanggal_reject: new Date().toISOString().split("T")[0],
                alasan_reject: rejectReason,
              }
            : y
        )
      );

      toast({
        title: "Berhasil",
        description: "Yudisium berhasil ditolak",
      });
      setSelectedYudisium(null);
      setRejectReason("");
    } catch (error) {
      console.error("Error rejecting yudisium:", error);
      toast({
        title: "Error",
        description: "Gagal menolak yudisium",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <IconCheck className="w-3 h-3 mr-1" />
            Disetujui
          </Badge>
        );
      case "Rejected":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            <IconX className="w-3 h-3 mr-1" />
            Ditolak
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            <IconCalendar className="w-3 h-3 mr-1" />
            Menunggu
          </Badge>
        );
    }
  };

  const getDokumenStatus = (dokumen) => {
    const complete = dokumen.filter(d => d.status === "Complete").length;
    const total = dokumen.length;
    
    if (complete === total) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          Lengkap ({complete}/{total})
        </Badge>
      );
    }
    return (
      <Badge variant="destructive" className="bg-red-100 text-red-800">
        Tidak Lengkap ({complete}/{total})
      </Badge>
    );
  };

  const isEligibleForApproval = (yudisiumItem) => {
    const dokumenLengkap = yudisiumItem.dokumen.every(d => d.status === "Complete");
    const ipkMemenuhi = yudisiumItem.ipk >= 2.0; // Minimal IPK
    const sksMemenuhi = yudisiumItem.total_sks >= 144; // Minimal SKS
    const nilaiMemenuhi = yudisiumItem.nilai_sidang >= 60; // Minimal nilai sidang
    
    return dokumenLengkap && ipkMemenuhi && sksMemenuhi && nilaiMemenuhi;
  };

  const filteredYudisium = yudisium.filter((item) => {
    const matchesSearch =
      item.mahasiswa.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mahasiswa.nim.includes(searchTerm) ||
      item.judul_skripsi.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading yudisium...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Persetujuan Yudisium</h1>
        <p className="text-muted-foreground">
          Kelola persetujuan yudisium mahasiswa yang akan lulus
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengajuan</CardTitle>
            <IconCertificate className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{yudisium.length}</div>
            <p className="text-xs text-muted-foreground">Pengajuan yudisium</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menunggu Approval</CardTitle>
            <IconCalendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {yudisium.filter(y => y.status === "Pending").length}
            </div>
            <p className="text-xs text-muted-foreground">Perlu ditinjau</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Siap Lulus</CardTitle>
            <IconCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {yudisium.filter(y => y.status === "Approved").length}
            </div>
            <p className="text-xs text-muted-foreground">Telah disetujui</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Yudisium</CardTitle>
          <CardDescription>
            Cari dan filter pengajuan yudisium
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Cari nama mahasiswa, NIM, atau judul skripsi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<IconSearch className="w-4 h-4" />}
              />
            </div>
            <div className="w-[200px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="Pending">Menunggu</SelectItem>
                  <SelectItem value="Approved">Disetujui</SelectItem>
                  <SelectItem value="Rejected">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Yudisium Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <IconCertificate className="w-5 h-5 mr-2" />
            Daftar Pengajuan Yudisium
          </CardTitle>
          <CardDescription>
            Pengajuan yudisium yang memerlukan persetujuan
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredYudisium.length === 0 ? (
            <div className="text-center py-8">
              <IconCertificate className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                Tidak ada pengajuan ditemukan
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Tidak ada pengajuan yudisium yang sesuai dengan kriteria pencarian.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mahasiswa</TableHead>
                  <TableHead>IPK</TableHead>
                  <TableHead>Nilai Sidang</TableHead>
                  <TableHead>Dokumen</TableHead>
                  <TableHead>Tanggal Sidang</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredYudisium.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <IconUser className="mr-2 h-4 w-4" />
                        <div>
                          <p className="font-semibold">{item.mahasiswa.nama}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.mahasiswa.nim} - Angkatan {item.mahasiswa.angkatan}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold">
                        {item.ipk}
                        {item.ipk >= 3.5 && (
                          <Badge variant="secondary" className="ml-1 bg-yellow-100 text-yellow-800">
                            Cum Laude
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold">
                        {item.nilai_sidang}
                        {item.nilai_sidang >= 85 ? (
                          <Badge variant="secondary" className="ml-1 bg-green-100 text-green-800">A</Badge>
                        ) : item.nilai_sidang >= 75 ? (
                          <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-800">B</Badge>
                        ) : (
                          <Badge variant="secondary" className="ml-1 bg-orange-100 text-orange-800">C</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getDokumenStatus(item.dokumen)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <IconCalendar className="mr-2 h-4 w-4" />
                        {new Date(item.tanggal_sidang).toLocaleDateString("id-ID")}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedYudisium(item)}
                            >
                              <IconEye className="w-4 h-4 mr-1" />
                              Detail
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>Detail Yudisium</DialogTitle>
                              <DialogDescription>
                                Informasi lengkap pengajuan yudisium
                              </DialogDescription>
                            </DialogHeader>
                            {selectedYudisium && (
                              <div className="space-y-6">
                                {/* Student Info */}
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div>
                                    <h4 className="font-semibold mb-2">Informasi Mahasiswa</h4>
                                    <div className="space-y-1">
                                      <p><strong>Nama:</strong> {selectedYudisium.mahasiswa.nama}</p>
                                      <p><strong>NIM:</strong> {selectedYudisium.mahasiswa.nim}</p>
                                      <p><strong>Angkatan:</strong> {selectedYudisium.mahasiswa.angkatan}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2">Informasi Akademik</h4>
                                    <div className="space-y-1">
                                      <p><strong>IPK:</strong> {selectedYudisium.ipk}</p>
                                      <p><strong>Total SKS:</strong> {selectedYudisium.total_sks}</p>
                                      <p><strong>Nilai Sidang:</strong> {selectedYudisium.nilai_sidang}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Skripsi Info */}
                                <div>
                                  <h4 className="font-semibold mb-2">Informasi Skripsi</h4>
                                  <p><strong>Judul:</strong> {selectedYudisium.judul_skripsi}</p>
                                  <div className="grid gap-4 md:grid-cols-2 mt-2">
                                    <div>
                                      <p><strong>Pembimbing 1:</strong> {selectedYudisium.pembimbing_1}</p>
                                      <p><strong>Pembimbing 2:</strong> {selectedYudisium.pembimbing_2}</p>
                                    </div>
                                    <div>
                                      <p><strong>Penguji 1:</strong> {selectedYudisium.penguji_1}</p>
                                      <p><strong>Penguji 2:</strong> {selectedYudisium.penguji_2}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Document Status */}
                                <div>
                                  <h4 className="font-semibold mb-2">Status Dokumen</h4>
                                  <div className="grid gap-2">
                                    {selectedYudisium.dokumen.map((doc, index) => (
                                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                                        <span>{doc.nama}</span>
                                        {doc.status === "Complete" ? (
                                          <Badge variant="default" className="bg-green-100 text-green-800">
                                            <IconCheck className="w-3 h-3 mr-1" />
                                            Lengkap
                                          </Badge>
                                        ) : (
                                          <Badge variant="destructive" className="bg-red-100 text-red-800">
                                            <IconX className="w-3 h-3 mr-1" />
                                            Belum
                                          </Badge>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Eligibility Check */}
                                <div className="p-4 border rounded">
                                  <h4 className="font-semibold mb-2">Kelayakan Yudisium</h4>
                                  {isEligibleForApproval(selectedYudisium) ? (
                                    <div className="flex items-center text-green-600">
                                      <IconCheck className="w-4 h-4 mr-2" />
                                      Mahasiswa memenuhi syarat untuk lulus
                                    </div>
                                  ) : (
                                    <div className="flex items-center text-red-600">
                                      <IconX className="w-4 h-4 mr-2" />
                                      Mahasiswa belum memenuhi syarat untuk lulus
                                    </div>
                                  )}
                                </div>

                                {selectedYudisium.alasan_reject && (
                                  <div className="p-4 border border-red-200 rounded bg-red-50">
                                    <h4 className="font-semibold text-red-600 mb-2">Alasan Penolakan</h4>
                                    <p className="text-red-600">{selectedYudisium.alasan_reject}</p>
                                  </div>
                                )}
                              </div>
                            )}
                            <DialogFooter>
                              {selectedYudisium?.status === "Pending" && (
                                <>
                                  <Button
                                    variant="destructive"
                                    onClick={() => {
                                      const reason = prompt("Masukkan alasan penolakan:");
                                      if (reason) {
                                        setRejectReason(reason);
                                        rejectYudisium(selectedYudisium.id);
                                      }
                                    }}
                                  >
                                    <IconX className="w-4 h-4 mr-1" />
                                    Tolak
                                  </Button>
                                  <Button
                                    onClick={() => approveYudisium(selectedYudisium.id)}
                                    className="bg-green-600 hover:bg-green-700"
                                    disabled={!isEligibleForApproval(selectedYudisium)}
                                  >
                                    <IconCheck className="w-4 h-4 mr-1" />
                                    Setujui Yudisium
                                  </Button>
                                </>
                              )}
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
