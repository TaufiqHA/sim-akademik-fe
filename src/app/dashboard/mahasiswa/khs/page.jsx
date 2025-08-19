"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getKhsMahasiswa, downloadKhs } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IconChartBar,
  IconDownload,
  IconEye,
  IconCalendar,
  IconSchool,
  IconFileText,
} from "@tabler/icons-react";

export default function KhsPage() {
  const { user } = useAuth();
  const [khsList, setKhsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    if (user?.id) {
      loadKhsData();
    }
  }, [user]);

  const loadKhsData = async () => {
    try {
      setLoading(true);
      const data = await getKhsMahasiswa(user.id);
      setKhsList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading KHS data:", error);
      // Mock data for demo
      setKhsList([
        {
          id: 1,
          tahun_akademik: { id: 1, tahun: "2024/2025", semester: "Ganjil" },
          ip_semester: 3.45,
          sks_semester: 18,
          sks_kumulatif: 120,
          ipk: 3.52,
          created_at: "2024-01-31T23:59:59Z",
          details: [
            {
              id: 1,
              mata_kuliah: { nama_mk: "Pemrograman Web", kode_mk: "TI301", sks: 3 },
              nilai_huruf: "A-",
              nilai_angka: 3.7
            },
            {
              id: 2,
              mata_kuliah: { nama_mk: "Basis Data", kode_mk: "TI302", sks: 3 },
              nilai_huruf: "B+",
              nilai_angka: 3.3
            }
          ]
        },
        {
          id: 2,
          tahun_akademik: { id: 2, tahun: "2023/2024", semester: "Genap" },
          ip_semester: 3.60,
          sks_semester: 21,
          sks_kumulatif: 102,
          ipk: 3.55,
          created_at: "2024-07-31T23:59:59Z",
          details: []
        },
        {
          id: 3,
          tahun_akademik: { id: 3, tahun: "2023/2024", semester: "Ganjil" },
          ip_semester: 3.55,
          sks_semester: 20,
          sks_kumulatif: 81,
          ipk: 3.50,
          created_at: "2024-01-31T23:59:59Z",
          details: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadKhs = async (khsId) => {
    try {
      setDownloading(khsId);
      const blob = await downloadKhs(khsId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `KHS_${khsId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading KHS:", error);
      alert("Gagal mendownload KHS. Silakan coba lagi.");
    } finally {
      setDownloading(null);
    }
  };

  const getGradeBadge = (nilai_huruf) => {
    const gradeColors = {
      'A': 'bg-green-100 text-green-800',
      'A-': 'bg-green-100 text-green-800',
      'B+': 'bg-blue-100 text-blue-800',
      'B': 'bg-blue-100 text-blue-800',
      'B-': 'bg-blue-100 text-blue-800',
      'C+': 'bg-yellow-100 text-yellow-800',
      'C': 'bg-yellow-100 text-yellow-800',
      'C-': 'bg-yellow-100 text-yellow-800',
      'D': 'bg-orange-100 text-orange-800',
      'E': 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={gradeColors[nilai_huruf] || 'bg-gray-100 text-gray-800'}>
        {nilai_huruf}
      </Badge>
    );
  };

  const getLatestKhs = () => {
    return khsList.length > 0 ? khsList[0] : null;
  };

  const getTotalSks = () => {
    const latest = getLatestKhs();
    return latest?.sks_kumulatif || 0;
  };

  const getCurrentIpk = () => {
    const latest = getLatestKhs();
    return latest?.ipk || 0.0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading KHS data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Kartu Hasil Studi (KHS)</h1>
        <p className="text-muted-foreground">
          Lihat dan unduh transkrip nilai per semester
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Semester</CardTitle>
            <IconCalendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{khsList.length}</div>
            <p className="text-xs text-muted-foreground">Semester selesai</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total SKS</CardTitle>
            <IconSchool className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTotalSks()}</div>
            <p className="text-xs text-muted-foreground">SKS terkumpul</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IPK Terkini</CardTitle>
            <IconChartBar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getCurrentIpk().toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Indeks prestasi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Download Semua</CardTitle>
            <IconFileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button size="sm" className="w-full">
              <IconDownload className="w-4 h-4 mr-2" />
              Transkrip Lengkap
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* KHS List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <IconChartBar className="w-5 h-5 mr-2" />
            Daftar KHS Per Semester
          </CardTitle>
          <CardDescription>
            Riwayat nilai dan prestasi akademik per semester
          </CardDescription>
        </CardHeader>
        <CardContent>
          {khsList.length === 0 ? (
            <div className="text-center py-8">
              <IconChartBar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                Belum ada KHS
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                KHS akan muncul setelah nilai semester selesai diinput.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tahun Akademik</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>SKS Semester</TableHead>
                  <TableHead>IP Semester</TableHead>
                  <TableHead>SKS Kumulatif</TableHead>
                  <TableHead>IPK</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {khsList.map((khs) => (
                  <TableRow key={khs.id}>
                    <TableCell className="font-medium">
                      {khs.tahun_akademik?.tahun}
                    </TableCell>
                    <TableCell>{khs.tahun_akademik?.semester}</TableCell>
                    <TableCell>{khs.sks_semester} SKS</TableCell>
                    <TableCell>
                      <span className="font-medium">{khs.ip_semester?.toFixed(2)}</span>
                    </TableCell>
                    <TableCell>{khs.sks_kumulatif} SKS</TableCell>
                    <TableCell>
                      <span className="font-medium text-lg">{khs.ipk?.toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      {new Date(khs.created_at).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <IconEye className="w-4 h-4 mr-1" />
                          Detail
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownloadKhs(khs.id)}
                          disabled={downloading === khs.id}
                        >
                          {downloading === khs.id ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-900 mr-1"></div>
                              Download
                            </div>
                          ) : (
                            <>
                              <IconDownload className="w-4 h-4 mr-1" />
                              Download
                            </>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Latest KHS Detail */}
      {getLatestKhs() && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <IconFileText className="w-5 h-5 mr-2" />
              Detail KHS Semester Terakhir
            </CardTitle>
            <CardDescription>
              {getLatestKhs().tahun_akademik?.tahun} - {getLatestKhs().tahun_akademik?.semester}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {getLatestKhs().details && getLatestKhs().details.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode</TableHead>
                    <TableHead>Mata Kuliah</TableHead>
                    <TableHead>SKS</TableHead>
                    <TableHead>Nilai Huruf</TableHead>
                    <TableHead>Nilai Angka</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getLatestKhs().details.map((detail) => (
                    <TableRow key={detail.id}>
                      <TableCell className="font-medium">
                        {detail.mata_kuliah?.kode_mk}
                      </TableCell>
                      <TableCell>{detail.mata_kuliah?.nama_mk}</TableCell>
                      <TableCell>{detail.mata_kuliah?.sks}</TableCell>
                      <TableCell>{getGradeBadge(detail.nilai_huruf)}</TableCell>
                      <TableCell className="font-medium">{detail.nilai_angka}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">
                  Detail nilai tidak tersedia untuk semester ini.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
