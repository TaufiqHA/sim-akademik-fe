"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getAllDosen } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IconChalkboard,
  IconSearch,
  IconUser,
  IconMail,
  IconSchool,
} from "@tabler/icons-react";

export default function DaftarDosenPage() {
  const { user } = useAuth();
  const [dosen, setDosen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProdi, setSelectedProdi] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      loadDosen();
    }
  }, [user]);

  const loadDosen = async () => {
    try {
      setLoading(true);
      setError("");

      // Use the getAllDosen function which already filters by role_id: 3
      const dosenData = await getAllDosen({
        search: searchTerm,
        ...(user?.fakultas_id && { fakultas_id: user.fakultas_id }),
      });

      // Ensure we have an array and filter only dosen (role_id === 3)
      const dosenArray = Array.isArray(dosenData)
        ? dosenData.filter((d) => d.role_id === 6)
        : [];

      setDosen(dosenArray);
    } catch (err) {
      console.error("Error loading dosen:", err);
      setError(err.message || "Failed to load dosen data");
      setDosen([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    await loadDosen();
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading dosen data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Daftar Dosen</h1>
        <p className="text-muted-foreground">
          Daftar dosen di fakultas{" "}
          {user?.fakultas_id ? `ID: ${user.fakultas_id}` : "Anda"}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Dosen</CardTitle>
            <IconChalkboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dosen.length}</div>
            <p className="text-xs text-muted-foreground">Dosen aktif</p>
          </CardContent>
        </Card>


        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Program Studi</CardTitle>
            <IconSchool className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                new Set(dosen.filter((d) => d.prodi_id).map((d) => d.prodi_id))
                  .size
              }
            </div>
            <p className="text-xs text-muted-foreground">Prodi dengan dosen</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Dosen</CardTitle>
          <CardDescription>
            Cari dan filter dosen berdasarkan kriteria tertentu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Cari nama dosen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Select value={selectedProdi} onValueChange={setSelectedProdi}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Semua Prodi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Prodi</SelectItem>
                <SelectItem value="1">Teknik Informatika</SelectItem>
                <SelectItem value="2">Sistem Informasi</SelectItem>
                <SelectItem value="3">Teknik Komputer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-red-600 text-center">{error}</div>
          </CardContent>
        </Card>
      )}

      {/* Dosen Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <IconChalkboard className="w-5 h-5 mr-2" />
            Daftar Dosen
          </CardTitle>
          <CardDescription>
            Informasi lengkap dosen di fakultas - Mode Read Only
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dosen.length === 0 ? (
            <div className="text-center py-8">
              <IconChalkboard className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">
                Tidak ada data dosen
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Belum ada dosen yang terdaftar atau sesuai dengan filter Anda.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Program Studi</TableHead>
                  <TableHead>Tanggal Bergabung</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dosen.map((dosenItem) => (
                  <TableRow key={dosenItem.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <IconUser className="mr-2 h-4 w-4" />
                        {dosenItem.nama}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <IconMail className="mr-2 h-4 w-4" />
                        {dosenItem.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <IconSchool className="mr-2 h-4 w-4" />
                        {dosenItem.prodi_id
                          ? `Prodi ID: ${dosenItem.prodi_id}`
                          : "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {dosenItem.created_at
                        ? new Date(dosenItem.created_at).toLocaleDateString(
                            "id-ID"
                          )
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
