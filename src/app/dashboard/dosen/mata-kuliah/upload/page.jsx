"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { 
  getJadwalKuliahByDosen, 
  uploadMateriKuliah,
  getTahunAkademik 
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { toast } from "sonner";
import {
  IconFileText,
  IconUpload,
  IconX,
  IconChevronLeft,
  IconAlertCircle,
  IconCheck,
  IconBook,
  IconCalendar,
  IconLoader,
} from "@tabler/icons-react";
import Link from "next/link";

export default function UploadMateriPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const [jadwalKuliah, setJadwalKuliah] = useState([]);
  const [tahunAkademik, setTahunAkademik] = useState([]);
  const [selectedTahunAkademik, setSelectedTahunAkademik] = useState("");
  const [selectedJadwal, setSelectedJadwal] = useState("");
  const [formData, setFormData] = useState({
    judul: "",
    deskripsi: "",
    file: null
  });
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({});

  // Get jadwal_id from URL params if available
  const preselectedJadwalId = searchParams.get("jadwal_id");

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (user?.id && selectedTahunAkademik) {
      loadJadwalKuliah();
    }
  }, [user, selectedTahunAkademik]);

  useEffect(() => {
    if (preselectedJadwalId && jadwalKuliah.length > 0) {
      setSelectedJadwal(preselectedJadwalId);
    }
  }, [preselectedJadwalId, jadwalKuliah]);

  const loadInitialData = async () => {
    try {
      // Load tahun akademik
      const tahunData = await getTahunAkademik();
      const tahunList = Array.isArray(tahunData) ? tahunData : [];
      setTahunAkademik(tahunList);
      
      // Set default to active tahun akademik
      const activeTahun = tahunList.find(t => t.is_aktif);
      if (activeTahun) {
        setSelectedTahunAkademik(activeTahun.id.toString());
      }
      
    } catch (error) {
      console.error("Error loading initial data:", error);
      // Mock data fallback
      setTahunAkademik([
        { id: 1, tahun: "2024/2025", semester: "Ganjil", is_aktif: true },
        { id: 2, tahun: "2023/2024", semester: "Genap", is_aktif: false }
      ]);
      setSelectedTahunAkademik("1");
    }
  };

  const loadJadwalKuliah = async () => {
    try {
      const data = await getJadwalKuliahByDosen(user.id, {
        tahun_akademik_id: selectedTahunAkademik
      });
      setJadwalKuliah(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading jadwal kuliah:", error);
      // Mock data for demo
      setJadwalKuliah([
        {
          id: 1,
          mata_kuliah: { 
            id: 1, 
            nama_mk: "Pemrograman Web", 
            kode_mk: "TI301", 
            sks: 3 
          },
          ruang: "Lab Komputer 1",
          hari: "Senin",
          jam_mulai: "08:00",
          jam_selesai: "10:30"
        },
        {
          id: 2,
          mata_kuliah: { 
            id: 2, 
            nama_mk: "Basis Data", 
            kode_mk: "TI302", 
            sks: 3 
          },
          ruang: "Lab Komputer 2",
          hari: "Rabu",
          jam_mulai: "10:30",
          jam_selesai: "13:00"
        }
      ]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          file: "Format file tidak didukung. Gunakan PDF, DOC, DOCX, PPT, atau PPTX"
        }));
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          file: "Ukuran file maksimal 10MB"
        }));
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        file
      }));
      
      // Clear file error
      if (errors.file) {
        setErrors(prev => ({
          ...prev,
          file: ""
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedJadwal) {
      newErrors.jadwal = "Pilih mata kuliah terlebih dahulu";
    }
    
    if (!formData.judul.trim()) {
      newErrors.judul = "Judul materi harus diisi";
    }
    
    if (!formData.file) {
      newErrors.file = "Pilih file untuk diupload";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Mohon lengkapi semua field yang diperlukan");
      return;
    }
    
    try {
      setLoading(true);
      setUploadProgress(0);
      
      // Create FormData for file upload
      const uploadData = new FormData();
      uploadData.append("jadwal_kuliah_id", selectedJadwal);
      uploadData.append("dosen_id", user.id.toString());
      uploadData.append("judul", formData.judul);
      if (formData.deskripsi) {
        uploadData.append("deskripsi", formData.deskripsi);
      }
      uploadData.append("file", formData.file);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 20;
        });
      }, 200);
      
      await uploadMateriKuliah(uploadData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast.success("Materi kuliah berhasil diupload!");
      
      // Reset form
      setFormData({
        judul: "",
        deskripsi: "",
        file: null
      });
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
      
      // Redirect back to mata kuliah page after a short delay
      setTimeout(() => {
        router.push("/dashboard/dosen/mata-kuliah");
      }, 1500);
      
    } catch (error) {
      console.error("Error uploading materi:", error);
      toast.error("Gagal mengupload materi kuliah");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const selectedJadwalInfo = jadwalKuliah.find(j => j.id.toString() === selectedJadwal);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/dosen/mata-kuliah">
          <Button variant="outline" size="sm">
            <IconChevronLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upload Materi Kuliah</h1>
          <p className="text-muted-foreground">
            Upload file materi pembelajaran untuk mata kuliah yang Anda ampu
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Form */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <IconUpload className="w-5 h-5 mr-2" />
                Form Upload Materi
              </CardTitle>
              <CardDescription>
                Isi informasi materi kuliah dan pilih file untuk diupload
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tahun Akademik Selection */}
                <div className="space-y-2">
                  <Label htmlFor="tahun-akademik">Tahun Akademik</Label>
                  <Select 
                    value={selectedTahunAkademik} 
                    onValueChange={setSelectedTahunAkademik}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tahun akademik" />
                    </SelectTrigger>
                    <SelectContent>
                      {tahunAkademik.map((tahun) => (
                        <SelectItem key={tahun.id} value={tahun.id.toString()}>
                          {tahun.tahun} - {tahun.semester}
                          {tahun.is_aktif && " (Aktif)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Mata Kuliah Selection */}
                <div className="space-y-2">
                  <Label htmlFor="mata-kuliah">Mata Kuliah</Label>
                  <Select 
                    value={selectedJadwal} 
                    onValueChange={setSelectedJadwal}
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
                  {errors.jadwal && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <IconAlertCircle className="w-4 h-4" />
                      {errors.jadwal}
                    </p>
                  )}
                </div>

                {/* Judul Materi */}
                <div className="space-y-2">
                  <Label htmlFor="judul">Judul Materi *</Label>
                  <Input
                    id="judul"
                    name="judul"
                    value={formData.judul}
                    onChange={handleInputChange}
                    placeholder="Masukkan judul materi kuliah"
                    className={errors.judul ? "border-red-500" : ""}
                  />
                  {errors.judul && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <IconAlertCircle className="w-4 h-4" />
                      {errors.judul}
                    </p>
                  )}
                </div>

                {/* Deskripsi */}
                <div className="space-y-2">
                  <Label htmlFor="deskripsi">Deskripsi (Opsional)</Label>
                  <Textarea
                    id="deskripsi"
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleInputChange}
                    placeholder="Berikan deskripsi singkat tentang materi ini"
                    rows={3}
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="file">File Materi *</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <IconFileText className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <label htmlFor="file" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            Pilih file atau drag & drop di sini
                          </span>
                          <span className="mt-1 block text-xs text-gray-500">
                            PDF, DOC, DOCX, PPT, PPTX hingga 10MB
                          </span>
                        </label>
                        <input
                          id="file"
                          name="file"
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.ppt,.pptx"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {formData.file && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <IconFileText className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium">{formData.file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, file: null }));
                          const fileInput = document.querySelector('input[type="file"]');
                          if (fileInput) fileInput.value = "";
                        }}
                      >
                        <IconX className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  
                  {errors.file && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <IconAlertCircle className="w-4 h-4" />
                      {errors.file}
                    </p>
                  )}
                </div>

                {/* Upload Progress */}
                {loading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <IconLoader className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <IconUpload className="w-4 h-4 mr-2" />
                        Upload Materi
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/dashboard/dosen/mata-kuliah")}
                    disabled={loading}
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Selected Mata Kuliah Info */}
          {selectedJadwalInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <IconBook className="w-5 h-5 mr-2" />
                  Mata Kuliah Dipilih
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{selectedJadwalInfo.mata_kuliah?.nama_mk}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedJadwalInfo.mata_kuliah?.kode_mk} • {selectedJadwalInfo.mata_kuliah?.sks} SKS
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <IconCalendar className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedJadwalInfo.hari}, {selectedJadwalInfo.jam_mulai} - {selectedJadwalInfo.jam_selesai}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Ruang: {selectedJadwalInfo.ruang}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upload Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Panduan Upload</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Format File yang Didukung:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• PDF (.pdf)</li>
                  <li>• Microsoft Word (.doc, .docx)</li>
                  <li>• Microsoft PowerPoint (.ppt, .pptx)</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Ketentuan:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Ukuran file maksimal 10MB</li>
                  <li>• Gunakan nama file yang deskriptif</li>
                  <li>• Pastikan konten sesuai dengan mata kuliah</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Alert>
            <IconCheck className="h-4 w-4" />
            <AlertTitle>Tips</AlertTitle>
            <AlertDescription className="text-sm">
              Berikan judul yang jelas dan deskripsi yang informatif agar mahasiswa mudah memahami konten materi.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
