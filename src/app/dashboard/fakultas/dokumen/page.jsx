"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import {
  getDokumenAkademik,
  uploadDokumenAkademik,
  deleteDokumenAkademik
} from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { IconUpload, IconSearch, IconDownload, IconTrash, IconEye, IconLoader2 } from "@tabler/icons-react"
import { toast } from "sonner"

export default function DokumenFakultasPage() {
  const { user } = useAuth()
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [uploadFormData, setUploadFormData] = useState({
    judul: "",
    jenis_dokumen: "fakultas",
    file: null
  })

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const response = await getDokumenAkademik({ jenis_dokumen: "fakultas" })
      setDocuments(Array.isArray(response) ? response : [])
    } catch (error) {
      console.error("Error fetching documents:", error)
      toast.error("Gagal memuat data dokumen")
      setDocuments([])
    } finally {
      setLoading(false)
    }
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.judul.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || doc.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const handleFileUpload = async () => {
    try {
      if (!uploadFormData.file || !uploadFormData.judul) {
        toast.error("Harap lengkapi semua field")
        return
      }

      const formData = new FormData()
      formData.append("file", uploadFormData.file)
      formData.append("jenis_dokumen", uploadFormData.jenis_dokumen)
      formData.append("judul", uploadFormData.judul)

      await uploadDokumenAkademik(formData)

      // Refresh the document list
      await fetchDocuments()

      setUploadFormData({
        judul: "",
        jenis_dokumen: "fakultas",
        file: null
      })

      // Reset file input
      const fileInput = document.getElementById("file")
      if (fileInput) fileInput.value = ""

      setIsUploadDialogOpen(false)
      toast.success("Dokumen berhasil diupload")
    } catch (error) {
      console.error("Error uploading document:", error)
      toast.error(error.message || "Gagal mengupload dokumen")
    }
  }

  const handleDeleteDocument = async (id) => {
    try {
      if (!confirm("Apakah Anda yakin ingin menghapus dokumen ini?")) {
        return
      }

      await deleteDokumenAkademik(id)
      await fetchDocuments() // Refresh the list
      toast.success("Dokumen berhasil dihapus")
    } catch (error) {
      console.error("Error deleting document:", error)
      toast.error(error.message || "Gagal menghapus dokumen")
    }
  }

  const handleDownloadDocument = (document) => {
    // Here you would implement the actual download logic
    toast.info(`Mengunduh: ${document.judul}`)
  }

  const handleViewDocument = (document) => {
    // Here you would implement the document viewer
    toast.info(`Melihat: ${document.judul}`)
  }

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Disetujui
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive">
            Ditolak
          </Badge>
        )
      case "pending":
      default:
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Menunggu
          </Badge>
        )
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type (PDF, DOC, DOCX)
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      if (!allowedTypes.includes(file.type)) {
        toast.error("Hanya file PDF, DOC, dan DOCX yang diperbolehkan")
        return
      }
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 10MB")
        return
      }
      setUploadFormData({ ...uploadFormData, file })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dokumen Fakultas</h1>
          <p className="text-muted-foreground">
            Upload dan kelola dokumen akademik fakultas
          </p>
        </div>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <IconUpload className="mr-2 h-4 w-4" />
              Upload Dokumen
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Upload Dokumen Baru</DialogTitle>
              <DialogDescription>
                Upload dokumen akademik fakultas baru
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="judul" className="text-right">
                  Judul
                </Label>
                <Input
                  id="judul"
                  value={uploadFormData.judul}
                  onChange={(e) => setUploadFormData({ ...uploadFormData, judul: e.target.value })}
                  className="col-span-3"
                  placeholder="Masukkan judul dokumen"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="jenis" className="text-right">
                  Jenis
                </Label>
                <Select 
                  value={uploadFormData.jenis_dokumen} 
                  onValueChange={(value) => setUploadFormData({ ...uploadFormData, jenis_dokumen: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Pilih jenis dokumen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fakultas">Dokumen Fakultas</SelectItem>
                    <SelectItem value="akademik">Dokumen Akademik</SelectItem>
                    <SelectItem value="peraturan">Peraturan</SelectItem>
                    <SelectItem value="panduan">Panduan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="file" className="text-right">
                  File
                </Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  className="col-span-3"
                  accept=".pdf,.doc,.docx"
                />
              </div>
              <div className="col-span-4 text-sm text-muted-foreground">
                <p>* File yang diperbolehkan: PDF, DOC, DOCX (Maksimal 10MB)</p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleFileUpload}>Upload Dokumen</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter & Pencarian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <IconSearch className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari dokumen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending">Menunggu</SelectItem>
                <SelectItem value="approved">Disetujui</SelectItem>
                <SelectItem value="rejected">Ditolak</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Dokumen</CardTitle>
          <CardDescription>
            Total {filteredDocuments.length} dokumen ditemukan
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <IconLoader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Memuat data dokumen...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul Dokumen</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Diupload Oleh</TableHead>
                  <TableHead>Tanggal Upload</TableHead>
                  <TableHead>Disetujui Oleh</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {documents.length === 0 ? "Belum ada dokumen" : "Tidak ada dokumen yang sesuai dengan filter"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDocuments.map((document) => (
                    <TableRow key={document.id}>
                      <TableCell className="font-medium">{document.judul}</TableCell>
                      <TableCell className="capitalize">{document.jenis_dokumen}</TableCell>
                      <TableCell>{getStatusBadge(document.status)}</TableCell>
                      <TableCell>{document.uploaded_by_name || user?.nama || '-'}</TableCell>
                      <TableCell>{formatDate(document.created_at)}</TableCell>
                      <TableCell>{document.approved_by_name || "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDocument(document)}
                          >
                            <IconEye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadDocument(document)}
                          >
                            <IconDownload className="h-4 w-4" />
                          </Button>
                          {document.status === "Pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteDocument(document.id)}
                            >
                              <IconTrash className="h-4 w-4" />
                            </Button>
                          )}
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

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Dokumen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Menunggu Persetujuan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {documents.filter(doc => doc.status === "Pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Telah Disetujui
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {documents.filter(doc => doc.status === "Approved").length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
