"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  getDokumenAkademik,
  approveDokumenAkademik,
  rejectDokumenAkademik
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
  IconFile,
  IconSearch,
  IconUser,
  IconCheck,
  IconX,
  IconEye,
  IconCalendar,
  IconDownload,
} from "@tabler/icons-react";
import { useToast } from "@/hooks/use-toast";

export default function SkripsiApprovalPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [approvalReason, setApprovalReason] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    if (user) {
      loadProposals();
    }
  }, [user]);

  const loadProposals = async () => {
    try {
      setLoading(true);

      // Parameters untuk API call sesuai sim.json: GET /dokumen-akademik?jenis_dokumen=skripsi
      const params = {
        jenis_dokumen: "skripsi"
      };

      // Jika user memiliki prodi_id, filter berdasarkan prodi
      if (user?.prodi_id) {
        params.prodi_id = user.prodi_id;
      }

      const response = await getDokumenAkademik(params);
      console.log("Proposal skripsi API response:", response);

      // Ensure response is always an array
      const responseArray = Array.isArray(response) ? response : response?.data || [];

      // Transform API response ke format yang dibutuhkan
      const transformedProposals = responseArray.map(item => ({
        id: item.id,
        judul: item.judul || `Proposal Skripsi #${item.id}`,
        mahasiswa: {
          nama: item.uploaded_by_name || "Unknown",
          nim: item.uploaded_by_nim || "Unknown"
        },
        pembimbing_1: item.pembimbing_1 || "Belum ditentukan",
        pembimbing_2: item.pembimbing_2 || "Belum ditentukan",
        status: item.status,
        tanggal_upload: item.created_at,
        tanggal_approve: item.approved_at,
        tanggal_reject: item.rejected_at,
        file_path: item.file_path,
        alasan_reject: item.alasan_reject,
        deskripsi: item.deskripsi || "Tidak ada deskripsi",
        uploaded_by: item.uploaded_by,
        approved_by: item.approved_by
      }));

      setProposals(transformedProposals);
    } catch (error) {
      console.error("Error loading proposals:", error);
      setError(error.message || "Gagal memuat data proposal");

      // Fallback ke mock data jika API gagal
      setProposals([
        {
          id: 1,
          judul: "Implementasi Machine Learning untuk Prediksi Cuaca",
          mahasiswa: { nama: "John Doe", nim: "2020001" },
          pembimbing_1: "Dr. Ahmad Rizki",
          pembimbing_2: "Prof. Sari Indah",
          status: "Pending",
          tanggal_upload: "2024-01-15",
          file_path: "/uploads/proposal_1.pdf",
          deskripsi: "Proposal skripsi tentang implementasi machine learning untuk prediksi cuaca menggunakan data historis.",
        },
        {
          id: 2,
          judul: "Sistem Informasi Manajemen Perpustakaan Berbasis Web",
          mahasiswa: { nama: "Jane Smith", nim: "2020002" },
          pembimbing_1: "Dr. Budi Santoso",
          pembimbing_2: "M.Kom. Lisa Dewi",
          status: "Approved",
          tanggal_upload: "2024-01-10",
          tanggal_approve: "2024-01-12",
          file_path: "/uploads/proposal_2.pdf",
          deskripsi: "Pengembangan sistem informasi manajemen perpustakaan dengan fitur katalog online dan peminjaman buku.",
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const approveProposal = async (proposalId) => {
    try {
      // Use API endpoint sesuai sim.json: POST /dokumen-akademik/{id}/approve
      await approveDokumenAkademik(proposalId);

      // Update local state
      setProposals((prev) =>
        prev.map((p) =>
          p.id === proposalId
            ? {
                ...p,
                status: "Approved",
                tanggal_approve: new Date().toISOString().split("T")[0],
                approved_by: user.id
              }
            : p
        )
      );

      toast({
        title: "Berhasil",
        description: "Proposal skripsi berhasil disetujui",
      });
      setSelectedProposal(null);
      setApprovalReason("");
    } catch (error) {
      console.error("Error approving proposal:", error);

      // Handle specific API errors
      if (error.status === 403) {
        toast({
          title: "Akses Ditolak",
          description: "Anda tidak memiliki hak untuk menyetujui proposal ini",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Gagal menyetujui proposal",
          variant: "destructive",
        });
      }
    }
  };

  const rejectProposal = async (proposalId) => {
    try {
      // Use API endpoint sesuai sim.json: POST /dokumen-akademik/{id}/reject
      await rejectDokumenAkademik(proposalId, rejectReason);

      // Update local state
      setProposals((prev) =>
        prev.map((p) =>
          p.id === proposalId
            ? {
                ...p,
                status: "Rejected",
                tanggal_reject: new Date().toISOString().split("T")[0],
                alasan_reject: rejectReason,
              }
            : p
        )
      );

      toast({
        title: "Berhasil",
        description: "Proposal skripsi berhasil ditolak",
      });
      setSelectedProposal(null);
      setRejectReason("");
    } catch (error) {
      console.error("Error rejecting proposal:", error);

      // Handle specific API errors
      if (error.status === 403) {
        toast({
          title: "Akses Ditolak",
          description: "Anda tidak memiliki hak untuk menolak proposal ini",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Gagal menolak proposal",
          variant: "destructive",
        });
      }
    }
  };

  const downloadFile = async (filePath) => {
    try {
      // Buat URL untuk download file
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
      const downloadUrl = `${API_BASE_URL}/dokumen-akademik/download${filePath}`;

      // Buka file di tab baru untuk download
      window.open(downloadUrl, '_blank');

      toast({
        title: "Download dimulai",
        description: "File proposal sedang didownload",
      });
    } catch (error) {
      console.error("Error downloading file:", error);
      toast({
        title: "Error",
        description: "Gagal mendownload file",
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

  const filteredProposals = Array.isArray(proposals) ? proposals.filter((proposal) => {
    const matchesSearch =
      proposal.judul?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.mahasiswa?.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.mahasiswa?.nim?.includes(searchTerm);

    const matchesStatus =
      statusFilter === "all" || proposal.status === statusFilter;

    return matchesSearch && matchesStatus;
  }) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading proposals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Approval Proposal Skripsi</h1>
        <p className="text-muted-foreground">
          Kelola persetujuan judul skripsi dan pembimbing mahasiswa
        </p>
      </div>

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Proposal</CardTitle>
          <CardDescription>
            Cari dan filter proposal berdasarkan kriteria tertentu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Cari judul, nama mahasiswa, atau NIM..."
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

      {/* Proposals Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <IconFile className="w-5 h-5 mr-2" />
            Daftar Proposal Skripsi
          </CardTitle>
          <CardDescription>
            Proposal skripsi yang memerlukan persetujuan
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredProposals.length === 0 ? (
            <div className="text-center py-8">
              <IconFile className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                Tidak ada proposal ditemukan
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Tidak ada proposal yang sesuai dengan kriteria pencarian.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mahasiswa</TableHead>
                  <TableHead>Judul</TableHead>
                  <TableHead>Pembimbing</TableHead>
                  <TableHead>Tanggal Upload</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProposals.map((proposal) => (
                  <TableRow key={proposal.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <IconUser className="mr-2 h-4 w-4" />
                        <div>
                          <p className="font-semibold">{proposal.mahasiswa.nama}</p>
                          <p className="text-sm text-muted-foreground">
                            {proposal.mahasiswa.nim}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p className="font-medium truncate" title={proposal.judul}>
                          {proposal.judul}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>1. {proposal.pembimbing_1}</p>
                        <p>2. {proposal.pembimbing_2}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <IconCalendar className="mr-2 h-4 w-4" />
                        {new Date(proposal.tanggal_upload).toLocaleDateString("id-ID")}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(proposal.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedProposal(proposal)}
                            >
                              <IconEye className="w-4 h-4 mr-1" />
                              Detail
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Detail Proposal Skripsi</DialogTitle>
                              <DialogDescription>
                                Informasi lengkap proposal skripsi
                              </DialogDescription>
                            </DialogHeader>
                            {selectedProposal && (
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold">Judul</h4>
                                  <p>{selectedProposal.judul}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold">Mahasiswa</h4>
                                  <p>{selectedProposal.mahasiswa.nama} ({selectedProposal.mahasiswa.nim})</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold">Pembimbing</h4>
                                  <p>1. {selectedProposal.pembimbing_1}</p>
                                  <p>2. {selectedProposal.pembimbing_2}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold">Deskripsi</h4>
                                  <p>{selectedProposal.deskripsi}</p>
                                </div>
                                <div>
                                  <h4 className="font-semibold">Status</h4>
                                  {getStatusBadge(selectedProposal.status)}
                                </div>
                                {selectedProposal.alasan_reject && (
                                  <div>
                                    <h4 className="font-semibold text-red-600">Alasan Penolakan</h4>
                                    <p className="text-red-600">{selectedProposal.alasan_reject}</p>
                                  </div>
                                )}
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => downloadFile(selectedProposal.file_path)}
                                  >
                                    <IconDownload className="w-4 h-4 mr-1" />
                                    Download File
                                  </Button>
                                </div>
                                {selectedProposal.status === "Pending" && (
                                  <div className="flex gap-2 pt-4 border-t">
                                    <div className="flex-1">
                                      <Textarea
                                        placeholder="Catatan approval (opsional)"
                                        value={approvalReason}
                                        onChange={(e) => setApprovalReason(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                            <DialogFooter>
                              {selectedProposal?.status === "Pending" && (
                                <>
                                  <Button
                                    variant="destructive"
                                    onClick={() => {
                                      if (rejectReason.trim()) {
                                        rejectProposal(selectedProposal.id);
                                      } else {
                                        const reason = prompt("Masukkan alasan penolakan:");
                                        if (reason) {
                                          setRejectReason(reason);
                                          rejectProposal(selectedProposal.id);
                                        }
                                      }
                                    }}
                                  >
                                    <IconX className="w-4 h-4 mr-1" />
                                    Tolak
                                  </Button>
                                  <Button
                                    onClick={() => approveProposal(selectedProposal.id)}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <IconCheck className="w-4 h-4 mr-1" />
                                    Setujui
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
