"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter, useSearchParams } from "next/navigation";
import { getJadwalKuliahByDosen, uploadMateriKuliah } from "@/lib/api";
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

export default function UploadMateriPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const jadwalIdFromQuery = searchParams.get("jadwal_id");

  const [jadwalKuliah, setJadwalKuliah] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    jadwal_kuliah_id: jadwalIdFromQuery || "",
    judul: "",
    deskripsi: "",
    file: null,
  });

  useEffect(() => {
    if (user?.id) {
      loadJadwalKuliah();
    }
  }, [user]);

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
        },
        {
          id: 2,
          mata_kuliah: { id: 2, nama_mk: "Basis Data", kode_mk: "TI302", sks: 3 },
          ruang: "Lab Komputer 2",
          hari: "Rabu",
          jam_mulai: "10:30",
          jam_selesai: "13:00",
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
      // Validate file type (accept common document formats)
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain'
      ];

      if (!allowedTypes.includes(file.type)) {
        setErrorMessage("Format file tidak didukung. Gunakan PDF, DOC, DOCX, PPT, PPTX, atau TXT.");
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
    
    if (!formData.jadwal_kuliah_id || !formData.judul || !formData.file) {
      setErrorMessage("Semua field wajib diisi.");
      setShowError(true);
      return;
    }

    try {
      setUploading(true);
      setErrorMessage("");

      const uploadData = new FormData();
      uploadData.append('jadwal_kuliah_id', formData.jadwal_kuliah_id);
      uploadData.append('judul', formData.judul);
      uploadData.append('deskripsi', formData.deskripsi);
      uploadData.append('file', formData.file);

      await uploadMateriKuliah(uploadData);
      setShowSuccess(true);
    } catch (error) {
      console.error("Error uploading materi:", error);
      setErrorMessage(error.message || "Gagal mengupload materi kuliah.");
      setShowError(true);
    } finally {
      setUploading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    router.push("/dashboard/dosen/mata-kuliah");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upload Materi Kuliah</h1>
          <p className="text-muted-foreground">
            Upload materi pembelajaran untuk mata kuliah
          </p>
        </div>
        <Link href="/dashboard/dosen/mata-kuliah">
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
            Form Upload Materi
          </CardTitle>
          <CardDescription>
            Lengkapi informasi materi kuliah yang akan diupload
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mata Kuliah Selection */}
            <div className="space-y-2">
              <Label htmlFor="jadwal_kuliah_id">Mata Kuliah *</Label>
              <Select
                value={formData.jadwal_kuliah_id}
                onValueChange={(value) => handleInputChange('jadwal_kuliah_id', value)}
              >
                <SelectTrigger>
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
            </div>

            {/* Judul Materi */}
            <div className="space-y-2">
              <Label htmlFor="judul">Judul Materi *</Label>
              <Input
                id="judul"
                placeholder="Masukkan judul materi"
                value={formData.judul}
                onChange={(e) => handleInputChange('judul', e.target.value)}
              />
            </div>

            {/* Deskripsi */}
            <div className="space-y-2">
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea
                id="deskripsi"
                placeholder="Deskripsi singkat tentang materi (opsional)"
                value={formData.deskripsi}
                onChange={(e) => handleInputChange('deskripsi', e.target.value)}
                rows={3}
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="file">File Materi *</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
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
                Format yang didukung: PDF, DOC, DOCX, PPT, PPTX, TXT (Maksimal 10MB)
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
                    Upload Materi
                  </>
                )}
              </Button>
              <Link href="/dashboard/dosen/mata-kuliah">
                <Button type="button" variant="outline">
                  Batal
                </Button>
              </Link>
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
              Materi kuliah telah berhasil diupload dan dapat diakses oleh mahasiswa.
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
