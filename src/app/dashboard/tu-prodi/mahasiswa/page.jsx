"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IconPlus, IconPencil, IconTrash, IconSearch } from "@tabler/icons-react"
import { useToast } from "@/hooks/use-toast"

export default function ManajemenMahasiswaPage() {
  const [mahasiswa, setMahasiswa] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Mock data - in real app, this would come from API
  const mockMahasiswa = [
    {
      id: 1,
      nama: "Ahmad Rizki Pratama",
      email: "ahmad.rizki@student.univ.ac.id",
      nim: "2021001",
      angkatan: "2021",
      status: "Aktif",
      created_at: "2021-08-01"
    },
    {
      id: 2,
      nama: "Siti Nurhaliza",
      email: "siti.nurhaliza@student.univ.ac.id",
      nim: "2021002",
      angkatan: "2021",
      status: "Aktif",
      created_at: "2021-08-01"
    },
    {
      id: 3,
      nama: "Budi Santoso",
      email: "budi.santoso@student.univ.ac.id",
      nim: "2020003",
      angkatan: "2020",
      status: "Cuti",
      created_at: "2020-08-01"
    }
  ]

  useEffect(() => {
    setMahasiswa(mockMahasiswa)
  }, [])

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    nim: "",
    angkatan: "",
    status: "Aktif"
  })

  const filteredMahasiswa = mahasiswa.filter(m =>
    m.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.nim.includes(searchTerm) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAdd = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newMahasiswa = {
        id: mahasiswa.length + 1,
        ...formData,
        created_at: new Date().toISOString().split('T')[0]
      }
      
      setMahasiswa([...mahasiswa, newMahasiswa])
      setFormData({ nama: "", email: "", password: "", nim: "", angkatan: "", status: "Aktif" })
      setIsAddDialogOpen(false)
      
      toast({
        title: "Berhasil",
        description: "Data mahasiswa berhasil ditambahkan",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menambahkan data mahasiswa",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMahasiswa(mahasiswa.map(m => 
        m.id === selectedMahasiswa.id 
          ? { ...m, ...formData }
          : m
      ))
      
      setFormData({ nama: "", email: "", password: "", nim: "", angkatan: "", status: "Aktif" })
      setSelectedMahasiswa(null)
      setIsEditDialogOpen(false)
      
      toast({
        title: "Berhasil",
        description: "Data mahasiswa berhasil diperbarui",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memperbarui data mahasiswa",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data mahasiswa ini?")) return
    
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMahasiswa(mahasiswa.filter(m => m.id !== id))
      
      toast({
        title: "Berhasil",
        description: "Data mahasiswa berhasil dihapus",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus data mahasiswa",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const openEditDialog = (m) => {
    setSelectedMahasiswa(m)
    setFormData({
      nama: m.nama,
      email: m.email,
      password: "",
      nim: m.nim,
      angkatan: m.angkatan,
      status: m.status
    })
    setIsEditDialogOpen(true)
  }

  const getStatusBadge = (status) => {
    const variants = {
      "Aktif": "default",
      "Cuti": "secondary",
      "Lulus": "secondary",
      "DO": "destructive"
    }
    return <Badge variant={variants[status] || "default"}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Data Mahasiswa</h1>
          <p className="text-muted-foreground">
            Kelola data mahasiswa program studi
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <IconPlus className="mr-2 h-4 w-4" />
              Tambah Mahasiswa
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tambah Mahasiswa Baru</DialogTitle>
              <DialogDescription>
                Tambahkan data mahasiswa baru. Pastikan semua data sudah benar.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nama">Nama Lengkap</Label>
                <Input
                  id="nama"
                  value={formData.nama}
                  onChange={(e) => setFormData({...formData, nama: e.target.value})}
                  placeholder="Masukkan nama lengkap"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="mahasiswa@student.univ.ac.id"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="Masukkan password"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nim">NIM</Label>
                <Input
                  id="nim"
                  value={formData.nim}
                  onChange={(e) => setFormData({...formData, nim: e.target.value})}
                  placeholder="202x001"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="angkatan">Angkatan</Label>
                <Input
                  id="angkatan"
                  value={formData.angkatan}
                  onChange={(e) => setFormData({...formData, angkatan: e.target.value})}
                  placeholder="2024"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aktif">Aktif</SelectItem>
                    <SelectItem value="Cuti">Cuti</SelectItem>
                    <SelectItem value="Lulus">Lulus</SelectItem>
                    <SelectItem value="DO">DO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAdd} disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Mahasiswa</CardTitle>
          <CardDescription>
            Total: {mahasiswa.length} mahasiswa
          </CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari mahasiswa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NIM</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Angkatan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMahasiswa.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.nim}</TableCell>
                  <TableCell>{m.nama}</TableCell>
                  <TableCell>{m.email}</TableCell>
                  <TableCell>{m.angkatan}</TableCell>
                  <TableCell>{getStatusBadge(m.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(m)}>
                        <IconPencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(m.id)}>
                        <IconTrash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredMahasiswa.length === 0 && (
            <div className="text-center py-6">
              <p className="text-muted-foreground">Tidak ada data mahasiswa yang ditemukan</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Data Mahasiswa</DialogTitle>
            <DialogDescription>
              Perbarui data mahasiswa. Pastikan semua data sudah benar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-nama">Nama Lengkap</Label>
              <Input
                id="edit-nama"
                value={formData.nama}
                onChange={(e) => setFormData({...formData, nama: e.target.value})}
                placeholder="Masukkan nama lengkap"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="mahasiswa@student.univ.ac.id"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-password">Password (kosongkan jika tidak diubah)</Label>
              <Input
                id="edit-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Masukkan password baru"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-nim">NIM</Label>
              <Input
                id="edit-nim"
                value={formData.nim}
                onChange={(e) => setFormData({...formData, nim: e.target.value})}
                placeholder="202x001"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-angkatan">Angkatan</Label>
              <Input
                id="edit-angkatan"
                value={formData.angkatan}
                onChange={(e) => setFormData({...formData, angkatan: e.target.value})}
                placeholder="2024"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aktif">Aktif</SelectItem>
                  <SelectItem value="Cuti">Cuti</SelectItem>
                  <SelectItem value="Lulus">Lulus</SelectItem>
                  <SelectItem value="DO">DO</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEdit} disabled={loading}>
              {loading ? "Menyimpan..." : "Perbarui"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
