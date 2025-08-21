"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
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
  IconChartBar,
  IconSearch,
  IconUser,
  IconDownload,
  IconEye,
  IconCalendar,
} from "@tabler/icons-react";

export default function KHSManagementPage() {
  const { user } = useAuth();
  const [khs, setKhs] = useState([]);
  const [mahasiswa, setMahasiswa] = useState([]);
  const [tahunAkademik, setTahunAkademik] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMahasiswa, setSelectedMahasiswa] = useState("all");
  const [selectedTahun, setSelectedTahun] = useState("all");

  useEffect(() => {
    if (user) {
      loadMahasiswa();
      loadTahunAkademik();
    }
  }, [user]);

  useEffect(() => {
    if (selectedMahasiswa !== "all") {
      loadKHS();
    }
  }, [selectedMahasiswa, selectedTahun]);

  const loadMahasiswa = async () => {
    try {
      setLoading(true);

      // Use actual API endpoint from sim.json: GET /users?role_id=7&prodi_id={user.prodi_id}
      const { getUsers } = await import("@/lib/api");

      const params = {
        role_id: 7, // Mahasiswa role
      };

      if (user?.prodi_id) {
        params.prodi_id = user.prodi_id;
      }

      const usersData = await getUsers(params);
      console.log("Mahasiswa API response:", usersData);

      // Transform response to expected format
      const mahasiswaList = Array.isArray(usersData) ? usersData : usersData?.data || [];
      setMahasiswa(mahasiswaList);
    } catch (error) {
      console.error("Error loading mahasiswa:", error);

      // Fallback data untuk development
      setMahasiswa([
        {
          id: 7,
          nama: "John Doe",
          email: "john@student.com",
          profile_mahasiswa: { nim: "2020001", angkatan: "2020" },
        },
        {
          id: 8,
          nama: "Jane Smith",
          email: "jane@student.com",
          profile_mahasiswa: { nim: "2020002", angkatan: "2020" },
        },
        {
          id: 9,
          nama: "Bob Wilson",
          email: "bob@student.com",
          profile_mahasiswa: { nim: "2021001", angkatan: "2021" },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadTahunAkademik = async () => {
    try {
      // Use actual API endpoint from sim.json: GET /tahun-akademik
      const { getTahunAkademik } = await import("@/lib/api");

      const tahunAkademikData = await getTahunAkademik();
      console.log("Tahun Akademik API response:", tahunAkademikData);

      // Ensure response is always an array
      const tahunAkademikList = Array.isArray(tahunAkademikData) ? tahunAkademikData : tahunAkademikData?.data || [];
      setTahunAkademik(tahunAkademikList);
    } catch (error) {
      console.error("Error loading tahun akademik:", error);

      // Fallback data untuk development
      setTahunAkademik([
        { id: 1, tahun: "2023/2024", semester: "Ganjil", is_aktif: false },
        { id: 2, tahun: "2023/2024", semester: "Genap", is_aktif: false },
        { id: 3, tahun: "2024/2025", semester: "Ganjil", is_aktif: true },
      ]);
    }
  };

  const loadKHS = async () => {
    try {
      setLoading(true);

      // Use actual API endpoint from sim.json: GET /khs?mahasiswa_id={selectedMahasiswa}&tahun_akademik_id={selectedTahun}
      const { getKhsMahasiswa } = await import("@/lib/api");

      const params = {};
      if (selectedTahun !== "all") {
        params.tahun_akademik_id = selectedTahun;
      }

      const khsData = await getKhsMahasiswa(selectedMahasiswa, params);
      console.log("KHS API response:", khsData);

      // Ensure response is always an array
      const khsList = Array.isArray(khsData) ? khsData : khsData?.data || [];
      setKhs(khsList);
    } catch (error) {
      console.error("Error loading KHS:", error);

      // Fallback data untuk development
      setKhs([
        {
          id: 1,
          mahasiswa_id: 7,
          tahun_akademik: { tahun: "2023/2024", semester: "Ganjil" },
          ip_semester: 3.45,
          sks_semester: 20,
          ipk: 3.42,
          total_sks: 40,
        },
        {
          id: 2,
          mahasiswa_id: 7,
          tahun_akademik: { tahun: "2023/2024", semester: "Genap" },
          ip_semester: 3.60,
          sks_semester: 18,
          ipk: 3.52,
          total_sks: 58,
        },
        {
          id: 3,
          mahasiswa_id: 7,
          tahun_akademik: { tahun: "2024/2025", semester: "Ganjil" },
          ip_semester: 3.75,
          sks_semester: 22,
          ipk: 3.58,
          total_sks: 80,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const downloadKHS = async (khsId) => {
    try {
      // Use actual API endpoint from sim.json: GET /khs/{khsId}/download
      const { downloadKhs } = await import("@/lib/api");
      const blob = await downloadKhs(khsId);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `KHS_${khsId}.pdf`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading KHS:", error);
      // Fallback untuk development
      alert("KHS PDF akan didownload (implementasi mock)");
    }
  };

  const viewKHSDetail = async (khsId) => {
    try {
      // Use actual API endpoint from sim.json: GET /khs/{khsId}/detail
      const { getKhsDetailData } = await import("@/lib/api");
      const khsDetail = await getKhsDetailData(khsId);
      console.log("KHS Detail:", khsDetail);

      // TODO: Implement modal or navigation to detail page
      alert(`Detail KHS loaded with ${khsDetail.length} mata kuliah`);
    } catch (error) {
      console.error("Error viewing KHS detail:", error);
      // Fallback untuk development
      alert("Lihat detail KHS (implementasi mock)");
    }
  };

  const getIPStatus = (ip) => {
    if (ip >= 3.5) return { color: "green", label: "Sangat Baik" };
    if (ip >= 3.0) return { color: "blue", label: "Baik" };
    if (ip >= 2.5) return { color: "orange", label: "Cukup" };
    return { color: "red", label: "Kurang" };
  };

  const filteredKHS = Array.isArray(khs) ? khs.filter((k) => {
    if (selectedTahun !== "all" && k.tahun_akademik_id !== parseInt(selectedTahun)) {
      return false;
    }
    return true;
  }) : [];

  const selectedMahasiswaData = mahasiswa.find(
    (m) => m.id === parseInt(selectedMahasiswa)
  );

  if (loading && selectedMahasiswa === "all") {
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
        <h1 className="text-3xl font-bold tracking-tight">KHS Mahasiswa</h1>
        <p className="text-muted-foreground">
          Lihat dan kelola Kartu Hasil Studi mahasiswa program studi
        </p>
      </div>

      {/* Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle>Filter KHS</CardTitle>
          <CardDescription>
            Pilih mahasiswa dan periode untuk melihat KHS
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-2 block">Mahasiswa</label>
              <Select value={selectedMahasiswa} onValueChange={setSelectedMahasiswa}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Mahasiswa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Mahasiswa</SelectItem>
                  {Array.isArray(mahasiswa) && mahasiswa.map((mhs) => (
                    <SelectItem key={mhs.id} value={mhs.id.toString()}>
                      {mhs.profile_mahasiswa?.nim} - {mhs.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Tahun Akademik</label>
              <Select value={selectedTahun} onValueChange={setSelectedTahun}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Periode</SelectItem>
                  {Array.isArray(tahunAkademik) && tahunAkademik.map((ta) => (
                    <SelectItem key={ta.id} value={ta.id.toString()}>
                      {ta.tahun} {ta.semester}
                      {ta.is_aktif && " (Aktif)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Info */}
      {selectedMahasiswa !== "all" && selectedMahasiswaData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconUser className="w-5 h-5 mr-2" />
              Informasi Mahasiswa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nama</p>
                <p className="text-lg font-semibold">{selectedMahasiswaData.nama}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">NIM</p>
                <p className="text-lg font-semibold">
                  {selectedMahasiswaData.profile_mahasiswa.nim}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Angkatan</p>
                <p className="text-lg font-semibold">
                  {selectedMahasiswaData.profile_mahasiswa.angkatan}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KHS Table */}
      {selectedMahasiswa !== "all" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconChartBar className="w-5 h-5 mr-2" />
              Daftar KHS
            </CardTitle>
            <CardDescription>
              Kartu Hasil Studi per semester
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Loading KHS...</p>
              </div>
            ) : filteredKHS.length === 0 ? (
              <div className="text-center py-8">
                <IconChartBar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">
                  Tidak ada data KHS
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Belum ada KHS untuk mahasiswa ini.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Periode</TableHead>
                    <TableHead>IP Semester</TableHead>
                    <TableHead>SKS Semester</TableHead>
                    <TableHead>IPK</TableHead>
                    <TableHead>Total SKS</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredKHS.map((khsItem) => {
                    const ipStatus = getIPStatus(khsItem.ip_semester);
                    const ipkStatus = getIPStatus(khsItem.ipk);
                    return (
                      <TableRow key={khsItem.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <IconCalendar className="mr-2 h-4 w-4" />
                            {khsItem.tahun_akademik.tahun} {khsItem.tahun_akademik.semester}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{khsItem.ip_semester}</span>
                            <Badge 
                              variant="secondary" 
                              className={`bg-${ipStatus.color}-100 text-${ipStatus.color}-800`}
                            >
                              {ipStatus.label}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{khsItem.sks_semester}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{khsItem.ipk}</span>
                            <Badge 
                              variant="secondary" 
                              className={`bg-${ipkStatus.color}-100 text-${ipkStatus.color}-800`}
                            >
                              {ipkStatus.label}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{khsItem.total_sks}</TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Valid
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => viewKHSDetail(khsItem.id)}
                            >
                              <IconEye className="w-4 h-4 mr-1" />
                              Detail
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => downloadKHS(khsItem.id)}
                            >
                              <IconDownload className="w-4 h-4 mr-1" />
                              PDF
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {selectedMahasiswa === "all" && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <IconUser className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                Pilih Mahasiswa
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Silakan pilih mahasiswa untuk melihat KHS.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
