"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { 
  getJadwalKuliahByDosen, 
  getNilaiDetail,
  inputNilai,
  updateNilai,
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
  IconClipboardData,
  IconChevronLeft,
  IconAlertCircle,
  IconCheck,
  IconCalculator,
  IconUser,
  IconLoader,
  IconBook,
  IconCalendar,
  IconSave,
} from "@tabler/icons-react";
import Link from "next/link";

export default function InputNilaiPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const [jadwalKuliah, setJadwalKuliah] = useState([]);
  const [tahunAkademik, setTahunAkademik] = useState([]);
  const [selectedTahunAkademik, setSelectedTahunAkademik] = useState("");
  const [selectedJadwal, setSelectedJadwal] = useState("");
  const [formData, setFormData] = useState({
    mahasiswa_id: "",
    mahasiswa_nim: "",
    mahasiswa_nama: "",
    tugas: "",
    uts: "",
    uas: "",
    nilai_akhir: "",
    nilai_huruf: ""
  });
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [nilaiId, setNilaiId] = useState(null);
  const [errors, setErrors] = useState({});

  // Get parameters from URL
  const preselectedJadwalId = searchParams.get("jadwal_id");
  const editNilaiId = searchParams.get("id");

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

  useEffect(() => {
    if (editNilaiId) {
      setIsEdit(true);
      setNilaiId(editNilaiId);
      loadNilaiData(editNilaiId);
    }
  }, [editNilaiId]);

  // Auto calculate nilai akhir when component scores change
  useEffect(() => {
    if (formData.tugas && formData.uts && formData.uas) {
      calculateNilaiAkhir();
    }
  }, [formData.tugas, formData.uts, formData.uas]);

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

  const loadNilaiData = async (id) => {
    try {
      const data = await getNilaiDetail(id);
      if (data) {
        setFormData({
          mahasiswa_id: data.mahasiswa_id || "",
          mahasiswa_nim: data.mahasiswa?.nim || "",
          mahasiswa_nama: data.mahasiswa?.nama || "",
          tugas: data.tugas || "",
          uts: data.uts || "",
          uas: data.uas || "",
          nilai_akhir: data.nilai_akhir || "",
          nilai_huruf: data.nilai_huruf || ""
        });
        if (data.jadwal_kuliah_id) {
          setSelectedJadwal(data.jadwal_kuliah_id.toString());
        }
      }
    } catch (error) {
      console.error("Error loading nilai data:", error);
      toast.error("Gagal memuat data nilai");
    }
  };

  const calculateNilaiAkhir = () => {
    const tugas = parseFloat(formData.tugas) || 0;
    const uts = parseFloat(formData.uts) || 0;
    const uas = parseFloat(formData.uas) || 0;
    
    // Formula: 30% Tugas + 30% UTS + 40% UAS
    const nilaiAkhir = (tugas * 0.3) + (uts * 0.3) + (uas * 0.4);
    const nilaiHuruf = getNilaiHuruf(nilaiAkhir);
    
    setFormData(prev => ({
      ...prev,
      nilai_akhir: nilaiAkhir.toFixed(2),
      nilai_huruf: nilaiHuruf
    }));
  };

  const getNilaiHuruf = (nilai) => {
    if (nilai >= 85) return "A";
    if (nilai >= 80) return "A-";
    if (nilai >= 75) return "B+";
    if (nilai >= 70) return "B";
    if (nilai >= 65) return "B-";
    if (nilai >= 60) return "C+";
    if (nilai >= 55) return "C";
    if (nilai >= 50) return "C-";
    if (nilai >= 45) return "D";
    return "E";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validate numeric inputs
    if (["tugas", "uts", "uas"].includes(name)) {
      const numValue = parseFloat(value);
      if (value !== "" && (isNaN(numValue) || numValue < 0 || numValue > 100)) {
        return; // Don't update if invalid
      }
    }
    
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedJadwal) {
      newErrors.jadwal = "Pilih mata kuliah terlebih dahulu";
    }
    
    if (!formData.mahasiswa_nim.trim()) {
      newErrors.mahasiswa_nim = "NIM mahasiswa harus diisi";
    }
    
    if (!formData.mahasiswa_nama.trim()) {
      newErrors.mahasiswa_nama = "Nama mahasiswa harus diisi";
    }
    
    if (!formData.tugas) {
      newErrors.tugas = "Nilai tugas harus diisi";
    }
    
    if (!formData.uts) {
      newErrors.uts = "Nilai UTS harus diisi";
    }
    
    if (!formData.uas) {
      newErrors.uas = "Nilai UAS harus diisi";
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
      
      const nilaiData = {
        mahasiswa_id: formData.mahasiswa_id || null,
        mahasiswa_nim: formData.mahasiswa_nim,
        mahasiswa_nama: formData.mahasiswa_nama,
        jadwal_kuliah_id: parseInt(selectedJadwal),
        tugas: parseFloat(formData.tugas),
        uts: parseFloat(formData.uts),
        uas: parseFloat(formData.uas),
        nilai_akhir: parseFloat(formData.nilai_akhir),
        nilai_huruf: formData.nilai_huruf
      };
      
      if (isEdit && nilaiId) {
        await updateNilai(nilaiId, nilaiData);
        toast.success("Nilai berhasil diupdate!");
      } else {
        await inputNilai(nilaiData);
        toast.success("Nilai berhasil diinput!");
      }
      
      // Reset form if not editing
      if (!isEdit) {
        setFormData({
          mahasiswa_id: "",
          mahasiswa_nim: "",
          mahasiswa_nama: "",
          tugas: "",
          uts: "",
          uas: "",
          nilai_akhir: "",
          nilai_huruf: ""
        });
      }
      
      // Redirect back to nilai page after a short delay
      setTimeout(() => {
        router.push("/dashboard/dosen/nilai");
      }, 1500);
      
    } catch (error) {
      console.error("Error saving nilai:", error);
      toast.error("Gagal menyimpan nilai");
    } finally {
      setLoading(false);
    }
  };

  const selectedJadwalInfo = jadwalKuliah.find(j => j.id.toString() === selectedJadwal);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/dosen/nilai">
          <Button variant="outline" size="sm">
            <IconChevronLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEdit ? "Edit Nilai Mahasiswa" : "Input Nilai Mahasiswa"}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? "Update nilai mahasiswa yang sudah ada" : "Input nilai baru untuk mahasiswa"}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Form */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <IconClipboardData className="w-5 h-5 mr-2" />
                {isEdit ? "Form Edit Nilai" : "Form Input Nilai"}
              </CardTitle>
              <CardDescription>
                {isEdit ? "Update data nilai mahasiswa" : "Masukkan data nilai mahasiswa baru"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Tahun Akademik Selection */}
                {!isEdit && (
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
                )}

                {/* Mata Kuliah Selection */}
                <div className="space-y-2">
                  <Label htmlFor="mata-kuliah">Mata Kuliah</Label>
                  <Select 
                    value={selectedJadwal} 
                    onValueChange={setSelectedJadwal}
                    disabled={isEdit}
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

                {/* Nilai Input */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="tugas">Nilai Tugas (30%) *</Label>
                    <Input
                      id="tugas"
                      name="tugas"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.tugas}
                      onChange={handleInputChange}
                      placeholder="0-100"
                      className={errors.tugas ? "border-red-500" : ""}
                    />
                    {errors.tugas && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <IconAlertCircle className="w-4 h-4" />
                        {errors.tugas}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="uts">Nilai UTS (30%) *</Label>
                    <Input
                      id="uts"
                      name="uts"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.uts}
                      onChange={handleInputChange}
                      placeholder="0-100"
                      className={errors.uts ? "border-red-500" : ""}
                    />
                    {errors.uts && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <IconAlertCircle className="w-4 h-4" />
                        {errors.uts}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="uas">Nilai UAS (40%) *</Label>
                    <Input
                      id="uas"
                      name="uas"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.uas}
                      onChange={handleInputChange}
                      placeholder="0-100"
                      className={errors.uas ? "border-red-500" : ""}
                    />
                    {errors.uas && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <IconAlertCircle className="w-4 h-4" />
                        {errors.uas}
                      </p>
                    )}
                  </div>
                </div>

                {/* Hasil Perhitungan */}
                {formData.nilai_akhir && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nilai-akhir">Nilai Akhir</Label>
                      <Input
                        id="nilai-akhir"
                        name="nilai_akhir"
                        value={formData.nilai_akhir}
                        readOnly
                        className="bg-gray-50"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="nilai-huruf">Nilai Huruf</Label>
                      <Input
                        id="nilai-huruf"
                        name="nilai_huruf"
                        value={formData.nilai_huruf}
                        readOnly
                        className="bg-gray-50 font-bold"
                      />
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
                        {isEdit ? "Updating..." : "Saving..."}
                      </>
                    ) : (
                      <>
                        <IconSave className="w-4 h-4 mr-2" />
                        {isEdit ? "Update Nilai" : "Simpan Nilai"}
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/dashboard/dosen/nilai")}
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
                  Mata Kuliah
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

          {/* Student Info */}
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

          {/* Calculation Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <IconCalculator className="w-5 h-5 mr-2" />
                Formula Perhitungan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Bobot Nilai:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Tugas: 30%</li>
                  <li>• UTS: 30%</li>
                  <li>• UAS: 40%</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Konversi Huruf:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• A: 85-100</li>
                  <li>• A-: 80-84</li>
                  <li>• B+: 75-79</li>
                  <li>• B: 70-74</li>
                  <li>• B-: 65-69</li>
                  <li>• C+: 60-64</li>
                  <li>• C: 55-59</li>
                  <li>• C-: 50-54</li>
                  <li>• D: 45-49</li>
                  <li>• E: 0-44</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Alert>
            <IconCheck className="h-4 w-4" />
            <AlertTitle>Tips Input Nilai</AlertTitle>
            <AlertDescription className="text-sm">
              Pastikan semua nilai berada dalam rentang 0-100. Nilai akhir akan dihitung otomatis berdasarkan bobot masing-masing komponen.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
