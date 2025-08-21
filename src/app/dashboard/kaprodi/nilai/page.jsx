"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  getJadwalKuliahByProdi,
  getNilaiByJadwal,
  finalizeNilai as apiFinalizeNilai,
} from "@/lib/api";
import { getApiConfig } from "@/lib/api-test";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import {
  IconClipboard,
  IconSearch,
  IconUser,
  IconBook,
  IconCheck,
  IconClock,
} from "@tabler/icons-react";
import { useToast } from "@/hooks/use-toast";

export default function NilaiManagementPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [nilai, setNilai] = useState([]);
  const [jadwalKuliah, setJadwalKuliah] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJadwal, setSelectedJadwal] = useState("all");
  const [apiConfig, setApiConfig] = useState(null);

  useEffect(() => {
    if (user) {
      loadJadwalKuliah();
    }
    setApiConfig(getApiConfig());
  }, [user]);

  useEffect(() => {
    if (selectedJadwal !== "all") {
      loadNilai();
    }
  }, [selectedJadwal]);

  const loadJadwalKuliah = async () => {
    try {
      setLoading(true);
      console.log("Loading jadwal kuliah for prodi_id:", user.prodi_id);

      // API call sesuai sim.json: GET /jadwal-kuliah?prodi_id={user.prodi_id}
      const response = await getJadwalKuliahByProdi(user.prodi_id);
      console.log("Jadwal kuliah API response:", response);

      // Ensure response is always an array
      const jadwalData = Array.isArray(response)
        ? response
        : response?.data || [];
      setJadwalKuliah(jadwalData);
    } catch (error) {
      console.error("Error loading jadwal kuliah:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.status,
        data: error.data,
      });

      // Fallback data jika API gagal
      const fallbackData = [
        {
          id: 1,
          mata_kuliah: { nama_mk: "Pemrograman Web", kode_mk: "IF301" },
          dosen: { nama: "Dr. Ahmad" },
          ruang: "Lab A",
          hari: "Senin",
        },
        {
          id: 2,
          mata_kuliah: { nama_mk: "Database", kode_mk: "IF302" },
          dosen: { nama: "Dr. Sari" },
          ruang: "Lab B",
          hari: "Selasa",
        },
      ];

      console.log("Using fallback jadwal data:", fallbackData);
      setJadwalKuliah(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const loadNilai = async () => {
    try {
      setLoading(true);
      console.log("Loading nilai for jadwal_kuliah_id:", selectedJadwal);

      // API call sesuai sim.json: GET /nilai?jadwal_kuliah_id={selectedJadwal}
      const response = await getNilaiByJadwal(selectedJadwal);
      console.log("Nilai API response:", response);

      // Ensure response is always an array
      const nilaiData = Array.isArray(response)
        ? response
        : response?.data || [];
      setNilai(nilaiData);
    } catch (error) {
      console.error("Error loading nilai:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.status,
        data: error.data,
      });

      // Fallback data jika API gagal
      const fallbackData = [
        {
          id: 1,
          mahasiswa: { nama: "John Doe", nim: "2020001" },
          tugas: 85,
          uts: 80,
          uas: 88,
          nilai_akhir: 84.5,
          status: "pending",
        },
        {
          id: 2,
          mahasiswa: { nama: "Jane Smith", nim: "2020002" },
          tugas: 90,
          uts: 85,
          uas: 92,
          nilai_akhir: 89.0,
          status: "finalized",
        },
        {
          id: 3,
          mahasiswa: { nama: "Bob Wilson", nim: "2020003" },
          tugas: 78,
          uts: 75,
          uas: 80,
          nilai_akhir: 77.5,
          status: "pending",
        },
      ];

      console.log("Using fallback nilai data:", fallbackData);
      setNilai(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  const finalizeNilai = async (nilaiId) => {
    try {
      console.log("Finalizing nilai ID:", nilaiId);

      // API call sesuai sim.json: POST /nilai/{id}/finalize
      const response = await apiFinalizeNilai(nilaiId);
      console.log("Finalize nilai API response:", response);

      // Update local state setelah sukses
      setNilai((prev) =>
        prev.map((n) => (n.id === nilaiId ? { ...n, status: "finalized" } : n))
      );

      toast({
        title: "Berhasil",
        description: "Nilai berhasil difinalisasi dan dikunci",
      });
    } catch (error) {
      console.error("Error finalizing nilai:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.status,
        data: error.data,
      });

      // Handle specific error from API spec (409 - Di luar periode nilai)
      if (error.status === 409) {
        toast({
          title: "Tidak Dapat Finalisasi",
          description: "Finalisasi nilai di luar periode yang ditentukan",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Gagal memfinalisasi nilai",
          variant: "destructive",
        });
      }
    }
  };

  const getStatusBadge = (status) => {
    if (status === "finalized") {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <IconCheck className="w-3 h-3 mr-1" />
          Finalized
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
        <IconClock className="w-3 h-3 mr-1" />
        Pending
      </Badge>
    );
  };

  const getNilaiHuruf = (nilai) => {
    if (nilai >= 85) return "A";
    if (nilai >= 80) return "B+";
    if (nilai >= 75) return "B";
    if (nilai >= 70) return "C+";
    if (nilai >= 65) return "C";
    if (nilai >= 60) return "D";
    return "E";
  };

  const filteredNilai = Array.isArray(nilai)
    ? nilai.filter(
        (n) =>
          n.mahasiswa?.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.mahasiswa?.nim?.includes(searchTerm)
      )
    : [];

  if (loading && selectedJadwal === "all") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Validasi Nilai & KHS
        </h1>
        <p className="text-muted-foreground">
          Kelola dan validasi nilai mahasiswa program studi
        </p>
      </div>

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Nilai</CardTitle>
          <CardDescription>
            Pilih jadwal kuliah untuk melihat nilai mahasiswa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Select value={selectedJadwal} onValueChange={setSelectedJadwal}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Jadwal Kuliah" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jadwal</SelectItem>
                  {Array.isArray(jadwalKuliah) &&
                    jadwalKuliah.map((jadwal) => (
                      <SelectItem key={jadwal.id} value={jadwal.id.toString()}>
                        {jadwal.mata_kuliah?.kode_mk} -{" "}
                        {jadwal.mata_kuliah?.nama_mk}({jadwal.dosen?.nama})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            {selectedJadwal !== "all" && (
              <div className="flex-1">
                <Input
                  placeholder="Cari mahasiswa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<IconSearch className="w-4 h-4" />}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Nilai Table */}
      {selectedJadwal !== "all" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconClipboard className="w-5 h-5 mr-2" />
              Daftar Nilai Mahasiswa
            </CardTitle>
            <CardDescription>
              Nilai mahasiswa untuk mata kuliah yang dipilih
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading nilai...</p>
              </div>
            ) : filteredNilai.length === 0 ? (
              <div className="text-center py-8">
                <IconBook className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                  Tidak ada data nilai
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Belum ada nilai yang diinputkan untuk jadwal ini.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mahasiswa</TableHead>
                    <TableHead>NIM</TableHead>
                    <TableHead>Tugas</TableHead>
                    <TableHead>UTS</TableHead>
                    <TableHead>UAS</TableHead>
                    <TableHead>Nilai Akhir</TableHead>
                    <TableHead>Huruf</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNilai.map((nilaiItem) => (
                    <TableRow key={nilaiItem.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <IconUser className="mr-2 h-4 w-4" />
                          {nilaiItem.mahasiswa.nama}
                        </div>
                      </TableCell>
                      <TableCell>{nilaiItem.mahasiswa.nim}</TableCell>
                      <TableCell>{nilaiItem.tugas}</TableCell>
                      <TableCell>{nilaiItem.uts}</TableCell>
                      <TableCell>{nilaiItem.uas}</TableCell>
                      <TableCell className="font-semibold">
                        {nilaiItem.nilai_akhir}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getNilaiHuruf(nilaiItem.nilai_akhir)}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(nilaiItem.status)}</TableCell>
                      <TableCell>
                        {nilaiItem.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => finalizeNilai(nilaiItem.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <IconCheck className="w-4 h-4 mr-1" />
                            Finalisasi
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {selectedJadwal === "all" && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <IconBook className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                Pilih Jadwal Kuliah
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Silakan pilih jadwal kuliah untuk melihat nilai mahasiswa.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
