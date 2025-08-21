"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
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
  IconSchool,
  IconUser,
  IconLoader,
  IconClipboard,
} from "@tabler/icons-react";
import Link from "next/link";

export default function UploadBimbinganPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    jenis_dokumen: "",
    judul: "",
    mahasiswa_nim: "",
    mahasiswa_nama: "",
    deskripsi: "",
    file: null
  });
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({});

  // Get type from URL params if available
  const preselectedType = searchParams.get("type");

  useEffect(() => {
    if (preselectedType && ["proposal", "skripsi", "magang"].includes(preselectedType)) {
      setFormData(prev => ({
        ...prev,
        jenis_dokumen: preselectedType
      }));
    }
  }, [preselectedType]);

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

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user makes selection
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
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          file: "Format file tidak didukung. Gunakan PDF, DOC, atau DOCX"
        }));
        return;
      }
      
      // Validate file size (max 15MB for academic documents)
      if (file.size > 15 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          file: "Ukuran file maksimal 15MB"
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
    
    if (!formData.jenis_dokumen) {
      newErrors.jenis_dokumen = "Pilih jenis dokumen";
    }
    
    if (!formData.judul.trim()) {
      newErrors.judul = "Judul dokumen harus diisi";
    }
    
    if (!formData.mahasiswa_nim.trim()) {
      newErrors.mahasiswa_nim = "NIM mahasiswa harus diisi";
    }
    
    if (!formData.mahasiswa_nama.trim()) {
      newErrors.mahasiswa_nama = "Nama mahasiswa harus diisi";
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
      uploadData.append("jenis_dokumen", formData.jenis_dokumen);
      uploadData.append("judul", formData.judul);
      uploadData.append("mahasiswa_nim", formData.mahasiswa_nim);
      uploadData.append("mahasiswa_nama", formData.mahasiswa_nama);
      uploadData.append("uploaded_by", user.id.toString());
      uploadData.append("pembimbing_id", user.id.toString()); // Dosen sebagai pembimbing
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
      
      await uploadDokumenAkademik(uploadData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast.success("Dokumen bimbingan berhasil diupload!");
      
      // Reset form
      setFormData({
        jenis_dokumen: "",
        judul: "",
        mahasiswa_nim: "",
        mahasiswa_nama: "",
        deskripsi: "",
        file: null
      });
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
      
      // Redirect back to bimbingan page after a short delay
      setTimeout(() => {
        router.push("/dashboard/dosen/bimbingan");
      }, 1500);
      
    } catch (error) {
      console.error("Error uploading dokumen:", error);
      toast.error("Gagal mengupload dokumen bimbingan");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const getJenisDocumentOptions = () => [
    { value: "proposal", label: "Proposal Skripsi", description: "Proposal penelitian skripsi mahasiswa" },
    { value: "skripsi", label: "Draft Skripsi", description: "Draft atau revisi skripsi mahasiswa" },
    { value: "magang", label: "Dokumen Magang", description: "Proposal atau laporan magang" }
  ];

  const getJenisDocumentInfo = (jenis) => {
    const options = getJenisDocumentOptions();
    return options.find(opt => opt.value === jenis);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/dosen/bimbingan">
          <Button variant="outline" size="sm">
            <IconChevronLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Upload Dokumen Bimbingan</h1>
          <p className="text-muted-foreground">
            Upload dokumen bimbingan skripsi atau magang mahasiswa
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
                Form Upload Dokumen
              </CardTitle>
              <CardDescription>
                Isi informasi dokumen bimbingan dan data mahasiswa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Jenis Dokumen */}
                <div className="space-y-2">
                  <Label htmlFor="jenis-dokumen">Jenis Dokumen *</Label>
                  <Select 
                    value={formData.jenis_dokumen} 
                    onValueChange={(value) => handleSelectChange("jenis_dokumen", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis dokumen" />
                    </SelectTrigger>
                    <SelectContent>
                      {getJenisDocumentOptions().map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-muted-foreground">{option.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.jenis_dokumen && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <IconAlertCircle className="w-4 h-4" />
                      {errors.jenis_dokumen}
                    </p>
                  )}
                </div>

                {/* Judul Dokumen */}
                <div className="space-y-2">
                  <Label htmlFor="judul">Judul Dokumen *</Label>
                  <Input
                    id="judul"
                    name="judul"
                    value={formData.judul}
                    onChange={handleInputChange}
                    placeholder="Masukkan judul dokumen"
                    className={errors.judul ? "border-red-500" : ""}
                  />
                  {errors.judul && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <IconAlertCircle className="w-4 h-4" />
                      {errors.judul}
                    </p>
                  )}
                </div>

                {/* Data Mahasiswa */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="mahasiswa-nim">NIM Mahasiswa *</Label>
                    <Input
                      id="mahasiswa-nim"
                      name="mahasiswa_nim"
                      value={formData.mahasiswa_nim}
                      onChange={handleInputChange}
                      placeholder="Contoh: 2024001"
                      className={errors.mahasiswa_nim ? "border-red-500" : ""}
                    />
                    {errors.mahasiswa_nim && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <IconAlertCircle className="w-4 h-4" />
                        {errors.mahasiswa_nim}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mahasiswa-nama">Nama Mahasiswa *</Label>
                    <Input
                      id="mahasiswa-nama"
                      name="mahasiswa_nama"
                      value={formData.mahasiswa_nama}
                      onChange={handleInputChange}
                      placeholder="Nama lengkap mahasiswa"
                      className={errors.mahasiswa_nama ? "border-red-500" : ""}
                    />
                    {errors.mahasiswa_nama && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <IconAlertCircle className="w-4 h-4" />
                        {errors.mahasiswa_nama}
                      </p>
                    )}
                  </div>
                </div>

                {/* Deskripsi */}
                <div className="space-y-2">
                  <Label htmlFor="deskripsi">Deskripsi/Catatan (Opsional)</Label>
                  <Textarea
                    id="deskripsi"
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleInputChange}
                    placeholder="Berikan catatan atau deskripsi tambahan tentang dokumen ini"
                    rows={3}
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="file">File Dokumen *</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <IconFileText className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <label htmlFor="file" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            Pilih file atau drag & drop di sini
                          </span>
                          <span className="mt-1 block text-xs text-gray-500">
                            PDF, DOC, DOCX hingga 15MB
                          </span>
                        </label>
                        <input
                          id="file"
                          name="file"
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx"
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
                        Upload Dokumen
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/dashboard/dosen/bimbingan")}
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
          {/* Selected Document Type Info */}
          {formData.jenis_dokumen && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <IconSchool className="w-5 h-5 mr-2" />
                  Jenis Dokumen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{getJenisDocumentInfo(formData.jenis_dokumen)?.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {getJenisDocumentInfo(formData.jenis_dokumen)?.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mahasiswa Info */}
          {(formData.mahasiswa_nim || formData.mahasiswa_nama) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <IconUser className="w-5 h-5 mr-2" />
                  Data Mahasiswa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {formData.mahasiswa_nama && (
                  <div>
                    <p className="font-medium">{formData.mahasiswa_nama}</p>
                    {formData.mahasiswa_nim && (
                      <p className="text-sm text-muted-foreground">NIM: {formData.mahasiswa_nim}</p>
                    )}
                  </div>
                )}
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
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Ketentuan:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Ukuran file maksimal 15MB</li>
                  <li>• Pastikan data mahasiswa benar</li>
                  <li>• Gunakan nama file yang deskriptif</li>
                  <li>• Dokumen harus sesuai dengan jenis yang dipilih</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Workflow Info */}
          <Alert>
            <IconClipboard className="h-4 w-4" />
            <AlertTitle>Alur Bimbingan</AlertTitle>
            <AlertDescription className="text-sm">
              Setelah dokumen diupload, status akan menjadi "Pending" dan dapat direview. 
              Anda dapat memberikan approval atau feedback untuk mahasiswa.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
