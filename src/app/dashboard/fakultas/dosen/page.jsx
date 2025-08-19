"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  getAllDosen,
  createLecturerWithProfile,
  updateUser,
  updateDosenProfile,
  deleteUser,
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
} from "@tabler/icons-react";
import { toast } from "sonner";

export default function DosenManagementPage() {
  const { user } = useAuth();
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingLecturer, setEditingLecturer] = useState(null);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    nidn: "",
    jabatan: "",
    keahlian: "",
    status: "aktif",
  });

  useEffect(() => {
    fetchLecturers();
  }, []);

  const fetchLecturers = async () => {
    try {
      setLoading(true);
      const dosenData = await getAllDosen({
        search: searchTerm,
        ...(user?.fakultas_id && { fakultas_id: user.fakultas_id }),
      });

      const dosenArray = Array.isArray(dosenData)
        ? dosenData.filter((d) => d.role_id === 6)
        : [];
      setLecturers(Array.isArray(dosenArray) ? dosenArray : []);
    } catch (error) {
      console.error("Error fetching lecturers:", error);
      toast.error("Gagal memuat data dosen");
      setLecturers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredLecturers = lecturers.filter(
    (lecturer) =>
      lecturer.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.nidn.includes(searchTerm)
  );

  const handleAddLecturer = async () => {
    try {
      if (
        !formData.nama ||
        !formData.email ||
        !formData.password ||
        !formData.nidn
      ) {
        toast.error("Harap lengkapi semua field yang wajib");
        return;
      }

      const userData = {
        nama: formData.nama,
        email: formData.email,
        password: formData.password,
        role_id: 5, // Dosen role
        fakultas_id: user?.fakultas_id || null,
        prodi_id: user?.prodi_id || null,
      };

      const profileData = {
        nidn: formData.nidn,
        jabatan: formData.jabatan,
        keahlian: formData.keahlian,
        status: formData.status,
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
        keahlian: "",
        status: "aktif",
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
        role_id: 5,
        fakultas_id: user?.fakultas_id || null,
        prodi_id: user?.prodi_id || null,
      };

      // Add password only if provided
      if (formData.password) {
        userData.password = formData.password;
      }

      const profileData = {
        nidn: formData.nidn,
        jabatan: formData.jabatan,
        keahlian: formData.keahlian,
        status: formData.status,
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
        keahlian: "",
        status: "aktif",
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
      keahlian: lecturer.keahlian,
      status: lecturer.status,
    });
    setIsEditDialogOpen(true);
  };

  const getStatusBadge = (status) => {
    return status === "aktif" ? (
      <Badge
        variant="default"
        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      >
        Aktif
      </Badge>
    ) : (
      <Badge variant="secondary">Non-aktif</Badge>
    );
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
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nama" className="text-right">
                  Nama
                </Label>
                <Input
                  id="nama"
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nidn" className="text-right">
                  NIDN
                </Label>
                <Input
                  id="nidn"
                  value={formData.nidn}
                  onChange={(e) =>
                    setFormData({ ...formData, nidn: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="jabatan" className="text-right">
                  Jabatan
                </Label>
                <Select
                  value={formData.jabatan}
                  onValueChange={(value) =>
                    setFormData({ ...formData, jabatan: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Pilih jabatan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asisten Ahli">Asisten Ahli</SelectItem>
                    <SelectItem value="Lektor">Lektor</SelectItem>
                    <SelectItem value="Lektor Kepala">Lektor Kepala</SelectItem>
                    <SelectItem value="Guru Besar">Guru Besar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="keahlian" className="text-right">
                  Keahlian
                </Label>
                <Input
                  id="keahlian"
                  value={formData.keahlian}
                  onChange={(e) =>
                    setFormData({ ...formData, keahlian: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aktif">Aktif</SelectItem>
                    <SelectItem value="nonaktif">Non-aktif</SelectItem>
                    <SelectItem value="pensiun">Pensiun</SelectItem>
                  </SelectContent>
                </Select>
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
          <div className="flex items-center space-x-2">
            <IconSearch className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari berdasarkan nama, email, atau NIDN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lecturers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Dosen</CardTitle>
          <CardDescription>
            Total {filteredLecturers.length} dosen ditemukan
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
                  <TableHead>Jabatan</TableHead>
                  <TableHead>Keahlian</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLecturers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {lecturers.length === 0
                        ? "Belum ada data dosen"
                        : "Tidak ada dosen yang sesuai dengan pencarian"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLecturers.map((lecturer) => (
                    <TableRow key={lecturer.id}>
                      <TableCell className="font-medium">
                        {lecturer.nama}
                      </TableCell>
                      <TableCell>{lecturer.email}</TableCell>
                      <TableCell>{lecturer.nidn || "-"}</TableCell>
                      <TableCell>{lecturer.jabatan || "-"}</TableCell>
                      <TableCell>{lecturer.keahlian || "-"}</TableCell>
                      <TableCell>
                        {getStatusBadge(lecturer.status || "aktif")}
                      </TableCell>
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
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-nama" className="text-right">
                Nama
              </Label>
              <Input
                id="edit-nama"
                value={formData.nama}
                onChange={(e) =>
                  setFormData({ ...formData, nama: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-nidn" className="text-right">
                NIDN
              </Label>
              <Input
                id="edit-nidn"
                value={formData.nidn}
                onChange={(e) =>
                  setFormData({ ...formData, nidn: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-jabatan" className="text-right">
                Jabatan
              </Label>
              <Select
                value={formData.jabatan}
                onValueChange={(value) =>
                  setFormData({ ...formData, jabatan: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih jabatan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asisten Ahli">Asisten Ahli</SelectItem>
                  <SelectItem value="Lektor">Lektor</SelectItem>
                  <SelectItem value="Lektor Kepala">Lektor Kepala</SelectItem>
                  <SelectItem value="Guru Besar">Guru Besar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-keahlian" className="text-right">
                Keahlian
              </Label>
              <Input
                id="edit-keahlian"
                value={formData.keahlian}
                onChange={(e) =>
                  setFormData({ ...formData, keahlian: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aktif">Aktif</SelectItem>
                  <SelectItem value="nonaktif">Non-aktif</SelectItem>
                  <SelectItem value="pensiun">Pensiun</SelectItem>
                </SelectContent>
              </Select>
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
