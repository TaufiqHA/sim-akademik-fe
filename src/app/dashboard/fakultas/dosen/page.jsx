"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "@/hooks/use-auth";
import { suppressResizeObserverLoopError } from "@/lib/resize-observer-fix";
import {
  getAllDosen,
  createLecturerWithProfile,
  updateUser,
  updateDosenProfile,
  deleteUser,
  getProdi,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconLoader2,
  IconX,
} from "@tabler/icons-react";
import { toast } from "sonner";

export default function DosenManagementPage() {
  const { user } = useAuth();
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [allLecturers, setAllLecturers] = useState([]);
  const [prodiList, setProdiList] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingLecturer, setEditingLecturer] = useState(null);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    nidn: "",
    jabatan: "",
    prodi_id: "",
  });

  useEffect(() => {
    fetchLecturers();
  }, []);

  // Fix ResizeObserver errors
  useEffect(() => {
    const cleanup = suppressResizeObserverLoopError();
    return cleanup;
  }, []);

  const fetchLecturers = async () => {
    try {
      setLoading(true);

      // Get all dosen (sudah include profile_dosen)
      const dosenData = await getAllDosen({});

      // Get prodi data to filter by fakultas_id
      const prodiData = await getProdi({
        ...(user?.fakultas_id && { fakultas_id: user.fakultas_id }),
      });

      // Pastikan array dosen
      const dosenArray = Array.isArray(dosenData)
        ? dosenData.filter((d) => d.role_id === 6)
        : Array.isArray(dosenData.data)
        ? dosenData.data.filter((d) => d.role_id === 6)
        : [];

      // Map nidn dan jabatan dari profile_dosen jika ada
      const dosenWithProfile = dosenArray.map((dosen) => ({
        ...dosen,
        nidn: dosen.profile_dosen?.nidn || dosen.nidn || "",
        jabatan: dosen.profile_dosen?.jabatan || dosen.jabatan || "",
      }));

      const prodiArray = Array.isArray(prodiData) ? prodiData : [];
      const prodiIds = prodiArray.map((prodi) => prodi.id);

      // Filter dosen yang memiliki prodi_id yang sesuai dengan fakultas user
      const filteredDosen = dosenWithProfile.filter((dosen) =>
        prodiIds.includes(dosen.prodi_id)
      );

      setProdiList(prodiArray);
      setAllLecturers(filteredDosen);
      setLecturers(filteredDosen);
    } catch (error) {
      console.error("Error fetching lecturers:", error);
      toast.error("Gagal memuat data dosen");
      setAllLecturers([]);
      setLecturers([]);
    } finally {
      setLoading(false);
    }
  };

  // Clear search function - memoized to prevent re-renders
  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  // Memoize filtered lecturers to prevent Table re-renders
  const filteredLecturers = useMemo(() => {
    if (!searchTerm.trim()) {
      return lecturers;
    }
    return lecturers.filter(
      (lecturer) =>
        lecturer.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lecturer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lecturer.nidn &&
          lecturer.nidn
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
    );
  }, [lecturers, searchTerm]);

  // Memoize prodi name lookup to prevent recalculation
  const getProdiName = useCallback(
    (prodiId) => {
      return prodiList.find((p) => p.id === prodiId)?.nama_prodi || "-";
    },
    [prodiList]
  );

  const handleAddLecturer = async () => {
    try {
      if (
        !formData.nama ||
        !formData.email ||
        !formData.password ||
        !formData.nidn ||
        !formData.prodi_id
      ) {
        toast.error("Harap lengkapi semua field yang wajib");
        return;
      }

      const userData = {
        nama: formData.nama,
        email: formData.email,
        password: formData.password,
        fakultas_id: user?.fakultas_id || null,
        prodi_id: parseInt(formData.prodi_id),
      };

      const profileData = {
        nidn: formData.nidn,
        jabatan: formData.jabatan,
      };

      await createLecturerWithProfile(userData, profileData);

      // Refresh the lecturer list
      await fetchLecturers();

      setFormData({
        nama: "",
        email: "",
        password: "",
        nidn: "",
        jabatan: "",
        prodi_id: "",
      });
      setIsAddDialogOpen(false);
      toast.success("Dosen berhasil ditambahkan");
    } catch (error) {
      console.error("Error adding lecturer:", error);
      toast.error(error.message || "Gagal menambahkan dosen");
    }
  };

  const handleEditLecturer = async () => {
    try {
      if (!editingLecturer) return;

      const userData = {
        nama: formData.nama,
        email: formData.email,
        role_id: 6,
        fakultas_id: user?.fakultas_id || null,
        prodi_id: parseInt(formData.prodi_id),
      };

      // Add password only if provided
      if (formData.password) {
        userData.password = formData.password;
      }

      const profileData = {
        nidn: formData.nidn,
        jabatan: formData.jabatan,
      };

      // Update user basic info
      await updateUser(editingLecturer.id, userData);

      // Update lecturer profile
      await updateDosenProfile(editingLecturer.id, profileData);

      // Refresh the lecturer list
      await fetchLecturers();

      setIsEditDialogOpen(false);
      setEditingLecturer(null);
      setFormData({
        nama: "",
        email: "",
        password: "",
        nidn: "",
        jabatan: "",
        prodi_id: "",
      });
      toast.success("Data dosen berhasil diperbarui");
    } catch (error) {
      console.error("Error updating lecturer:", error);
      toast.error(error.message || "Gagal memperbarui data dosen");
    }
  };

  const handleDeleteLecturer = async (id) => {
    try {
      if (!confirm("Apakah Anda yakin ingin menghapus dosen ini?")) {
        return;
      }

      await deleteUser(id);
      await fetchLecturers(); // Refresh the list
      toast.success("Dosen berhasil dihapus");
    } catch (error) {
      console.error("Error deleting lecturer:", error);
      toast.error(error.message || "Gagal menghapus dosen");
    }
  };

  const openEditDialog = (lecturer) => {
    setEditingLecturer(lecturer);
    setFormData({
      nama: lecturer.nama,
      email: lecturer.email,
      password: "",
      nidn: lecturer.nidn,
      jabatan: lecturer.jabatan,
      prodi_id: lecturer.prodi_id || "",
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Dosen</h1>
          <p className="text-muted-foreground">Kelola data dosen fakultas</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <IconPlus className="mr-2 h-4 w-4" />
              Tambah Dosen
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tambah Dosen Baru</DialogTitle>
              <DialogDescription>
                Masukkan data dosen baru yang akan ditambahkan
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama</Label>
                  <Input
                    id="nama"
                    value={formData.nama}
                    onChange={(e) =>
                      setFormData({ ...formData, nama: e.target.value })
                    }
                    placeholder="Nama lengkap dosen"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="email@domain.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Password minimal 6 karakter"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nidn">NIDN</Label>
                  <Input
                    id="nidn"
                    value={formData.nidn}
                    onChange={(e) =>
                      setFormData({ ...formData, nidn: e.target.value })
                    }
                    placeholder="Nomor Induk Dosen Nasional"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prodi">Program Studi</Label>
                <Select
                  key={`prodi-select-${prodiList.length}`}
                  value={formData.prodi_id?.toString() || ""}
                  onValueChange={(value) =>
                    setFormData({ ...formData, prodi_id: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih program studi" />
                  </SelectTrigger>
                  <SelectContent>
                    {prodiList.length > 0 ? (
                      prodiList.map((prodi) => (
                        <SelectItem
                          key={`prodi-${prodi.id}`}
                          value={prodi.id.toString()}
                        >
                          {prodi.nama_prodi}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-prodi" disabled>
                        Tidak ada program studi tersedia
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jabatan">Jabatan</Label>
                <Input
                  id="jabatan"
                  value={formData.jabatan}
                  onChange={(e) =>
                    setFormData({ ...formData, jabatan: e.target.value })
                  }
                  placeholder="Contoh: Lektor, Asisten Ahli"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddLecturer}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Pencarian Dosen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative max-w-sm">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari berdasarkan nama, email, atau NIDN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 h-6 w-6 p-0 -translate-y-1/2 hover:bg-gray-100"
                onClick={clearSearch}
              >
                <IconX className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lecturers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Dosen</CardTitle>
          <CardDescription>
            {searchTerm ? (
              <>
                Menampilkan {filteredLecturers.length} hasil pencarian dari{" "}
                {allLecturers.length} dosen
                {filteredLecturers.length === 0 && (
                  <span className="block mt-1 text-orange-600">
                    Tidak ada dosen yang sesuai dengan pencarian "{searchTerm}"
                  </span>
                )}
              </>
            ) : (
              <>Total {filteredLecturers.length} dosen ditemukan</>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <IconLoader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Memuat data dosen...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>NIDN</TableHead>
                  <TableHead>Program Studi</TableHead>
                  <TableHead>Jabatan</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLecturers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {allLecturers.length === 0
                        ? "Belum ada data dosen"
                        : searchTerm
                        ? `Tidak ada dosen yang sesuai dengan pencarian "${searchTerm}"`
                        : "Tidak ada data dosen"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLecturers.map((lecturer) => (
                    <TableRow key={`lecturer-${lecturer.id}`}>
                      <TableCell className="font-medium">
                        {lecturer.nama}
                      </TableCell>
                      <TableCell>{lecturer.email}</TableCell>
                      <TableCell>{lecturer.nidn || "-"}</TableCell>
                      <TableCell>{getProdiName(lecturer.prodi_id)}</TableCell>
                      <TableCell>{lecturer.jabatan || "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(lecturer)}
                          >
                            <IconEdit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteLecturer(lecturer.id)}
                          >
                            <IconTrash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Data Dosen</DialogTitle>
            <DialogDescription>Ubah data dosen yang dipilih</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-nama">Nama</Label>
                <Input
                  id="edit-nama"
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                  placeholder="Nama lengkap dosen"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="email@domain.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-nidn">NIDN</Label>
              <Input
                id="edit-nidn"
                value={formData.nidn}
                onChange={(e) =>
                  setFormData({ ...formData, nidn: e.target.value })
                }
                placeholder="Nomor Induk Dosen Nasional"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-prodi">Program Studi</Label>
              <Select
                key={`edit-prodi-select-${prodiList.length}`}
                value={formData.prodi_id?.toString() || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, prodi_id: value })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih program studi" />
                </SelectTrigger>
                <SelectContent>
                  {prodiList.length > 0 ? (
                    prodiList.map((prodi) => (
                      <SelectItem
                        key={`edit-prodi-${prodi.id}`}
                        value={prodi.id.toString()}
                      >
                        {prodi.nama_prodi}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-prodi" disabled>
                      Tidak ada program studi tersedia
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-jabatan">Jabatan</Label>
              <Input
                id="edit-jabatan"
                value={formData.jabatan}
                onChange={(e) =>
                  setFormData({ ...formData, jabatan: e.target.value })
                }
                placeholder="Contoh: Lektor, Asisten Ahli"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEditLecturer}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
