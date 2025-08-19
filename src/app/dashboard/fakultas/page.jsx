"use client"

import { useState, useEffect } from "react"
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
import { getFakultas, createFakultas, getProdi } from "@/lib/api"
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
    cell: ({ row }) => (
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
          <DropdownMenuItem>
            <IconPencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconUsers className="mr-2 h-4 w-4" />
            Lihat Prodi
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">
            <IconTrash className="mr-2 h-4 w-4" />
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export default function FakultasPage() {
  const { user } = useAuth()
  const [fakultasData, setFakultasData] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
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
      await createFakultas({
        nama_fakultas: formData.nama_fakultas.trim()
      })

      setFormData({ nama_fakultas: "" })
      setIsDialogOpen(false)

      // Refresh data
      fetchFakultasData()

      toast.success("Fakultas berhasil ditambahkan")
    } catch (error) {
      console.error("Error creating fakultas:", error)
      toast.error("Gagal menambahkan fakultas")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Daftar Fakultas</h1>
          <p className="text-muted-foreground">
            Kelola data fakultas di universitas
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <IconPlus className="mr-2 h-4 w-4" />
              Tambah Fakultas
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Tambah Fakultas Baru</DialogTitle>
                <DialogDescription>
                  Masukkan informasi fakultas yang akan ditambahkan.
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
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Batal
                </Button>
                <Button type="submit">
                  Tambah Fakultas
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
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
          />
        </CardContent>
      </Card>
    </div>
  )
}
