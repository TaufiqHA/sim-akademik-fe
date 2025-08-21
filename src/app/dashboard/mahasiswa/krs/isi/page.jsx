"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { createKrs, getJadwalKuliah } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
} from "@/components/ui/alert-dialog";
import {
  IconClipboard,
  IconArrowLeft,
  IconDeviceFloppy,
  IconCheck,
  IconX,
  IconSearch,
} from "@tabler/icons-react";
import Link from "next/link";

export default function IsiKrsPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [jadwalKuliah, setJadwalKuliah] = useState([]);
  const [selectedMataKuliah, setSelectedMataKuliah] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProdi, setSelectedProdi] = useState("all");

  useEffect(() => {
    loadJadwalKuliah();
  }, []);

  const loadJadwalKuliah = async () => {
    try {
      setLoading(true);
      const data = await getJadwalKuliah({
        tahun_akademik_id: 1, // Current academic year
        prodi_id: user?.prodi_id
      });
      setJadwalKuliah(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading jadwal kuliah:", error);
      setJadwalKuliah([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMataKuliahSelect = (jadwal, isSelected) => {
    if (isSelected) {
      setSelectedMataKuliah(prev => [...prev, jadwal]);
    } else {
      setSelectedMataKuliah(prev => prev.filter(mk => mk.id !== jadwal.id));
    }
  };

  const getTotalSks = () => {
    return selectedMataKuliah.reduce((total, mk) => total + (mk.mata_kuliah?.sks || 0), 0);
  };

  const getKapasitasBadge = (terisi, kapasitas) => {
    const percentage = (terisi / kapasitas) * 100;
    if (percentage >= 90) {
      return <Badge variant="destructive">Penuh ({terisi}/{kapasitas})</Badge>;
    } else if (percentage >= 70) {
      return <Badge variant="secondary">Terbatas ({terisi}/{kapasitas})</Badge>;
    } else {
      return <Badge variant="outline">Tersedia ({terisi}/{kapasitas})</Badge>;
    }
  };

  const filteredJadwal = jadwalKuliah.filter(jadwal => {
    const matchesSearch = 
      jadwal.mata_kuliah?.nama_mk.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jadwal.mata_kuliah?.kode_mk.toLowerCase().includes(searchTerm.toLowerCase()) ||
      jadwal.dosen?.nama.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const handleSaveKrs = async () => {
    if (selectedMataKuliah.length === 0) {
      setErrorMessage("Pilih minimal satu mata kuliah.");
      setShowError(true);
      return;
    }

    const totalSks = getTotalSks();
    if (totalSks > 24) {
      setErrorMessage("Total SKS tidak boleh lebih dari 24.");
      setShowError(true);
      return;
    }

    try {
      setSaving(true);
      
      const krsData = {
        mahasiswa_id: user.id,
        tahun_akademik_id: 1, // Current academic year
        jadwal_kuliah_ids: selectedMataKuliah.map(mk => mk.id)
      };

      await createKrs(krsData);
      setShowSuccess(true);
    } catch (error) {
      console.error("Error saving KRS:", error);
      setErrorMessage(error.message || "Gagal menyimpan KRS.");
      setShowError(true);
    } finally {
      setSaving(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    router.push("/dashboard/mahasiswa/krs");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading jadwal kuliah...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Isi KRS</h1>
          <p className="text-muted-foreground">
            Pilih mata kuliah untuk semester ini
          </p>
        </div>
        <Link href="/dashboard/mahasiswa/krs">
          <Button variant="outline">
            <IconArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </Link>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan KRS</CardTitle>
          <CardDescription>
            Total mata kuliah dan SKS yang dipilih
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium">Mata Kuliah Dipilih</p>
              <p className="text-2xl font-bold">{selectedMataKuliah.length}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Total SKS</p>
              <p className="text-2xl font-bold">{getTotalSks()}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Batas Maksimal</p>
              <p className="text-2xl font-bold text-muted-foreground">24 SKS</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Pilih Mata Kuliah</CardTitle>
          <CardDescription>
            Cari dan pilih mata kuliah yang ingin diambil
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Cari mata kuliah, kode, atau dosen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
          </div>

          {/* Jadwal Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Pilih</TableHead>
                <TableHead>Kode</TableHead>
                <TableHead>Mata Kuliah</TableHead>
                <TableHead>SKS</TableHead>
                <TableHead>Dosen</TableHead>
                <TableHead>Hari</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead>Ruang</TableHead>
                <TableHead>Kapasitas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJadwal.map((jadwal) => {
                const isSelected = selectedMataKuliah.some(mk => mk.id === jadwal.id);
                const isFull = jadwal.terisi >= jadwal.kapasitas;
                
                return (
                  <TableRow key={jadwal.id} className={isSelected ? "bg-blue-50" : ""}>
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        disabled={isFull && !isSelected}
                        onCheckedChange={(checked) => handleMataKuliahSelect(jadwal, checked)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {jadwal.mata_kuliah?.kode_mk}
                    </TableCell>
                    <TableCell>{jadwal.mata_kuliah?.nama_mk}</TableCell>
                    <TableCell>{jadwal.mata_kuliah?.sks}</TableCell>
                    <TableCell>{jadwal.dosen?.nama}</TableCell>
                    <TableCell>{jadwal.hari}</TableCell>
                    <TableCell>
                      {jadwal.jam_mulai} - {jadwal.jam_selesai}
                    </TableCell>
                    <TableCell>{jadwal.ruang}</TableCell>
                    <TableCell>{getKapasitasBadge(jadwal.terisi, jadwal.kapasitas)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={handleSaveKrs}
          disabled={saving || selectedMataKuliah.length === 0}
          className="flex-1"
        >
          {saving ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Menyimpan...
            </div>
          ) : (
            <>
              <IconDeviceFloppy className="w-4 h-4 mr-2" />
              Simpan KRS
            </>
          )}
        </Button>
        <Link href="/dashboard/mahasiswa/krs">
          <Button variant="outline">
            Batal
          </Button>
        </Link>
      </div>

      {/* Success Dialog */}
      <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-green-600">
              <IconCheck className="w-5 h-5 mr-2" />
              KRS Berhasil Disimpan
            </AlertDialogTitle>
            <AlertDialogDescription>
              KRS Anda telah berhasil disimpan sebagai draft. Anda dapat mengedit atau submit KRS melalui halaman daftar KRS.
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
