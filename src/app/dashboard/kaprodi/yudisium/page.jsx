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

      // Use API endpoint sesuai sim.json: GET /yudisium?prodi_id={user.prodi_id}
      const { getYudisium } = await import("@/lib/api");

      const params = {};
      if (user?.prodi_id) {
        params.prodi_id = user.prodi_id;
      }

      const yudisiumData = await getYudisium(params);
      console.log("Yudisium API response:", yudisiumData);

      // Ensure response is always an array and handle null/undefined
      let yudisiumList = [];
      if (Array.isArray(yudisiumData)) {
        yudisiumList = yudisiumData;
      } else if (yudisiumData && Array.isArray(yudisiumData.data)) {
        yudisiumList = yudisiumData.data;
      } else if (yudisiumData && yudisiumData.data) {
        // If data exists but isn't an array, wrap it
        yudisiumList = [yudisiumData.data];
      }
      setYudisium(yudisiumList);
    } catch (error) {
      console.error("Error loading yudisium:", error);

      toast({
        title: "Error",
        description: "Gagal memuat data yudisium dari server.",
        variant: "destructive",
      });

      // Set empty array when API fails - no mock data
      setYudisium([]);
    } finally {
      setLoading(false);
    }
  };

  const approveYudisium = async (yudisiumId) => {
    try {
      // Use API endpoint sesuai sim.json: POST /yudisium/{id}/approve
      const { approveYudisium: apiApproveYudisium } = await import("@/lib/api");

      const response = await apiApproveYudisium(yudisiumId);
      console.log("Approve yudisium API response:", response);

      // Update local state
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

      // Handle specific API errors
      if (error.status === 403) {
        toast({
          title: "Akses Ditolak",
          description: "Anda tidak memiliki hak untuk menyetujui yudisium ini",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Gagal menyetujui yudisium",
          variant: "destructive",
        });
      }
    }
  };

  const rejectYudisium = async (yudisiumId) => {
    try {
      // Use API endpoint sesuai sim.json: POST /yudisium/{id}/reject
      const { rejectYudisium: apiRejectYudisium } = await import("@/lib/api");

      const response = await apiRejectYudisium(yudisiumId, rejectReason);
      console.log("Reject yudisium API response:", response);

      // Update local state
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

      // Handle specific API errors
      if (error.status === 403) {
        toast({
          title: "Akses Ditolak",
          description: "Anda tidak memiliki hak untuk menolak yudisium ini",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Gagal menolak yudisium",
          variant: "destructive",
        });
      }
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
    if (!Array.isArray(dokumen) || dokumen.length === 0) {
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800">
          Tidak Ada Dokumen
        </Badge>
      );
    }

    const complete = dokumen.filter(d => d && d.status === "Complete").length;
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

  const checkEligibility = async (yudisiumId) => {
    try {
      // Use API endpoint sesuai sim.json: GET /yudisium/{id}/check-eligibility
      const { checkYudisiumEligibility } = await import("@/lib/api");

      const eligibilityResult = await checkYudisiumEligibility(yudisiumId);
      console.log("Check eligibility API response:", eligibilityResult);

      return eligibilityResult;
    } catch (error) {
      console.error("Error checking eligibility:", error);

      // Fallback to local check
      return { is_eligible: false, reason: "Tidak dapat memeriksa kelayakan" };
    }
  };

  const isEligibleForApproval = (yudisiumItem) => {
    if (!yudisiumItem) return false;

    const dokumen = Array.isArray(yudisiumItem.dokumen) ? yudisiumItem.dokumen : [];
    const dokumenLengkap = dokumen.length > 0 && dokumen.every(d => d && d.status === "Complete");
    const ipkMemenuhi = (yudisiumItem.ipk || 0) >= 2.0; // Minimal IPK
    const sksMemenuhi = (yudisiumItem.total_sks || 0) >= 144; // Minimal SKS
    const nilaiMemenuhi = (yudisiumItem.nilai_sidang || 0) >= 60; // Minimal nilai sidang

    return dokumenLengkap && ipkMemenuhi && sksMemenuhi && nilaiMemenuhi;
  };

  const filteredYudisium = Array.isArray(yudisium) ? yudisium.filter((item) => {
    if (!item) return false;

    const searchTermLower = (searchTerm || "").toLowerCase();
    const matchesSearch = !searchTerm || (
      (item.mahasiswa?.nama || "").toLowerCase().includes(searchTermLower) ||
      (item.mahasiswa?.nim || "").includes(searchTerm) ||
      (item.judul_skripsi || "").toLowerCase().includes(searchTermLower)
    );

    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  }) : [];

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
            <div className="text-2xl font-bold">{Array.isArray(yudisium) ? yudisium.length : 0}</div>
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
              {Array.isArray(yudisium) ? yudisium.filter(y => y && y.status === "Pending").length : 0}
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
              {Array.isArray(yudisium) ? yudisium.filter(y => y && y.status === "Approved").length : 0}
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
                                    {Array.isArray(selectedYudisium.dokumen) && selectedYudisium.dokumen.map((doc, index) => (
                                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                                        <span>{doc?.nama || 'Dokumen Tidak Diketahui'}</span>
                                        {doc?.status === "Complete" ? (
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
