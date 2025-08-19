"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getAllDosen, getProdi } from "@/lib/api";
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
  IconFilter,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export default function DaftarDosenPage() {
  const { user } = useAuth();
  const [allDosen, setAllDosen] = useState([]); // Store all data
  const [filteredDosen, setFilteredDosen] = useState([]); // Store filtered data
  const [prodiOptions, setProdiOptions] = useState([]); // Store prodi options
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProdi, setSelectedProdi] = useState("all");
  const [error, setError] = useState("");

  // Initial load only
  useEffect(() => {
    if (user) {
      loadDosen();
      loadProdi();
    }
  }, [user]);

  // Client-side filter when search term or prodi selection changes
  useEffect(() => {
    applyFilter();
  }, [searchTerm, selectedProdi, allDosen, prodiOptions]);

  const handleFilter = () => {
    applyFilter();
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedProdi("all");
  };

  const applyFilter = () => {
    if (!allDosen.length) return;

    let filtered = [...allDosen];

    // First, ensure lecturers belong to prodi within this faculty
    if (prodiOptions.length > 0) {
      const validProdiIds = prodiOptions.map(prodi => prodi.id);
      filtered = filtered.filter((d) =>
        d.prodi_id && validProdiIds.includes(d.prodi_id)
      );
    }

    // Apply name search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter((d) =>
        d.nama && d.nama.toLowerCase().includes(searchTerm.toLowerCase().trim())
      );
    }

    // Apply prodi filter if a specific prodi is selected
    if (selectedProdi !== "all") {
      filtered = filtered.filter((d) => d.prodi_id === parseInt(selectedProdi));
    }

    setFilteredDosen(filtered);
  };

  const loadProdi = async () => {
    try {
      if (user?.fakultas_id) {
        const prodiData = await getProdi({ fakultas_id: user.fakultas_id });
        console.log('Prodi data for fakultas_id', user.fakultas_id, ':', prodiData);
        setProdiOptions(Array.isArray(prodiData) ? prodiData : []);
      }
    } catch (err) {
      console.error("Error loading prodi:", err);
      setProdiOptions([]);
    }
  };

  const loadDosen = async () => {
    try {
      setLoading(true);
      setError("");

      console.log('=== Loading Dosen ===');
      console.log('Selected prodi:', selectedProdi);
      console.log('User fakultas_id:', user?.fakultas_id);

      // Build parameters for API call - get all dosen, we'll filter by faculty client-side
      const apiParams = {};

      console.log('API params:', apiParams);

      // Use the getAllDosen function which already filters by role_id: 6
      const dosenData = await getAllDosen(apiParams);

      console.log('Raw dosen data from API:', dosenData);

      // Ensure we have an array and filter only dosen (role_id === 6)
      let dosenArray = Array.isArray(dosenData)
        ? dosenData.filter((d) => d.role_id === 6)
        : [];

      console.log('After role filter (role_id === 6):', dosenArray);

      setAllDosen(dosenArray);
      // Initial filtering will be handled by applyFilter useEffect
    } catch (err) {
      console.error("Error loading dosen:", err);
      setError(err.message || "Failed to load dosen data");
      setDosen([]);
    } finally {
      setLoading(false);
    }
  };

  // Remove handleSearch since useEffect handles filter changes automatically


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
            <div className="text-2xl font-bold">{filteredDosen.length}</div>
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
              {prodiOptions.length}
            </div>
            <p className="text-xs text-muted-foreground">Total program studi</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Dosen</CardTitle>
          <CardDescription>
            Cari nama dosen dan filter berdasarkan program studi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Cari nama dosen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedProdi} onValueChange={setSelectedProdi}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Semua Prodi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Prodi</SelectItem>
                {prodiOptions.map((prodi) => (
                  <SelectItem key={prodi.id} value={prodi.id.toString()}>
                    {prodi.nama_prodi}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset
            </Button>
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
          {filteredDosen.length === 0 ? (
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
                {filteredDosen.map((dosenItem) => (
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
