"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { uploadDokumenAkademik } from "@/lib/api";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/dialog";
import {
  IconUpload,
  IconFileText,
  IconArrowLeft,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import Link from "next/link";

export default function UploadDokumenPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    jenis_dokumen: "",
    mahasiswa_nim: "",
    mahasiswa_nama: "",
    judul: "",
    deskripsi: "",
    file: null,
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type (accept common document formats)
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];

      if (!allowedTypes.includes(file.type)) {
        setErrorMessage("Format file tidak didukung. Gunakan PDF, DOC, DOCX, atau TXT.");
        setShowError(true);
        return;
      }

      // Validate file size (max 25MB for academic documents)
      if (file.size > 25 * 1024 * 1024) {
        setErrorMessage("Ukuran file terlalu besar. Maksimal 25MB.");
        setShowError(true);
        return;
      }

      handleInputChange('file', file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.jenis_dokumen || !formData.mahasiswa_nim || !formData.mahasiswa_nama || 
        !formData.judul || !formData.file) {
      setErrorMessage("Semua field wajib diisi.");
      setShowError(true);
      return;
    }

    try {
      setUploading(true);
      setErrorMessage("");

      const uploadData = new FormData();
      uploadData.append('jenis_dokumen', formData.jenis_dokumen);
      uploadData.append('judul', formData.judul);
      uploadData.append('deskripsi', formData.deskripsi);
      uploadData.append('mahasiswa_nim', formData.mahasiswa_nim);
      uploadData.append('mahasiswa_nama', formData.mahasiswa_nama);
      uploadData.append('file', formData.file);
      uploadData.append('uploaded_by', user?.id);

      await uploadDokumenAkademik(uploadData);
      setShowSuccess(true);
    } catch (error) {
      console.error("Error uploading dokumen:", error);
      setErrorMessage(error.message || "Gagal mengupload dokumen akademik.");
      setShowError(true);
    } finally {
      setUploading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    router.push("/dashboard/dosen/bimbingan");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upload Dokumen Bimbingan</h1>
          <p className="text-muted-foreground">
            Upload dokumen skripsi atau magang untuk mahasiswa bimbingan
          </p>
        </div>
        <Link href="/dashboard/dosen/bimbingan">
          <Button variant="outline">
            <IconArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <IconUpload className="w-5 h-5 mr-2" />
            Form Upload Dokumen
          </CardTitle>
          <CardDescription>
            Lengkapi informasi dokumen akademik yang akan diupload
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Jenis Dokumen */}
            <div className="space-y-2">
              <Label htmlFor="jenis_dokumen">Jenis Dokumen *</Label>
              <Select
                value={formData.jenis_dokumen}
                onValueChange={(value) => handleInputChange('jenis_dokumen', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis dokumen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="skripsi">Skripsi</SelectItem>
                  <SelectItem value="magang">Magang/PKL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mahasiswa Information */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="mahasiswa_nim">NIM Mahasiswa *</Label>
                <Input
                  id="mahasiswa_nim"
                  placeholder="Masukkan NIM mahasiswa"
                  value={formData.mahasiswa_nim}
                  onChange={(e) => handleInputChange('mahasiswa_nim', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mahasiswa_nama">Nama Mahasiswa *</Label>
                <Input
                  id="mahasiswa_nama"
                  placeholder="Masukkan nama mahasiswa"
                  value={formData.mahasiswa_nama}
                  onChange={(e) => handleInputChange('mahasiswa_nama', e.target.value)}
                />
              </div>
            </div>

            {/* Judul */}
            <div className="space-y-2">
              <Label htmlFor="judul">
                {formData.jenis_dokumen === "skripsi" ? "Judul Skripsi" : 
                 formData.jenis_dokumen === "magang" ? "Tempat/Instansi Magang" : 
                 "Judul"} *
              </Label>
              <Input
                id="judul"
                placeholder={
                  formData.jenis_dokumen === "skripsi" ? "Masukkan judul skripsi" :
                  formData.jenis_dokumen === "magang" ? "Masukkan tempat/instansi magang" :
                  "Masukkan judul dokumen"
                }
                value={formData.judul}
                onChange={(e) => handleInputChange('judul', e.target.value)}
              />
            </div>

            {/* Deskripsi */}
            <div className="space-y-2">
              <Label htmlFor="deskripsi">Deskripsi/Catatan</Label>
              <Textarea
                id="deskripsi"
                placeholder="Deskripsi singkat atau catatan tambahan (opsional)"
                value={formData.deskripsi}
                onChange={(e) => handleInputChange('deskripsi', e.target.value)}
                rows={3}
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="file">File Dokumen *</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt"
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
                Format yang didukung: PDF, DOC, DOCX, TXT (Maksimal 25MB)
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={uploading}
                className="flex-1"
              >
                {uploading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Mengupload...
                  </div>
                ) : (
                  <>
                    <IconUpload className="w-4 h-4 mr-2" />
                    Upload Dokumen
                  </>
                )}
              </Button>
              <Link href="/dashboard/dosen/bimbingan">
                <Button type="button" variant="outline">
                  Batal
                </Button>
              </Link>
            </div>

            {/* Information */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Catatan:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Dokumen yang diupload akan memiliki status "Pending" dan perlu review</li>
                <li>• Pastikan informasi mahasiswa yang diisi sudah benar</li>
                <li>• File dokumen akan tersimpan aman di sistem</li>
                <li>• Anda dapat memberikan feedback setelah mereview dokumen</li>
              </ul>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-green-600">
              <IconCheck className="w-5 h-5 mr-2" />
              Upload Berhasil
            </AlertDialogTitle>
            <AlertDialogDescription>
              Dokumen akademik telah berhasil diupload. Status dokumen adalah "Pending" dan siap untuk direview.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={handleSuccessClose}>OK</Button>
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
