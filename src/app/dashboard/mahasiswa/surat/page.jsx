"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { uploadSuratPermintaan, getMahasiswaDokumen } from "@/lib/api";
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
  IconFileText,
  IconUpload,
  IconDownload,
  IconCheck,
  IconX,
  IconClock,
  IconEye,
  IconPlus,
} from "@tabler/icons-react";

export default function SuratPermintaanPage() {
  const { user } = useAuth();
  const [suratList, setSuratList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    jenis_surat: "",
    keperluan: "",
    keterangan: "",
    file_pendukung: null,
  });

  const jenisSuratOptions = [
    { value: "surat_aktif_kuliah", label: "Surat Keterangan Aktif Kuliah" },
    { value: "surat_cuti", label: "Surat Permohonan Cuti Akademik" },
    { value: "surat_pindah", label: "Surat Keterangan Pindah Prodi" },
    { value: "surat_lulus", label: "Surat Keterangan Lulus" },
    { value: "surat_nilai", label: "Surat Keterangan Nilai" },
    { value: "surat_bebas_biaya", label: "Surat Keterangan Bebas Biaya" },
  ];

  useEffect(() => {
    loadSuratData();
  }, []);

  const loadSuratData = async () => {
    try {
      setLoading(true);
      const data = await getMahasiswaDokumen(user?.id, { 
        jenis_dokumen: ["surat_aktif_kuliah", "surat_cuti", "surat_pindah", "surat_lulus", "surat_nilai", "surat_bebas_biaya"]
      });
      setSuratList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading surat data:", error);
      setSuratList([]);
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
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png'
      ];

      if (!allowedTypes.includes(file.type)) {
        setErrorMessage("Format file tidak didukung. Gunakan PDF, DOC, DOCX, JPG, atau PNG.");
        setShowError(true);
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Ukuran file terlalu besar. Maksimal 5MB.");
        setShowError(true);
        return;
      }

      handleInputChange('file_pendukung', file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.jenis_surat || !formData.keperluan) {
      setErrorMessage("Jenis surat dan keperluan wajib diisi.");
      setShowError(true);
      return;
    }

    try {
      setUploading(true);
      setErrorMessage("");

      const uploadData = new FormData();
      uploadData.append('keperluan', formData.keperluan);
      uploadData.append('keterangan', formData.keterangan);
      
      if (formData.file_pendukung) {
        uploadData.append('file', formData.file_pendukung);
      }

      await uploadSuratPermintaan(uploadData, formData.jenis_surat);
      
      // Reset form
      setFormData({
        jenis_surat: "",
        keperluan: "",
        keterangan: "",
        file_pendukung: null,
      });
      
      // Reset file input
      const fileInput = document.getElementById('file_pendukung');
      if (fileInput) fileInput.value = '';
      
      setShowSuccess(true);
      await loadSuratData();
    } catch (error) {
      console.error("Error uploading surat:", error);
      setErrorMessage(error.message || "Gagal mengajukan surat permintaan.");
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
      case "Processing":
        return <Badge variant="outline"><IconClock className="w-3 h-3 mr-1" />Processing</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getJenisSuratLabel = (jenis) => {
    const option = jenisSuratOptions.find(opt => opt.value === jenis);
    return option?.label || jenis;
  };

  const handleDownload = (surat) => {
    // Simulate download
    const link = document.createElement('a');
    link.href = `/generated-surat/${surat.id}.pdf`;
    link.download = `${surat.judul}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const getStats = () => {
    const total = suratList.length;
    const pending = suratList.filter(s => s.status === "Pending").length;
    const approved = suratList.filter(s => s.status === "Approved").length;
    const rejected = suratList.filter(s => s.status === "Rejected").length;
    
    return { total, pending, approved, rejected };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading surat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Permintaan Surat</h1>
        <p className="text-muted-foreground">
          Ajukan dan kelola permintaan surat akademik
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Permintaan</CardTitle>
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
            <p className="text-xs text-muted-foreground">Menunggu proses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <IconCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Siap diambil</p>
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

      <Tabs defaultValue="request" className="space-y-4">
        <TabsList>
          <TabsTrigger value="request">Ajukan Surat</TabsTrigger>
          <TabsTrigger value="history">Riwayat Permintaan</TabsTrigger>
        </TabsList>

        {/* Request Tab */}
        <TabsContent value="request">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <IconPlus className="w-5 h-5 mr-2" />
                Ajukan Surat Baru
              </CardTitle>
              <CardDescription>
                Lengkapi form untuk mengajukan surat akademik
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Jenis Surat */}
                <div className="space-y-2">
                  <Label htmlFor="jenis_surat">Jenis Surat *</Label>
                  <Select
                    value={formData.jenis_surat}
                    onValueChange={(value) => handleInputChange('jenis_surat', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis surat" />
                    </SelectTrigger>
                    <SelectContent>
                      {jenisSuratOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Keperluan */}
                <div className="space-y-2">
                  <Label htmlFor="keperluan">Keperluan *</Label>
                  <Input
                    id="keperluan"
                    placeholder="Untuk keperluan apa surat ini dibutuhkan"
                    value={formData.keperluan}
                    onChange={(e) => handleInputChange('keperluan', e.target.value)}
                  />
                </div>

                {/* Keterangan */}
                <div className="space-y-2">
                  <Label htmlFor="keterangan">Keterangan Tambahan</Label>
                  <Textarea
                    id="keterangan"
                    placeholder="Keterangan atau informasi tambahan (opsional)"
                    value={formData.keterangan}
                    onChange={(e) => handleInputChange('keterangan', e.target.value)}
                    rows={3}
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="file_pendukung">File Pendukung</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="file_pendukung"
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      className="flex-1"
                    />
                    {formData.file_pendukung && (
                      <div className="flex items-center text-sm text-green-600">
                        <IconCheck className="w-4 h-4 mr-1" />
                        {formData.file_pendukung.name}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Format yang didukung: PDF, DOC, DOCX, JPG, PNG (Maksimal 5MB)
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
                      Mengajukan...
                    </div>
                  ) : (
                    <>
                      <IconUpload className="w-4 h-4 mr-2" />
                      Ajukan Surat
                    </>
                  )}
                </Button>

                {/* Information */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Informasi Penting:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Proses surat membutuhkan waktu 3-5 hari kerja</li>
                    <li>• Pastikan data yang diisi sudah benar dan lengkap</li>
                    <li>• Surat yang sudah disetujui dapat diambil di TU Prodi</li>
                    <li>• Untuk surat tertentu mungkin memerlukan dokumen pendukung</li>
                  </ul>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <IconFileText className="w-5 h-5 mr-2" />
                Riwayat Permintaan Surat
              </CardTitle>
              <CardDescription>
                Daftar surat yang pernah Anda ajukan
              </CardDescription>
            </CardHeader>
            <CardContent>
              {suratList.length === 0 ? (
                <div className="text-center py-8">
                  <IconFileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">
                    Belum ada permintaan surat
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Ajukan surat akademik pertama Anda.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Jenis Surat</TableHead>
                      <TableHead>Keperluan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tanggal Ajukan</TableHead>
                      <TableHead>Tanggal Proses</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suratList.map((surat) => (
                      <TableRow key={surat.id}>
                        <TableCell className="font-medium">
                          {getJenisSuratLabel(surat.jenis_dokumen)}
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={surat.keperluan}>
                            {surat.keperluan}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(surat.status)}</TableCell>
                        <TableCell>
                          {new Date(surat.created_at).toLocaleDateString("id-ID")}
                        </TableCell>
                        <TableCell>
                          {surat.processed_at 
                            ? new Date(surat.processed_at).toLocaleDateString("id-ID")
                            : "-"
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <IconEye className="w-4 h-4 mr-1" />
                              Detail
                            </Button>
                            {surat.status === "Approved" && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDownload(surat)}
                              >
                                <IconDownload className="w-4 h-4 mr-1" />
                                Download
                              </Button>
                            )}
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
              Permintaan Berhasil Diajukan
            </AlertDialogTitle>
            <AlertDialogDescription>
              Permintaan surat Anda telah berhasil diajukan. Status permintaan adalah "Pending" dan akan diproses oleh admin TU Prodi dalam 3-5 hari kerja.
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
              Permintaan Gagal
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
