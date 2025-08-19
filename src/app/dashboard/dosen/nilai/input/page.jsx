"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter, useSearchParams } from "next/navigation";
import { getJadwalKuliahByDosen, inputNilai, finalizeNilai } from "@/lib/api";
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
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IconClipboardData,
  IconCalculator,
  IconArrowLeft,
  IconCheck,
  IconX,
  IconLock,
  IconSave,
} from "@tabler/icons-react";
import Link from "next/link";

export default function InputNilaiPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const jadwalIdFromQuery = searchParams.get("jadwal_id");

  const [jadwalKuliah, setJadwalKuliah] = useState([]);
  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedJadwal, setSelectedJadwal] = useState(jadwalIdFromQuery || "");
  const [nilaiInputs, setNilaiInputs] = useState({});

  useEffect(() => {
    if (user?.id) {
      loadJadwalKuliah();
    }
  }, [user]);

  useEffect(() => {
    if (selectedJadwal) {
      loadMahasiswaData();
    }
  }, [selectedJadwal]);

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

  const loadMahasiswaData = async () => {
    try {
      // In real implementation, this would fetch from KRS data
      // For demo, using mock data
      setMahasiswaList([
        { id: 1, nama: "Ahmad Rizki", nim: "2024001" },
        { id: 2, nama: "Siti Aminah", nim: "2024002" },
        { id: 3, nama: "Budi Santoso", nim: "2024003" },
        { id: 4, nama: "Maya Sari", nim: "2024004" },
        { id: 5, nama: "Andi Pratama", nim: "2024005" }
      ]);

      // Initialize nilai inputs
      const initialInputs = {};
      [1, 2, 3, 4, 5].forEach(id => {
        initialInputs[id] = {
          tugas: "",
          uts: "",
          uas: "",
          nilai_akhir: ""
        };
      });
      setNilaiInputs(initialInputs);
    } catch (error) {
      console.error("Error loading mahasiswa data:", error);
    }
  };

  const handleNilaiChange = (mahasiswaId, field, value) => {
    const numValue = value === "" ? "" : parseFloat(value);
    
    setNilaiInputs(prev => {
      const updated = {
        ...prev,
        [mahasiswaId]: {
          ...prev[mahasiswaId],
          [field]: numValue
        }
      };

      // Auto calculate nilai_akhir when all components are filled
      if (field !== 'nilai_akhir') {
        const nilai = updated[mahasiswaId];
        if (nilai.tugas !== "" && nilai.uts !== "" && nilai.uas !== "") {
          // Formula: 30% Tugas + 30% UTS + 40% UAS
          const nilaiAkhir = (nilai.tugas * 0.3) + (nilai.uts * 0.3) + (nilai.uas * 0.4);
          updated[mahasiswaId].nilai_akhir = Math.round(nilaiAkhir * 100) / 100;
        }
      }

      return updated;
    });
  };

  const getGradeFromNilai = (nilai) => {
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

  const validateInputs = () => {
    for (const mahasiswaId in nilaiInputs) {
      const nilai = nilaiInputs[mahasiswaId];
      
      // Check if any field has value
      const hasValues = nilai.tugas !== "" || nilai.uts !== "" || nilai.uas !== "";
      
      if (hasValues) {
        // Validate range (0-100)
        if (
          (nilai.tugas !== "" && (nilai.tugas < 0 || nilai.tugas > 100)) ||
          (nilai.uts !== "" && (nilai.uts < 0 || nilai.uts > 100)) ||
          (nilai.uas !== "" && (nilai.uas < 0 || nilai.uas > 100))
        ) {
          return "Nilai harus berada dalam rentang 0-100";
        }
      }
    }
    return null;
  };

  const handleSave = async () => {
    const validation = validateInputs();
    if (validation) {
      setErrorMessage(validation);
      setShowError(true);
      return;
    }

    try {
      setSaving(true);
      
      for (const mahasiswaId in nilaiInputs) {
        const nilai = nilaiInputs[mahasiswaId];
        
        // Only save if there are values
        const hasValues = nilai.tugas !== "" || nilai.uts !== "" || nilai.uas !== "";
        
        if (hasValues) {
          await inputNilai({
            mahasiswa_id: parseInt(mahasiswaId),
            jadwal_kuliah_id: parseInt(selectedJadwal),
            tugas: nilai.tugas !== "" ? nilai.tugas : null,
            uts: nilai.uts !== "" ? nilai.uts : null,
            uas: nilai.uas !== "" ? nilai.uas : null
          });
        }
      }

      setShowSuccess(true);
    } catch (error) {
      console.error("Error saving nilai:", error);
      setErrorMessage(error.message || "Gagal menyimpan nilai.");
      setShowError(true);
    } finally {
      setSaving(false);
    }
  };

  const handleFinalize = async () => {
    try {
      setFinalizing(true);
      
      // First save all values
      await handleSave();
      
      // Then finalize each nilai
      for (const mahasiswaId in nilaiInputs) {
        const nilai = nilaiInputs[mahasiswaId];
        const hasValues = nilai.tugas !== "" || nilai.uts !== "" || nilai.uas !== "";
        
        if (hasValues && nilai.nilai_akhir !== "") {
          // In real implementation, you'd need the nilai ID from the save response
          // For demo, we'll just simulate the finalize call
          await finalizeNilai(parseInt(mahasiswaId));
        }
      }
      
      setShowSuccess(true);
    } catch (error) {
      console.error("Error finalizing nilai:", error);
      setErrorMessage(error.message || "Gagal finalisasi nilai.");
      setShowError(true);
    } finally {
      setFinalizing(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    router.push("/dashboard/dosen/nilai");
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
          <h1 className="text-3xl font-bold tracking-tight">Input Nilai</h1>
          <p className="text-muted-foreground">
            Input nilai mahasiswa per mata kuliah
          </p>
        </div>
        <Link href="/dashboard/dosen/nilai">
          <Button variant="outline">
            <IconArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </Link>
      </div>

      {/* Mata Kuliah Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Pilih Mata Kuliah</CardTitle>
          <CardDescription>
            Pilih mata kuliah untuk input nilai mahasiswa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedJadwal} onValueChange={setSelectedJadwal}>
            <SelectTrigger className="w-full max-w-md">
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
        </CardContent>
      </Card>

      {/* Input Nilai Form */}
      {selectedJadwal && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconClipboardData className="w-5 h-5 mr-2" />
              Input Nilai - {jadwalKuliah.find(j => j.id == selectedJadwal)?.mata_kuliah?.nama_mk}
            </CardTitle>
            <CardDescription>
              Input nilai untuk setiap komponen penilaian. Nilai akhir akan dihitung otomatis.
              <br />
              <strong>Formula:</strong> 30% Tugas + 30% UTS + 40% UAS
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mahasiswaList.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Tidak ada mahasiswa terdaftar</p>
              </div>
            ) : (
              <div className="space-y-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>NIM</TableHead>
                      <TableHead>Nama Mahasiswa</TableHead>
                      <TableHead>Tugas (30%)</TableHead>
                      <TableHead>UTS (30%)</TableHead>
                      <TableHead>UAS (40%)</TableHead>
                      <TableHead>Nilai Akhir</TableHead>
                      <TableHead>Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mahasiswaList.map((mahasiswa) => (
                      <TableRow key={mahasiswa.id}>
                        <TableCell className="font-medium">
                          {mahasiswa.nim}
                        </TableCell>
                        <TableCell>{mahasiswa.nama}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="0-100"
                            value={nilaiInputs[mahasiswa.id]?.tugas || ""}
                            onChange={(e) => handleNilaiChange(mahasiswa.id, 'tugas', e.target.value)}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="0-100"
                            value={nilaiInputs[mahasiswa.id]?.uts || ""}
                            onChange={(e) => handleNilaiChange(mahasiswa.id, 'uts', e.target.value)}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="0-100"
                            value={nilaiInputs[mahasiswa.id]?.uas || ""}
                            onChange={(e) => handleNilaiChange(mahasiswa.id, 'uas', e.target.value)}
                            className="w-20"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-lg">
                            {nilaiInputs[mahasiswa.id]?.nilai_akhir || "-"}
                          </div>
                        </TableCell>
                        <TableCell>
                          {nilaiInputs[mahasiswa.id]?.nilai_akhir ? (
                            <div className="font-medium text-lg">
                              {getGradeFromNilai(nilaiInputs[mahasiswa.id].nilai_akhir)}
                            </div>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    variant="outline"
                  >
                    {saving ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                        Menyimpan...
                      </div>
                    ) : (
                      <>
                        <IconSave className="w-4 h-4 mr-2" />
                        Simpan Draft
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={handleFinalize}
                    disabled={finalizing}
                  >
                    {finalizing ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Memfinalisasi...
                      </div>
                    ) : (
                      <>
                        <IconLock className="w-4 h-4 mr-2" />
                        Simpan & Finalisasi
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p><strong>Catatan:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Simpan Draft: Menyimpan nilai tanpa mengunci, masih bisa diedit</li>
                    <li>Simpan & Finalisasi: Mengunci nilai, tidak bisa diedit lagi</li>
                    <li>Nilai harus dalam rentang 0-100</li>
                    <li>Nilai akhir dihitung otomatis berdasarkan formula yang ditentukan</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Success Dialog */}
      <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-green-600">
              <IconCheck className="w-5 h-5 mr-2" />
              Berhasil
            </AlertDialogTitle>
            <AlertDialogDescription>
              Nilai telah berhasil disimpan dan dapat dilihat oleh mahasiswa.
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
              Error
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
