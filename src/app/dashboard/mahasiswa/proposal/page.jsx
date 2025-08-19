"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { uploadProposalSkripsi, getMahasiswaDokumen } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  IconSchool,
  IconUpload,
  IconFileText,
  IconDownload,
  IconCheck,
  IconX,
  IconClock,
  IconEye,
} from "@tabler/icons-react";

export default function ProposalSkripsiPage() {
  const { user } = useAuth();
  const [proposalList, setProposalList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    judul: "",
    deskripsi: "",
    file: null,
  });

  useEffect(() => {
    loadProposalData();
  }, []);

  const loadProposalData = async () => {
    try {
      setLoading(true);
      const data = await getMahasiswaDokumen(user?.id, { jenis_dokumen: "proposal" });
      setProposalList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading proposal data:", error);
      // Mock data for demo
      setProposalList([
        {
          id: 1,
          judul: "Sistem Informasi Manajemen Perpustakaan Berbasis Web",
          deskripsi: "Proposal pengembangan sistem informasi untuk mengelola data perpustakaan secara digital",
          file_path: "/uploads/proposal/proposal-v1.pdf",
          status: "Pending",
          created_at: "2024-01-15T10:00:00Z",
          feedback: null
        },
        {
          id: 2,
          judul: "Aplikasi Mobile Learning untuk Pembelajaran Bahasa Inggris",
          deskripsi: "Proposal pengembangan aplikasi mobile untuk pembelajaran bahasa Inggris interaktif",
          file_path: "/uploads/proposal/proposal-v2.pdf",
          status: "Approved",
          created_at: "2024-01-20T14:30:00Z",
          feedback: "Proposal sudah baik, silakan lanjutkan ke tahap berikutnya"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (!allowedTypes.includes(file.type)) {
        setErrorMessage("Format file tidak didukung. Gunakan PDF, DOC, atau DOCX.");
        setShowError(true);
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("Ukuran file terlalu besar. Maksimal 10MB.");
        setShowError(true);
        return;
      }

      handleInputChange('file', file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.judul || !formData.file) {
      setErrorMessage("Judul dan file proposal wajib diisi.");
      setShowError(true);
      return;
    }

    try {
      setUploading(true);
      setErrorMessage("");

      const uploadData = new FormData();
      uploadData.append('judul', formData.judul);
      uploadData.append('deskripsi', formData.deskripsi);
      uploadData.append('file', formData.file);

      await uploadProposalSkripsi(uploadData);
      
      // Reset form
      setFormData({
        judul: "",
        deskripsi: "",
        file: null,
      });
      
      // Reset file input
      const fileInput = document.getElementById('file');
      if (fileInput) fileInput.value = '';
      
      setShowSuccess(true);
      await loadProposalData();
    } catch (error) {
      console.error("Error uploading proposal:", error);
      setErrorMessage(error.message || "Gagal mengupload proposal skripsi.");
      setShowError(true);
    } finally {
      setUploading(false);
    }
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

  const handleDownload = (proposal) => {
    // Simulate download
    const link = document.createElement('a');
    link.href = proposal.file_path;
    link.download = `${proposal.judul}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const getStats = () => {
    const total = proposalList.length;
    const pending = proposalList.filter(p => p.status === "Pending").length;
    const approved = proposalList.filter(p => p.status === "Approved").length;
    const rejected = proposalList.filter(p => p.status === "Rejected").length;
    
    return { total, pending, approved, rejected };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading proposal data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Proposal Skripsi</h1>
        <p className="text-muted-foreground">
          Upload dan kelola proposal skripsi Anda
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Proposal</CardTitle>
            <IconFileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Diajukan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <IconClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Menunggu review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <IconCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Disetujui</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <IconX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">Ditolak</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upload">Upload Proposal</TabsTrigger>
          <TabsTrigger value="history">Riwayat Proposal</TabsTrigger>
        </TabsList>

        {/* Upload Tab */}
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <IconUpload className="w-5 h-5 mr-2" />
                Upload Proposal Skripsi
              </CardTitle>
              <CardDescription>
                Lengkapi informasi dan upload file proposal skripsi Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Judul Proposal */}
                <div className="space-y-2">
                  <Label htmlFor="judul">Judul Proposal Skripsi *</Label>
                  <Input
                    id="judul"
                    placeholder="Masukkan judul proposal skripsi"
                    value={formData.judul}
                    onChange={(e) => handleInputChange('judul', e.target.value)}
                  />
                </div>

                {/* Deskripsi */}
                <div className="space-y-2">
                  <Label htmlFor="deskripsi">Deskripsi/Abstrak</Label>
                  <Textarea
                    id="deskripsi"
                    placeholder="Deskripsi singkat tentang proposal (opsional)"
                    value={formData.deskripsi}
                    onChange={(e) => handleInputChange('deskripsi', e.target.value)}
                    rows={4}
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="file">File Proposal *</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="flex-1"
                    />
                    {formData.file && (
                      <div className="flex items-center text-sm text-green-600">
                        <IconCheck className="w-4 h-4 mr-1" />
                        {formData.file.name}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Format yang didukung: PDF, DOC, DOCX (Maksimal 10MB)
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={uploading}
                  className="w-full"
                >
                  {uploading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Mengupload...
                    </div>
                  ) : (
                    <>
                      <IconUpload className="w-4 h-4 mr-2" />
                      Upload Proposal
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <IconSchool className="w-5 h-5 mr-2" />
                Riwayat Proposal Skripsi
              </CardTitle>
              <CardDescription>
                Daftar proposal yang pernah Anda ajukan
              </CardDescription>
            </CardHeader>
            <CardContent>
              {proposalList.length === 0 ? (
                <div className="text-center py-8">
                  <IconFileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">
                    Belum ada proposal
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Upload proposal skripsi pertama Anda.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Judul Proposal</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tanggal Upload</TableHead>
                      <TableHead>Feedback</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {proposalList.map((proposal) => (
                      <TableRow key={proposal.id}>
                        <TableCell className="font-medium max-w-xs">
                          <div className="truncate" title={proposal.judul}>
                            {proposal.judul}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(proposal.status)}</TableCell>
                        <TableCell>
                          {new Date(proposal.created_at).toLocaleDateString("id-ID")}
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={proposal.feedback}>
                            {proposal.feedback || "-"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <IconEye className="w-4 h-4 mr-1" />
                              Detail
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDownload(proposal)}
                            >
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

      {/* Success Dialog */}
      <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-green-600">
              <IconCheck className="w-5 h-5 mr-2" />
              Upload Berhasil
            </AlertDialogTitle>
            <AlertDialogDescription>
              Proposal skripsi Anda telah berhasil diupload. Status proposal adalah "Pending" dan akan direview oleh dosen pembimbing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => setShowSuccess(false)}>OK</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Error Dialog */}
      <AlertDialog open={showError} onOpenChange={setShowError}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-red-600">
              <IconX className="w-5 h-5 mr-2" />
              Upload Gagal
            </AlertDialogTitle>
            <AlertDialogDescription>
              {errorMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowError(false)}>
              Tutup
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
