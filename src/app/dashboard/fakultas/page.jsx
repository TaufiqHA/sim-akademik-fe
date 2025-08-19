"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { FakultasTable } from "@/components/fakultas-table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  IconPlus,
  IconDotsVertical,
  IconPencil,
  IconTrash,
  IconSchool,
  IconCalendar,
  IconUsers
} from "@tabler/icons-react"
import { getFakultas, createFakultas, updateFakultas, deleteFakultas, getProdi } from "@/lib/api"
import { toast } from "sonner"

const fakultasColumns = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <div className="w-12 text-center font-mono">
        {row.original.id}
      </div>
    ),
  },
  {
    accessorKey: "nama_fakultas",
    header: "Nama Fakultas",
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <IconSchool className="h-4 w-4 text-blue-600" />
        <span className="font-medium">{row.original.nama_fakultas}</span>
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "total_prodi",
    header: "Total Program Studi",
    cell: ({ row }) => {
      return (
        <div className="text-center">
          <Badge variant="outline" className="text-green-600">
            - Prodi
          </Badge>
        </div>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: "Tanggal Dibuat",
    cell: ({ row }) => (
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <IconCalendar className="h-4 w-4" />
        <span>
          {row.original.created_at
            ? new Date(row.original.created_at).toLocaleDateString('id-ID')
            : new Date().toLocaleDateString('id-ID')
          }
        </span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="secondary" className="text-green-600">
        Aktif
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row, table }) => {
      const fakultas = row.original
      const { handleEdit, handleDelete, handleViewProdi } = table.options.meta || {}

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              size="icon">
              <IconDotsVertical className="h-4 w-4" />
              <span className="sr-only">Buka menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => handleEdit?.(fakultas)}>
              <IconPencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleViewProdi?.(fakultas)}>
              <IconUsers className="mr-2 h-4 w-4" />
              Lihat Prodi
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={() => handleDelete?.(fakultas)}>
              <IconTrash className="mr-2 h-4 w-4" />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function FakultasPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [fakultasData, setFakultasData] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingFakultas, setEditingFakultas] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingFakultas, setDeletingFakultas] = useState(null)
  const [formData, setFormData] = useState({
    nama_fakultas: ""
  })

  useEffect(() => {
    fetchFakultasData()
  }, [])

  const fetchFakultasData = async () => {
    try {
      setLoading(true)
      const data = await getFakultas()
      setFakultasData(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching fakultas data:", error)
      toast.error("Gagal memuat data fakultas")
      setFakultasData([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.nama_fakultas.trim()) {
      toast.error("Nama fakultas harus diisi")
      return
    }

    try {
      if (isEditMode && editingFakultas) {
        await updateFakultas(editingFakultas.id, {
          nama_fakultas: formData.nama_fakultas.trim()
        })
        toast.success("Fakultas berhasil diperbarui")
      } else {
        await createFakultas({
          nama_fakultas: formData.nama_fakultas.trim()
        })
        toast.success("Fakultas berhasil ditambahkan")
      }

      resetForm()
      fetchFakultasData()
    } catch (error) {
      console.error("Error saving fakultas:", error)
      toast.error(isEditMode ? "Gagal memperbarui fakultas" : "Gagal menambahkan fakultas")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEdit = (fakultas) => {
    setEditingFakultas(fakultas)
    setFormData({ nama_fakultas: fakultas.nama_fakultas })
    setIsEditMode(true)
    setIsDialogOpen(true)
  }

  const handleDelete = (fakultas) => {
    setDeletingFakultas(fakultas)
    setIsDeleteDialogOpen(true)
  }

  const handleViewProdi = (fakultas) => {
    // Navigate to prodi page filtered by fakultas
    router.push(`/dashboard/prodi?fakultas_id=${fakultas.id}`)
  }

  const confirmDelete = async () => {
    if (!deletingFakultas) return

    try {
      await deleteFakultas(deletingFakultas.id)
      setIsDeleteDialogOpen(false)
      setDeletingFakultas(null)
      fetchFakultasData()
      toast.success("Fakultas berhasil dihapus")
    } catch (error) {
      console.error("Error deleting fakultas:", error)
      toast.error("Gagal menghapus fakultas")
    }
  }

  const resetForm = () => {
    setFormData({ nama_fakultas: "" })
    setIsEditMode(false)
    setEditingFakultas(null)
    setIsDialogOpen(false)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Daftar Fakultas</h1>
            <p className="text-muted-foreground">Kelola data fakultas di universitas</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Daftar Fakultas</h1>
          <p className="text-muted-foreground">
            Kelola data fakultas di universitas
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          if (!open) resetForm()
          setIsDialogOpen(open)
        }}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <IconPlus className="mr-2 h-4 w-4" />
              Tambah Fakultas
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>{isEditMode ? "Edit Fakultas" : "Tambah Fakultas Baru"}</DialogTitle>
                <DialogDescription>
                  {isEditMode ? "Ubah informasi fakultas." : "Masukkan informasi fakultas yang akan ditambahkan."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nama_fakultas">Nama Fakultas</Label>
                  <Input
                    id="nama_fakultas"
                    name="nama_fakultas"
                    placeholder="Contoh: Fakultas Teknik Informatika"
                    value={formData.nama_fakultas}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Batal
                </Button>
                <Button type="submit">
                  {isEditMode ? "Perbarui Fakultas" : "Tambah Fakultas"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Konfirmasi Hapus</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menghapus fakultas "{deletingFakultas?.nama_fakultas}"?
                Tindakan ini tidak dapat dibatalkan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDeleteDialogOpen(false)
                  setDeletingFakultas(null)
                }}
              >
                Batal
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={confirmDelete}
              >
                Hapus
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Fakultas
            </CardTitle>
            <IconSchool className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fakultasData.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Fakultas terdaftar
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Program Studi
            </CardTitle>
            <IconUsers className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              -
            </div>
            <p className="text-xs text-muted-foreground">
              Program studi aktif
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rata-rata Prodi per Fakultas
            </CardTitle>
            <IconCalendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              -
            </div>
            <p className="text-xs text-muted-foreground">
              Prodi per fakultas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Data Fakultas</CardTitle>
          <CardDescription>
            Daftar seluruh fakultas yang terdaftar di sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FakultasTable
            data={fakultasData}
            columns={fakultasColumns}
            meta={{
              handleEdit,
              handleDelete,
              handleViewProdi
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
